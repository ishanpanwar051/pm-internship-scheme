import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import TagInput from '../../components/ui/TagInput';
import IndiaMap from '../../components/ui/IndiaMap';
import {
  UserCheck,
  GraduationCap,
  Sparkles,
  MapPin,
  FileText,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  Sliders,
  Check,
  Laptop,
  Landmark,
  Cog,
  HeartPulse,
  Sprout,
  BookOpen,
  ShoppingBag,
  Building2,
  Truck,
  Zap,
  X as XIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

const DOMAINS_LIST = [
  { id: 'Information Technology', label: 'Information Technology', icon: Laptop },
  { id: 'Finance & Banking', label: 'Finance & Banking', icon: Landmark },
  { id: 'Heavy Manufacturing', label: 'Manufacturing & Heavy Eng', icon: Cog },
  { id: 'Healthcare & Pharma', label: 'Healthcare & Clinical Pharma', icon: HeartPulse },
  { id: 'Agriculture & Agrotech', label: 'Agriculture & Bio-economy', icon: Sprout },
  { id: 'Education & EdTech', label: 'Education & Learning Tech', icon: BookOpen },
  { id: 'Renewable Energy', label: 'Renewable Energy & Solar', icon: Zap },
  { id: 'Retail & E-Commerce', label: 'Retail & Consumer Markets', icon: ShoppingBag },
  { id: 'Infrastructure & Smart Cities', label: 'Infrastructure & Civil Works', icon: Building2 },
  { id: 'Logistics & Supply Chain', label: 'Logistics & Freight Ops', icon: Truck },
];

const SKILLS_SUGGESTIONS = [
  'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB',
  'Docker', 'AWS', 'Machine Learning', 'Data Analysis', 'AutoCAD', 'SolidWorks',
  'Excel', 'Tally', 'Financial Modeling', 'Clinical Research', 'Communication',
  'Project Management', 'Problem Solving',
];

export const InternProfile: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get('step') || '1', 10);
  const [step, setStep] = useState<number>(initialStep >= 1 && initialStep <= 5 ? initialStep : 1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Profile Form States
  const [personalInfo, setPersonalInfo] = useState({
    dob: '',
    gender: 'Male',
    fatherName: '',
    address: '',
    city: '',
    state: 'Delhi',
    district: '',
    pincode: '',
  });
  const [aadhar, setAadhar] = useState('');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'PH'>('General');
  const [isPH, setIsPH] = useState(false);

  // Academic
  const [academic, setAcademic] = useState({
    institutionName: '',
    institutionType: 'College',
    stream: 'Engineering',
    specialization: '',
    cgpa: 7.5,
    passingYear: 2024,
    tenthPercent: 85,
    twelfthPercent: 82,
  });

  // Skills & Preferences
  const [skills, setSkills] = useState<string[]>([]);
  const [domainInterest, setDomainInterest] = useState<string[]>([]);
  const [locationPreference, setLocationPreference] = useState<string[]>([]);
  const [resumeUrl, setResumeUrl] = useState('');
  const [parsedSkills, setParsedSkills] = useState<string[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/intern/profile');
        const p = res.data.profile;
        if (p) {
          if (p.personalInfo) setPersonalInfo((prev) => ({ ...prev, ...p.personalInfo }));
          if (p.category) setCategory(p.category);
          if (typeof p.isPH === 'boolean') setIsPH(p.isPH);
          if (p.academic) setAcademic((prev) => ({ ...prev, ...p.academic }));
          if (p.skills) setSkills(p.skills);
          if (p.domainInterest) setDomainInterest(p.domainInterest);
          if (p.locationPreference) setLocationPreference(p.locationPreference);
          if (p.resumeUrl) setResumeUrl(p.resumeUrl);
          if (p.resumeParsedSkills) setParsedSkills(p.resumeParsedSkills);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleStateClick = (stateName: string) => {
    if (locationPreference.includes(stateName)) {
      setLocationPreference(locationPreference.filter((s) => s !== stateName));
    } else {
      if (locationPreference.length >= 5) {
        toast.error('Maximum 5 location preferences allowed');
        return;
      }
      setLocationPreference([...locationPreference, stateName]);
    }
  };

  const handleDomainToggle = (dId: string) => {
    if (domainInterest.includes(dId)) {
      setDomainInterest(domainInterest.filter((id) => id !== dId));
    } else {
      setDomainInterest([...domainInterest, dId]);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF documents are accepted for AI parsing');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    const toastId = toast.loading('Uploading and executing AI skill parsing...');

    try {
      const res = await api.post('/intern/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResumeUrl(res.data.resumeUrl);
      const extracted = res.data.parsedSkills || [];
      setParsedSkills(extracted);
      if (res.data.profile?.skills) {
        setSkills(res.data.profile.skills);
      }

      toast.success(`AI identified ${extracted.length} competencies!`, { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Resume upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const saveProfile = async (targetAllocationStatus?: string) => {
    setIsSaving(true);
    try {
      await api.post('/intern/profile', {
        personalInfo,
        aadhar,
        category,
        isPH,
        academic,
        skills,
        domainInterest,
        locationPreference,
        allocationStatus: targetAllocationStatus || 'Pending',
      });
      toast.success('Candidate profile updated successfully!');
      if (targetAllocationStatus === 'Pending') {
        navigate('/intern/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-slate-400">Loading Candidate Profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Candidate Competency Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Complete the sections below so we can match you with the best opportunities based on your skills and preferences.
        </p>
      </div>

      {/* 5-Step Stepper Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between overflow-x-auto">
        {[
          { num: 1, label: 'Personal & KYC', icon: UserCheck },
          { num: 2, label: 'Education & Marks', icon: GraduationCap },
          { num: 3, label: 'Domain & Skills', icon: Sparkles },
          { num: 4, label: 'Preferred Locations', icon: MapPin },
          { num: 5, label: 'Upload Resume / CV (AI)', icon: FileText },
        ].map((s) => {
          const Icon = s.icon;
          const active = step === s.num;
          const completed = step > s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-gov-navy ${
                active
                  ? 'bg-gov-navy text-white shadow-md'
                  : completed
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
                {completed ? <Check className="w-3 h-3" /> : s.num}
              </div>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* FORM SECTION BODY */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        {/* STEP 1: Personal & Quotas */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-2 border-slate-200 dark:border-slate-700">
              Section 1: Personal Identification & Statutory Quotas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Full Candidate Name
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.name || ''}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={personalInfo.dob ? personalInfo.dob.split('T')[0] : ''}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Father / Guardian Name
                </label>
                <input
                  type="text"
                  value={personalInfo.fatherName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, fatherName: e.target.value })}
                  placeholder="Father's full name"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Gender
                </label>
                <select
                  value={personalInfo.gender}
                  onChange={(e: any) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Permanent Residential State
                </label>
                <select
                  value={personalInfo.state}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, state: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Aadhar Number (Only Last 4 Stored for Security)
                </label>
                <input
                  type="password"
                  maxLength={12}
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  placeholder="12-digit Aadhaar Number (Securely protected)"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-gov-navy dark:text-blue-300 uppercase">
                  <Info className="w-4 h-4 text-gov-saffron" />
                  <span>Category (as per Government norms)</span>
                </div>
                <span className="text-[10px] text-slate-500">Government of India Norms</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['General', 'OBC', 'SC', 'ST', 'PH'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      category === cat
                        ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="phCheckbox"
                  checked={isPH}
                  onChange={(e) => setIsPH(e.target.checked)}
                  className="w-4 h-4 text-gov-navy rounded"
                />
                <label htmlFor="phCheckbox" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Candidate with Benchmark Disability (Divyangjan / PH Category)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Academic Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-2 border-slate-200 dark:border-slate-700">
              Section 2: Academic Standing & Institution
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Institution / College Name
                </label>
                <input
                  type="text"
                  value={academic.institutionName}
                  onChange={(e) => setAcademic({ ...academic, institutionName: e.target.value })}
                  placeholder="e.g. Delhi Technological University"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Institution Classification
                </label>
                <select
                  value={academic.institutionType}
                  onChange={(e) => setAcademic({ ...academic, institutionType: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
                >
                  <option value="IIT">Indian Institute of Technology (IIT)</option>
                  <option value="NIT">National Institute of Technology (NIT)</option>
                  <option value="Central University">Central University</option>
                  <option value="State University">State University</option>
                  <option value="College">Affiliated College</option>
                  <option value="Polytechnic">Polytechnic / Diploma Institute</option>
                  <option value="Other">Other Recognized Higher Ed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Academic Discipline (Stream)
                </label>
                <select
                  value={academic.stream}
                  onChange={(e) => setAcademic({ ...academic, stream: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
                >
                  <option value="Engineering">Engineering & Technology</option>
                  <option value="Commerce">Commerce & Accountancy</option>
                  <option value="Science">Pure & Applied Sciences</option>
                  <option value="Management">Management & Administration</option>
                  <option value="Medical">Medical & Life Sciences</option>
                  <option value="Agriculture">Agriculture & Allied Studies</option>
                  <option value="Arts">Humanities & Social Sciences</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Specialization / Branch
                </label>
                <input
                  type="text"
                  value={academic.specialization}
                  onChange={(e) => setAcademic({ ...academic, specialization: e.target.value })}
                  placeholder="e.g. Computer Science, Finance, Mechanical"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>
            </div>

            {/* CGPA Slider with Live Counter */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-gov-navy dark:text-amber-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                    Cumulative Grade Point Average (CGPA / 10.0)
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-gov-navy text-white text-xs font-black">
                  {academic.cgpa} / 10.0
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.05"
                value={academic.cgpa}
                onChange={(e) => setAcademic({ ...academic, cgpa: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-gov-navy"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.0 (Minimum)</span>
                <span>7.5 (Merit Tier)</span>
                <span>8.5+ (High Honors)</span>
                <span>10.0</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Skills & Domain Interests */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-2 border-slate-200 dark:border-slate-700">
              Section 3: Competencies & Preferred Industry Sectors
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Technical & Applied Competencies (Add at least 3)
              </label>
              <TagInput
                tags={skills}
                onChange={setSkills}
                suggestions={SKILLS_SUGGESTIONS}
                placeholder="Type skill (e.g. Python, Financial Modeling, AutoCAD) and press enter"
                minTagsMessage="Please add at least 3 skills to help us match you with relevant roles."
              />
            </div>

            <div className="space-y-3 pt-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Select Domain Interests (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DOMAINS_LIST.map((dom) => {
                  const isChecked = domainInterest.includes(dom.id);
                  const DomIcon = dom.icon;
                  return (
                    <div
                      key={dom.id}
                      onClick={() => handleDomainToggle(dom.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center justify-between space-x-2 ${
                        isChecked
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-gov-navy dark:border-blue-500 text-gov-navy dark:text-white shadow-sm ring-1 ring-gov-navy/20'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <DomIcon className={`w-4 h-4 flex-shrink-0 ${isChecked ? 'text-gov-navy dark:text-amber-400' : 'text-slate-500'}`} />
                        <span className="truncate">{dom.label}</span>
                      </div>
                      {isChecked && <Check className="w-3.5 h-3.5 text-gov-navy dark:text-amber-400 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Location Map */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-2 border-slate-200 dark:border-slate-700">
              Section 4: Preferred Internship Geographies
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select up to 5 preferred states where you are available for physical apprenticeship placement.
            </p>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <IndiaMap
                interactive={true}
                selectedStates={locationPreference}
                onStateSelect={handleStateClick}
              />
            </div>

            {/* Selected States Chips */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Selected Preferences ({locationPreference.length} / 5):
              </div>
              <div className="flex flex-wrap gap-2">
                {locationPreference.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No states selected. Click on map above.</span>
                ) : (
                  locationPreference.map((st) => (
                    <span
                      key={st}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-gov-saffron/20 text-slate-900 dark:text-amber-300 border border-gov-saffron flex items-center space-x-1"
                    >
                      <span>{st}</span>
                      <button
                        type="button"
                        onClick={() => handleStateClick(st)}
                        aria-label={`Remove ${st}`}
                        className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer ml-1"
                      >
                        <XIcon className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Resume Upload */}
        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-2 border-slate-200 dark:border-slate-700">
              Section 5: Resume Upload & Skill Check (PDF)
            </h3>

            <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-center bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors">
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950 text-gov-navy dark:text-blue-300 mx-auto flex items-center justify-center mb-4">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Upload Your Resume / CV (PDF)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
                Our system scans your resume, extracts your skills, and helps match you with participating top 500 companies.
              </p>

              <label className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-blue-500/20 transition-all">
                <Upload className="w-4 h-4" />
                <span>Select & Upload PDF Resume</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {resumeUrl && (
                <div className="mt-4 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resume verified and on file: {resumeUrl.split('/').pop()}</span>
                </div>
              )}
            </div>

            {/* Extracted Skills Review */}
            {parsedSkills.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Extracted Skills from PDF:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {parsedSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => s - 1)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 disabled:opacity-30 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => saveProfile()}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2 rounded-lg bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold flex items-center space-x-1 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => saveProfile('Pending')}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-lg bg-gov-saffron hover:bg-amber-500 text-slate-950 text-xs font-extrabold shadow-md uppercase tracking-wider flex items-center space-x-2"
              >
                {isSaving ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit Candidate Profile</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternProfile;
