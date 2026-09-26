import { SocialPlatform, PostStatus, AccountStatus, UserRole } from '../types';

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const PLATFORM_CONFIG: Record<
  SocialPlatform, 
  { 
    name: string; 
    charLimit: number; 
    brandColor: string; 
    bgLight: string;
    description: string;
    supportedMedia: ('image' | 'video' | 'carousel')[];
  }
> = {
  instagram: {
    name: 'Instagram',
    charLimit: 2200,
    brandColor: '#E1306C',
    bgLight: '#FDF2F8',
    description: 'Feed posts, carousels, and reels',
    supportedMedia: ['image', 'video', 'carousel']
  },
  facebook: {
    name: 'Facebook',
    charLimit: 63206,
    brandColor: '#1877F2',
    bgLight: '#EFF6FF',
    description: 'Page posts, photos, and video updates',
    supportedMedia: ['image', 'video', 'carousel']
  },
  linkedin: {
    name: 'LinkedIn',
    charLimit: 3000,
    brandColor: '#0A66C2',
    bgLight: '#F0F7FF',
    description: 'Company updates, articles, and media',
    supportedMedia: ['image', 'video']
  },
  tiktok: {
    name: 'TikTok',
    charLimit: 2200,
    brandColor: '#000000',
    bgLight: '#F4F4F5',
    description: 'Short-form vertical video dispatches',
    supportedMedia: ['video']
  },
  youtube: {
    name: 'YouTube',
    charLimit: 5000,
    brandColor: '#FF0000',
    bgLight: '#FEF2F2',
    description: 'Community posts, Shorts, and video uploads',
    supportedMedia: ['image', 'video']
  }
};

export const STATUS_CONFIG: Record<PostStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'badge-draft' },
  pending: { label: 'In Review', className: 'badge-pending' },
  approved: { label: 'Approved', className: 'badge-approved' },
  scheduled: { label: 'Scheduled', className: 'badge-scheduled' },
  published: { label: 'Published', className: 'badge-published' },
  failed: { label: 'Failed', className: 'badge-failed' },
  rejected: { label: 'Rejected', className: 'badge-failed' }
};


export const ACCOUNT_STATUS_CONFIG: Record<AccountStatus, { label: string; color: string; badgeClass: string }> = {
  connected: { label: 'Connected', color: '#16a34a', badgeClass: 'badge-published' },
  expiring: { label: 'Token Expiring', color: '#d97706', badgeClass: 'badge-pending' },
  failed: { label: 'Connection Failed', color: '#dc2626', badgeClass: 'badge-failed' }
};

export const ROLE_CONFIG: Record<UserRole, { label: string; desc: string }> = {
  Owner: { label: 'Owner', desc: 'Full organization access and billing control' },
  Admin: { label: 'Admin', desc: 'Workspace & team administration' },
  Manager: { label: 'Manager', desc: 'Content publishing and approval authority' },
  Editor: { label: 'Editor', desc: 'Content creation and scheduling drafts' },
  Contributor: { label: 'Contributor', desc: 'Draft submissions only' },
  Analyst: { label: 'Analyst', desc: 'Read-only access to performance analytics' },
  Client: { label: 'Client', desc: 'Review, comment and approve scheduled posts' }
};
