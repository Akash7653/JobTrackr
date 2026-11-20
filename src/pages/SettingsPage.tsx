import React, { useState, useRef } from 'react';
import {
  User,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle2,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import { useJobContext } from '../context/JobContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { downloadJSON, downloadCSV, parseAndValidateImportJSON } from '../utils/exportImport';

export const SettingsPage: React.FC = () => {
  const {
    applications,
    userProfile,
    updateUserProfile,
    resetToSampleData,
    clearAllData,
    importApplications,
  } = useJobContext();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  // Profile Form state
  const [name, setName] = useState(userProfile.name);
  const [title, setTitle] = useState(userProfile.title);
  const [email, setEmail] = useState(userProfile.email);
  const [targetRole, setTargetRole] = useState(userProfile.targetRole);
  const [targetSalary, setTargetSalary] = useState(userProfile.targetSalary.toString());
  const [currency, setCurrency] = useState(userProfile.currency || '$');
  const [bio, setBio] = useState(userProfile.bio || '');

  // Confirm dialogs state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Hidden file input for JSON import
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      title: title.trim(),
      email: email.trim(),
      targetRole: targetRole.trim(),
      targetSalary: parseInt(targetSalary, 10) || 150000,
      currency,
      bio: bio.trim(),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = parseAndValidateImportJSON(content);
      if (result.success && result.applications) {
        importApplications(result.applications);
      } else {
        showToast({
          title: 'Import Failed',
          message: result.error || 'Failed to parse JSON file.',
          type: 'error',
        });
      }
    };
    reader.readAsText(file);
    // reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Settings & Preferences</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Manage your profile, theme, compensation benchmarks, and data backups.
        </p>
      </div>

      {/* 1. Profile Information Section */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Candidate Profile</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized career target settings and contact info.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Professional Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
            />
            <Input
              label="Target Role"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Staff Engineer / Tech Lead"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Salary (Annual)"
              type="number"
              value={targetSalary}
              onChange={(e) => setTargetSalary(e.target.value)}
              leftIcon={<DollarSign className="w-4 h-4" />}
            />
            <Select
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="CAD $">CAD ($)</option>
              <option value="₹">INR (₹)</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Professional Bio & Objectives
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your background, tech stack, and what you look for in next role..."
              className="w-full bg-white dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </section>

      {/* 2. Theme & Display Section */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Interface Theme</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred visual presentation</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Dark Mode Card */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              theme === 'dark'
                ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500 ring-1 ring-indigo-500/50'
                : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">Dark Mode</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Deep charcoal SaaS theme (Default)</span>
              </div>
            </div>
            {theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          </div>

          {/* Light Mode Card */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              theme === 'light'
                ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500 ring-1 ring-indigo-500/50'
                : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-amber-500 dark:text-amber-400">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">Light Mode</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Clean high-contrast daytime mode</span>
              </div>
            </div>
            {theme === 'light' && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          </div>
        </div>
      </section>

      {/* 3. Data Export & Import Section */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Data Management & Backup</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export your data for safe keeping or import applications from a JSON backup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* JSON Export */}
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={() => downloadJSON({ applications, userProfile }, 'jobtrackr-export.json')}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export JSON Backup
          </Button>

          {/* CSV Export */}
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={() => downloadCSV(applications, 'jobtrackr-applications.csv')}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV Table
          </Button>

          {/* JSON Import */}
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Import JSON Data
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </section>

      {/* 4. Danger Zone */}
      <section className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 space-y-4">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>Danger Zone</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Reset to Sample Applications</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restore the original 12 realistic SaaS job applications dataset.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />}
          >
            Reset Sample Data
          </Button>
        </div>

        <div className="border-t border-rose-200 dark:border-rose-500/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Clear All Applications</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Permanently delete all application records from LocalStorage.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsClearConfirmOpen(true)}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear All Data
          </Button>
        </div>
      </section>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetToSampleData}
        title="Reset to Sample Applications"
        message="This will overwrite current applications and load the original 12 portfolio sample applications. Are you sure?"
        confirmText="Reset to Samples"
        variant="warning"
      />

      {/* Confirm Clear Dialog */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={clearAllData}
        title="Clear All Applications"
        message="This will erase all application records from your browser's LocalStorage. This action cannot be reversed."
        confirmText="Erase All Records"
        variant="danger"
      />
    </div>
  );
};
