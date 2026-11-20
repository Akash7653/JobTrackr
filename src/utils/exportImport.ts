import { JobApplication } from '../types/job';

export function downloadJSON(data: unknown, filename = 'jobtrackr-export.json') {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function downloadCSV(applications: JobApplication[], filename = 'jobtrackr-applications.csv') {
  const headers = [
    'ID',
    'Company',
    'Job Title',
    'Status',
    'Work Mode',
    'Location',
    'Applied Date',
    'Salary Min',
    'Salary Max',
    'Currency',
    'Employment Type',
    'Recruiter Name',
    'Recruiter Email',
    'Interview Date',
    'Job URL',
    'Notes',
  ];

  const escapeCSV = (val: unknown) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = applications.map((app) => [
    escapeCSV(app.id),
    escapeCSV(app.company),
    escapeCSV(app.jobTitle),
    escapeCSV(app.status),
    escapeCSV(app.workMode),
    escapeCSV(app.location),
    escapeCSV(app.appliedDate),
    escapeCSV(app.salaryMin),
    escapeCSV(app.salaryMax),
    escapeCSV(app.salaryCurrency),
    escapeCSV(app.employmentType),
    escapeCSV(app.recruiterName),
    escapeCSV(app.recruiterEmail),
    escapeCSV(app.interviewDate),
    escapeCSV(app.jobUrl),
    escapeCSV(app.notes),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}

export function parseAndValidateImportJSON(jsonText: string): {
  success: boolean;
  applications?: JobApplication[];
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonText);
    const list = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.applications)
      ? parsed.applications
      : null;

    if (!list) {
      return {
        success: false,
        error: 'Invalid file format: Expected an array of job applications or an object containing an "applications" array.',
      };
    }

    const validStatuses = ['Wishlist', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];
    const validModes = ['Remote', 'Hybrid', 'Onsite'];

    const validated: JobApplication[] = [];

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (!item || typeof item !== 'object') continue;

      if (!item.company || !item.jobTitle) {
        return {
          success: false,
          error: `Record #${i + 1} is missing company name or job title.`,
        };
      }

      const status = validStatuses.includes(item.status) ? item.status : 'Applied';
      const workMode = validModes.includes(item.workMode) ? item.workMode : 'Remote';
      const id = item.id || `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const now = new Date().toISOString();

      validated.push({
        id,
        company: String(item.company).trim(),
        jobTitle: String(item.jobTitle).trim(),
        logoUrl: item.logoUrl ? String(item.logoUrl) : undefined,
        location: item.location ? String(item.location) : 'Remote',
        workMode,
        employmentType: item.employmentType || 'Full-time',
        salaryMin: typeof item.salaryMin === 'number' ? item.salaryMin : undefined,
        salaryMax: typeof item.salaryMax === 'number' ? item.salaryMax : undefined,
        salaryCurrency: item.salaryCurrency || '$',
        salaryPeriod: item.salaryPeriod || 'year',
        appliedDate: item.appliedDate || now.split('T')[0],
        status,
        jobDescription: item.jobDescription ? String(item.jobDescription) : '',
        jobUrl: item.jobUrl ? String(item.jobUrl) : '',
        recruiterName: item.recruiterName ? String(item.recruiterName) : '',
        recruiterEmail: item.recruiterEmail ? String(item.recruiterEmail) : '',
        recruiterPhone: item.recruiterPhone ? String(item.recruiterPhone) : '',
        notes: item.notes ? String(item.notes) : '',
        interviewDate: item.interviewDate ? String(item.interviewDate) : undefined,
        assessmentDeadline: item.assessmentDeadline ? String(item.assessmentDeadline) : undefined,
        followUpDate: item.followUpDate ? String(item.followUpDate) : undefined,
        priority: item.priority || 'Medium',
        rating: typeof item.rating === 'number' ? item.rating : 3,
        favorite: Boolean(item.favorite),
        timeline: Array.isArray(item.timeline)
          ? item.timeline
          : [
              {
                id: `tl-${Date.now()}`,
                status,
                date: item.appliedDate || now.split('T')[0],
                note: 'Imported application',
              },
            ],
        createdAt: item.createdAt || now,
        updatedAt: now,
      });
    }

    if (validated.length === 0) {
      return {
        success: false,
        error: 'No valid job applications found in the file.',
      };
    }

    return {
      success: true,
      applications: validated,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: `JSON parse error: ${(err as Error).message}`,
    };
  }
}
