import React, { useState, useEffect } from 'react';
import {
  JobStatus,
  WorkMode,
  EmploymentType,
  JobPriority,
} from '../../types/job';
import { useJobContext } from '../../context/JobContext';
import { validateApplicationForm } from '../../utils/validators';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import {
  Building2,
  Briefcase,
  DollarSign,
  Calendar,
  Link as LinkIcon,
  User,
  Mail,
  FileText,
  Star,
} from 'lucide-react';

export const ApplicationFormModal: React.FC = () => {
  const {
    isAddModalOpen,
    closeModal,
    prefilledStatus,
    editingJob,
    addApplication,
    updateApplication,
  } = useJobContext();

  const isEditing = Boolean(editingJob);

  // Form State
  const [activeTab, setActiveTab] = useState<'core' | 'compensation' | 'contact' | 'notes'>('core');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState<JobStatus>('Applied');
  const [workMode, setWorkMode] = useState<WorkMode>('Remote');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [location, setLocation] = useState('Remote');
  const [appliedDate, setAppliedDate] = useState('');
  const [salaryMin, setSalaryMin] = useState<string>('');
  const [salaryMax, setSalaryMax] = useState<string>('');
  const [salaryCurrency, setSalaryCurrency] = useState('$');
  const [salaryPeriod, setSalaryPeriod] = useState<'year' | 'month' | 'hour'>('year');
  const [jobUrl, setJobUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [assessmentDeadline, setAssessmentDeadline] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [priority, setPriority] = useState<JobPriority>('Medium');
  const [rating, setRating] = useState<number>(4);
  const [jobDescription, setJobDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or initialize form whenever modal opens or editingJob changes
  useEffect(() => {
    if (isAddModalOpen) {
      setActiveTab('core');
      setErrors({});
      if (editingJob) {
        setCompany(editingJob.company);
        setJobTitle(editingJob.jobTitle);
        setStatus(editingJob.status);
        setWorkMode(editingJob.workMode);
        setEmploymentType(editingJob.employmentType);
        setLocation(editingJob.location || 'Remote');
        setAppliedDate(editingJob.appliedDate || '');
        setSalaryMin(editingJob.salaryMin ? editingJob.salaryMin.toString() : '');
        setSalaryMax(editingJob.salaryMax ? editingJob.salaryMax.toString() : '');
        setSalaryCurrency(editingJob.salaryCurrency || '$');
        setSalaryPeriod(editingJob.salaryPeriod || 'year');
        setJobUrl(editingJob.jobUrl || '');
        setLogoUrl(editingJob.logoUrl || '');
        setRecruiterName(editingJob.recruiterName || '');
        setRecruiterEmail(editingJob.recruiterEmail || '');
        setRecruiterPhone(editingJob.recruiterPhone || '');
        setInterviewDate(editingJob.interviewDate ? editingJob.interviewDate.substring(0, 16) : '');
        setAssessmentDeadline(editingJob.assessmentDeadline || '');
        setFollowUpDate(editingJob.followUpDate || '');
        setPriority(editingJob.priority || 'Medium');
        setRating(editingJob.rating || 4);
        setJobDescription(editingJob.jobDescription || '');
        setNotes(editingJob.notes || '');
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        setCompany('');
        setJobTitle('');
        setStatus(prefilledStatus || 'Applied');
        setWorkMode('Remote');
        setEmploymentType('Full-time');
        setLocation('Remote');
        setAppliedDate(todayStr);
        setSalaryMin('');
        setSalaryMax('');
        setSalaryCurrency('$');
        setSalaryPeriod('year');
        setJobUrl('');
        setLogoUrl('');
        setRecruiterName('');
        setRecruiterEmail('');
        setRecruiterPhone('');
        setInterviewDate('');
        setAssessmentDeadline('');
        setFollowUpDate('');
        setPriority('Medium');
        setRating(4);
        setJobDescription('');
        setNotes('');
      }
    }
  }, [isAddModalOpen, editingJob, prefilledStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const minNum = salaryMin ? parseInt(salaryMin, 10) : undefined;
    const maxNum = salaryMax ? parseInt(salaryMax, 10) : undefined;

    const validation = validateApplicationForm({
      company,
      jobTitle,
      appliedDate,
      salaryMin: minNum,
      salaryMax: maxNum,
      jobUrl,
      recruiterEmail,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Switch to tab with first error
      if (validation.errors.company || validation.errors.jobTitle || validation.errors.appliedDate) {
        setActiveTab('core');
      } else if (validation.errors.salary || validation.errors.jobUrl) {
        setActiveTab('compensation');
      } else if (validation.errors.recruiterEmail) {
        setActiveTab('contact');
      }
      return;
    }

    const payload = {
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      status,
      workMode,
      employmentType,
      location: location.trim() || 'Remote',
      appliedDate,
      salaryMin: minNum,
      salaryMax: maxNum,
      salaryCurrency,
      salaryPeriod,
      jobUrl: jobUrl.trim(),
      logoUrl: logoUrl.trim() || undefined,
      recruiterName: recruiterName.trim(),
      recruiterEmail: recruiterEmail.trim(),
      recruiterPhone: recruiterPhone.trim(),
      interviewDate: interviewDate ? interviewDate : undefined,
      assessmentDeadline: assessmentDeadline || undefined,
      followUpDate: followUpDate || undefined,
      priority,
      rating,
      jobDescription: jobDescription.trim(),
      notes: notes.trim(),
    };

    if (isEditing && editingJob) {
      updateApplication(editingJob.id, payload);
    } else {
      addApplication(payload);
    }

    closeModal();
  };

  return (
    <Modal
      isOpen={isAddModalOpen}
      onClose={closeModal}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            {isEditing ? <Briefcase className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
          </div>
          <span>{isEditing ? 'Edit Job Application' : 'Add New Application'}</span>
        </div>
      }
      description={
        isEditing
          ? `Update records and timeline for ${editingJob?.company}`
          : 'Track a new opportunity with complete compensation and recruiter contacts.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs">
          {[
            { id: 'core', label: '1. Role & Status' },
            { id: 'compensation', label: '2. Salary & Links' },
            { id: 'contact', label: '3. Recruiter & Dates' },
            { id: 'notes', label: '4. Description & Notes' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-600/15 dark:text-indigo-300 dark:border-indigo-500/30'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Role & Status */}
        {activeTab === 'core' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                placeholder="e.g. Stripe, Linear, Vercel"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  if (errors.company) setErrors((prev) => ({ ...prev, company: '' }));
                }}
                error={errors.company}
                required
                leftIcon={<Building2 className="w-4 h-4" />}
              />
              <Input
                label="Job Title"
                placeholder="e.g. Senior Frontend Engineer"
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  if (errors.jobTitle) setErrors((prev) => ({ ...prev, jobTitle: '' }));
                }}
                error={errors.jobTitle}
                required
                leftIcon={<Briefcase className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Application Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                required
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Assessment">Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </Select>

              <Select
                label="Work Mode"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                required
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </Select>

              <Select
                label="Employment Type"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Location"
                placeholder="e.g. San Francisco, CA or Worldwide"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Input
                label="Application Date"
                type="date"
                value={appliedDate}
                onChange={(e) => {
                  setAppliedDate(e.target.value);
                  if (errors.appliedDate) setErrors((prev) => ({ ...prev, appliedDate: '' }));
                }}
                error={errors.appliedDate}
                required
                leftIcon={<Calendar className="w-4 h-4" />}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Salary & Links */}
        {activeTab === 'compensation' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Minimum Salary"
                type="number"
                placeholder="e.g. 160000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                leftIcon={<DollarSign className="w-4 h-4" />}
                error={errors.salary}
              />
              <Input
                label="Maximum Salary"
                type="number"
                placeholder="e.g. 210000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                leftIcon={<DollarSign className="w-4 h-4" />}
              />
              <Select
                label="Frequency"
                value={salaryPeriod}
                onChange={(e) => setSalaryPeriod(e.target.value as 'year' | 'month' | 'hour')}
              >
                <option value="year">Per Year (/yr)</option>
                <option value="month">Per Month (/mo)</option>
                <option value="hour">Per Hour (/hr)</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Posting URL"
                placeholder="https://company.com/careers/role"
                value={jobUrl}
                onChange={(e) => {
                  setJobUrl(e.target.value);
                  if (errors.jobUrl) setErrors((prev) => ({ ...prev, jobUrl: '' }));
                }}
                error={errors.jobUrl}
                leftIcon={<LinkIcon className="w-4 h-4" />}
              />
              <Input
                label="Company Logo URL (optional)"
                placeholder="https://..."
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as JobPriority)}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </Select>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Opportunity Excitement (1-5)
                </label>
                <div className="flex items-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{rating}/5 Stars</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Contacts & Dates */}
        {activeTab === 'contact' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Recruiter / Hiring Manager"
                placeholder="e.g. Sarah Chen"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="Recruiter Email"
                type="email"
                placeholder="recruiter@company.com"
                value={recruiterEmail}
                onChange={(e) => {
                  setRecruiterEmail(e.target.value);
                  if (errors.recruiterEmail) setErrors((prev) => ({ ...prev, recruiterEmail: '' }));
                }}
                error={errors.recruiterEmail}
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Upcoming Interview Date/Time"
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                helperText="Shows on Dashboard & Calendar"
              />
              <Input
                label="Take-home / Assessment Deadline"
                type="date"
                value={assessmentDeadline}
                onChange={(e) => setAssessmentDeadline(e.target.value)}
              />
              <Input
                label="Next Follow-up Reminder"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Tab 4: Description & Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Job Description & Requirements
              </label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key responsibilities, tech stack, and qualifications here..."
                className="w-full bg-white dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/80 leading-relaxed transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                Personal Notes & Strategy
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Referral notes, interview impressions, prep topics, salary negotiations..."
                className="w-full bg-white dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/80 leading-relaxed transition-colors"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {activeTab !== 'core' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const tabs: Array<'core' | 'compensation' | 'contact' | 'notes'> = [
                    'core',
                    'compensation',
                    'contact',
                    'notes',
                  ];
                  const curIdx = tabs.indexOf(activeTab);
                  if (curIdx > 0) setActiveTab(tabs[curIdx - 1]);
                }}
              >
                Previous Step
              </Button>
            )}
            {activeTab !== 'notes' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const tabs: Array<'core' | 'compensation' | 'contact' | 'notes'> = [
                    'core',
                    'compensation',
                    'contact',
                    'notes',
                  ];
                  const curIdx = tabs.indexOf(activeTab);
                  if (curIdx < tabs.length - 1) setActiveTab(tabs[curIdx + 1]);
                }}
              >
                Next Step
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              {isEditing ? 'Save Changes' : 'Create Application'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
