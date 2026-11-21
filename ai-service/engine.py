import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.optimize import linear_sum_assignment

def run_matching(interns_data, slots_data, weights=None):
    """
    Core AI Smart Allocation Engine.
    Combines TF-IDF vectorization of skill profiles, multi-factor bonus weights,
    quota-based allocations, and the Hungarian Algorithm (Munkres / Kuhn)
    for globally optimal assignment. `weights` optionally overrides the
    default scoring/penalty weights and quota percentages.
    """
    # Configurable scoring weights (fall back to defaults)
    WEIGHTS = {
        'location': 0.20,
        'homeState': 0.08,
        'domain': 0.12,
        'cgpaHigh': 0.10,
        'cgpaMid': 0.07,
        'cgpaLow': 0.05,
        'penaltyGate': -999.0,
    }
    if isinstance(weights, dict):
        for k, v in weights.items():
            try:
                WEIGHTS[k] = float(v)
            except (TypeError, ValueError):
                continue
    # STEP 1: FILTER ELIGIBLE INTERNS & ACTIVE SLOTS
    active_interns = [
        i for i in interns_data
        if i.get('allocationStatus') in ['Pending', 'Not Applied']
    ]
    active_slots = [
        s for s in slots_data
        if s.get('filledSeats', 0) < s.get('totalSeats', 0) and s.get('isActive', True)
    ]
    
    if not active_interns or not active_slots:
        return []
    
    n_interns = len(active_interns)
    n_slots = len(active_slots)
    
    # STEP 2: TF-IDF SKILL VECTORIZATION & COSINE SIMILARITY
    intern_skill_strings = [
        ' '.join(i.get('skills', [])) if i.get('skills') else 'general'
        for i in active_interns
    ]
    slot_skill_strings = [
        ' '.join(s.get('requiredSkills', []) + s.get('preferredSkills', [])) if (s.get('requiredSkills') or s.get('preferredSkills')) else 'general'
        for s in active_slots
    ]
    
    all_skill_corpus = intern_skill_strings + slot_skill_strings
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1, token_pattern=r'(?u)\b\w+\b')
    tfidf_matrix = vectorizer.fit_transform(all_skill_corpus)
    
    intern_vecs = tfidf_matrix[:n_interns]
    slot_vecs = tfidf_matrix[n_interns:]
    
    base_scores = cosine_similarity(intern_vecs, slot_vecs)  # Shape: (n_interns, n_slots)
    
    # STEP 3: APPLY MULTI-FACTOR BONUSES & ELIGIBILITY CONSTRAINTS
    score_matrix = base_scores.copy().astype(float)
    
    for i, intern in enumerate(active_interns):
        intern_loc_pref = set(intern.get('locationPreference', []) or [])
        intern_domains = set(intern.get('domainInterest', []) or [])
        intern_state = str(intern.get('state', '')).strip().lower()
        cgpa = float(intern.get('cgpa', 0) or 0)
        
        for j, slot in enumerate(active_slots):
            slot_loc = slot.get('location', {}) or {}
            slot_state = str(slot_loc.get('state', '')).strip().lower()
            slot_domain = slot.get('domain', '')
            min_cgpa = float(slot.get('eligibility', {}).get('minCGPA', 0) or 0)
            
            # Eligibility gate: strict filter
            if min_cgpa > 0 and cgpa < min_cgpa:
                score_matrix[i][j] = WEIGHTS['penaltyGate']
                continue
            
            bonus = 0.0
            
            # Location Preference Match
            if any(pref.strip().lower() == slot_state for pref in intern_loc_pref):
                bonus += WEIGHTS['location']
            
            # Home State Match
            if intern_state and intern_state == slot_state:
                bonus += WEIGHTS['homeState']
                
            # Domain Interest Alignment
            if slot_domain in intern_domains:
                bonus += WEIGHTS['domain']
                
            # Academic Merit (CGPA) Tiered Bonus
            if cgpa >= 8.5:
                bonus += WEIGHTS['cgpaHigh']
            elif cgpa >= 7.5:
                bonus += WEIGHTS['cgpaMid']
            elif cgpa >= 6.5:
                bonus += WEIGHTS['cgpaLow']
                
            total_score = base_scores[i][j] + bonus
            # Scale and cap score between 0.0 and 1.0
            score_matrix[i][j] = min(max(total_score, 0.0), 1.0)
            
    # STEP 4: QUOTA-BASED HUNGARIAN ALLOCATION
    # Quota Breakdown: SC (15%), ST (7.5%), OBC (27%), PH (4%), General (remainder)
    quotas = {
        'SC': 0.15,
        'ST': 0.075,
        'OBC': 0.27,
        'PH': 0.04
    }
    if isinstance(weights, dict):
        supplied_quotas = weights.get('quotas')
        if isinstance(supplied_quotas, dict):
            for qk, qv in supplied_quotas.items():
                try:
                    quotas[qk] = float(qv)
                except (TypeError, ValueError):
                    continue
    categories = ['SC', 'ST', 'OBC', 'PH', 'General']
    
    allocations = []
    allocated_intern_ids = set()
    slot_seats_occupied = {str(s.get('id') or s.get('_id')): 0 for s in active_slots}
    
    for category in categories:
        if category == 'PH':
            cat_candidates = [
                (idx, intern) for idx, intern in enumerate(active_interns)
                if (intern.get('isPH') or intern.get('category') == 'PH')
                and str(intern.get('id') or intern.get('_id')) not in allocated_intern_ids
            ]
        elif category == 'General':
            cat_candidates = [
                (idx, intern) for idx, intern in enumerate(active_interns)
                if (intern.get('category') == 'General' or not intern.get('category'))
                and not intern.get('isPH')
                and str(intern.get('id') or intern.get('_id')) not in allocated_intern_ids
            ]
        else:
            cat_candidates = [
                (idx, intern) for idx, intern in enumerate(active_interns)
                if intern.get('category') == category
                and not intern.get('isPH')
                and str(intern.get('id') or intern.get('_id')) not in allocated_intern_ids
            ]
            
        if not cat_candidates:
            continue
            
        cat_indices = [idx for idx, _ in cat_candidates]
        cat_matrix = score_matrix[np.ix_(cat_indices, range(n_slots))].copy()
        
        # Enforce quota limits per slot for this category
        for j, slot in enumerate(active_slots):
            s_id = str(slot.get('id') or slot.get('_id'))
            total_s = int(slot.get('totalSeats', 1))
            
            if category == 'General':
                # General takes remaining seats after reserved proportions
                reserved_est = sum(max(1, int(total_s * q)) for q in quotas.values())
                available_for_general = max(1, total_s - reserved_est)
                if slot_seats_occupied[s_id] >= total_s:
                    cat_matrix[:, j] = -999.0
            else:
                cat_quota_seats = max(1, int(total_s * quotas[category]))
                if slot_seats_occupied[s_id] >= cat_quota_seats:
                    cat_matrix[:, j] = -999.0
                    
        # Apply Hungarian Algorithm (minimizes cost, so invert scores to maximize)
        row_ind, col_ind = linear_sum_assignment(-cat_matrix)
        
        for r, c in zip(row_ind, col_ind):
            intern_global_idx = cat_indices[r]
            intern = active_interns[intern_global_idx]
            intern_id = str(intern.get('id') or intern.get('_id'))
            slot = active_slots[c]
            slot_id = str(slot.get('id') or slot.get('_id'))
            score = cat_matrix[r][c]
            
            # Disregard ineligible assignments
            if score <= 0.0:
                continue
                
            # Build Explainability Details
            intern_skills_set = set(s.strip().lower() for s in intern.get('skills', []))
            slot_req_skills = set(s.strip().lower() for s in (slot.get('requiredSkills', []) + slot.get('preferredSkills', [])))
            matched_skills = [
                s for s in intern.get('skills', [])
                if s.strip().lower() in slot_req_skills
            ]
            
            skill_score = float(base_scores[intern_global_idx][c])
            slot_state = slot.get('location', {}).get('state', '')
            location_score = 1.0 if any(pref.strip().lower() == slot_state.strip().lower() for pref in intern.get('locationPreference', [])) else 0.0
            domain_score = 1.0 if slot.get('domain') in intern.get('domainInterest', []) else 0.0
            cgpa = float(intern.get('cgpa', 0) or 0)
            academic_score = min(cgpa / 10.0, 1.0)
            
            # Construct natural-language human rationale
            reasons = []
            if matched_skills:
                skills_preview = ', '.join(matched_skills[:3])
                reasons.append(f"Strong skill alignment in {skills_preview}")
            if location_score > 0:
                reasons.append(f"Preferred location match ({slot_state})")
            if domain_score > 0:
                reasons.append(f"Domain alignment with {slot.get('domain', 'sector')}")
            if cgpa >= 7.5:
                reasons.append(f"High academic standing (CGPA: {cgpa})")
                
            explanation = ". ".join(reasons) + "." if reasons else "Matched based on composite academic and competency profile."
            
            allocations.append({
                'internId': intern_id,
                'slotId': slot_id,
                'companyId': str(slot.get('companyId', '')),
                'matchScore': round(float(min(max(score, 0.0), 1.0)), 4),
                'matchReason': {
                    'skillScore': round(skill_score, 4),
                    'locationScore': location_score,
                    'academicScore': round(academic_score, 4),
                    'domainScore': domain_score,
                    'quotaCategory': category,
                    'matchedSkills': matched_skills,
                    'explanation': explanation
                }
            })
            
            allocated_intern_ids.add(intern_id)
            slot_seats_occupied[slot_id] += 1
            
    return allocations
