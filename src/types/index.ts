export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube';

export type UserRole = 
  | 'Owner'
  | 'Admin'
  | 'Manager'
  | 'Editor'
  | 'Contributor'
  | 'Analyst'
  | 'Client';

export type PostStatus = 
  | 'draft'
  | 'pending'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'failed'
  | 'rejected';


export type AccountStatus = 
  | 'connected'
  | 'expiring'
  | 'failed';

// ============================================================
// CORE HIERARCHY TYPES
// ============================================================

export interface Organization {
  id: string;
  name: string;
  logo: string;
  website: string;
  industry: string;
  plan: 'Starter' | 'Professional' | 'Agency' | 'Enterprise';
}

/**
 * Brand: primary content management context within an Organization.
 * Replaces the old "Workspace" concept.
 * Organization → Brands → Social Accounts → Users → Roles
 */
export interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  timezone: string;
  industry: string;
  organizationId: string;
  postCount?: number;
  accountCount?: number;
  memberCount?: number;
  color?: string; // accent color for visual identity
}

// ============================================================
// SOCIAL ACCOUNTS — belong to a Brand
// ============================================================

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  name: string;
  username: string;
  avatar: string;
  status: AccountStatus;
  brandId: string;
  lastSynced: string;
  expiresInDays?: number;
  errorMessage?: string;
  // Token & OAuth details
  tokenType?: 'OAuth2' | 'API Key' | 'Long-lived';
  tokenExpiresAt?: string;        // human-readable date string e.g. "Oct 15, 2026"
  oauthScopes?: string[];         // list of granted scopes
  apiVersion?: string;            // e.g. "v18.0"
  // Team access
  assignedMemberIds?: string[];   // which team member IDs can post via this account
  // Extended metrics
  metrics?: {
    followers: number;
    engagementRate: number;
    postsThisMonth?: number;
    reach?: number;
    impressions?: number;
  };
}

// ============================================================
// CONTENT TYPES — Posts & Media belong to a Brand
// ============================================================

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface Post {
  id: string;
  brandId: string; // was workspaceId
  platforms: SocialPlatform[];
  content: string;
  platformCustomizations?: Partial<Record<SocialPlatform, string>>;
  mediaUrls: string[];
  mediaType?: 'text' | 'image' | 'video' | 'carousel' | 'link';
  status: PostStatus;
  scheduledTime?: string;
  publishedTime?: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
  };
  approvalStage?: 'Draft' | 'Manager Review' | 'Client Approval' | 'Scheduled' | 'Published' | 'Rejected';
  rejectionReason?: string;
  comments: PostComment[];
  auditLog: AuditLogEntry[];
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    impressions: number;
  };
  // Extended Content Composer fields
  altTexts?: Record<string, string>;
  thumbnailUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  linkDomain?: string;
  linkDescription?: string;
  linkImage?: string;
}

export interface MediaItem {
  id: string;
  brandId: string; // was workspaceId
  name: string;
  url: string;
  type: 'image' | 'video' | 'gif';
  sizeBytes: number;
  dimensions?: string;
  duration?: string;
  folder: string;
  tags: string[];
  usedCount: number;
  uploadedAt: string;
}

// ============================================================
// USERS, ROLES & PERMISSIONS
// ============================================================

/**
 * Approved 7-category functional permission model
 * Each category contains granular individual permissions
 */
export interface TeamMemberPermissions {
  // 1. Account Connection
  accountConnection: {
    connectAccounts: boolean;
    disconnectAccounts: boolean;
    reconnectAccounts: boolean;
    manageAccounts: boolean;
  };
  // 2. Content Creation
  contentCreation: {
    createContent: boolean;
    editContent: boolean;
    uploadMedia: boolean;
    manageDrafts: boolean;
    deleteContent: boolean;
  };
  // 3. Publishing & Scheduling
  publishing: {
    publishImmediately: boolean;
    schedulePosts: boolean;
    manageScheduledPosts: boolean;
    reschedulePosts: boolean;
  };
  // 4. Approval & Collaboration
  approvals: {
    submitForApproval: boolean;
    approvePosts: boolean;
    rejectPosts: boolean;
    editRejectedPosts: boolean;
    resubmitRejectedPosts: boolean;
  };
  // 5. Analytics
  analytics: {
    viewDashboardAnalytics: boolean;
    viewDetailedAnalytics: boolean;
    viewPostPerformance: boolean;
    viewImpressions: boolean;
  };
  // 6. Media Library
  mediaLibrary: {
    viewMedia: boolean;
    uploadMedia: boolean;
    manageMedia: boolean;
    deleteMedia: boolean;
  };
  // 7. Team & Organization Management
  teamManagement: {
    viewTeamMembers: boolean;
    inviteMembers: boolean;
    manageMembers: boolean;
    assignRoles: boolean;
    manageOrgSettings: boolean;
    manageBilling: boolean;
  };
}

/**
 * Team Member: an organization-level user assigned to one or more brands
 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  brandId: string; // primary brand assignment (was workspaceId)
  brandIds?: string[]; // all brands this user has access to
  status: 'active' | 'invited';
  lastActive: string;
  permissions: TeamMemberPermissions;
}

// ============================================================
// ROLE PERMISSION MATRIX — default perms per role
// ============================================================

export interface RolePermissionSet {
  role: UserRole;
  description: string;
  permissions: TeamMemberPermissions;
}

// ============================================================
// ANALYTICS & METRICS
// ============================================================

export type DateFilterRange = 'today' | 'yesterday' | '7days' | '30days' | '90days' | 'custom';

export interface DashboardMetricSummary {
  connectedAccounts: number;
  publishedPosts: number;
  scheduledPosts: number;
  failedPosts: number;
  followers: number;
  followerGrowth: number;
  engagement: number;
  reach: number;
  impressions: number;
  engagementRate: number;
}

// ============================================================
// NOTIFICATIONS & LOGS
// ============================================================

export interface NotificationItem {
  id: string;
  type: 'publish_success' | 'publish_fail' | 'approval_request' | 'approval_done' | 'token_expiring' | 'team_invite';
  title: string;
  message: string;
  time: string;
  read: boolean;
  targetId?: string;
}

export interface PublishingLogItem {
  id: string;
  postId: string;
  postCaption: string;
  platform: SocialPlatform;
  status: 'success' | 'failed' | 'processing';
  timestamp: string;
  error?: string;
  attempts: number;
}

// ============================================================
// MULTI-TENANT ARCHITECTURE: USER, MEMBERSHIP & INVITATIONS
// ============================================================

export type MemberStatus = 'active' | 'pending' | 'invited' | 'suspended';

export interface UserOrganizationMembership {
  userId: string;
  organizationId: string;
  role: UserRole;
  accessibleBrandIds?: string[]; // If undefined/empty & role is Owner/Admin, full access. Else specific brand IDs.
  joinedAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: MemberStatus;
  createdAt: string;
}

export interface MemberInvitation {
  id: string;
  token: string;
  name: string;
  email: string;
  organizationId: string;
  brandIds: string[];
  role: UserRole;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
}
