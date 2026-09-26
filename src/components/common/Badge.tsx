import React from 'react';
import type { SocialPlatform, PostStatus, AccountStatus } from '../../types';
import { STATUS_CONFIG, ACCOUNT_STATUS_CONFIG, PLATFORM_CONFIG } from '../../utils/helpers';
import { 
  InstagramIcon, 
  FacebookIcon, 
  LinkedinIcon, 
  TiktokIcon, 
  YoutubeIcon 
} from './SocialIcons';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Calendar 
} from 'lucide-react';

interface StatusBadgeProps {
  status: PostStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  const renderIcon = () => {
    switch (status) {
      case 'draft': return <FileText size={11} />;
      case 'pending': return <Clock size={11} />;
      case 'approved': return <CheckCircle2 size={11} />;
      case 'scheduled': return <Calendar size={11} />;
      case 'published': return <CheckCircle2 size={11} />;
      case 'failed': return <AlertCircle size={11} />;
      default: return null;
    }
  };

  return (
    <span className={`badge ${config.className}`}>
      {showIcon && renderIcon()}
      {config.label}
    </span>
  );
};

interface PlatformBadgeProps {
  platform: SocialPlatform;
  showName?: boolean;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform, showName = true }) => {
  const config = PLATFORM_CONFIG[platform];

  const renderIcon = () => {
    switch (platform) {
      case 'instagram': return <InstagramIcon size={13} color="currentColor" />;
      case 'facebook': return <FacebookIcon size={13} color="currentColor" />;
      case 'linkedin': return <LinkedinIcon size={13} color="currentColor" />;
      case 'tiktok': return <TiktokIcon size={13} color="currentColor" />;
      case 'youtube': return <YoutubeIcon size={13} color="currentColor" />;
      default: return null;
    }
  };

  return (
    <span className={`badge badge-platform badge-${platform}`}>
      {renderIcon()}
      {showName && config?.name}
    </span>
  );
};

interface AccountStatusBadgeProps {
  status: AccountStatus;
}

export const AccountStatusBadge: React.FC<AccountStatusBadgeProps> = ({ status }) => {
  const config = ACCOUNT_STATUS_CONFIG[status];
  return (
    <span className={`badge ${config.badgeClass}`}>
      <span className="badge-dot" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  );
};
