/**
 * RBAC — Role-Based Access Control
 *
 * Single source of truth for:
 *  - 7 approved roles: Owner, Admin, Manager, Editor, Contributor, Analyst, Client
 *  - 7 functional permission categories (32 granular permissions)
 *  - Dynamic, Admin-configurable permission matrix persisted across the app
 *  - Dynamic page access derivation based on active permissions
 *  - Dynamic action capabilities derivation based on active permissions
 */

import { UserRole, TeamMemberPermissions } from '../types';

export const ALL_ROLES: UserRole[] = [
  'Owner',
  'Admin',
  'Manager',
  'Editor',
  'Contributor',
  'Analyst',
  'Client'
];

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  Owner: 'Full organization authority: billing control, brand creation, and organizational governance.',
  Admin: 'Primary system administrator: sole role with team invitation/role assignment and permission matrix editing.',
  Manager: 'Brand-level supervisor: manages content scheduling, direct publishing, and multi-stage review approvals.',
  Editor: 'Content producer: creates, edits, schedules posts, and manages drafts and creative assets.',
  Contributor: 'Entry-level content creator: drafts posts and submits content for editorial review.',
  Analyst: 'Reporting and metrics specialist: view-only access to performance charts, reach, and engagement data.',
  Client: 'External stakeholder: reviews pending brand posts, approves or rejects copy, and tracks performance.',
};

export type NavId =
  | 'dashboard'
  | 'calendar'
  | 'scheduled-posts'
  | 'content'
  | 'approvals'
  | 'unpublished'
  | 'analytics'
  | 'media'
  | 'social'
  | 'team'
  | 'settings'
  | 'composer'
  | 'org-brands'
  | 'roles-permissions'
  | 'org-settings'
  | 'billing';

// ── Functional Permission Categories Metadata ───────────────────────────────

export interface PermissionItemDef {
  key: string;
  label: string;
  desc: string;
}

export interface PermissionCategoryDef {
  key: keyof TeamMemberPermissions;
  title: string;
  desc: string;
  permissions: PermissionItemDef[];
}

export const PERMISSION_CATEGORIES: PermissionCategoryDef[] = [
  {
    key: 'accountConnection',
    title: '1. Account Connection',
    desc: 'Connect, disconnect, reconnect and configure social media channels',
    permissions: [
      { key: 'connectAccounts', label: 'Connect accounts', desc: 'Authorize and link new social media accounts to brands' },
      { key: 'disconnectAccounts', label: 'Disconnect accounts', desc: 'Unlink and remove connected social channels' },
      { key: 'reconnectAccounts', label: 'Reconnect accounts', desc: 'Refresh expired OAuth tokens and account permissions' },
      { key: 'manageAccounts', label: 'Manage accounts', desc: 'Configure sync settings, API versions, and account metadata' },
    ]
  },
  {
    key: 'contentCreation',
    title: '2. Content Creation',
    desc: 'Draft creation, copy editing, media uploads, and post lifecycle management',
    permissions: [
      { key: 'createContent', label: 'Create content', desc: 'Compose new posts across connected social networks' },
      { key: 'editContent', label: 'Edit content', desc: 'Modify copy, hashtags, mentions, and platform customizations' },
      { key: 'uploadMedia', label: 'Upload media', desc: 'Upload images, videos, and GIFs directly into composer' },
      { key: 'manageDrafts', label: 'Manage drafts', desc: 'Save, organize, duplicate, and archive unpublished drafts' },
      { key: 'deleteContent', label: 'Delete content', desc: 'Permanently remove draft, pending, or published posts' },
    ]
  },
  {
    key: 'publishing',
    title: '3. Publishing & Scheduling',
    desc: 'Immediate dispatch, calendar queue automation, and rescheduling',
    permissions: [
      { key: 'publishImmediately', label: 'Publish immediately', desc: 'Dispatch live posts to connected social channels instantly' },
      { key: 'schedulePosts', label: 'Schedule posts', desc: 'Queue posts for future automatic publication at target times' },
      { key: 'manageScheduledPosts', label: 'Manage scheduled posts', desc: 'Pause, cancel, or re-order upcoming posts in the queue' },
      { key: 'reschedulePosts', label: 'Reschedule posts', desc: 'Adjust scheduled dates, times, and calendar slots' },
    ]
  },
  {
    key: 'approvals',
    title: '4. Approval & Collaboration',
    desc: 'Multi-tiered review workflows, client sign-offs, and rejection feedback',
    permissions: [
      { key: 'submitForApproval', label: 'Submit for approval', desc: 'Send draft content into the editorial approval pipeline' },
      { key: 'approvePosts', label: 'Approve posts', desc: 'Grant approval for posts to advance to scheduled/published state' },
      { key: 'rejectPosts', label: 'Reject posts', desc: 'Decline submission and return with mandatory rejection feedback' },
      { key: 'editRejectedPosts', label: 'Edit rejected posts', desc: 'Update copy or media on posts flagged with feedback' },
      { key: 'resubmitRejectedPosts', label: 'Resubmit rejected posts', desc: 'Re-enter revised posts into the approval workflow' },
    ]
  },
  {
    key: 'analytics',
    title: '5. Analytics',
    desc: 'Performance metrics, post engagement tracking, and reporting KPIs',
    permissions: [
      { key: 'viewDashboardAnalytics', label: 'View dashboard analytics', desc: 'Access high-level brand summary metrics on dashboard' },
      { key: 'viewDetailedAnalytics', label: 'View detailed analytics', desc: 'Examine in-depth platform charts, breakdown metrics, and trends' },
      { key: 'viewPostPerformance', label: 'View post performance', desc: 'Inspect per-post reach, likes, comments, and engagement rates' },
      { key: 'viewImpressions', label: 'View impressions', desc: 'Analyze impression counts, follower growth, and audience velocity' },
    ]
  },
  {
    key: 'mediaLibrary',
    title: '6. Media Library',
    desc: 'Asset library storage, categorizations, uploads, and media maintenance',
    permissions: [
      { key: 'viewMedia', label: 'View media', desc: 'Browse brand asset gallery, folders, tags, and media previews' },
      { key: 'uploadMedia', label: 'Upload media', desc: 'Upload high-resolution images, videos, and graphic assets' },
      { key: 'manageMedia', label: 'Manage media', desc: 'Organize assets into folders, edit metadata, and assign tags' },
      { key: 'deleteMedia', label: 'Delete media', desc: 'Remove unused or outdated media assets from the library' },
    ]
  },
  {
    key: 'teamManagement',
    title: '7. Team & Organization Management',
    desc: 'Organization hierarchy, team invites, role assignment, and billing',
    permissions: [
      { key: 'viewTeamMembers', label: 'View team members', desc: 'See brand collaborators, member list, and active roles' },
      { key: 'inviteMembers', label: 'Invite members', desc: 'Send email invitations to new team members (Admin-only)' },
      { key: 'manageMembers', label: 'Manage members', desc: 'Remove members, modify brand assignments, and deactivate access' },
      { key: 'assignRoles', label: 'Assign roles', desc: 'Change member roles between the 7 approved role tiers (Admin-only)' },
      { key: 'manageOrgSettings', label: 'Manage organization settings', desc: 'Configure company profile, security policies, and workspace defaults' },
      { key: 'manageBilling', label: 'Manage billing', desc: 'Manage payment methods, invoices, and subscription plans (Owner-only)' },
    ]
  }
];

// ── Default Approved Role Permissions Matrix ────────────────────────────────

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, TeamMemberPermissions> = {
  Owner: {
    accountConnection: {
      connectAccounts: true,
      disconnectAccounts: true,
      reconnectAccounts: true,
      manageAccounts: true,
    },
    contentCreation: {
      createContent: true,
      editContent: true,
      uploadMedia: true,
      manageDrafts: true,
      deleteContent: true,
    },
    publishing: {
      publishImmediately: true,
      schedulePosts: true,
      manageScheduledPosts: true,
      reschedulePosts: true,
    },
    approvals: {
      submitForApproval: true,
      approvePosts: true,
      rejectPosts: true,
      editRejectedPosts: true,
      resubmitRejectedPosts: true,
    },
    analytics: {
      viewDashboardAnalytics: true,
      viewDetailedAnalytics: true,
      viewPostPerformance: true,
      viewImpressions: true,
    },
    mediaLibrary: {
      viewMedia: true,
      uploadMedia: true,
      manageMedia: true,
      deleteMedia: true,
    },
    teamManagement: {
      viewTeamMembers: true,
      inviteMembers: false, // Admin only per Rule 14
      manageMembers: false,
      assignRoles: false,
      manageOrgSettings: true,
      manageBilling: true,  // Owner-only
    }
  },

  Admin: {
    accountConnection: {
      connectAccounts: true,
      disconnectAccounts: true,
      reconnectAccounts: true,
      manageAccounts: true,
    },
    contentCreation: {
      createContent: true,
      editContent: true,
      uploadMedia: true,
      manageDrafts: true,
      deleteContent: true,
    },
    publishing: {
      publishImmediately: true,
      schedulePosts: true,
      manageScheduledPosts: true,
      reschedulePosts: true,
    },
    approvals: {
      submitForApproval: true,
      approvePosts: true,
      rejectPosts: true,
      editRejectedPosts: true,
      resubmitRejectedPosts: true,
    },
    analytics: {
      viewDashboardAnalytics: true,
      viewDetailedAnalytics: true,
      viewPostPerformance: true,
      viewImpressions: true,
    },
    mediaLibrary: {
      viewMedia: true,
      uploadMedia: true,
      manageMedia: true,
      deleteMedia: true,
    },
    teamManagement: {
      viewTeamMembers: true,
      inviteMembers: true,  // Admin-only capability
      manageMembers: true,
      assignRoles: true,
      manageOrgSettings: true,
      manageBilling: false, // Owner-only
    }
  },

  Manager: {
    accountConnection: {
      connectAccounts: true,
      disconnectAccounts: true,
      reconnectAccounts: true,
      manageAccounts: false,
    },
    contentCreation: {
      createContent: true,
      editContent: true,
      uploadMedia: true,
      manageDrafts: true,
      deleteContent: true,
    },
    publishing: {
      publishImmediately: true,
      schedulePosts: true,
      manageScheduledPosts: true,
      reschedulePosts: true,
    },
    approvals: {
      submitForApproval: true,
      approvePosts: true,
      rejectPosts: true,
      editRejectedPosts: true,
      resubmitRejectedPosts: true,
    },
    analytics: {
      viewDashboardAnalytics: true,
      viewDetailedAnalytics: true,
      viewPostPerformance: true,
      viewImpressions: true,
    },
    mediaLibrary: {
      viewMedia: true,
      uploadMedia: true,
      manageMedia: true,
      deleteMedia: true,
    },
    teamManagement: {
      viewTeamMembers: true,
      inviteMembers: false,
      manageMembers: false,
      assignRoles: false,
      manageOrgSettings: false,
      manageBilling: false,
    }
  },

  Editor: {
    accountConnection: {
      connectAccounts: false,
      disconnectAccounts: false,
      reconnectAccounts: false,
      manageAccounts: false,
    },
    contentCreation: {
      createContent: true,
      editContent: true,
      uploadMedia: true,
      manageDrafts: true,
      deleteContent: false,
    },
    publishing: {
      publishImmediately: true,
      schedulePosts: true,
      manageScheduledPosts: true,
      reschedulePosts: false,
    },
    approvals: {
      submitForApproval: true,
      approvePosts: false,
      rejectPosts: false,
      editRejectedPosts: true,
      resubmitRejectedPosts: true,
    },
    analytics: {
      viewDashboardAnalytics: true,
      viewDetailedAnalytics: true,
      viewPostPerformance: true,
      viewImpressions: true,
    },
    mediaLibrary: {
      viewMedia: true,
      uploadMedia: true,
      manageMedia: true,
      deleteMedia: false,
    },
    teamManagement: {
      viewTeamMembers: false,
      inviteMembers: false,
      manageMembers: false,
      assignRoles: false,
      manageOrgSettings: false,
      manageBilling: false,
    }
  },

  Contributor: {
    accountConnection: {
      connectAccounts: false,
      disconnectAccounts: false,
      reconnectAccounts: false,
      manageAccounts: false,
    },
    contentCreation: {
      createContent: true,
      editContent: true,
      uploadMedia: true,
      manageDrafts: true,
      deleteContent: false,
    },
    publishing: {
      publishImmediately: false,
      schedulePosts: false,
      manageScheduledPosts: false,
      reschedulePosts: false,
    },
    approvals: {
      submitForApproval: true,
      approvePosts: false,
      rejectPosts: false,
      editRejectedPosts: true,
      resubmitRejectedPosts: true,
    },
    analytics: {
      viewDashboardAnalytics: true,
      viewDetailedAnalytics: false,
      viewPostPerformance: false,
      viewImpressions: false,
    },
    mediaLibrary: {
      viewMedia: true,
      uploadMedia: true,
      manageMedia: false,
      deleteMedia: false,
    },
    teamManagement: {
      viewTeamMembers: false,
      inviteMembers: false,
      manageMembers: false,
      assignRoles: false,
      manageOrgSettings: false,
      manageBilling: false,
    }
  },

  Analyst: {
    accountConnection: {
      connectAccounts: false,
      disconnectAccounts: false,
      reconnectAccounts: false,
      manageAccounts: false,
    },
    contentCreation: {
      createContent: false,
      editContent: false,
      uploadMedia: false,
      manageDrafts: false,
      deleteContent: false,
    },
    publishing: {
      publishImmediately: false,
      schedulePosts: false,
      manageScheduledPosts: false,
      reschedulePosts: false,
    },
    approvals: {
      submitForApproval: false,
      approvePosts: false,
      rejectPosts: false,
      editRejectedPosts: false,
      resubmitRejectedPosts: false,
    },
    analytics: {
      viewDashboardAnalytics: true,
      viewDetailedAnalytics: true,
      viewPostPerformance: true,
      viewImpressions: true,
    },
    mediaLibrary: {
      viewMedia: false,
      uploadMedia: false,
      manageMedia: false,
      deleteMedia: false,
    },
    teamManagement: {
      viewTeamMembers: false,
      inviteMembers: false,
      manageMembers: false,
      assignRoles: false,
      manageOrgSettings: false,
      manageBilling: false,
    }
  },

  Client: {
    accountConnection: {
      connectAccounts: false,
      disconnectAccounts: false,
      reconnectAccounts: false,
      manageAccounts: false,
    },
    contentCreation: {
      createContent: false,
      editContent: false,
      uploadMedia: false,
      manageDrafts: false,
      deleteContent: false,
    },
    publishing: {
      publishImmediately: false,
      schedulePosts: false,
      manageScheduledPosts: false,
      reschedulePosts: false,
    },
    approvals: {
      submitForApproval: false,
      approvePosts: true,
      rejectPosts: true,
      editRejectedPosts: false,
      resubmitRejectedPosts: false,
    },
    analytics: {
      viewDashboardAnalytics: true,
      viewDetailedAnalytics: true,
      viewPostPerformance: true,
      viewImpressions: false,
    },
    mediaLibrary: {
      viewMedia: false,
      uploadMedia: false,
      manageMedia: false,
      deleteMedia: false,
    },
    teamManagement: {
      viewTeamMembers: false,
      inviteMembers: false,
      manageMembers: false,
      assignRoles: false,
      manageOrgSettings: false,
      manageBilling: false,
    }
  },
};

// ── Action-level capabilities ─────────────────────────────────────────────────

export interface RoleCapabilities {
  canCreateContent: boolean;
  canEditContent: boolean;
  canSaveDrafts: boolean;
  canSubmitForApproval: boolean;
  canApproveRejectPosts: boolean;
  canPublishImmediately: boolean;
  canSchedulePosts: boolean;
  canReschedulePosts: boolean;
  canDeleteContent: boolean;
  canEditRejectedPosts: boolean;
  canManageChannels: boolean;
  canManageMedia: boolean;
  canUploadMedia: boolean;
  canViewTeam: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canAssignRoles: boolean;
  canViewBilling: boolean;
  canManageBilling: boolean;
  canManageBrandSettings: boolean;
  canManageOrgSettings: boolean;
  canViewAnalytics: boolean;
}

export function getCapabilities(
  role: UserRole
): RoleCapabilities {
  const perms = DEFAULT_ROLE_PERMISSIONS[role];

  return {
    canCreateContent: perms.contentCreation.createContent,
    canEditContent: perms.contentCreation.editContent,
    canSaveDrafts: perms.contentCreation.manageDrafts,
    canSubmitForApproval: perms.approvals.submitForApproval || perms.approvals.resubmitRejectedPosts,
    canApproveRejectPosts: perms.approvals.approvePosts || perms.approvals.rejectPosts,
    canPublishImmediately: perms.publishing.publishImmediately,
    canSchedulePosts: perms.publishing.schedulePosts,
    canReschedulePosts: perms.publishing.reschedulePosts,
    canDeleteContent: perms.contentCreation.deleteContent,
    canEditRejectedPosts: perms.approvals.editRejectedPosts,
    canManageChannels:
      perms.accountConnection.connectAccounts ||
      perms.accountConnection.disconnectAccounts ||
      perms.accountConnection.reconnectAccounts ||
      perms.accountConnection.manageAccounts,
    canManageMedia: perms.mediaLibrary.manageMedia || perms.mediaLibrary.deleteMedia,
    canUploadMedia: perms.mediaLibrary.uploadMedia || perms.contentCreation.uploadMedia,
    canViewTeam: perms.teamManagement.viewTeamMembers,
    // Only Admin can invite/remove members or assign roles per specification rule 14
    canInviteMembers: role === 'Admin' && perms.teamManagement.inviteMembers,
    canRemoveMembers: role === 'Admin' && perms.teamManagement.manageMembers,
    canAssignRoles: role === 'Admin' && perms.teamManagement.assignRoles,
    canViewBilling: perms.teamManagement.manageBilling || role === 'Owner' || role === 'Admin',
    canManageBilling: role === 'Owner' && perms.teamManagement.manageBilling,
    canManageBrandSettings: perms.teamManagement.manageOrgSettings || role === 'Owner' || role === 'Admin',
    canManageOrgSettings: perms.teamManagement.manageOrgSettings || role === 'Owner' || role === 'Admin',
    canViewAnalytics: perms.analytics.viewDashboardAnalytics || perms.analytics.viewDetailedAnalytics,
  };
}

// ── Dynamic Page / Route Access ──────────────────────────────────────────────

export function canAccessPage(
  role: UserRole,
  navId: string
): boolean {
  // Roles & permissions page is accessible by all 7 roles (read-only for non-admin, editable for Admin)
  if (navId === 'roles-permissions') return true;

  const perms = DEFAULT_ROLE_PERMISSIONS[role];

  switch (navId) {
    case 'dashboard':
      return perms.analytics.viewDashboardAnalytics || true;
    case 'calendar':
      return (
        perms.publishing.schedulePosts ||
        perms.publishing.manageScheduledPosts ||
        perms.publishing.reschedulePosts ||
        perms.publishing.publishImmediately ||
        perms.contentCreation.createContent ||
        role === 'Client'
      );
    case 'scheduled-posts':
      return (
        perms.publishing.schedulePosts ||
        perms.publishing.manageScheduledPosts ||
        perms.publishing.reschedulePosts ||
        perms.publishing.publishImmediately
      );
    case 'content':
      return (
        perms.contentCreation.createContent ||
        perms.contentCreation.editContent ||
        perms.contentCreation.manageDrafts
      );
    case 'approvals':
      return (
        perms.approvals.submitForApproval ||
        perms.approvals.approvePosts ||
        perms.approvals.rejectPosts
      );
    case 'unpublished':
      return (
        perms.contentCreation.manageDrafts ||
        perms.contentCreation.deleteContent ||
        perms.approvals.editRejectedPosts ||
        perms.contentCreation.createContent ||
        role === 'Client'
      );
    case 'analytics':
      return (
        perms.analytics.viewDetailedAnalytics ||
        perms.analytics.viewPostPerformance ||
        perms.analytics.viewImpressions
      );
    case 'media':
      return (
        perms.mediaLibrary.viewMedia ||
        perms.mediaLibrary.uploadMedia ||
        perms.mediaLibrary.manageMedia
      );
    case 'social':
      return (
        perms.accountConnection.connectAccounts ||
        perms.accountConnection.disconnectAccounts ||
        perms.accountConnection.reconnectAccounts ||
        perms.accountConnection.manageAccounts ||
        role === 'Editor'
      );
    case 'team':
      return (
        perms.teamManagement.viewTeamMembers ||
        perms.teamManagement.inviteMembers ||
        perms.teamManagement.manageMembers
      );
    case 'settings':
      return perms.teamManagement.manageOrgSettings || role === 'Owner' || role === 'Admin';
    case 'composer':
      return perms.contentCreation.createContent || perms.contentCreation.editContent;
    case 'org-brands':
      return perms.teamManagement.manageOrgSettings || role === 'Owner' || role === 'Admin';
    case 'org-settings':
      return perms.teamManagement.manageOrgSettings || role === 'Owner' || role === 'Admin';
    case 'billing':
      return perms.teamManagement.manageBilling || role === 'Owner' || role === 'Admin';
    default:
      return false;
  }
}

export function getAllowedPages(
  role: UserRole
): NavId[] {
  const allNavs: NavId[] = [
    'dashboard',
    'calendar',
    'scheduled-posts',
    'content',
    'approvals',
    'unpublished',
    'analytics',
    'media',
    'social',
    'team',
    'settings',
    'composer',
    'org-brands',
    'roles-permissions',
    'org-settings',
    'billing'
  ];
  return allNavs.filter(nav => canAccessPage(role, nav));
}

export function getDefaultPage(
  role: UserRole
): string {
  const allowed = getAllowedPages(role);
  return allowed[0] ?? 'dashboard';
}
