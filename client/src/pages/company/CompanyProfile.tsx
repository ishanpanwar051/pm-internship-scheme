import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Building2, ShieldCheck, Upload, Save, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const CompanyProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/company/profile');
        setProfile(res.data.profile);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post('/company/profile', profile);
      toast.success('Organization profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-slate-400">Loading Enterprise Dossier...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gov-saffron">
            Accreditation & Registry
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Organization Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain your enterprise entity details and administrative contact points.
          </p>
        </div>

        {profile?.isVerified ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
            Verified Enterprise
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            Pending Sovereign Verification
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Company / Enterprise Legal Name
            </label>
            <input
              type="text"
              required
              value={profile?.companyName || ''}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Corporate Identification Number (CIN)
            </label>
            <input
              type="text"
              value={profile?.registrationNumber || ''}
              onChange={(e) => setProfile({ ...profile, registrationNumber: e.target.value })}
              placeholder="e.g. U72200DL2024PTC123456"
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Primary Industrial Sector
            </label>
            <input
              type="text"
              required
              value={profile?.sector || ''}
              onChange={(e) => setProfile({ ...profile, sector: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Corporate Website
            </label>
            <input
              type="url"
              value={profile?.website || ''}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              placeholder="https://www.enterprise.com"
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Organizational Overview & Mission
            </label>
            <textarea
              rows={3}
              value={profile?.description || ''}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>
        </div>

        {/* Administrative Contact Person */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Nodal Internship Liaison Contact
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Liaison Full Name
              </label>
              <input
                type="text"
                value={profile?.contactPerson?.name || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contactPerson: { ...profile.contactPerson, name: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={profile?.contactPerson?.designation || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contactPerson: { ...profile.contactPerson, designation: e.target.value },
                  })
                }
                placeholder="e.g. HR Director"
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Direct Contact Phone
              </label>
              <input
                type="tel"
                value={profile?.contactPerson?.phone || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contactPerson: { ...profile.contactPerson, phone: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-gov-navy"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold shadow-md uppercase tracking-wider flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;
