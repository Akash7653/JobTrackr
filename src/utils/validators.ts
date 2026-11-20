export interface ValidationError {
  field: string;
  message: string;
}

export function validateApplicationForm(data: {
  company: string;
  jobTitle: string;
  appliedDate: string;
  salaryMin?: number;
  salaryMax?: number;
  jobUrl?: string;
  recruiterEmail?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.company || !data.company.trim()) {
    errors.company = 'Company name is required';
  }

  if (!data.jobTitle || !data.jobTitle.trim()) {
    errors.jobTitle = 'Job title is required';
  }

  if (!data.appliedDate) {
    errors.appliedDate = 'Application date is required';
  }

  if (
    data.salaryMin !== undefined &&
    data.salaryMax !== undefined &&
    data.salaryMin > data.salaryMax
  ) {
    errors.salary = 'Minimum salary cannot exceed maximum salary';
  }

  if (data.jobUrl && data.jobUrl.trim()) {
    try {
      new URL(data.jobUrl.trim());
    } catch {
      if (!data.jobUrl.startsWith('http://') && !data.jobUrl.startsWith('https://')) {
        // try prepending https
        try {
          new URL('https://' + data.jobUrl.trim());
        } catch {
          errors.jobUrl = 'Please enter a valid URL';
        }
      } else {
        errors.jobUrl = 'Please enter a valid URL';
      }
    }
  }

  if (data.recruiterEmail && data.recruiterEmail.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.recruiterEmail.trim())) {
      errors.recruiterEmail = 'Please enter a valid email address';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
