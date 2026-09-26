import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Organization, 
  Brand,
  SocialAccount, 
  Post, 
  MediaItem, 
  TeamMember, 
  NotificationItem, 
  PublishingLogItem,
  DateFilterRange,
  UserRole,
  SocialPlatform,
  PostStatus,
  TeamMemberPermissions,
  UserOrganizationMembership,
  MemberInvitation
} from '../types';
import { 
  initialOrganization, 
  initialOrganizations,
  initialBrands, 
  initialSocialAccounts, 
  initialPosts, 
  initialMediaItems, 
  initialTeamMembers, 
  initialNotifications, 
  initialPublishingLogs,
  initialUserMemberships,
  initialInvitations,
  makePermissions
} from '../mock/initialData';
import { 
  getDefaultPage, 
  DEFAULT_ROLE_PERMISSIONS 
} from '../utils/rbac';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Auth & Multi-tenant Routing
  isAuthenticated: boolean;
  currentRoute: string;
  navigateTo: (route: string) => void;
  adminActiveTab: string;
  setAdminActiveTab: (tab: string) => void;
  currentUser: {
    name: string;
    email: string;
    avatar: string;
    role: UserRole;
  };
  login: (asRole?: UserRole, targetRoute?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Multi-tenant Organizations
  organizations: Organization[];
  currentOrgId: string;
  organization: Organization;
  switchOrganization: (orgId: string) => void;
  updateOrganization: (data: Partial<Organization>) => void;
  userMemberships: UserOrganizationMembership[];

  // Brands (scoped to current organization)
  currentBrand: Brand;
  brands: Brand[];
  allBrands: Brand[]; // unfiltered full list (for org-level views)
  orgBrands: Brand[]; // all brands belonging to active organization
  switchBrand: (brandId: string) => void;
  createBrand: (data: { name: string; description: string; website: string; timezone: string; industry: string; color?: string; logo?: string }) => { success: boolean; brand?: Brand; error?: string };
  updateBrand: (brandId: string, data: Partial<Brand>) => void;
  deleteBrand: (brandId: string) => void;
  brandApprovers: Record<string, string[]>;
  addBrandApprover: (brandId: string, memberId: string) => void;
  removeBrandApprover: (brandId: string, memberId: string) => void;

  // Invitations
  invitations: MemberInvitation[];
  orgInvitations: MemberInvitation[];
  inviteMember: (data: { name: string; email: string; organizationId: string; brandIds: string[]; role: UserRole }) => { success: boolean; token?: string; error?: string; invitation?: MemberInvitation };
  resendInvitation: (invitationId: string) => void;
  cancelInvitation: (invitationId: string) => void;
  acceptInvitation: (token: string, password: string) => { success: boolean; error?: string };
  activeInvitationPreview: MemberInvitation | null;
  setActiveInvitationPreview: (inv: MemberInvitation | null) => void;

  // Member Context — cascades from Brand selection
  currentMember: TeamMember;
  brandMembers: TeamMember[]; // members of the currently selected brand
  orgMembers: TeamMember[]; // all members belonging to brands of current org
  currentMemberId: string;
  switchMember: (memberId: string) => void;
  updateMemberRole: (memberId: string, role: UserRole) => void;
  removeMemberFromOrg: (memberId: string) => void;
  updateMemberBrandAccess: (memberId: string, brandIds: string[]) => void;

  // Social Accounts — filtered to currentBrand
  socialAccounts: SocialAccount[];
  allSocialAccounts: SocialAccount[];
  connectAccount: (platform: SocialPlatform, username: string, name: string) => void;
  reconnectAccount: (accountId: string) => void;
  refreshAccount: (accountId: string) => void;
  disconnectAccount: (accountId: string) => void;
  renameAccount: (accountId: string, newName: string) => void;
  reassignAccountBrand: (accountId: string, newBrandId: string) => void;
  updateAccountMembers: (accountId: string, memberIds: string[]) => void;

  // Posts — filtered to currentBrand
  posts: Post[];
  allPosts: Post[];
  savePost: (postData: Partial<Post>, status: PostStatus) => void;
  deletePost: (postId: string) => void;
  duplicatePost: (postId: string) => void;
  approvePost: (postId: string, comment?: string) => void;
  rejectPost: (postId: string, reason: string) => void;
  requestChangesPost: (postId: string, feedback: string) => void;
  reschedulePost: (postId: string, newTime: string) => void;
  retryFailedPost: (postId: string) => void;

  // Media Library — filtered to currentBrand
  mediaItems: MediaItem[];
  uploadMedia: (item: Partial<MediaItem>) => void;
  deleteMedia: (mediaId: string) => void;

  // Team — filtered to currentBrand
  teamMembers: TeamMember[];
  allTeamMembers: TeamMember[];
  inviteTeamMember: (data: { name: string; email: string; role: UserRole; brandId: string }) => void;
  updateMemberPermissions: (memberId: string, permissions: Partial<TeamMemberPermissions>) => void;
  removeMember: (memberId: string) => void;


  // Navigation & Filters
  activeNav: string;
  setActiveNav: (nav: string) => void;
  dateFilter: DateFilterRange;
  setDateFilter: (range: DateFilterRange) => void;

  // Notifications & Logs
  notifications: NotificationItem[];
  markNotificationsRead: () => void;
  publishingLogs: PublishingLogItem[];

  // Modal state
  isComposerOpen: boolean;
  editingPost: Post | null;
  openComposer: (postToEdit?: Post) => void;
  closeComposer: () => void;
  
  isScheduleModalOpen: boolean;
  openScheduleModal: (post?: Post) => void;
  closeScheduleModal: () => void;

  reviewDrawerPost: Post | null;
  openReviewDrawer: (post: Post) => void;
  closeReviewDrawer: () => void;

  isConnectAccountOpen: boolean;
  setIsConnectAccountOpen: (open: boolean) => void;

  isCreateBrandOpen: boolean;
  setIsCreateBrandOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  isPublishingLogsOpen: boolean;
  setIsPublishingLogsOpen: (open: boolean) => void;

  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;

  showSkeletonLoading: boolean;
  setShowSkeletonLoading: (loading: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'warning' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('aurasocial_auth');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // URL / Path-based route state synchronized with browser URL
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname) {
      return window.location.pathname;
    }
    return '/';
  });

  const [adminActiveTab, setAdminActiveTab] = useState<string>('overview');

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(null, '', route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Multi-tenant Organizations
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [currentOrgId, setCurrentOrgId] = useState<string>('org-acme');
  const [userMemberships, setUserMemberships] = useState<UserOrganizationMembership[]>(initialUserMemberships);

  // Invitations
  const [invitations, setInvitations] = useState<MemberInvitation[]>(initialInvitations);
  const [activeInvitationPreview, setActiveInvitationPreview] = useState<MemberInvitation | null>(null);

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    role: UserRole;
  }>({
    name: 'Alex Morgan',
    email: 'alex@acmedigital.agency',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Admin' // Start as Admin in Acme Digital Agency
  });

  // Organization object
  const organization = organizations.find(o => o.id === currentOrgId) || organizations[0];

  // Brands (replaces Workspaces)
  const [allBrands, setAllBrands] = useState<Brand[]>(initialBrands);
  const [currentBrandId, setCurrentBrandId] = useState<string>('brand-restaurant');

  // Member Context — default to Alex Morgan in GreenLeaf Restaurant
  const [currentMemberId, setCurrentMemberId] = useState<string>('usr-alex-restaurant');

  // All data collections (unfiltered — filtered views are derived)
  const [allSocialAccounts, setAllSocialAccounts] = useState<SocialAccount[]>(initialSocialAccounts);
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts);
  const [allMediaItems, setAllMediaItems] = useState<MediaItem[]>(initialMediaItems);
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [publishingLogs, setPublishingLogs] = useState<PublishingLogItem[]>(initialPublishingLogs);

  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [dateFilter, setDateFilter] = useState<DateFilterRange>('30days');

  // Modal controls
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [reviewDrawerPost, setReviewDrawerPost] = useState<Post | null>(null);
  const [isConnectAccountOpen, setIsConnectAccountOpen] = useState(false);
  const [isCreateBrandOpen, setIsCreateBrandOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPublishingLogsOpen, setIsPublishingLogsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showSkeletonLoading, setShowSkeletonLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ── Toast helpers ──
  const showToast = (type: 'success' | 'warning' | 'error' | 'info', message: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ── Derived: active organization brands (DATA ISOLATION) ──
  const orgBrands = allBrands.filter(b => b.organizationId === currentOrgId);
  const brands = orgBrands; // expose only active organization's brands

  // ── Derived: current brand ──
  const currentBrand = orgBrands.find(b => b.id === currentBrandId) || orgBrands[0] || allBrands[0];

  // ── Derived: brand-scoped data (KEY: data isolation per brand) ──
  const socialAccounts = allSocialAccounts.filter(a => a.brandId === currentBrandId);
  const posts = allPosts.filter(p => p.brandId === currentBrandId);
  const mediaItems = allMediaItems.filter(m => m.brandId === currentBrandId);
  const teamMembers = allTeamMembers.filter(m => m.brandId === currentBrandId);

  // ── Derived: brand-scoped members for current brand ──
  const brandMembers = allTeamMembers.filter(m => m.brandId === currentBrandId);

  // ── Derived: organization-scoped members across all brands in this org ──
  const orgBrandIds = orgBrands.map(b => b.id);
  const orgMembers = allTeamMembers.filter(m => orgBrandIds.includes(m.brandId));

  // ── Derived: organization-scoped invitations ──
  const orgInvitations = invitations.filter(inv => inv.organizationId === currentOrgId);

  // ── Derived: current active member ──
  const currentMember = (
    allTeamMembers.find(m => m.id === currentMemberId && m.brandId === currentBrandId)
    || brandMembers[0]
    || allTeamMembers[0]
  );

  // ── Multi-tenant Organization actions ──
  const switchOrganization = (orgId: string) => {
    const targetOrg = organizations.find(o => o.id === orgId);
    if (!targetOrg) return;
    setCurrentOrgId(orgId);

    // Evaluate user role for target organization
    const membership = userMemberships.find(m => m.organizationId === orgId && (m.userId === 'usr-alex' || m.userId === currentUser.email));
    const roleInOrg: UserRole = membership ? membership.role : 'Manager';

    setCurrentUser(prev => ({
      ...prev,
      role: roleInOrg
    }));

    // Find brands in target organization
    const targetOrgBrands = allBrands.filter(b => b.organizationId === orgId);
    let accessibleBrands = targetOrgBrands;
    if (membership && membership.accessibleBrandIds && membership.accessibleBrandIds.length > 0 && roleInOrg !== 'Owner' && roleInOrg !== 'Admin') {
      accessibleBrands = targetOrgBrands.filter(b => membership.accessibleBrandIds?.includes(b.id));
    }

    if (accessibleBrands.length > 0) {
      setCurrentBrandId(accessibleBrands[0].id);
      const newBrandMembers = allTeamMembers.filter(m => m.brandId === accessibleBrands[0].id);
      if (newBrandMembers.length > 0) {
        setCurrentMemberId(newBrandMembers[0].id);
      }
    } else {
      setCurrentBrandId(''); // empty brand state
    }

    // RBAC Direct Route Protection: If non-admin switches to org on /admin route, redirect to /app!
    if (currentRoute.startsWith('/admin') && roleInOrg !== 'Owner' && roleInOrg !== 'Admin') {
      navigateTo('/app');
      showToast('warning', `Switched to ${targetOrg.name} as ${roleInOrg}. Redirected to app (Admin Portal requires Admin/Owner role).`);
    } else {
      showToast('info', `Switched organization to ${targetOrg.name} (${roleInOrg} role)`);
    }
  };

  const updateOrganization = (data: Partial<Organization>) => {
    setOrganizations(prev => prev.map(o => o.id === currentOrgId ? { ...o, ...data } : o));
    showToast('success', 'Organization settings updated successfully');
  };

  // ── switchMember: select a member within current brand ──
  const switchMember = (memberId: string) => {
    const member = allTeamMembers.find(m => m.id === memberId && m.brandId === currentBrandId);
    if (!member) return;
    setCurrentMemberId(memberId);
    setCurrentUser({
      name: member.name,
      email: member.email,
      avatar: member.avatar,
      role: member.role
    });
    showToast('info', `Active member: ${member.name} (${member.role})`);
  };

  // ── Brand actions ──
  const switchBrand = (brandId: string) => {
    const brand = allBrands.find(b => b.id === brandId);
    const newBrandMembers = allTeamMembers.filter(m => m.brandId === brandId);

    // Keep active user if present or select first brand member
    const currentName = currentUser.name;
    const sameUserInNewBrand = newBrandMembers.find(m => m.name === currentName);
    const newMember = sameUserInNewBrand || newBrandMembers[0];

    setCurrentBrandId(brandId);
    if (newMember) {
      setCurrentMemberId(newMember.id);
      setCurrentUser({
        name: newMember.name,
        email: newMember.email,
        avatar: newMember.avatar,
        role: newMember.role
      });
    }
    setActiveNav('dashboard');
    showToast('info', `Switched to ${brand?.name || brandId}${newMember ? ` — ${newMember.name} (${newMember.role})` : ''}`);
  };

  const createBrand = (data: { name: string; description: string; website: string; timezone: string; industry: string; color?: string; logo?: string }) => {
    if (currentUser.role !== 'Owner' && currentUser.role !== 'Admin') {
      showToast('error', 'Only Owner and Admin can create a Brand.');
      return { success: false, error: 'Unauthorized' };
    }

    // Edge case 12: Check unique brand name within this organization
    const exists = orgBrands.some(b => b.name.trim().toLowerCase() === data.name.trim().toLowerCase());
    if (exists) {
      showToast('error', `A brand named "${data.name}" already exists in this organization.`);
      return { success: false, error: 'Duplicate brand name' };
    }

    const newBrand: Brand = {
      id: 'brand-' + Math.random().toString(36).substring(2, 7),
      name: data.name,
      description: data.description,
      logo: data.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
      website: data.website || 'https://brand.example.com',
      timezone: data.timezone || 'America/New_York (EST)',
      industry: data.industry || 'General',
      organizationId: currentOrgId,
      postCount: 0,
      accountCount: 0,
      memberCount: 1,
      color: data.color || '#6366f1'
    };
    setAllBrands(prev => [...prev, newBrand]);
    setCurrentBrandId(newBrand.id);
    setIsCreateBrandOpen(false);
    showToast('success', `Brand "${data.name}" created successfully!`);
    return { success: true, brand: newBrand };
  };

  const updateBrand = (brandId: string, data: Partial<Brand>) => {
    if (currentUser.role !== 'Owner' && currentUser.role !== 'Admin') {
      showToast('error', 'Only Owner and Admin can edit Brand Information.');
      return;
    }
    setAllBrands(prev => prev.map(b => b.id === brandId ? { ...b, ...data } : b));
    showToast('success', 'Brand information updated successfully.');
  };

  const deleteBrand = (brandId: string) => {
    if (currentUser.role !== 'Owner' && currentUser.role !== 'Admin') {
      showToast('error', 'Only Owner and Admin can delete a Brand.');
      return;
    }
    if (orgBrands.length <= 1) {
      showToast('error', 'Cannot delete the only brand in the organization.');
      return;
    }
    const brandToDelete = allBrands.find(b => b.id === brandId);
    const remaining = allBrands.filter(b => b.id !== brandId);
    setAllBrands(remaining);
    if (currentBrandId === brandId) {
      const remainingOrgBrands = remaining.filter(b => b.organizationId === currentOrgId);
      setCurrentBrandId(remainingOrgBrands[0]?.id || '');
    }
    showToast('success', `Brand "${brandToDelete?.name || brandId}" deleted.`);
  };

  // ── Invitations & Member Management actions ──
  const inviteMember = (data: { name: string; email: string; organizationId: string; brandIds: string[]; role: UserRole }) => {
    if (currentUser.role !== 'Owner' && currentUser.role !== 'Admin') {
      showToast('error', 'Only Owner and Admin can invite members.');
      return { success: false, error: 'Unauthorized' };
    }

    // Edge case 10: Prevent duplicate pending invitation for same email in same organization
    const existingPending = invitations.find(
      inv => inv.email.toLowerCase() === data.email.toLowerCase() && 
             inv.organizationId === data.organizationId && 
             inv.status === 'pending'
    );
    if (existingPending) {
      showToast('error', `A pending invitation already exists for ${data.email}`);
      return { success: false, error: 'Duplicate invitation exists' };
    }

    const token = 'inv-tok-' + Math.random().toString(36).substring(2, 10);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const newInvitation: MemberInvitation = {
      id: 'inv-' + Math.random().toString(36).substring(2, 8),
      token,
      name: data.name,
      email: data.email,
      organizationId: data.organizationId,
      brandIds: data.brandIds,
      role: data.role,
      status: 'pending',
      invitedBy: currentUser.name,
      createdAt: now.toISOString(),
      expiresAt
    };

    setInvitations(prev => [newInvitation, ...prev]);

    // Also register member in team members as status 'invited'
    if (data.brandIds.length > 0) {
      data.brandIds.forEach(bId => {
        const newTeamMember: TeamMember = {
          id: 'usr-' + Math.random().toString(36).substring(2, 8),
          name: data.name,
          email: data.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
          role: data.role,
          brandId: bId,
          brandIds: data.brandIds,
          status: 'invited',
          lastActive: 'Invitation sent',
          permissions: makePermissions(data.role)
        };
        setAllTeamMembers(prev => [...prev, newTeamMember]);
      });
    }

    showToast('success', `Invitation successfully sent to ${data.email}`);
    setActiveInvitationPreview(newInvitation);
    return { success: true, token, invitation: newInvitation };
  };

  const resendInvitation = (invitationId: string) => {
    const inv = invitations.find(i => i.id === invitationId);
    if (!inv) return;
    const now = new Date();
    const newExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    setInvitations(prev => prev.map(i => i.id === invitationId ? { ...i, expiresAt: newExpiresAt, status: 'pending' } : i));
    showToast('info', `Invitation resent to ${inv.email}`);
    setActiveInvitationPreview(inv);
  };

  const cancelInvitation = (invitationId: string) => {
    const inv = invitations.find(i => i.id === invitationId);
    setInvitations(prev => prev.filter(i => i.id !== invitationId));
    if (inv) {
      setAllTeamMembers(prev => prev.filter(m => !(m.email.toLowerCase() === inv.email.toLowerCase() && m.status === 'invited')));
    }
    showToast('info', 'Invitation cancelled.');
  };

  const acceptInvitation = (token: string, password: string) => {
    const inv = invitations.find(i => i.token === token && i.status === 'pending');
    if (!inv) {
      return { success: false, error: 'Invalid or expired invitation token.' };
    }

    // Update invitation to accepted
    setInvitations(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'accepted' } : i));

    // Update team members from 'invited' to 'active'
    setAllTeamMembers(prev => prev.map(m => {
      if (m.email.toLowerCase() === inv.email.toLowerCase()) {
        return { ...m, status: 'active', lastActive: 'Just now' };
      }
      return m;
    }));

    // Add User Organization Membership
    const newMembership: UserOrganizationMembership = {
      userId: 'usr-' + inv.email.replace(/[^a-zA-Z0-9]/g, ''),
      organizationId: inv.organizationId,
      role: inv.role,
      accessibleBrandIds: inv.brandIds,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setUserMemberships(prev => [...prev, newMembership]);

    // Activate session as this user
    setIsAuthenticated(true);
    localStorage.setItem('aurasocial_auth', 'true');
    setCurrentOrgId(inv.organizationId);
    if (inv.brandIds.length > 0) {
      setCurrentBrandId(inv.brandIds[0]);
    }
    setCurrentUser({
      name: inv.name,
      email: inv.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(inv.name)}`,
      role: inv.role
    });

    showToast('success', `Welcome ${inv.name}! Your account has been activated.`);
    navigateTo('/app');
    return { success: true };
  };

  const updateMemberRole = (memberId: string, newRole: UserRole) => {
    setAllTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole, permissions: makePermissions(newRole) } : m));
    showToast('success', `Member role updated to ${newRole}`);
  };

  const removeMemberFromOrg = (memberId: string) => {
    const member = allTeamMembers.find(m => m.id === memberId);
    setAllTeamMembers(prev => prev.filter(m => m.id !== memberId));
    showToast('info', `${member?.name || 'Member'} removed from organization.`);
  };

  const updateMemberBrandAccess = (memberId: string, brandIds: string[]) => {
    setAllTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, brandIds } : m));
    showToast('success', 'Brand access updated for member.');
  };

  // Approvers state scoped per Brand
  const [brandApprovers, setBrandApprovers] = useState<Record<string, string[]>>({
    'brand-restaurant': ['usr-priya-restaurant', 'usr-jordan-restaurant'],
    'brand-urban': ['usr-alex-urban', 'usr-priya-urban'],
    'brand-nova': ['usr-priya-nova'],
    'brand-wellnest': ['usr-fatima', 'usr-jordan-wellnest'],
  });

  const addBrandApprover = (brandId: string, memberId: string) => {
    if (currentUser.role !== 'Admin') {
      showToast('error', 'Only Admin can add approvers.');
      return;
    }
    setBrandApprovers(prev => {
      const list = prev[brandId] || [];
      if (list.includes(memberId)) return prev;
      return { ...prev, [brandId]: [...list, memberId] };
    });
    showToast('success', 'Approver added successfully.');
  };

  const removeBrandApprover = (brandId: string, memberId: string) => {
    if (currentUser.role !== 'Admin') {
      showToast('error', 'Only Admin can remove approvers.');
      return;
    }
    setBrandApprovers(prev => {
      const list = prev[brandId] || [];
      return { ...prev, [brandId]: list.filter(id => id !== memberId) };
    });
    showToast('info', 'Approver removed.');
  };

  // ── Auth actions ──
  const switchRole = (role: UserRole) => {
    setCurrentUser(prev => ({ ...prev, role }));
    setActiveNav(getDefaultPage(role));
    showToast('info', `Simulating active role as: ${role}`);
  };

  const login = (asRole: UserRole = 'Owner', targetRoute?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('aurasocial_auth', 'true');
    setCurrentUser(prev => ({ ...prev, role: asRole }));
    showToast('success', `Signed in successfully as ${asRole}`);
    // If Admin or Owner, default to /admin, otherwise /app
    const dest = targetRoute || ((asRole === 'Admin' || asRole === 'Owner') ? '/admin' : '/app');
    navigateTo(dest);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('aurasocial_auth', 'false');
    navigateTo('/');
    showToast('info', 'Signed out of AuraSocial');
  };

  // ── Social Account actions ──
  const connectAccount = (platform: SocialPlatform, username: string, name: string) => {
    const newAccount: SocialAccount = {
      id: `acc-${platform}-${Date.now()}`,
      platform,
      name,
      username: username.startsWith('@') ? username : `@${username}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      status: 'connected',
      brandId: currentBrandId,
      lastSynced: 'Just now',
      tokenType: 'OAuth2',
      tokenExpiresAt: 'Dec 31, 2026',
      oauthScopes: ['publish', 'read_insights', 'manage_pages'],
      apiVersion: 'v18.0',
      assignedMemberIds: [currentMemberId],
      metrics: { followers: 1250, engagementRate: 4.5, postsThisMonth: 0, reach: 0, impressions: 0 }
    };
    setAllSocialAccounts(prev => [...prev, newAccount]);
    setAllBrands(prev => prev.map(b => b.id === currentBrandId ? { ...b, accountCount: (b.accountCount || 0) + 1 } : b));
    setIsConnectAccountOpen(false);
    showToast('success', `${name} (${platform}) connected to ${currentBrand.name}!`);
  };

  const reconnectAccount = (accountId: string) => {
    setAllSocialAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return { ...acc, status: 'connected' as const, errorMessage: undefined, expiresInDays: undefined, lastSynced: 'Just now', tokenExpiresAt: 'Dec 31, 2026' };
      }
      return acc;
    }));
    showToast('success', 'OAuth token refreshed — account is now connected.');
  };

  const refreshAccount = (accountId: string) => {
    setAllSocialAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) return { ...acc, lastSynced: 'Just now' };
      return acc;
    }));
    showToast('info', 'Account synced with network API.');
  };

  const disconnectAccount = (accountId: string) => {
    const acc = allSocialAccounts.find(a => a.id === accountId);
    setAllSocialAccounts(prev => prev.filter(a => a.id !== accountId));
    setAllBrands(prev => prev.map(b => b.id === currentBrandId ? { ...b, accountCount: Math.max(0, (b.accountCount || 1) - 1) } : b));
    showToast('warning', `${acc?.name || 'Account'} disconnected from ${currentBrand.name}.`);
  };

  const renameAccount = (accountId: string, newName: string) => {
    setAllSocialAccounts(prev => prev.map(acc =>
      acc.id === accountId ? { ...acc, name: newName } : acc
    ));
    showToast('success', `Account renamed to "${newName}".`);
  };

  const reassignAccountBrand = (accountId: string, newBrandId: string) => {
    const newBrand = allBrands.find(b => b.id === newBrandId);
    setAllSocialAccounts(prev => prev.map(acc =>
      acc.id === accountId ? { ...acc, brandId: newBrandId } : acc
    ));
    // Update account counts
    const acc = allSocialAccounts.find(a => a.id === accountId);
    if (acc) {
      setAllBrands(prev => prev.map(b => {
        if (b.id === acc.brandId) return { ...b, accountCount: Math.max(0, (b.accountCount || 1) - 1) };
        if (b.id === newBrandId) return { ...b, accountCount: (b.accountCount || 0) + 1 };
        return b;
      }));
    }
    showToast('success', `Account moved to brand: ${newBrand?.name || newBrandId}.`);
  };

  const updateAccountMembers = (accountId: string, memberIds: string[]) => {
    setAllSocialAccounts(prev => prev.map(acc =>
      acc.id === accountId ? { ...acc, assignedMemberIds: memberIds } : acc
    ));
    showToast('success', 'Account team access updated.');
  };

  // ── Composer / Post actions ──
  const openComposer = (postToEdit?: Post) => {
    setEditingPost(postToEdit || null);
    setActiveNav('composer');
  };

  const closeComposer = () => {
    setIsComposerOpen(false);
    setEditingPost(null);
  };

  const openScheduleModal = (post?: Post) => {
    if (post) setEditingPost(post);
    setIsScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
  };

  const openReviewDrawer = (post: Post) => {
    setReviewDrawerPost(post);
  };

  const closeReviewDrawer = () => {
    setReviewDrawerPost(null);
  };

  const savePost = (postData: Partial<Post>, status: PostStatus) => {
    if (editingPost) {
      setAllPosts(prev => prev.map(p => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            ...postData,
            status,
            approvalStage: status === 'pending' ? 'Manager Review' : status === 'scheduled' ? 'Scheduled' : p.approvalStage,
            auditLog: [
              ...p.auditLog,
              { id: 'a-' + Date.now(), action: `Updated post to status: ${status}`, user: currentUser.name, timestamp: 'Just now' }
            ]
          };
        }
        return p;
      }));
      showToast('success', `Post updated as ${status}!`);
    } else {
      const newPost: Post = {
        id: 'post-' + Date.now(),
        brandId: currentBrandId,
        platforms: postData.platforms || ['instagram'],
        content: postData.content || '',
        platformCustomizations: postData.platformCustomizations || {},
        mediaUrls: postData.mediaUrls || [],
        mediaType: postData.mediaType || 'image',
        status,
        scheduledTime: postData.scheduledTime || (status === 'scheduled' ? 'Tomorrow at 10:00 AM' : undefined),
        createdAt: new Date().toISOString(),
        author: { id: 'usr-current', name: currentUser.name, avatar: currentUser.avatar, role: currentUser.role },
        approvalStage: status === 'pending' ? 'Manager Review' : status === 'scheduled' ? 'Scheduled' : 'Draft',
        comments: [],
        auditLog: [{
          id: 'a-' + Date.now(),
          action: status === 'draft' ? 'Created draft' : status === 'pending' ? 'Submitted for Approval' : status === 'published' ? 'Published immediately' : 'Scheduled post',
          user: currentUser.name,
          timestamp: 'Just now'
        }]
      };
      setAllPosts(prev => [newPost, ...prev]);

      if (status === 'published') {
        newPost.platforms.forEach(platform => {
          setPublishingLogs(prev => [{
            id: 'log-' + Date.now() + '-' + platform,
            postId: newPost.id,
            postCaption: newPost.content.substring(0, 50) + '...',
            platform,
            status: 'success',
            timestamp: 'Just now',
            attempts: 1
          }, ...prev]);
        });
      }

      showToast(
        'success',
        status === 'draft' ? 'Draft saved successfully.'
          : status === 'pending' ? 'Submitted for approval.'
          : status === 'published' ? 'Post published successfully!'
          : 'Post scheduled successfully!'
      );
    }
    closeComposer();
    closeScheduleModal();
  };

  const deletePost = (postId: string) => {
    setAllPosts(prev => prev.filter(p => p.id !== postId));
    if (reviewDrawerPost?.id === postId) closeReviewDrawer();
    showToast('info', 'Post deleted.');
  };

  const duplicatePost = (postId: string) => {
    const postToDup = allPosts.find(p => p.id === postId);
    if (!postToDup) return;
    const duplicated: Post = {
      ...postToDup,
      id: 'post-' + Date.now(),
      status: 'draft',
      scheduledTime: undefined,
      publishedTime: undefined,
      approvalStage: 'Draft',
      comments: [],
      auditLog: [{ id: 'a-' + Date.now(), action: 'Duplicated from post #' + postId, user: currentUser.name, timestamp: 'Just now' }]
    };
    setAllPosts(prev => [duplicated, ...prev]);
    showToast('success', 'Post duplicated as new draft.');
  };

  const approvePost = (postId: string, _comment?: string) => {
    setAllPosts(prev => prev.map(p => {
      if (p.id === postId) {
        // If already has a scheduled time, keep it scheduled; otherwise publish immediately
        const hasSchedule = !!p.scheduledTime;
        return {
          ...p,
          status: (hasSchedule ? 'scheduled' : 'published') as PostStatus,
          approvalStage: hasSchedule ? 'Scheduled' : 'Published',
          publishedTime: hasSchedule ? undefined : 'Just now',
          // preserve existing scheduledTime - do NOT overwrite
          auditLog: [...p.auditLog, {
            id: 'a-' + Date.now(),
            action: hasSchedule
              ? `Approved by ${currentUser.role}. Remains scheduled for ${p.scheduledTime}.`
              : `Approved and published immediately by ${currentUser.role}.`,
            user: currentUser.name,
            timestamp: 'Just now'
          }]
        };
      }
      return p;
    }));
    showToast('success', 'Post approved!');
  };


  const rejectPost = (postId: string, reason?: string) => {
    setAllPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          status: 'rejected' as PostStatus,
          approvalStage: 'Rejected',
          rejectionReason: reason || p.rejectionReason || 'Rejected during approval review',
          auditLog: [...p.auditLog, {
            id: 'a-' + Date.now(),
            action: `Rejected by ${currentUser.role}. Moved to Unpublished Posts.`,
            user: currentUser.name,
            timestamp: 'Just now'
          }]
        };
      }
      return p;
    }));
    showToast('warning', 'Post rejected and moved to Unpublished Posts.');
  };


  const requestChangesPost = (postId: string, feedback: string) => {
    setAllPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p, status: 'draft' as PostStatus, approvalStage: 'Draft',
          comments: [...p.comments, { id: 'c-' + Date.now(), authorName: currentUser.name, authorAvatar: currentUser.avatar, authorRole: currentUser.role, content: `Changes Requested: ${feedback}`, createdAt: 'Just now' }],
          auditLog: [...p.auditLog, { id: 'a-' + Date.now(), action: `Changes requested: "${feedback}"`, user: currentUser.name, timestamp: 'Just now' }]
        };
      }
      return p;
    }));
    if (reviewDrawerPost?.id === postId) setReviewDrawerPost(prev => prev ? { ...prev, status: 'draft', approvalStage: 'Draft' } : null);
    showToast('info', 'Changes requested; post returned to Drafts.');
  };

  const reschedulePost = (postId: string, newTime: string) => {
    setAllPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, scheduledTime: newTime, auditLog: [...p.auditLog, { id: 'a-' + Date.now(), action: `Rescheduled to ${newTime}`, user: currentUser.name, timestamp: 'Just now' }] };
      }
      return p;
    }));
    showToast('success', `Post rescheduled to ${newTime}!`);
  };

  const retryFailedPost = (postId: string) => {
    setAllPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, status: 'published' as PostStatus, publishedTime: 'Just now', rejectionReason: undefined, auditLog: [...p.auditLog, { id: 'a-' + Date.now(), action: 'Manual retry succeeded. Published to network APIs.', user: currentUser.name, timestamp: 'Just now' }] };
      }
      return p;
    }));
    showToast('success', 'Retry successful! Post has been published.');
  };

  // ── Media actions ──
  const uploadMedia = (item: Partial<MediaItem>) => {
    const newItem: MediaItem = {
      id: 'med-' + Date.now(),
      brandId: currentBrandId,
      name: item.name || 'uploaded_asset.jpg',
      url: item.url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      type: item.type || 'image',
      sizeBytes: item.sizeBytes || 2100000,
      dimensions: item.dimensions || '2048 x 1536',
      folder: item.folder || 'Uploads',
      tags: item.tags || ['upload', 'media'],
      usedCount: 0,
      uploadedAt: 'Today'
    };
    setAllMediaItems(prev => [newItem, ...prev]);
    showToast('success', `Media "${newItem.name}" uploaded to ${currentBrand.name}!`);
  };

  const deleteMedia = (mediaId: string) => {
    setAllMediaItems(prev => prev.filter(m => m.id !== mediaId));
    showToast('info', 'Media asset removed from library.');
  };

  // ── Team actions ──
  const inviteTeamMember = (data: { name: string; email: string; role: UserRole; brandId: string }) => {
    // RBAC guard: ONLY Admin can invite members (Owner and Manager are explicitly restricted)
    const inviterRole = currentUser.role;
    if (inviterRole !== 'Admin') {
      showToast('error', 'Only an Admin can invite team members.');
      return;
    }
    const newMember: TeamMember = {
      id: 'usr-' + Date.now(),
      name: data.name,
      email: data.email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      role: data.role,
      brandId: data.brandId,
      brandIds: [data.brandId],
      status: 'invited',
      lastActive: 'Invitation sent',
      permissions: makePermissions(data.role)
    };
    setAllTeamMembers(prev => [...prev, newMember]);
    showToast('success', `Invitation sent to ${data.email} as ${data.role} on ${currentBrand.name}!`);
  };

  const updateMemberPermissions = (memberId: string, perms: Partial<TeamMemberPermissions>) => {
    setAllTeamMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, permissions: { ...m.permissions, ...perms } };
      }
      return m;
    }));
    showToast('success', 'Updated team member permissions successfully.');
  };


  const removeMember = (memberId: string) => {
    const member = allTeamMembers.find(m => m.id === memberId);
    setAllTeamMembers(prev => prev.filter(m => m.id !== memberId));
    showToast('info', `${member?.name || 'Member'} removed from ${currentBrand.name}.`);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentRoute,
        navigateTo,
        adminActiveTab,
        setAdminActiveTab,
        currentUser,
        login,
        logout,
        switchRole,

        organizations,
        currentOrgId,
        organization,
        switchOrganization,
        updateOrganization,
        userMemberships,

        currentBrand,
        brands,
        allBrands,
        orgBrands,
        switchBrand,
        createBrand,
        updateBrand,
        deleteBrand,
        brandApprovers,
        addBrandApprover,
        removeBrandApprover,

        invitations,
        orgInvitations,
        inviteMember,
        resendInvitation,
        cancelInvitation,
        acceptInvitation,
        activeInvitationPreview,
        setActiveInvitationPreview,

        currentMember,
        brandMembers,
        orgMembers,
        currentMemberId,
        switchMember,
        updateMemberRole,
        removeMemberFromOrg,
        updateMemberBrandAccess,

        socialAccounts,
        allSocialAccounts,
        connectAccount,
        reconnectAccount,
        refreshAccount,
        disconnectAccount,
        renameAccount,
        reassignAccountBrand,
        updateAccountMembers,

        posts,
        allPosts,
        savePost,
        deletePost,
        duplicatePost,
        approvePost,
        rejectPost,
        requestChangesPost,
        reschedulePost,
        retryFailedPost,

        mediaItems,
        uploadMedia,
        deleteMedia,

        teamMembers,
        allTeamMembers,
        inviteTeamMember,
        updateMemberPermissions,
        removeMember,

        activeNav,
        setActiveNav,
        dateFilter,
        setDateFilter,

        notifications,
        markNotificationsRead,
        publishingLogs,

        isComposerOpen,
        editingPost,
        openComposer,
        closeComposer,

        isScheduleModalOpen,
        openScheduleModal,
        closeScheduleModal,

        reviewDrawerPost,
        openReviewDrawer,
        closeReviewDrawer,

        isConnectAccountOpen,
        setIsConnectAccountOpen,

        isCreateBrandOpen,
        setIsCreateBrandOpen,

        isSearchOpen,
        setIsSearchOpen,

        isPublishingLogsOpen,
        setIsPublishingLogsOpen,

        isOnboardingOpen,
        setIsOnboardingOpen,

        showSkeletonLoading,
        setShowSkeletonLoading,

        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
