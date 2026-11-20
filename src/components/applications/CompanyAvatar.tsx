import React from 'react';
import { getInitials, getCompanyColorClass } from '../../utils/formatters';

export interface CompanyAvatarProps {
  company: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CompanyAvatar: React.FC<CompanyAvatarProps> = ({
  company,
  logoUrl,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs rounded-lg',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-12 h-12 text-base rounded-xl',
    xl: 'w-14 h-14 text-lg rounded-2xl',
  };

  const palette = getCompanyColorClass(company || 'Company');
  const initials = getInitials(company || 'CO');

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center font-bold select-none border transition-transform duration-150 ${sizeMap[size]} ${palette.bg} ${palette.text} ${palette.border} ${className}`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={company}
          className="w-full h-full object-contain rounded-inherit p-1"
          onError={(e) => {
            // Fallback to initials if image URL fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
