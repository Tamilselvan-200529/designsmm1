import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Menu, 
  X, 
  Sparkles, 
  Search, 
  Bell, 
  LayoutDashboard, 
  PenSquare, 
  Calendar, 
  FileText, 
  MoreHorizontal,
  CheckSquare,
  BarChart3,
  Image as ImageIcon,
  Share2,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { canAccessPage, getCapabilities } from '../../utils/rbac';

export const MobileNav: React.FC = () => {
  const { 
    activeNav, 
    setActiveNav, 
    openComposer, 
    setIsSearchOpen, 
    notifications, 
    currentUser,
    logout,
    posts 
  } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingApprovals = posts.filter(p => p.status === 'pending').length;
  const caps = getCapabilities(currentUser.role);

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="mobile-topbar">
        <div className="flex items-center gap-2">
          <button 
            className="btn btn-ghost btn-icon-only"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-1.5" style={{ fontWeight: 700, fontSize: '16px' }}>
            <Sparkles size={16} color="var(--color-primary)" />
            <span>AuraSocial</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            className="icon-action-btn"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <button 
            className="icon-action-btn"
            onClick={() => handleNavClick('dashboard')}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-unread-dot" />}
          </button>

          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-nav-tabs">
          <button
            className={`mobile-nav-tab ${activeNav === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Home</span>
          </button>

          {caps.canCreateContent && (
            <button
              className="mobile-nav-tab"
              style={{ color: 'var(--color-primary)' }}
              onClick={() => openComposer()}
            >
              <PenSquare size={20} />
              <span>Publish</span>
            </button>
          )}

          <button
            className={`mobile-nav-tab ${activeNav === 'calendar' ? 'active' : ''}`}
            onClick={() => handleNavClick('calendar')}
          >
            <Calendar size={20} />
            <span>Calendar</span>
          </button>

          <button
            className={`mobile-nav-tab ${activeNav === 'content' ? 'active' : ''}`}
            onClick={() => handleNavClick('content')}
          >
            <FileText size={20} />
            <span>Content</span>
          </button>

          <button
            className={`mobile-nav-tab ${isDrawerOpen ? 'active' : ''}`}
            onClick={() => setIsDrawerOpen(true)}
          >
            <MoreHorizontal size={20} />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Slide-out Mobile Menu Drawer */}
      {isDrawerOpen && (
        <div className="modal-overlay" onClick={() => setIsDrawerOpen(false)} style={{ alignItems: 'flex-start', padding: 0 }}>
          <div 
            className="flex flex-col bg-canvas"
            style={{ 
              width: '80%', 
              maxWidth: '300px', 
              height: '100vh', 
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-xl)',
              padding: '20px 16px',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: '16px' }}>
                <Sparkles size={18} color="var(--color-primary)" />
                <span>AuraSocial</span>
              </div>
              <button 
                className="btn btn-ghost btn-icon-only"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              {canAccessPage(currentUser.role, 'dashboard') && (
                <button 
                  className={`sidebar-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
                  onClick={() => handleNavClick('dashboard')}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </div>
                </button>
              )}

              {canAccessPage(currentUser.role, 'calendar') && (
                <button 
                  className={`sidebar-nav-item ${activeNav === 'calendar' ? 'active' : ''}`}
                  onClick={() => handleNavClick('calendar')}
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={18} />
                    <span>Calendar</span>
                  </div>
                </button>
              )}

              {canAccessPage(currentUser.role, 'content') && (
                <button 
                  className={`sidebar-nav-item ${activeNav === 'content' ? 'active' : ''}`}
                  onClick={() => handleNavClick('content')}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} />
                    <span>Content Library</span>
                  </div>
                </button>
              )}

              {canAccessPage(currentUser.role, 'approvals') && (
                <button 
                  className={`sidebar-nav-item ${activeNav === 'approvals' ? 'active' : ''}`}
                  onClick={() => handleNavClick('approvals')}
                >
                  <div className="flex items-center gap-3">
                    <CheckSquare size={18} />
                    <span>Approvals</span>
                  </div>
                  {pendingApprovals > 0 && <span className="sidebar-nav-badge">{pendingApprovals}</span>}
                </button>
              )}

              {canAccessPage(currentUser.role, 'analytics') && (
                <button 
                  className={`sidebar-nav-item ${activeNav === 'analytics' ? 'active' : ''}`}
                  onClick={() => handleNavClick('analytics')}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 size={18} />
                    <span>Analytics</span>
                  </div>
                </button>
              )}

              {(canAccessPage(currentUser.role, 'org-brands') || canAccessPage(currentUser.role, 'roles-permissions') || canAccessPage(currentUser.role, 'billing')) && (
                <>
                  <div className="divider" style={{ margin: '12px 0' }} />
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-light)', letterSpacing: '0.05em', padding: '4px 12px' }}>
                    ORGANIZATION
                  </div>
                </>
              )}

              {canAccessPage(currentUser.role, 'org-brands') && (
                <button 
                  className={`sidebar-nav-item ${activeNav === 'org-brands' ? 'active' : ''}`}
                  onClick={() => handleNavClick('org-brands')}
                >
                  <div className="flex items-center gap-3">
                    <span>🏢</span>
                    <span>All Brands</span>
                  </div>
                </button>
              )}

              {canAccessPage(currentUser.role, 'roles-permissions') && (
                <button 
                  className={`sidebar-nav-item ${activeNav === 'roles-permissions' ? 'active' : ''}`}
                  onClick={() => handleNavClick('roles-permissions')}
                >
                  <div className="flex items-center gap-3">
                    <span>🛡️</span>
                    <span>Roles &amp; Permissions</span>
                  </div>
                </button>
              )}

              {canAccessPage(currentUser.role, 'billing') && (
                <button 
                  className={`sidebar-nav-item ${activeNav === 'billing' ? 'active' : ''}`}
                  onClick={() => handleNavClick('billing')}
                >
                  <div className="flex items-center gap-3">
                    <span>💳</span>
                    <span>Billing &amp; Subscription</span>
                  </div>
                </button>
              )}
            </div>

            <div className="divider" style={{ margin: '16px 0' }} />

            <button
              className="btn btn-secondary w-full justify-center gap-2"
              onClick={() => {
                setIsDrawerOpen(false);
                logout();
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
