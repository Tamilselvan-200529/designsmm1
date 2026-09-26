import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Plus, 
  Bell, 
  PenSquare, 
  Layers, 
  UserPlus, 
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

export const Topbar: React.FC = () => {
  const { 
    organization,
    currentBrand, 
    currentMember,
    setIsSearchOpen, 
    openComposer, 
    setIsCreateBrandOpen,
    notifications, 
    markNotificationsRead,
    currentUser,
    setActiveNav
  } = useApp();

  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="topbar">
      {/* Left side: Org > Brand > Member Breadcrumb */}
      <div className="topbar-left">
        <div className="flex items-center gap-1.5" style={{ fontSize: '13px' }}>
          <span 
            style={{ fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', whiteSpace: 'nowrap' }}
            onClick={() => setActiveNav('org-brands')}
            title="View all organization brands"
          >
            {organization.name}
          </span>
          <ChevronRight size={13} color="var(--text-light)" />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            {currentBrand.name}
          </span>
          <ChevronRight size={13} color="var(--text-light)" />
          <div className="flex items-center gap-1.5" style={{ whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              {currentMember?.name ?? currentUser.name}
            </span>
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '4px',
              backgroundColor: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)'
            }}>
              {currentMember?.role ?? currentUser.role}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="topbar-center">
        <button 
          className="search-trigger-btn"
          onClick={() => setIsSearchOpen(true)}
          title="Search posts, media, accounts, team... (Cmd+K)"
        >
          <div className="flex items-center gap-2">
            <Search size={15} />
            <span>Search posts, media, accounts...</span>
          </div>
          <span className="search-kbd">⌘K</span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="topbar-right">
        {/* + Quick Create Dropdown */}
        <div style={{ position: 'relative' }}>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
          >
            <span>Create</span>
            <ChevronDown size={13} />
          </Button>

          {isCreateMenuOpen && (
            <div 
              className="dropdown-menu"
              style={{ position: 'absolute', top: '38px', right: 0, width: '220px', zIndex: 300 }}
            >
              <button 
                className="dropdown-item"
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  openComposer();
                }}
              >
                <PenSquare size={16} color="var(--color-primary)" />
                <div className="flex flex-col">
                  <span style={{ fontWeight: 600 }}>Create Post</span>
                  <span className="text-caption">Draft, schedule or publish</span>
                </div>
              </button>

              <div className="divider" style={{ margin: '4px 0' }} />

              <button 
                className="dropdown-item"
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  setIsCreateBrandOpen(true);
                }}
              >
                <Layers size={16} color="var(--color-primary)" />
                <div className="flex flex-col">
                  <span>New Brand</span>
                  <span className="text-caption">Add brand to organization</span>
                </div>
              </button>

              {currentUser.role === 'Admin' && (
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setIsCreateMenuOpen(false);
                    setActiveNav('team');
                  }}
                >
                  <UserPlus size={16} color="var(--text-muted)" />
                  <span>Invite Team Member</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-action-btn"
            onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-unread-dot" />}
          </button>

          {isNotifMenuOpen && (
            <div 
              className="dropdown-menu"
              style={{ position: 'absolute', top: '44px', right: 0, width: '340px', padding: '12px', zIndex: 300 }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>Notifications</span>
                  {unreadCount > 0 && <span className="badge badge-scheduled">{unreadCount} new</span>}
                </div>
                {unreadCount > 0 && (
                  <button 
                    className="btn btn-link" 
                    style={{ fontSize: '11.5px' }}
                    onClick={markNotificationsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: '300px' }}>
                {notifications.map(notif => (
                  <div 
                    key={notif.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: notif.read ? 'transparent' : 'var(--color-primary-light)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {notif.title}
                      </span>
                      <span className="text-caption">{notif.time}</span>
                    </div>
                    <span className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                      {notif.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar - reflects active member */}
        <div className="flex items-center gap-2 pl-2">
          <Avatar 
            src={currentMember?.avatar ?? currentUser.avatar} 
            name={currentMember?.name ?? currentUser.name} 
            size="md" 
          />
        </div>
      </div>
    </header>
  );
};
