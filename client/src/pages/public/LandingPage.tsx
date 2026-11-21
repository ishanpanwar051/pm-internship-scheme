import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Briefcase,
  Award,
  ChevronRight,
  IndianRupee,
  ShieldCheck,
  GraduationCap,
  Clock,
  HelpCircle,
  FileCheck,
  Check,
  Cog,
  HeartPulse,
  Landmark,
  Sprout,
  Zap,
  Truck,
  Scale,
  Laptop,
} from 'lucide-react';
import LiveTickerBar from '../../components/ui/LiveTickerBar';
import MoreStreamsBanner from '../../components/ui/MoreStreamsBanner';
import NationalValueCards from '../../components/ui/NationalValueCards';
import MilestoneStepper from '../../components/ui/MilestoneStepper';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const FAQS = [
    {
      q: 'Is there any registration fee or application charge for students?',
      a: 'No. The National Internship Portal and PM Internship Scheme have a strict Zero Fee Policy. Registration, application, and matching are 100% free for all candidates.',
    },
    {
      q: 'How much stipend will I receive and how is it paid?',
      a: 'Selected interns receive a monthly financial assistance of ₹5,000 per month (₹4,500 from the Government of India via Direct Benefit Transfer directly into your Aadhaar-linked bank account, and ₹500 from the host company), plus a one-time grant of ₹6,000 for incidentals.',
    },
    {
      q: 'Can non-engineering and general degree students apply?',
      a: 'Yes, absolutely! The scheme is open to students from all disciplines: BA, BSc, BCom, BBA, BCA, Pharmacy, Agriculture, Law, Hotel Management, ITI, Polytechnic Diplomas, as well as BTech.',
    },
    {
      q: 'Who is eligible to register for the PM Internship Scheme?',
      a: 'Indian youth aged 21 to 24 years who are not in full-time employment and meet the basic educational qualification (minimum 10th pass, 12th pass, ITI, Diploma, or Graduate degree).',
    },
    {
      q: 'Will I get an official government certificate after completion?',
      a: 'Yes. Upon successful completion of your internship, you will receive a QR-verifiable government certificate stored directly in your DigiLocker, plus coursework credits mapped to your Academic Bank of Credits (ABC).',
    },
  ];

  return (
    <div className="w-full bg-[#FAFBFD] text-slate-900 overflow-x-hidden min-h-screen">
      {/* 1. Live Ticker / Announcement Strip */}
      <LiveTickerBar />

      {/* 2. "Not an engineer? We have you covered too" Banner */}
      <MoreStreamsBanner />

      {/* 3. Official Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto space-y-7">
        {/* Soft Background Radial Pastel Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-100/40 via-rose-100/30 to-indigo-100/40 blur-3xl pointer-events-none -z-10 rounded-full" />

        {/* Central National Internship Mission Pill */}
        <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-white border border-amber-200 shadow-2xs text-xs sm:text-sm font-bold text-amber-900">
          <span className="text-base">🇮🇳</span>
          <span className="tracking-wider uppercase">NATIONAL INTERNSHIP MISSION</span>
        </div>

        {/* Main Massive Headline from Reference Screenshot */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.14] max-w-5xl mx-auto">
          The Government of India's vision is to provide{' '}
          <span className="text-[#F43F5E] underline decoration-[#F43F5E]/30 underline-offset-8">
            1 crore internships
          </span>{' '}
          by 2027
        </h1>

        {/* Official Subtitle from Reference Screenshot */}
        <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
          Delivered through the National Internship Portal by AICTE, Ministry of Education & Ministry of Corporate Affairs — for AICTE, UGC, IGNOU and students across India.
        </p>

        {/* Tricolor Dashes from Screenshot */}
        <div className="flex items-center justify-center space-x-2 pt-1">
          <span className="w-8 h-1.5 rounded-full bg-[#FF9933]" />
          <span className="w-8 h-1.5 rounded-full bg-slate-300" />
          <span className="w-8 h-1.5 rounded-full bg-[#138808]" />
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register?role=intern"
            className="px-8 py-4 rounded-full bg-[#84CC16] hover:bg-[#65A30D] text-white text-sm font-black transition-all shadow-md hover:shadow-lg flex items-center space-x-2 transform hover:-translate-y-0.5"
          >
            <span>Register Free as Candidate</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/login?role=company"
            className="px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-bold transition-all shadow-xs flex items-center space-x-2"
          >
            <Building2 className="w-5 h-5 text-slate-600" />
            <span>Enterprise Host Partner</span>
          </Link>
        </div>
      </section>

      {/* 4. Three Value Proposition Cards (From Screenshot 1 Bottom) */}
      <section className="border-t border-slate-200/60 bg-white/80">
        <NationalValueCards />
      </section>

      {/* 5. Five Milestones Pipeline & Stepper (From Screenshot 2) */}
      <section className="border-y border-slate-200/80 bg-gradient-to-b from-[#FAFBFD] via-[#FFF9F6] to-[#FAFBFD]">
        <MilestoneStepper />
      </section>

      {/* 6. Key Scheme Benefits for Candidates (Relevant, user-facing info) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold uppercase">
            <span>Direct Benefits to Youth</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Apply Under the PM Internship Scheme?
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A prestigious nationwide program connecting aspiring students directly to corporate shop floors and corporate boardrooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">₹5,000 Monthly Stipend</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Financial support disbursed directly into your bank account through Direct Benefit Transfer (DBT).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">₹6,000 One-time Grant</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              An additional one-time joining grant provided to meet travel, accommodation, and incidental expenses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Top 500 Enterprises</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Intern in India's premier organizations across manufacturing, IT, finance, logistics, and renewable energy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">DigiLocker Certificate</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Government-authenticated digital certificate and Academic Bank of Credits (ABC) recognized by universities.
            </p>
          </div>
        </div>
      </section>

      {/* Inclusive Nationwide Disciplines — Opportunities for Every Stream */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <span>Pan-India Diverse Disciplines</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                Open for Every Field — Not Just Computer Science!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                The PM Internship Scheme bridges talent across B.Com, B.Sc Agriculture, Mechanical, Civil, B.Pharm, BBA, BA, ITI, Diplomas, and Engineering disciplines.
              </p>
            </div>
            <Link
              to="/intern/explore"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
            >
              <span>Explore All Sectors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Cog,
                color: 'text-amber-700 bg-amber-50 border-amber-200',
                sector: 'Mechanical & Automotive',
                degrees: 'Mechanical, Auto, Production, ITI',
                roles: 'EV Powertrain, CAD/CAM, Assembly Ops, Quality Testing',
                companies: 'Mahindra, Tata Motors, L&T',
              },
              {
                icon: Landmark,
                color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                sector: 'Banking, Finance & Commerce',
                degrees: 'B.Com, BBA, M.Com, Economics, CA Inter',
                roles: 'Credit Analysis, Auditing, Equity Research, Tally ERP',
                companies: 'State Bank of India, HDFC Bank, ICICI',
              },
              {
                icon: HeartPulse,
                color: 'text-rose-700 bg-rose-50 border-rose-200',
                sector: 'Healthcare, Pharma & Biotech',
                degrees: 'B.Pharm, D.Pharm, BSc Biotech, Nursing',
                roles: 'Clinical Research, Drug Formulation, Lab Quality, Hospital Ops',
                companies: "Dr. Reddy's, Sun Pharma, Apollo",
              },
              {
                icon: Sprout,
                color: 'text-green-700 bg-green-50 border-green-200',
                sector: 'Agriculture & Food Technology',
                degrees: 'B.Sc Agriculture, Food Tech, Dairy, Rural Dev',
                roles: 'Soil Testing, Crop Analytics, Cold Chain Logistics, Agro-Marketing',
                companies: 'ITC Agri-Business, UPL, Godrej Agrovet',
              },
              {
                icon: Building2,
                color: 'text-purple-700 bg-purple-50 border-purple-200',
                sector: 'Civil & Smart Infrastructure',
                degrees: 'Civil Engg, Architecture, Surveying, Diploma',
                roles: 'Structural Design, Highway Projects, Site Superintending',
                companies: 'Larsen & Toubro, Godrej Properties, DLF',
              },
              {
                icon: Zap,
                color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
                sector: 'Renewable Energy & Solar',
                degrees: 'Electrical, Electronics, Energy Science, ITI',
                roles: 'Solar PV Sizing, Micro-Grid Ops, Wind Farm Maintenance',
                companies: 'Tata Power Renewable, Adani Green, NTPC',
              },
              {
                icon: Truck,
                color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
                sector: 'Logistics, Supply Chain & Retail',
                degrees: 'BBA Logistics, B.Com, Any Graduate',
                roles: 'Warehouse Operations, Freight Dispatch, Inventory Systems',
                companies: 'Delhivery, Blue Dart, Flipkart, HUL',
              },
              {
                icon: Laptop,
                color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
                sector: 'Computer Science & AI',
                degrees: 'B.Tech CS/IT, BCA, MCA, BSc IT, Data Sci',
                roles: 'Cloud DevOps, AI Systems, Full Stack Engineering',
                companies: 'TCS, Infosys, Wipro, HCL',
              },
            ].map((sec, i) => {
              const Icon = sec.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all bg-slate-50/60 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${sec.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {sec.sector}
                      </h4>
                    </div>

                    <div className="space-y-1 text-[11px] pt-1 border-t border-slate-200/80">
                      <div>
                        <span className="font-semibold text-slate-700">Eligible: </span>
                        <span className="text-slate-500">{sec.degrees}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Roles: </span>
                        <span className="text-slate-500">{sec.roles}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[10px] text-blue-700 font-medium">
                    🏢 {sec.companies}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Who Can Apply? (Eligibility Criteria Card) */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 rounded-3xl border border-orange-200 p-8 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                Candidate Guidelines
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Who is Eligible to Apply?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Designed to be accessible to candidates across every district, town, and rural area in India.
              </p>
              <div className="pt-2">
                <Link
                  to="/register?role=intern"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-xs transition-colors"
                >
                  <span>Check Your Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Age Requirement</span>
                </div>
                <p className="text-xs text-slate-600">
                  Youth between 21 and 24 years of age at the time of application submission.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Educational Streams</span>
                </div>
                <p className="text-xs text-slate-600">
                  Passed 10th, 12th, ITI, Polytechnic Diploma, or completed any Undergraduate Degree (BA, BSc, BCom, BTech, etc.).
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Employment Status</span>
                </div>
                <p className="text-xs text-slate-600">
                  Must not be engaged in full-time employment, ensuring opportunities reach students seeking work experience.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Reservation Categories</span>
                </div>
                <p className="text-xs text-slate-600">
                  Reservation guidelines protected for SC, ST, OBC, EWS, and PwD applicants as per Government of India norms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Hon'ble PM Narendra Modi Vision & Dignitary Banner */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 relative overflow-hidden">
          {/* Top Tricolor Strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-tricolor-strip" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Hon'ble PM Photo & Gold Frame */}
            <div className="lg:col-span-4 flex flex-col items-center sm:flex-row lg:flex-col text-center sm:text-left lg:text-center space-y-4 sm:space-y-0 sm:space-x-5 lg:space-x-0 lg:space-y-4">
              <div className="relative">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden gold-frame shadow-md bg-slate-100">
                  <img
                    src="/pm_modi.jpg"
                    alt="Shri Narendra Modi, Hon'ble Prime Minister of India"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <img
                  src="/indian_flag.jpg"
                  alt="Tiranga"
                  className="w-8 h-5 rounded-xs object-cover absolute -bottom-2 -right-2 shadow-sm border border-white"
                />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Shri Narendra Modi
                </h3>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wide">
                  Hon'ble Prime Minister of India
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Viksit Bharat 2047 Vision
                </p>
              </div>
            </div>

            {/* Right Column: Vision Quote & National Reach */}
            <div className="lg:col-span-8 space-y-5 text-left border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold">
                <span>PRIME MINISTER'S INTERNSHIP SCHEME</span>
              </div>

              <blockquote className="text-lg sm:text-xl font-medium text-slate-800 italic leading-relaxed">
                "When India's youth are empowered with transparent access to top industries, no dream is beyond reach. This national platform ensures that merit, opportunity, and constitutional fairness reach every village and city."
              </blockquote>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-slate-900 font-mono">1 Crore</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">Youth by 2027</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-orange-600 font-mono">500+</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">Top Corporates</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-emerald-600 font-mono">₹5,000</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">Monthly DBT Stipend</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-indigo-600 font-mono">28 States</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">& 8 UTs Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Waving Indian Flag Nationwide Impact Showcase */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <div className="h-48 sm:h-60 w-full relative">
            <img
              src="/indian_flag.jpg"
              alt="Indian National Flag Tiranga over India Gate"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent flex items-center px-6 sm:px-12">
              <div className="max-w-xl text-white space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider">
                  Pan-India Unified Coverage
                </span>
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
                  One Nation, One National Internship Portal
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  Empowering candidates from tier-1, tier-2, and rural districts with transparent placements in top industries across India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Frequently Asked Questions (FAQ) Section */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
            Clear Answers for Students
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Have questions about the scheme, stipends, or application process?
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                    openFaq === idx ? 'rotate-90 text-orange-600' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 11. Portal Role Entry Quick-Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/login?role=intern"
            className="p-7 bg-white hover:bg-orange-50/40 rounded-3xl border border-slate-200 hover:border-orange-300 transition-all shadow-xs group text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Student & Candidate Portal</h4>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Build your profile, auto-verify college details, and track your transparent internship placements.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-orange-600 mt-4 group-hover:translate-x-1 transition-transform">
              <span>Candidate Sign In</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/login?role=company"
            className="p-7 bg-white hover:bg-blue-50/40 rounded-3xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs group text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Enterprise Host Partner</h4>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Publish vacancies, view shortlisted candidates, and onboard youth seamlessly.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-blue-600 mt-4 group-hover:translate-x-1 transition-transform">
              <span>Corporate Sign In</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/login?role=admin"
            className="p-7 bg-white hover:bg-purple-50/40 rounded-3xl border border-slate-200 hover:border-purple-300 transition-all shadow-xs group text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Ministry & Administrative Portal</h4>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Monitor allocations, run smart matching, and export reports.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-purple-600 mt-4 group-hover:translate-x-1 transition-transform">
              <span>Admin Console</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;