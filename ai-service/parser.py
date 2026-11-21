import fitz  # PyMuPDF
import re
from skills_taxonomy import SKILLS_TAXONOMY

def parse_resume(pdf_bytes):
    """
    Extracts text from PDF bytes and identifies technical and domain skills
    using word boundary regex against the predefined taxonomy.
    Attempts spaCy entity extraction for organizations with a clean fallback.
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    doc.close()
    
    text_lower = full_text.lower()
    # Normalize punctuation but retain alphanumeric characters and spaces
    text_clean = re.sub(r'[^a-z0-9\s\+\#\.]', ' ', text_lower)
    
    extracted_skills = []
    for skill in SKILLS_TAXONOMY:
        # Match whole words to avoid partial false positives
        escaped_skill = re.escape(skill.lower())
        pattern = r'(?:\b|\s)' + escaped_skill + r'(?:\b|\s)'
        if re.search(pattern, text_clean):
            extracted_skills.append(skill)
    
    # Extract organizations using spaCy if available
    orgs = []
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        doc_nlp = nlp(full_text[:4000])
        orgs = list(set([ent.text.strip() for ent in doc_nlp.ents if ent.label_ == "ORG" and len(ent.text.strip()) > 2]))
    except Exception:
        orgs = []
    
    return {
        "skills": sorted(list(set(extracted_skills))),
        "organizations": orgs[:5],
        "rawText": full_text[:600].strip()
    }
