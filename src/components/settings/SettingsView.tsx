import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { UserRole, SocialPlatform, Brand, TeamMember } from '../../types';
import { 
  ArrowLeft,
  Info,
  Share2,
  Users,
  Send,
  UserCheck,
  Edit2,
  Trash2,
  Plus,
  Check,
  X,
  AlertTriangle,
  Lock,
  Globe,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface SettingsViewProps {
  initialTab?: 'brand-info' | 'social-channels' | 'brand-members' | 'publishing' | 'all-members' | 'organization';
}

type SettingsSection = 'brand-info' | 'social-channels' | 'brand-members' | 'publishing' | 'all-members' | 'roles-permissions';


const DEFAULT_ROLES: Array<{ name: string; isCustom?: boolean }> = [
  { name: 'Brand Admin' },
  { name: 'User' },
  { name: 'Limited Publisher' },
];

const PERMISSION_COLUMNS = ['Publishing', 'Messages', 'Comment / Reply', 'Advanced Reports', 'Zia', 'Inbox'];

const DEFAULT_PERMISSIONS: Record<string, Record<string, boolean>> = {
  'Brand Admin': { Publishing: true, Messages: true, 'Comment / Reply': true, 'Advanced Reports': true, Zia: true, Inbox: true },
  'User':        { Publishing: true, Messages: true, 'Comment / Reply': true, 'Advanced Reports': true, Zia: true, Inbox: true },
  'Limited Publisher': { Publishing: false, Messages: true, 'Comment / Reply': true, 'Advanced Reports': true, Zia: true, Inbox: false },
};

// Phase 1 platforms ONLY
const PHASE_1_PLATFORMS: Array<{
  platform: SocialPlatform;
  label: string;
  type: string;
  iconBg: string;
  iconColor: string;
}> = [
  { platform: 'facebook', label: 'Facebook Page', type: 'page', iconBg: '#1877f2', iconColor: '#ffffff' },
  { platform: 'linkedin', label: 'LinkedIn Profile', type: 'profile', iconBg: '#0a66c2', iconColor: '#ffffff' },
  { platform: 'instagram', label: 'Instagram Profile', type: 'profile', iconBg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', iconColor: '#ffffff' },
  { platform: 'tiktok', label: 'TikTok Profile', type: 'profile', iconBg: '#000000', iconColor: '#ffffff' },
  { platform: 'youtube', label: 'YouTube Channel', type: 'channel', iconBg: '#ff0000', iconColor: '#ffffff' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ initialTab = 'brand-info' }) => {
  const { 
    currentUser, 
    currentBrand,
    allBrands,
    switchBrand,
    updateBrand,
    deleteBrand,
    brandMembers,
    allTeamMembers,
    socialAccounts,
    connectAccount,
    disconnectAccount,
    brandApprovers,
    addBrandApprover,
    removeBrandApprover,
    inviteTeamMember,
    removeMember,
    organization, 
    setActiveNav,
    showToast 
  } = useApp();

  // Normalize initialTab
  const getInitialSection = (): SettingsSection => {
    if (initialTab === 'organization' || initialTab === 'all-members') return 'all-members';
    if (initialTab === 'publishing') return currentUser.role === 'Admin' ? 'publishing' : 'brand-info';
    if (initialTab === 'social-channels') return 'social-channels';
    if (initialTab === 'brand-members') return 'brand-members';
    return 'brand-info';
  };

  const [activeSection, setActiveSection] = useState<SettingsSection>(getInitialSection);

  // RBAC checks
  const isAdmin = currentUser.role === 'Admin';
  const isOwnerOrAdmin = currentUser.role === 'Owner' || currentUser.role === 'Admin';
  const canManageChannels = currentUser.role === 'Owner' || currentUser.role === 'Admin' || currentUser.role === 'Manager';

  // ── Modals State ──
  const [isEditBrandModalOpen, setIsEditBrandModalOpen] = useState(false);
  const [editBrandName, setEditBrandName] = useState(currentBrand.name);
  const [editBrandDescription, setEditBrandDescription] = useState(currentBrand.description || '');
  const [editBrandTimezone, setEditBrandTimezone] = useState(currentBrand.timezone || 'America/New_York (EST)');
  const [editBrandLogo, setEditBrandLogo] = useState(currentBrand.logo);

  const [isDeleteBrandModalOpen, setIsDeleteBrandModalOpen] = useState(false);

  // Connect Channel Modal
  const [connectPlatform, setConnectPlatform] = useState<SocialPlatform | null>(null);
  const [connectAccountName, setConnectAccountName] = useState('');
  const [connectUsername, setConnectUsername] = useState('');

  // Add Approver Modal
  const [isAddApproverModalOpen, setIsAddApproverModalOpen] = useState(false);

  // Invite Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Editor');

  // Channels Dropdown in Members Table
  const [openMemberChannelDropdown, setOpenMemberChannelDropdown] = useState<string | null>(null);
  const [memberSelectedChannels, setMemberSelectedChannels] = useState<Record<string, string[]>>({});




  const availableChannelNames = socialAccounts.length > 0 
    ? socialAccounts.map(a => {
        const p = PHASE_1_PLATFORMS.find(pl => pl.platform === a.platform);
        return p ? p.label : a.name;
      })
    : PHASE_1_PLATFORMS.map(p => p.label);

  const getMemberChannels = (memberId: string) => {
    return memberSelectedChannels[memberId] ?? availableChannelNames;
  };

  const handleToggleChannel = (memberId: string, channelName: string) => {
    const currentSelected = getMemberChannels(memberId);
    let updated: string[];
    if (currentSelected.includes(channelName)) {
      updated = currentSelected.filter(c => c !== channelName);
    } else {
      updated = [...currentSelected, channelName];
    }
    setMemberSelectedChannels(prev => ({ ...prev, [memberId]: updated }));
  };

  const handleToggleAllChannels = (memberId: string) => {
    const currentSelected = getMemberChannels(memberId);
    if (currentSelected.length === availableChannelNames.length) {
      setMemberSelectedChannels(prev => ({ ...prev, [memberId]: [] }));
    } else {
      setMemberSelectedChannels(prev => ({ ...prev, [memberId]: [...availableChannelNames] }));
    }
  };

  // Handle Edit Brand
  const handleOpenEditBrand = () => {
    setEditBrandName(currentBrand.name);
    setEditBrandDescription(currentBrand.description || '');
    setEditBrandTimezone(currentBrand.timezone || 'America/New_York (EST)');
    setEditBrandLogo(currentBrand.logo);
    setIsEditBrandModalOpen(true);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrand(currentBrand.id, {
      name: editBrandName.trim(),
      description: editBrandDescription.trim(),
      timezone: editBrandTimezone.trim(),
      logo: editBrandLogo.trim()
    });
    setIsEditBrandModalOpen(false);
  };

  // Handle Delete Brand
  const handleConfirmDeleteBrand = () => {
    deleteBrand(currentBrand.id);
    setIsDeleteBrandModalOpen(false);
  };

  // Handle Connect Channel
  const handleOpenConnect = (platform: SocialPlatform) => {
    if (!canManageChannels) {
      showToast('error', 'Your role does not have permission to connect channels.');
      return;
    }
    const defaultName = `${currentBrand.name} ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
    const defaultUser = currentBrand.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    setConnectPlatform(platform);
    setConnectAccountName(defaultName);
    setConnectUsername(defaultUser);
  };

  const handleConfirmConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectPlatform || !connectAccountName.trim() || !connectUsername.trim()) return;
    connectAccount(connectPlatform, connectUsername.trim(), connectAccountName.trim());
    setConnectPlatform(null);
  };

  // Handle Disconnect Channel
  const handleDisconnect = (accountId: string, platformName: string) => {
    if (!canManageChannels) {
      showToast('error', 'Your role does not have permission to disconnect channels.');
      return;
    }
    if (window.confirm(`Are you sure you want to disconnect ${platformName}?`)) {
      disconnectAccount(accountId);
      showToast('info', `${platformName} disconnected.`);
    }
  };

  // Current brand's approver IDs
  const currentBrandApproverIds = brandApprovers[currentBrand.id] || [];
  const currentApprovers = brandMembers.filter(m => currentBrandApproverIds.includes(m.id));
  const availableMembersForApprover = brandMembers.filter(m => !currentBrandApproverIds.includes(m.id));

  // Handle Invite Member
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('error', 'Only Admin can invite new members.');
      return;
    }
    if (!inviteName.trim() || !inviteEmail.trim()) {
      showToast('error', 'Please provide a name and email.');
      return;
    }
    inviteTeamMember({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      brandId: currentBrand.id
    });
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Editor');
  };

  // Helper for brand membership
  const getBrandsForMember = (memberEmail: string) => {
    const memberEntries = allTeamMembers.filter(m => m.email === memberEmail);
    const brandIds = memberEntries.map(m => m.brandId);
    return allBrands.filter(b => brandIds.includes(b.id));
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', backgroundColor: '#ffffff', color: '#1e293b' }}>
      
      {/* ── Left Settings Navigation ── */}
      <div style={{
        width: '240px',
        flexShrink: 0,
        borderRight: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 0'
      }}>
        {/* Back Link */}
        <div style={{ padding: '0 18px 18px 18px' }}>
          <button
            onClick={() => setActiveNav('dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'transparent',
              color: '#3b82f6',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 0',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>
        </div>

        {/* ── Section: BRAND SETTINGS ── */}
        <div style={{ padding: '0 18px 6px 18px' }}>
          <span style={{
            fontSize: '10.5px',
            fontWeight: 700,
            color: '#64748b',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            BRAND SETTINGS
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 8px', marginBottom: '20px' }}>
          {/* 1. Brand Information */}
          <button
            onClick={() => setActiveSection('brand-info')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeSection === 'brand-info' ? 600 : 500,
              color: activeSection === 'brand-info' ? '#0f172a' : '#475569',
              backgroundColor: activeSection === 'brand-info' ? '#f1f5f9' : 'transparent',
              borderLeft: activeSection === 'brand-info' ? '3px solid #f97316' : '3px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Info size={16} color={activeSection === 'brand-info' ? '#f97316' : '#64748b'} />
            <span>Brand Information</span>
          </button>

          {/* 2. Social Channels */}
          <button
            onClick={() => setActiveSection('social-channels')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeSection === 'social-channels' ? 600 : 500,
              color: activeSection === 'social-channels' ? '#0f172a' : '#475569',
              backgroundColor: activeSection === 'social-channels' ? '#f1f5f9' : 'transparent',
              borderLeft: activeSection === 'social-channels' ? '3px solid #f97316' : '3px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Share2 size={16} color={activeSection === 'social-channels' ? '#f97316' : '#64748b'} />
            <span>Social Channels</span>
          </button>

          {/* 3. Brand Members */}
          <button
            onClick={() => setActiveSection('brand-members')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeSection === 'brand-members' ? 600 : 500,
              color: activeSection === 'brand-members' ? '#0f172a' : '#475569',
              backgroundColor: activeSection === 'brand-members' ? '#f1f5f9' : 'transparent',
              borderLeft: activeSection === 'brand-members' ? '3px solid #f97316' : '3px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={16} color={activeSection === 'brand-members' ? '#f97316' : '#64748b'} />
            <span>Brand Members</span>
          </button>

          {/* 4. Publishing — visible to all, content gated for Admin */}
          <button
            onClick={() => setActiveSection('publishing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeSection === 'publishing' ? 600 : 500,
              color: activeSection === 'publishing' ? '#0f172a' : '#475569',
              backgroundColor: activeSection === 'publishing' ? '#f1f5f9' : 'transparent',
              borderLeft: activeSection === 'publishing' ? '3px solid #f97316' : '3px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <Send size={16} color={activeSection === 'publishing' ? '#f97316' : '#64748b'} />
            <span>Publishing</span>
          </button>

        </nav>

        {/* ── Section: GENERAL SETTINGS ── */}
        <div style={{ padding: '0 18px 6px 18px' }}>
          <span style={{
            fontSize: '10.5px',
            fontWeight: 700,
            color: '#64748b',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            GENERAL SETTINGS
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 8px' }}>
          {/* 5. All Members */}
          <button
            onClick={() => setActiveSection('all-members')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeSection === 'all-members' ? 600 : 500,
              color: activeSection === 'all-members' ? '#0f172a' : '#475569',
              backgroundColor: activeSection === 'all-members' ? '#f1f5f9' : 'transparent',
              borderLeft: activeSection === 'all-members' ? '3px solid #f97316' : '3px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <UserCheck size={16} color={activeSection === 'all-members' ? '#f97316' : '#64748b'} />
            <span>All Members</span>
          </button>
        </nav>
      </div>

      {/* ── Right Content Area ── */}
      <div style={{ flex: 1, minWidth: 0, padding: '24px 36px', overflowY: 'auto' }}>

        {/* ══════════════════════════════════════════════════════════════════════
            1. BRAND INFORMATION (Reference 4)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeSection === 'brand-info' && (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                Brand Information
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isOwnerOrAdmin ? (
                  <>
                    <button
                      onClick={handleOpenEditBrand}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: '1px solid #3b82f6',
                        backgroundColor: '#ffffff',
                        color: '#3b82f6',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setIsDeleteBrandModalOpen(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: '1px solid #ef4444',
                        backgroundColor: '#ffffff',
                        color: '#ef4444',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Delete Brand</span>
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                    Read-only (Owner & Admin only)
                  </span>
                )}
              </div>
            </div>

            {/* Row-based Brand Info Display */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Display Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', padding: '16px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>Display Name</span>
                <span style={{ fontSize: '13.5px', color: '#334155' }}>{currentBrand.name}</span>
              </div>

              {/* Photo */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', padding: '20px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>Photo</span>
                <div>
                  <img
                    src={currentBrand.logo}
                    alt={currentBrand.name}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', padding: '18px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a', paddingTop: '2px' }}>Description</span>
                <span style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, maxWidth: '640px' }}>
                  {currentBrand.description || 'No description provided.'}
                </span>
              </div>

              {/* Time Zone */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', padding: '18px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>Time Zone</span>
                <span style={{ fontSize: '13.5px', color: '#334155' }}>{currentBrand.timezone || 'UTC'}</span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            2. SOCIAL CHANNELS (Reference 5)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeSection === 'social-channels' && (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Social Channels
                </h1>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                  Manage social channels connected to <strong>{currentBrand.name}</strong>.
                </p>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
                Phase 1 Platforms
              </span>
            </div>

            {/* Channels List */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {PHASE_1_PLATFORMS.map(({ platform, label, iconBg, iconColor }) => {
                const connectedAccount = socialAccounts.find(a => a.platform === platform && a.status === 'connected');
                const isConnected = !!connectedAccount;

                return (
                  <div
                    key={platform}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 8px',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    {/* Left: Platform Icon & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: iconBg,
                        color: iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '15px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}>
                        {platform === 'facebook' && 'f'}
                        {platform === 'linkedin' && 'in'}
                        {platform === 'instagram' && 'IG'}
                        {platform === 'tiktok' && 'TT'}
                        {platform === 'youtube' && 'YT'}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                          {label}
                        </div>
                        {isConnected && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <img
                              src={connectedAccount.avatar}
                              alt={connectedAccount.name}
                              style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              Connected as <strong style={{ color: '#0f172a' }}>{connectedAccount.name}</strong> ({connectedAccount.username})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Connect / Disconnect */}
                    <div>
                      {isConnected ? (
                        <button
                          onClick={() => handleDisconnect(connectedAccount.id, label)}
                          disabled={!canManageChannels}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: canManageChannels ? '#3b82f6' : '#94a3b8',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: canManageChannels ? 'pointer' : 'not-allowed',
                            textDecoration: 'underline'
                          }}
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenConnect(platform)}
                          disabled={!canManageChannels}
                          style={{
                            padding: '6px 18px',
                            borderRadius: '20px',
                            border: '1px solid #3b82f6',
                            backgroundColor: '#ffffff',
                            color: canManageChannels ? '#3b82f6' : '#94a3b8',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: canManageChannels ? 'pointer' : 'not-allowed',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            3. BRAND MEMBERS (Reference 3)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeSection === 'brand-members' && (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Team Members
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#f97316',
                    borderBottom: '2px solid #f97316',
                    paddingBottom: '4px'
                  }}>
                    Members ({brandMembers.length})
                  </span>
                </div>
              </div>

              {/* + Invite Button — Admin Only */}
              {isAdmin && (
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 18px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(29,78,216,0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Plus size={15} />
                  <span>Invite</span>
                </button>
              )}
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Members ({brandMembers.length})
                    </th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Role
                    </th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Channels
                    </th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                      Approver
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {brandMembers.map(member => {
                    const isApprover = currentBrandApproverIds.includes(member.id);

                    return (
                      <tr key={member.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        {/* Member Column */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Avatar src={member.avatar} name={member.name} size="md" />
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>
                                {member.name}
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>
                                {member.email}
                              </div>
                              <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px', fontWeight: 500 }}>
                                Status: Active
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Column */}
                        <td style={{ padding: '14px', fontSize: '13px', color: '#334155', fontWeight: 500 }}>
                          {member.role}
                        </td>

                        {/* Channels Column */}
                        <td style={{ padding: '14px', position: 'relative' }}>
                          {(() => {
                            const selected = getMemberChannels(member.id);
                            const isAll = selected.length === availableChannelNames.length;
                            const isOpen = openMemberChannelDropdown === member.id;
                            
                            let displayText = 'All Channels';
                            if (isAll) {
                              displayText = 'All Channels';
                            } else if (selected.length === 0) {
                              displayText = 'No Channels';
                            } else if (selected.length === 1) {
                              displayText = selected[0];
                            } else {
                              displayText = `${selected.length} Channels`;
                            }

                            return (
                              <div style={{ position: 'relative', display: 'inline-block' }}>
                                <button
                                  type="button"
                                  onClick={() => setOpenMemberChannelDropdown(isOpen ? null : member.id)}
                                  title={selected.join(', ') || 'No Channels'}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '6px',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '12px',
                                    color: '#334155',
                                    cursor: 'pointer',
                                    minWidth: '110px',
                                    maxWidth: '160px',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                                    {displayText}
                                  </span>
                                  <ChevronDown size={13} color="#64748b" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                                </button>

                                {isOpen && (
                                  <>
                                    <div
                                      style={{ position: 'fixed', inset: 0, zIndex: 110 }}
                                      onClick={() => setOpenMemberChannelDropdown(null)}
                                    />
                                    <div
                                      style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 4px)',
                                        left: 0,
                                        zIndex: 120,
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.05)',
                                        padding: '6px',
                                        minWidth: '190px',
                                        maxWidth: '240px'
                                      }}
                                    >
                                      {/* "All Channels" Option */}
                                      <label
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          padding: '6px 8px',
                                          borderRadius: '5px',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          fontWeight: 600,
                                          color: '#0f172a',
                                          borderBottom: '1px solid #f1f5f9',
                                          marginBottom: '4px'
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isAll}
                                          onChange={() => handleToggleAllChannels(member.id)}
                                          style={{ accentColor: '#1d4ed8', width: '13px', height: '13px', cursor: 'pointer' }}
                                        />
                                        <span>All Channels</span>
                                      </label>

                                      {/* Individual Channels */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '180px', overflowY: 'auto' }}>
                                        {availableChannelNames.map(chName => {
                                          const isChecked = selected.includes(chName);
                                          return (
                                            <label
                                              key={chName}
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '5px 8px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                color: '#334155',
                                                backgroundColor: isChecked ? '#f8fafc' : 'transparent',
                                                transition: 'background-color 0.1s'
                                              }}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggleChannel(member.id, chName)}
                                                style={{ accentColor: '#1d4ed8', width: '13px', height: '13px', cursor: 'pointer' }}
                                              />
                                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {chName}
                                              </span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })()}
                        </td>

                        {/* Approver Column */}
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          {isApprover ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                              <Check size={14} strokeWidth={2.5} />
                            </div>
                          ) : (
                            <span style={{ color: '#cbd5e1', fontSize: '14px' }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            4. PUBLISHING (Reference 1) — ADMIN ONLY
            ══════════════════════════════════════════════════════════════════════ */}
        {activeSection === 'publishing' && (
          <div>
            {!isAdmin ? (
              <div style={{
                padding: '36px',
                textAlign: 'center',
                backgroundColor: '#fef2f2',
                borderRadius: '12px',
                border: '1px solid #fee2e2'
              }}>
                <Lock size={36} color="#ef4444" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#991b1b', margin: '0 0 6px 0' }}>
                  Access Restricted
                </h3>
                <p style={{ fontSize: '13px', color: '#b91c1c', margin: 0 }}>
                  Publishing and Approval Settings are restricted exclusively to the Admin role.
                </p>
              </div>
            ) : (
              <div>

                {/* Section: Add Approvers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                      Add Approvers
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                      Add members to manage posts sent for approval.
                    </p>
                  </div>

                  {/* Approvers Chips List */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                    {currentApprovers.map(approver => (
                      <div
                        key={approver.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 12px 6px 8px',
                          borderRadius: '24px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          color: '#0f172a'
                        }}
                      >
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: '#1d4ed8',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px'
                        }}>
                          {approver.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{approver.name}</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>({approver.role})</span>
                        <button
                          onClick={() => removeBrandApprover(currentBrand.id, approver.id)}
                          title="Remove approver"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2px',
                            borderRadius: '50%'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    {/* + Add Approver button */}
                    <button
                      onClick={() => setIsAddApproverModalOpen(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: '1px solid #3b82f6',
                        backgroundColor: '#ffffff',
                        color: '#3b82f6',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Plus size={14} />
                      <span>Add Approver</span>
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            5. ALL MEMBERS (Under GENERAL SETTINGS)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeSection === 'all-members' && (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px 0' }}>
                  All Members
                </h1>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                  Organization-level membership across all brands in <strong>{organization.name}</strong>.
                </p>
              </div>

              {/* Admin Invite Button */}
              {isAdmin && (
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 18px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(29,78,216,0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Plus size={15} />
                  <span>Invite Member</span>
                </button>
              )}
            </div>

            {/* Members Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Member
                    </th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Brand Associations
                    </th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Role(s)
                    </th>
                    <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allTeamMembers.map(member => {
                    const memberBrands = getBrandsForMember(member.email);

                    return (
                      <tr key={member.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        {/* Member */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Avatar src={member.avatar} name={member.name} size="md" />
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>
                                {member.name}
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Brand Associations */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {memberBrands.map(b => (
                              <span
                                key={b.id}
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  backgroundColor: b.id === currentBrand.id ? '#e0f2fe' : '#f1f5f9',
                                  color: b.id === currentBrand.id ? '#0369a1' : '#475569',
                                  border: b.id === currentBrand.id ? '1px solid #bae6fd' : '1px solid #e2e8f0'
                                }}
                              >
                                {b.name}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Role */}
                        <td style={{ padding: '14px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            fontSize: '12px'
                          }}>
                            {member.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#16a34a'
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ── MODAL: EDIT BRAND INFORMATION ── */}
      {isEditBrandModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          backgroundColor: 'rgba(15,23,42,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '12px', width: '480px', maxWidth: '90vw',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Edit Brand Information
              </h2>
              <button
                onClick={() => setIsEditBrandModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={editBrandName}
                  onChange={e => setEditBrandName(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Photo URL
                </label>
                <input
                  type="url"
                  value={editBrandLogo}
                  onChange={e => setEditBrandLogo(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  value={editBrandDescription}
                  onChange={e => setEditBrandDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Time Zone
                </label>
                <input
                  type="text"
                  value={editBrandTimezone}
                  onChange={e => setEditBrandTimezone(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditBrandModalOpen(false)}
                  style={{
                    padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px', borderRadius: '6px', border: 'none',
                    backgroundColor: '#1d4ed8', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DELETE BRAND CONFIRMATION ── */}
      {isDeleteBrandModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          backgroundColor: 'rgba(15,23,42,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '12px', width: '420px', maxWidth: '90vw',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', color: '#ef4444' }}>
              <AlertTriangle size={24} />
              <h2 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Delete {currentBrand.name}?
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
              Are you sure you want to delete this brand? All associated social channels, posts, and brand settings will be permanently removed.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsDeleteBrandModalOpen(false)}
                style={{
                  padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBrand}
                style={{
                  padding: '8px 18px', borderRadius: '6px', border: 'none',
                  backgroundColor: '#ef4444', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Delete Brand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CONNECT CHANNEL ── */}
      {connectPlatform && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          backgroundColor: 'rgba(15,23,42,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '12px', width: '440px', maxWidth: '90vw',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Connect {connectPlatform.charAt(0).toUpperCase() + connectPlatform.slice(1)} Channel
              </h2>
              <button
                onClick={() => setConnectPlatform(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmConnect} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Account / Page Name
                </label>
                <input
                  type="text"
                  value={connectAccountName}
                  onChange={e => setConnectAccountName(e.target.value)}
                  placeholder="e.g. GreenLeaf Official"
                  required
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Username / Handle
                </label>
                <input
                  type="text"
                  value={connectUsername}
                  onChange={e => setConnectUsername(e.target.value)}
                  placeholder="e.g. @greenleafdining"
                  required
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setConnectPlatform(null)}
                  style={{
                    padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px', borderRadius: '6px', border: 'none',
                    backgroundColor: '#1d4ed8', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Connect Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD APPROVER (Publishing) ── */}
      {isAddApproverModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          backgroundColor: 'rgba(15,23,42,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '12px', width: '420px', maxWidth: '90vw',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Add Approver
              </h2>
              <button
                onClick={() => setIsAddApproverModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px' }}>
              Select a member of <strong>{currentBrand.name}</strong> to add as a designated approver.
            </p>

            {availableMembersForApprover.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                All brand members are already approvers.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {availableMembersForApprover.map(member => (
                  <button
                    key={member.id}
                    onClick={() => {
                      addBrandApprover(currentBrand.id, member.id);
                      setIsAddApproverModalOpen(false);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar src={member.avatar} name={member.name} size="sm" />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{member.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{member.role} • {member.email}</div>
                      </div>
                    </div>
                    <Plus size={16} color="#3b82f6" />
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => setIsAddApproverModalOpen(false)}
                style={{
                  padding: '7px 16px', borderRadius: '6px', border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: INVITE MEMBER (Admin Only) ── */}
      {isInviteModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          backgroundColor: 'rgba(15,23,42,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '12px', width: '450px', maxWidth: '90vw',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Invite Team Member
              </h2>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  required
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="e.g. rachel@greenleafbistro.com"
                  required
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Assigned Role (7 Approved Roles)
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as UserRole)}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '6px',
                    border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none', backgroundColor: '#ffffff'
                  }}
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Editor">Editor</option>
                  <option value="Contributor">Contributor</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Client">Client</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  style={{
                    padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px', borderRadius: '6px', border: 'none',
                    backgroundColor: '#1d4ed8', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};
