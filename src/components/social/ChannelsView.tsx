import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ConnectAccountModal } from './ConnectAccountModal';
import { SocialAccount, SocialPlatform } from '../../types';
import { PLATFORM_CONFIG } from '../../utils/helpers';
import {
  Settings,
  MoreHorizontal,
  ExternalLink,
  RefreshCw,
  Trash2,
  Plus,
  Building2,
  ChevronRight,
  Wifi,
  AlertCircle,
} from 'lucide-react';
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  TiktokIcon,
  YoutubeIcon,
} from '../common/SocialIcons';

// ── Platform icon helper ─────────────────────────────────────────────────────
function PlatformIcon({ platform, size = 14, color: customColor }: { platform: SocialPlatform; size?: number; color?: string }) {
  const cfg = PLATFORM_CONFIG[platform];
  const color = customColor || cfg.brandColor;
  switch (platform) {
    case 'instagram': return <InstagramIcon size={size} color={color} />;
    case 'facebook':  return <FacebookIcon  size={size} color={color} />;
    case 'linkedin':  return <LinkedinIcon  size={size} color={color} />;
    case 'tiktok':    return <TiktokIcon    size={size} color={color} />;
    case 'youtube':   return <YoutubeIcon   size={size} color={color} />;
  }
}

// ── Platform badge overlaid on avatar ───────────────────────────────────────
function ChannelAvatar({ account }: { account: SocialAccount }) {
  const cfg = PLATFORM_CONFIG[account.platform];
  return (
    <div style={{ position: 'relative', flexShrink: 0, width: '40px', height: '40px' }}>
      <img
        src={account.avatar}
        alt={account.name}
        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f1f5f9' }}
        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&size=80&background=f1f5f9&color=64748b`; }}
      />
      {/* Platform badge */}
      <span style={{
        position: 'absolute', bottom: '-2px', right: '-2px',
        width: '18px', height: '18px', borderRadius: '50%',
        backgroundColor: cfg.brandColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid #ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}>
        <PlatformIcon platform={account.platform} size={10} color="#ffffff" />
      </span>
    </div>
  );
}

// ── Three-dot context menu ───────────────────────────────────────────────────
interface ChannelMenuProps {
  account: SocialAccount;
  onSettings: () => void;
  onClose: () => void;
}
const ChannelMenu: React.FC<ChannelMenuProps> = ({ account, onSettings, onClose }) => {
  const { reconnectAccount, refreshAccount, disconnectAccount, showToast } = useApp();
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cfg = PLATFORM_CONFIG[account.platform];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleViewOnPlatform = () => {
    const urls: Record<SocialPlatform, string> = {
      instagram: `https://instagram.com/${account.username.replace('@', '')}`,
      facebook: `https://facebook.com/${account.username.replace('@', '')}`,
      linkedin: `https://linkedin.com/in/${account.username.replace('@', '')}`,
      tiktok: `https://tiktok.com/@${account.username.replace('@', '')}`,
      youtube: `https://youtube.com/@${account.username.replace('@', '')}`,
    };
    window.open(urls[account.platform], '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleRefresh = () => {
    showToast('info', `Refreshing connection for ${account.name}…`);
    setTimeout(() => {
      refreshAccount(account.id);
      if (account.status !== 'connected') reconnectAccount(account.id);
      showToast('success', `${account.name} reconnected successfully.`);
    }, 1200);
    onClose();
  };

  const handleDisconnect = () => {
    disconnectAccount(account.id);
    onClose();
  };

  if (confirmDisconnect) {
    return (
      <div ref={menuRef} style={{
        position: 'absolute', top: '100%', right: 0, zIndex: 500,
        backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
        borderRadius: '10px', boxShadow: '0 8px 24px rgba(15,23,42,0.14)',
        width: '260px', padding: '16px',
      }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
          Disconnect {cfg.name}?
        </p>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.5 }}>
          Disconnecting this channel will stop publishing and scheduling posts to this account.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setConfirmDisconnect(false)}
            style={{
              flex: 1, padding: '7px', borderRadius: '6px',
              border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
              cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, color: '#64748b',
            }}
          >Cancel</button>
          <button
            onClick={handleDisconnect}
            style={{
              flex: 1, padding: '7px', borderRadius: '6px',
              border: 'none', backgroundColor: '#dc2626',
              cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, color: '#ffffff',
            }}
          >Disconnect</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={menuRef} style={{
      position: 'absolute', top: '100%', right: 0, zIndex: 500,
      backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
      borderRadius: '10px', boxShadow: '0 8px 24px rgba(15,23,42,0.14)',
      minWidth: '190px', overflow: 'hidden', padding: '4px',
    }}>
      {/* View on Platform */}
      <button
        onClick={handleViewOnPlatform}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          width: '100%', padding: '9px 12px', border: 'none',
          backgroundColor: 'transparent', cursor: 'pointer',
          fontSize: '13.5px', fontWeight: 500, color: '#0f172a',
          borderRadius: '6px', textAlign: 'left',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <ExternalLink size={15} color="#64748b" />
        View on {cfg.name}
      </button>

      {/* Refresh Connection */}
      <button
        onClick={handleRefresh}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          width: '100%', padding: '9px 12px', border: 'none',
          backgroundColor: 'transparent', cursor: 'pointer',
          fontSize: '13.5px', fontWeight: 500, color: '#0f172a',
          borderRadius: '6px', textAlign: 'left',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <RefreshCw size={15} color="#64748b" />
        Refresh Connection
      </button>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />

      {/* Disconnect — destructive */}
      <button
        onClick={() => setConfirmDisconnect(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          width: '100%', padding: '9px 12px', border: 'none',
          backgroundColor: 'transparent', cursor: 'pointer',
          fontSize: '13.5px', fontWeight: 500, color: '#dc2626',
          borderRadius: '6px', textAlign: 'left',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fef2f2')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <Trash2 size={15} color="#dc2626" />
        Disconnect Channel
      </button>
    </div>
  );
};

// ── Single channel row ───────────────────────────────────────────────────────
interface ChannelRowProps {
  account: SocialAccount;
  onSettingsClick: (account: SocialAccount) => void;
}
const ChannelRow: React.FC<ChannelRowProps> = ({ account, onSettingsClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = PLATFORM_CONFIG[account.platform];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderRadius: '8px', backgroundColor: '#ffffff',
      border: '1px solid #f1f5f9',
      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Left: avatar + info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <ChannelAvatar account={account} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
            {account.name}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '12.5px', color: '#64748b', marginTop: '2px',
          }}>
            <PlatformIcon platform={account.platform} size={12} />
            <span>{cfg.name} {account.platform === 'linkedin' ? 'Profile' : account.platform === 'youtube' ? 'Channel' : 'Page'}</span>
            {account.status !== 'connected' && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                fontSize: '11px', fontWeight: 600, padding: '1px 6px',
                borderRadius: '4px',
                backgroundColor: account.status === 'expiring' ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)',
                color: account.status === 'expiring' ? '#b45309' : '#dc2626',
              }}>
                <AlertCircle size={10} />
                {account.status === 'expiring' ? 'Token Expiring' : 'Connection Failed'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative', flexShrink: 0 }}>
        {/* Settings icon */}
        <button
          onClick={() => onSettingsClick(account)}
          title="Channel Settings"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: '6px', border: 'none',
            backgroundColor: 'transparent', cursor: 'pointer', color: '#94a3b8',
            transition: 'background-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9';
            (e.currentTarget as HTMLElement).style.color = '#475569';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#94a3b8';
          }}
        >
          <Settings size={16} />
        </button>

        {/* Three-dot menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            title="More options"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px', borderRadius: '6px', border: 'none',
              backgroundColor: menuOpen ? '#f1f5f9' : 'transparent',
              cursor: 'pointer', color: '#94a3b8',
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9';
              (e.currentTarget as HTMLElement).style.color = '#475569';
            }}
            onMouseLeave={e => {
              if (!menuOpen) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#94a3b8';
              }
            }}
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <ChannelMenu
              account={account}
              onSettings={() => { onSettingsClick(account); setMenuOpen(false); }}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ── Empty state ──────────────────────────────────────────────────────────────
const EmptyChannels: React.FC<{ onConnect: () => void }> = ({ onConnect }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '60px 24px', textAlign: 'center',
  }}>
    <div style={{
      width: '56px', height: '56px', borderRadius: '14px',
      backgroundColor: 'rgba(99,102,241,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
    }}>
      <Wifi size={26} color="#6366f1" />
    </div>
    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
      No channels connected yet
    </h3>
    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', maxWidth: '300px', lineHeight: 1.6 }}>
      Connect your first social channel to start publishing, scheduling, and tracking your content.
    </p>
    <button
      onClick={onConnect}
      style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: '9px 18px', borderRadius: '8px',
        backgroundColor: '#22c55e', border: 'none',
        color: '#ffffff', fontWeight: 700, fontSize: '13.5px',
        cursor: 'pointer', boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
      }}
    >
      <Plus size={15} />
      Connect Channel
    </button>
  </div>
);

// ── Main ChannelsView ────────────────────────────────────────────────────────
interface ChannelsViewProps {
  onOpenSettings: (account: SocialAccount) => void;
}

export const ChannelsView: React.FC<ChannelsViewProps> = ({ onOpenSettings }) => {
  const {
    socialAccounts,
    organization,
    currentBrand,
    setIsConnectAccountOpen,
  } = useApp();

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500,
      }}>
        <Building2 size={13} />
        <span>{organization.name}</span>
        <ChevronRight size={12} />
        <span style={{ color: currentBrand?.color || 'var(--color-primary)', fontWeight: 600 }}>
          {currentBrand?.name}
        </span>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Channels</span>
      </div>

      {/* Page header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="text-display" style={{ fontSize: '24px' }}>Channels</h1>
          <p className="text-body">
            Manage connected social channels for <strong>{currentBrand.name}</strong>.
          </p>
        </div>
        <div className="page-actions">
          <button
            onClick={() => setIsConnectAccountOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 18px', borderRadius: '8px',
              backgroundColor: '#22c55e', border: 'none',
              color: '#ffffff', fontWeight: 700, fontSize: '13.5px',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#16a34a')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#22c55e')}
          >
            <Plus size={15} />
            Connect Channel
          </button>
        </div>
      </div>

      {/* Channel list card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Count bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: socialAccounts.length > 0 ? '1px solid #f1f5f9' : 'none',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
            {socialAccounts.length}/Unlimited
          </span>
          {socialAccounts.length > 0 && (
            <div style={{ width: '80px', height: '3px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, (socialAccounts.length / 10) * 100)}%`,
                height: '100%', backgroundColor: '#22c55e', borderRadius: '2px',
              }} />
            </div>
          )}
        </div>

        {/* Channel rows */}
        {socialAccounts.length === 0 ? (
          <EmptyChannels onConnect={() => setIsConnectAccountOpen(true)} />
        ) : (
          <div style={{ padding: '8px 12px 12px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {socialAccounts.map(account => (
              <ChannelRow
                key={account.id}
                account={account}
                onSettingsClick={onOpenSettings}
              />
            ))}
          </div>
        )}
      </div>

      {/* Connect Account Modal */}
      <ConnectAccountModal />
    </div>
  );
};
