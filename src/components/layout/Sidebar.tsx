import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  PenSquare, 
  Calendar as CalendarIcon, 
  FileText, 
  CheckSquare, 
  BarChart3, 
  Image as ImageIcon, 
  Share2, 
  Users, 
  Settings as SettingsIcon,
  ChevronDown,
  Plus,
  LogOut,
  Building2,
  Shield,
  Layers,
  CreditCard,
  Briefcase,
  Check,
  User,
  Globe
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { UserRole } from '../../types';
import { canAccessPage, getCapabilities } from '../../utils/rbac';

const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  Owner:       { bg: 'rgba(99,102,241,0.12)',  text: '#4f46e5' },
  Admin:       { bg: 'rgba(234,88,12,0.12)',   text: '#ea580c' },
  Manager:     { bg: 'rgba(37,99,235,0.12)',   text: '#2563eb' },
  Editor:      { bg: 'rgba(16,185,129,0.12)',  text: '#059669' },
  Contributor: { bg: 'rgba(202,138,4,0.12)',   text: '#b45309' },
  Analyst:     { bg: 'rgba(139,92,246,0.12)',  text: '#7c3aed' },
  Client:      { bg: 'rgba(100,116,139,0.12)', text: '#475569' },
};

export const Sidebar: React.FC = () => {
  const { 
    activeNav, 
    setActiveNav, 
    openComposer, 
    organization,
    organizations,
    currentOrgId,
    switchOrganization,
    navigateTo,
    currentBrand, 
    allBrands, 
    switchBrand, 
    setIsCreateBrandOpen,
    currentUser,
    currentMember,
    brandMembers,
    switchMember,
    logout,
    posts
  } = useApp();

  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false);

  // Count pending approvals in current brand
  const pendingCount = posts.filter(p => p.status === 'pending').length;
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const rejectedCount = posts.filter(p => p.status === 'rejected').length;
  const unpublishedCount = posts.filter(p => p.status === 'rejected' || p.status === 'draft' || p.status === 'failed').length;

  // RBAC — filter nav items to only those the current role can access
  const userRole = currentUser.role;
  const caps = getCapabilities(userRole);

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    action?: () => void;
    badge?: string | number;
  }

  interface NavGroup {
    group: string;
    items: NavItem[];
  }

  const navItems: NavGroup[] = [
    {
      group: 'BRAND CONTEXT',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
        { id: 'calendar', label: 'Calendar', icon: <CalendarIcon size={17} /> },
        { 
          id: 'scheduled-posts', 
          label: 'Scheduled Posts', 
          icon: <CalendarIcon size={17} />,
          badge: scheduledCount > 0 ? scheduledCount : undefined
        },
        { id: 'content', label: 'Content Posts', icon: <FileText size={17} /> },
        { 
          id: 'approvals', 
          label: 'Approvals', 
          icon: <CheckSquare size={17} />, 
          badge: pendingCount > 0 ? pendingCount : undefined 
        },
        { 
          id: 'unpublished', 
          label: 'Unpublished Posts', 
          icon: <FileText size={17} />, 
          badge: rejectedCount > 0 ? `${rejectedCount} rejected` : (unpublishedCount > 0 ? unpublishedCount : undefined)
        },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={17} /> },
        { id: 'social', label: 'Channels', icon: <Share2 size={17} /> },
        { id: 'team', label: 'Brand Team', icon: <Users size={17} /> },
        { id: 'settings', label: 'Brand Settings', icon: <SettingsIcon size={17} /> },
      ]
    },
    {
      group: 'ORGANIZATION',
      items: [
        { 
          id: 'org-brands', 
          label: 'All Brands', 
          icon: <Layers size={17} />,
          badge: allBrands.length
        },
        { 
          id: 'roles-permissions', 
          label: 'Roles & Permissions', 
          icon: <Shield size={17} /> 
        },
        { 
          id: 'org-settings', 
          label: 'Org Settings', 
          icon: <Building2 size={17} /> 
        },
        { 
          id: 'billing', 
          label: 'Billing & Plans', 
          icon: <CreditCard size={17} /> 
        },
      ]
    }
  ];

  const roleColors = ROLE_COLORS[currentMember?.role ?? 'Contributor'];

  return (
    <aside className="sidebar">
      {/* ── LEVEL 1: ORGANIZATION ── */}
      <div style={{ padding: '12px 14px 8px 14px', position: 'relative' }}>
        <div style={{ 
          fontSize: '9.5px', fontWeight: 700, color: 'var(--text-muted)', 
          letterSpacing: '0.07em', marginBottom: '5px', paddingLeft: '2px', 
          textTransform: 'uppercase' 
        }}>
          Organization
        </div>
        <button
          onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '7px 9px', borderRadius: '8px',
            border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{ 
              width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', boxShadow: '0 2px 6px rgba(99,102,241,0.35)'
            }}>
              <Briefcase size={13} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, textAlign: 'left' }}>
              <span style={{ 
                fontSize: '12px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
              }}>
                {organization.name}
              </span>
              <span style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.2 }}>
                {organization.plan} Plan
              </span>
            </div>
          </div>
          <ChevronDown size={13} color="#94a3b8" style={{ flexShrink: 0, transform: isOrgMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {isOrgMenuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 890 }} onClick={() => setIsOrgMenuOpen(false)} />
            <div style={{
              position: 'absolute', top: '62px', left: '14px', right: '14px', zIndex: 900,
              backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px',
              boxShadow: '0 12px 30px rgba(15,23,42,0.18), 0 4px 10px rgba(15,23,42,0.06)',
              padding: '8px'
            }}>
              <div style={{ padding: '4px 6px 6px', borderBottom: '1px solid #f1f5f9', marginBottom: '6px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: '3px' }}>ORGANIZATION</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{organization.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{organization.industry} • {organization.plan}</div>
              </div>

              {/* Multi-Tenant Organization Switcher */}
              {organizations.length > 1 && (
                <div style={{ padding: '4px 0', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', padding: '2px 8px 4px', textTransform: 'uppercase' }}>Switch Organization</div>
                  {organizations.map(org => (
                    <button
                      key={org.id}
                      className="dropdown-item"
                      onClick={() => { setIsOrgMenuOpen(false); switchOrganization(org.id); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', padding: '5px 8px', borderRadius: '6px', fontSize: '12px',
                        border: 'none', cursor: 'pointer',
                        backgroundColor: org.id === currentOrgId ? 'rgba(79,70,229,0.08)' : 'transparent',
                        color: org.id === currentOrgId ? '#4f46e5' : '#0f172a',
                        fontWeight: org.id === currentOrgId ? 700 : 500
                      }}
                    >
                      <span>{org.name}</span>
                      {org.id === currentOrgId && <Check size={12} color="#4f46e5" />}
                    </button>
                  ))}
                </div>
              )}

              {(currentUser.role === 'Owner' || currentUser.role === 'Admin') && (
                <button
                  className="dropdown-item"
                  onClick={() => { setIsOrgMenuOpen(false); navigateTo('/admin'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', borderRadius: '6px', fontSize: '12.5px', border: 'none', cursor: 'pointer', backgroundColor: 'rgba(79,70,229,0.06)', color: '#4f46e5', fontWeight: 600, marginBottom: '2px' }}
                >
                  <Shield size={14} color="#4f46e5" />
                  <span>Admin Portal</span>
                </button>
              )}

              <button
                className="dropdown-item"
                onClick={() => { setIsOrgMenuOpen(false); setActiveNav('org-brands'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', borderRadius: '6px', fontSize: '12.5px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: '#0f172a' }}
              >
                <Layers size={14} color="var(--color-primary)" />
                <span>View All Brands</span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => { setIsOrgMenuOpen(false); setActiveNav('org-settings'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', borderRadius: '6px', fontSize: '12.5px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: '#0f172a' }}
              >
                <Building2 size={14} color="#64748b" />
                <span>Organization Settings</span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => { setIsOrgMenuOpen(false); navigateTo('/'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', borderRadius: '6px', fontSize: '12.5px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: '#64748b' }}
              >
                <Globe size={14} color="#64748b" />
                <span>Landing Page</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── LEVEL 2: BRAND ── */}
      <div style={{ padding: '0 14px 8px 14px', position: 'relative' }}>
        <div style={{ 
          fontSize: '9.5px', fontWeight: 700, color: 'var(--text-muted)', 
          letterSpacing: '0.07em', marginBottom: '5px', paddingLeft: '2px',
          textTransform: 'uppercase' 
        }}>
          Brand
        </div>
        <button
          onClick={() => setIsBrandMenuOpen(!isBrandMenuOpen)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '7px 9px', borderRadius: '8px',
            border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <img 
              src={currentBrand.logo} 
              alt={currentBrand.name}
              style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, textAlign: 'left' }}>
              <span style={{ 
                fontSize: '12px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
              }}>
                {currentBrand.name}
              </span>
              <span style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentBrand.industry}
              </span>
            </div>
          </div>
          <ChevronDown size={13} color="#94a3b8" style={{ flexShrink: 0, transform: isBrandMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {isBrandMenuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 890 }} onClick={() => setIsBrandMenuOpen(false)} />
            <div style={{
              position: 'absolute', top: '60px', left: '14px', right: '14px', zIndex: 900,
              backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px',
              boxShadow: '0 12px 30px rgba(15,23,42,0.18), 0 4px 10px rgba(15,23,42,0.06)',
              padding: '6px'
            }}>
              <div style={{ padding: '4px 8px 6px', fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                SELECT BRAND ({allBrands.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {allBrands.map(b => (
                  <button
                    key={b.id}
                    className="dropdown-item"
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                      padding: '7px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                      fontWeight: b.id === currentBrand.id ? 700 : 500,
                      backgroundColor: b.id === currentBrand.id ? '#eef2ff' : 'transparent',
                      color: '#0f172a', transition: 'background-color 0.12s ease'
                    }}
                    onClick={() => { switchBrand(b.id); setIsBrandMenuOpen(false); }}
                  >
                    <img src={b.logo} alt={b.name} style={{ width: '22px', height: '22px', borderRadius: '5px', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{b.accountCount} accounts · {b.memberCount} members</div>
                    </div>
                    {b.id === currentBrand.id && <Check size={13} color="var(--color-primary)" />}
                  </button>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '6px', paddingTop: '6px' }}>
                <button
                  className="dropdown-item"
                  onClick={() => { setIsBrandMenuOpen(false); setIsCreateBrandOpen(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '7px 8px', borderRadius: '6px', fontSize: '12px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--color-primary)', fontWeight: 600 }}
                >
                  <Plus size={14} />
                  <span>Create New Brand</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── LEVEL 3: MEMBER ── */}
      <div style={{ padding: '0 14px 10px 14px', position: 'relative', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ 
          fontSize: '9.5px', fontWeight: 700, color: 'var(--text-muted)', 
          letterSpacing: '0.07em', marginBottom: '5px', paddingLeft: '2px',
          textTransform: 'uppercase' 
        }}>
          Active Member
        </div>
        <button
          onClick={() => setIsMemberMenuOpen(!isMemberMenuOpen)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '7px 9px', borderRadius: '8px',
            border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <Avatar src={currentMember?.avatar} name={currentMember?.name} size="sm" />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, textAlign: 'left' }}>
              <span style={{ 
                fontSize: '12px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
              }}>
                {currentMember?.name ?? 'Select Member'}
              </span>
              <span style={{ fontSize: '10px', lineHeight: 1.2 }}>
                <span style={{ 
                  display: 'inline-block', padding: '0px 5px', borderRadius: '3px', fontSize: '9.5px', fontWeight: 700,
                  backgroundColor: roleColors.bg, color: roleColors.text
                }}>
                  {currentMember?.role ?? '—'}
                </span>
              </span>
            </div>
          </div>
          <ChevronDown size={13} color="#94a3b8" style={{ flexShrink: 0, transform: isMemberMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {isMemberMenuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 890 }} onClick={() => setIsMemberMenuOpen(false)} />
            <div style={{
              position: 'absolute', top: '60px', left: '14px', right: '14px', zIndex: 900,
              backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px',
              boxShadow: '0 12px 30px rgba(15,23,42,0.18), 0 4px 10px rgba(15,23,42,0.06)',
              padding: '6px'
            }}>
              <div style={{ padding: '4px 8px 6px', fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                {currentBrand.name.toUpperCase()} MEMBERS ({brandMembers.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {brandMembers.map(member => {
                  const mc = ROLE_COLORS[member.role];
                  const isActive = member.id === currentMember?.id;
                  return (
                    <button
                      key={member.id}
                      className="dropdown-item"
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                        padding: '7px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                        backgroundColor: isActive ? '#eef2ff' : 'transparent',
                        color: '#0f172a', transition: 'background-color 0.12s ease'
                      }}
                      onClick={() => { switchMember(member.id); setIsMemberMenuOpen(false); }}
                    >
                      <Avatar src={member.avatar} name={member.name} size="sm" />
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ fontSize: '12px', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                        <div>
                          <span style={{ 
                            display: 'inline-block', padding: '0px 5px', borderRadius: '3px', fontSize: '9.5px', fontWeight: 700,
                            backgroundColor: mc.bg, color: mc.text
                          }}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                      {isActive && <Check size={13} color="var(--color-primary)" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Compose Quick Action (hidden for roles that cannot create content) ── */}
      {caps.canCreateContent && (
        <div style={{ padding: '10px 14px 8px 14px' }}>
          <button
            onClick={() => openComposer()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '9px 12px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              border: 'none', color: '#ffffff', fontWeight: 700, fontSize: '13px',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <PenSquare size={14} />
            <span>Create Post</span>
          </button>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', paddingBottom: '8px' }}>
        {/* Role-filtered nav — items hidden if current role lacks access */}
        {navItems.map(group => {
          const visibleItems = group.items.filter(item => canAccessPage(userRole, item.id));
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.group} style={{ padding: '4px 10px' }}>
              <div style={{ 
                fontSize: '9.5px', fontWeight: 700, color: 'var(--text-muted)', 
                letterSpacing: '0.07em', padding: '10px 6px 5px 6px',
                textTransform: 'uppercase'
              }}>
                {group.group}
              </div>
              {visibleItems.map(item => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (item.action) item.action();
                      else setActiveNav(item.id);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '7px 10px', borderRadius: '7px', border: 'none',
                      backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                      color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400, fontSize: '13px',
                      cursor: 'pointer', transition: 'all 0.15s ease', marginBottom: '1px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge !== 0 && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '9px',
                        backgroundColor: isActive ? 'var(--color-primary)' : '#e2e8f0',
                        color: isActive ? '#ffffff' : '#64748b',
                        fontSize: '10px', fontWeight: 700
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── Footer: Navigation & Sign-out ── */}
      <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border-color)', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {(currentUser.role === 'Owner' || currentUser.role === 'Admin') && (
          <button
            onClick={() => navigateTo('/admin')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
              padding: '6px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              backgroundColor: 'rgba(79,70,229,0.06)', color: '#4f46e5', fontSize: '12px', fontWeight: 600,
              transition: 'all 0.15s ease'
            }}
          >
            <Shield size={14} color="#4f46e5" />
            <span>Admin Portal</span>
          </button>
        )}
        <button
          onClick={() => navigateTo('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
            padding: '6px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            backgroundColor: 'transparent', color: 'var(--text-muted)', fontSize: '12px',
            transition: 'all 0.15s ease'
          }}
        >
          <Globe size={14} />
          <span>Landing Page</span>
        </button>
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
            padding: '6px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            backgroundColor: 'transparent', color: 'var(--text-muted)', fontSize: '12px',
            transition: 'all 0.15s ease'
          }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
