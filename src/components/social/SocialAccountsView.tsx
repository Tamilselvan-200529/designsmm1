import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { AccountStatusBadge, PlatformBadge } from '../common/Badge';
import { ConnectAccountModal } from './ConnectAccountModal';
import { SocialAccount, SocialPlatform } from '../../types';
import { PLATFORM_CONFIG } from '../../utils/helpers';
import { formatCompactNumber } from '../../utils/helpers';
import {
  Plus, RefreshCw, RotateCcw, Trash2, AlertTriangle, CheckCircle2,
  Edit2, Check, X, Key, Calendar, Users, Shield, Layers,
  ChevronDown, ExternalLink, Wifi, WifiOff, Clock, Globe,
  TrendingUp, Eye, Heart, FileText
} from 'lucide-react';

// ─── Status colour tokens ───────────────────────────────────────────────────
const STATUS_STYLES = {
  connected: { bg: 'rgba(22,163,74,0.08)', border: '#bbf7d0', text: '#15803d', icon: <CheckCircle2 size={14} color="#16a34a" />, label: 'Connected' },
  expiring:  { bg: 'rgba(234,179,8,0.08)', border: '#fde68a', text: '#b45309', icon: <Clock size={14} color="#d97706" />, label: 'Token Expiring' },
  failed:    { bg: 'rgba(239,68,68,0.08)', border: '#fecaca', text: '#dc2626', icon: <WifiOff size={14} color="#dc2626" />, label: 'Connection Failed' },
};

// ─── Account Detail Drawer ──────────────────────────────────────────────────
interface AccountDrawerProps {
  account: SocialAccount;
  onClose: () => void;
}
const AccountDrawer: React.FC<AccountDrawerProps> = ({ account, onClose }) => {
  const {
    allBrands, currentBrand, brandMembers, allTeamMembers,
    reconnectAccount, refreshAccount, disconnectAccount,
    renameAccount, reassignAccountBrand, updateAccountMembers,
    showToast
  } = useApp();

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(account.name);
  const [isBrandDropOpen, setIsBrandDropOpen] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const st = STATUS_STYLES[account.status];
  const cfg = PLATFORM_CONFIG[account.platform];

  // Members in current brand who have access to this account
  const accountMembers = brandMembers.filter(m =>
    (account.assignedMemberIds || []).includes(m.id)
  );
  const unassignedMembers = brandMembers.filter(m =>
    !(account.assignedMemberIds || []).includes(m.id)
  );

  const handleSaveName = () => {
    if (newName.trim()) renameAccount(account.id, newName.trim());
    setEditingName(false);
  };

  const toggleMemberAccess = (memberId: string) => {
    const current = account.assignedMemberIds || [];
    const updated = current.includes(memberId)
      ? current.filter(id => id !== memberId)
      : [...current, memberId];
    updateAccountMembers(account.id, updated);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 800, display: 'flex',
      justifyContent: 'flex-end'
    }}>
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div style={{
        position: 'relative', width: '460px', height: '100%', backgroundColor: '#ffffff',
        boxShadow: '-8px 0 32px rgba(15,23,42,0.18)', overflowY: 'auto',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
          backgroundColor: cfg.bgLight
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={account.avatar} alt={account.name}
              style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
            />
            <div>
              {editingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    autoFocus
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                    style={{
                      border: '1px solid #6366f1', borderRadius: '6px', padding: '3px 8px',
                      fontSize: '13px', fontWeight: 600, outline: 'none', width: '180px'
                    }}
                  />
                  <button onClick={handleSaveName} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: '2px' }}><Check size={15} /></button>
                  <button onClick={() => setEditingName(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px' }}><X size={15} /></button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{account.name}</span>
                  <button
                    onClick={() => { setEditingName(true); setNewName(account.name); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}
                    title="Rename account"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <PlatformBadge platform={account.platform} />
                <span style={{ fontSize: '12px', color: '#64748b' }}>{account.username}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', borderRadius: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Status & Health */}
          <section>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px' }}>Account Health</h4>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px',
              borderRadius: '10px', border: `1px solid ${st.border}`, backgroundColor: st.bg
            }}>
              {st.icon}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: st.text }}>{st.label}</div>
                {account.status === 'expiring' && (
                  <div style={{ fontSize: '12px', color: '#78716c' }}>
                    Token expires in <strong>{account.expiresInDays} days</strong> ({account.tokenExpiresAt})
                  </div>
                )}
                {account.status === 'failed' && (
                  <div style={{ fontSize: '12px', color: '#78716c' }}>{account.errorMessage}</div>
                )}
                {account.status === 'connected' && (
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Last synced: {account.lastSynced}</div>
                )}
              </div>
            </div>

            {account.status !== 'connected' && (
              <Button
                variant="primary"
                size="sm"
                icon={<RotateCcw size={13} />}
                onClick={() => { reconnectAccount(account.id); onClose(); }}
                style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}
              >
                Reconnect & Refresh OAuth Token
              </Button>
            )}
            {account.status === 'connected' && (
              <Button
                variant="secondary"
                size="sm"
                icon={<RefreshCw size={13} />}
                onClick={() => refreshAccount(account.id)}
                style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}
              >
                Sync Now
              </Button>
            )}
          </section>

          {/* Token & Auth Details */}
          <section>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px' }}>Token & Authentication</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: <Key size={14} color="#6366f1" />, label: 'Token Type', value: account.tokenType || 'OAuth2' },
                { icon: <Calendar size={14} color="#0891b2" />, label: 'Expires', value: account.tokenExpiresAt || 'Unknown' },
                { icon: <Globe size={14} color="#059669" />, label: 'API Version', value: account.apiVersion || 'v18.0' },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: '8px', backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {row.icon}
                    <span style={{ fontSize: '12.5px', color: '#64748b' }}>{row.label}</span>
                  </div>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}>{row.value}</span>
                </div>
              ))}
              {account.oauthScopes && account.oauthScopes.length > 0 && (
                <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={13} color="#6366f1" />
                    <span>OAuth Scopes Granted</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {account.oauthScopes.map(scope => (
                      <span key={scope} style={{
                        fontSize: '10.5px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px',
                        backgroundColor: 'rgba(99,102,241,0.1)', color: '#4f46e5'
                      }}>
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Performance Metrics */}
          <section>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px' }}>Performance This Month</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { icon: <Users size={14} color="#6366f1" />, label: 'Followers', value: formatCompactNumber(account.metrics?.followers || 0) },
                { icon: <Heart size={14} color="#e11d48" />, label: 'Engagement', value: `${account.metrics?.engagementRate || 0}%` },
                { icon: <FileText size={14} color="#059669" />, label: 'Posts', value: account.metrics?.postsThisMonth ?? 0 },
                { icon: <Eye size={14} color="#0891b2" />, label: 'Reach', value: formatCompactNumber(account.metrics?.reach || 0) },
                { icon: <TrendingUp size={14} color="#7c3aed" />, label: 'Impressions', value: formatCompactNumber(account.metrics?.impressions || 0) },
              ].map(m => (
                <div key={m.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '10px 8px', borderRadius: '8px', backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9', textAlign: 'center'
                }}>
                  {m.icon}
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{m.value}</span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>{m.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Assign to Brand */}
          <section>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px' }}>Brand Assignment</h4>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsBrandDropOpen(!isBrandDropOpen)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  border: '1px solid #e2e8f0', backgroundColor: '#fff',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#0f172a'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={14} color="#6366f1" />
                  <span>{allBrands.find(b => b.id === account.brandId)?.name || 'Unknown Brand'}</span>
                </div>
                <ChevronDown size={13} color="#94a3b8" />
              </button>
              {isBrandDropOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1 }} onClick={() => setIsBrandDropOpen(false)} />
                  <div style={{
                    position: 'absolute', top: '42px', left: 0, right: 0, zIndex: 2,
                    backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.14)', padding: '6px'
                  }}>
                    {allBrands.map(brand => (
                      <button
                        key={brand.id}
                        onClick={() => { reassignAccountBrand(account.id, brand.id); setIsBrandDropOpen(false); onClose(); }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '7px 10px', borderRadius: '6px', border: 'none',
                          cursor: 'pointer', fontSize: '13px',
                          backgroundColor: brand.id === account.brandId ? '#eef2ff' : 'transparent',
                          fontWeight: brand.id === account.brandId ? 700 : 400, color: '#0f172a'
                        }}
                      >
                        <span>{brand.name}</span>
                        {brand.id === account.brandId && <Check size={13} color="#4f46e5" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Team Member Access */}
          <section>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Team Access ({accountMembers.length} of {brandMembers.length} members)
            </h4>
            <p style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '10px' }}>
              Select which team members can publish via this account.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {brandMembers.map(member => {
                const hasAccess = (account.assignedMemberIds || []).includes(member.id);
                return (
                  <button
                    key={member.id}
                    onClick={() => toggleMemberAccess(member.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 10px', borderRadius: '8px', border: '1px solid',
                      borderColor: hasAccess ? '#c7d2fe' : '#f1f5f9',
                      backgroundColor: hasAccess ? 'rgba(99,102,241,0.06)' : '#f8fafc',
                      cursor: 'pointer', transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Avatar src={member.avatar} name={member.name} size="sm" />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}>{member.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{member.role}</div>
                      </div>
                    </div>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '5px', border: `2px solid`,
                      borderColor: hasAccess ? '#4f46e5' : '#cbd5e1',
                      backgroundColor: hasAccess ? '#4f46e5' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {hasAccess && <Check size={11} color="#fff" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Danger Zone */}
          <section style={{ borderTop: '1px solid #fecaca', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px' }}>Danger Zone</h4>
            {!confirmDisconnect ? (
              <button
                onClick={() => setConfirmDisconnect(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                  padding: '9px 12px', borderRadius: '8px', border: '1px solid #fecaca',
                  backgroundColor: 'rgba(239,68,68,0.06)', color: '#dc2626',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600
                }}
              >
                <Trash2 size={14} />
                <span>Disconnect Account</span>
              </button>
            ) : (
              <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fecaca', backgroundColor: 'rgba(239,68,68,0.06)' }}>
                <p style={{ fontSize: '12.5px', color: '#dc2626', marginBottom: '10px', fontWeight: 600 }}>
                  Are you sure? This will remove all OAuth tokens and stop all scheduled posts for this account.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="secondary" size="sm" onClick={() => setConfirmDisconnect(false)} style={{ flex: 1 }}>Cancel</Button>
                  <button
                    onClick={() => { disconnectAccount(account.id); onClose(); }}
                    style={{
                      flex: 1, padding: '6px 12px', borderRadius: '6px', border: 'none',
                      backgroundColor: '#dc2626', color: '#fff', cursor: 'pointer',
                      fontSize: '13px', fontWeight: 600
                    }}
                  >
                    Confirm Disconnect
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────
export const SocialAccountsView: React.FC = () => {
  const {
    socialAccounts,
    setIsConnectAccountOpen,
    reconnectAccount,
    refreshAccount,
    currentBrand,
    allBrands,
    brandMembers,
  } = useApp();

  const [drawerAccount, setDrawerAccount] = useState<SocialAccount | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'connected' | 'expiring' | 'failed'>('all');
  const [filterPlatform, setFilterPlatform] = useState<SocialPlatform | 'all'>('all');

  // ── Summary counts ──
  const connected = socialAccounts.filter(a => a.status === 'connected').length;
  const expiring  = socialAccounts.filter(a => a.status === 'expiring').length;
  const failed    = socialAccounts.filter(a => a.status === 'failed').length;
  const totalFollowers = socialAccounts.reduce((s, a) => s + (a.metrics?.followers || 0), 0);

  // ── Filtered accounts ──
  const filtered = useMemo(() => {
    return socialAccounts.filter(a => {
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (filterPlatform !== 'all' && a.platform !== filterPlatform) return false;
      return true;
    });
  }, [socialAccounts, filterStatus, filterPlatform]);

  const platforms: (SocialPlatform | 'all')[] = ['all', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="text-display" style={{ fontSize: '24px' }}>Social Accounts</h1>
          <p className="text-body">
            Manage OAuth tokens, API health, team access and account settings for <strong>{currentBrand.name}</strong>
          </p>
        </div>
        <div className="page-actions">
          <Button variant="primary" icon={<Plus size={15} />} onClick={() => setIsConnectAccountOpen(true)}>
            Connect Account
          </Button>
        </div>
      </div>

      {/* ── Health Summary Bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Connected', value: connected, icon: <Wifi size={16} />, color: '#16a34a', bg: 'rgba(22,163,74,0.08)', border: '#bbf7d0', filterVal: 'connected' },
          { label: 'Token Expiring', value: expiring, icon: <Clock size={16} />, color: '#d97706', bg: 'rgba(234,179,8,0.08)', border: '#fde68a', filterVal: 'expiring' },
          { label: 'Failed', value: failed, icon: <WifiOff size={16} />, color: '#dc2626', bg: 'rgba(239,68,68,0.08)', border: '#fecaca', filterVal: 'failed' },
          { label: 'Total Followers', value: formatCompactNumber(totalFollowers), icon: <Users size={16} />, color: '#4f46e5', bg: 'rgba(99,102,241,0.08)', border: '#c7d2fe', filterVal: null },
        ].map(card => (
          <button
            key={card.label}
            onClick={() => card.filterVal && setFilterStatus(card.filterVal as typeof filterStatus)}
            style={{
              padding: '14px 16px', borderRadius: '10px', border: `1px solid ${filterStatus === card.filterVal ? card.color : card.border}`,
              backgroundColor: card.bg, cursor: card.filterVal ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left',
              boxShadow: filterStatus === card.filterVal ? `0 0 0 2px ${card.color}30` : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ color: card.color }}>{card.icon}</div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>{card.label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'connected', 'expiring', 'failed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                border: '1px solid', cursor: 'pointer', transition: 'all 0.12s ease',
                borderColor: filterStatus === s ? '#4f46e5' : '#e2e8f0',
                backgroundColor: filterStatus === s ? '#eef2ff' : '#fff',
                color: filterStatus === s ? '#4f46e5' : '#64748b'
              }}
            >
              {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0' }} />

        <div style={{ display: 'flex', gap: '6px' }}>
          {platforms.map(p => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              style={{
                padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                border: '1px solid', cursor: 'pointer', transition: 'all 0.12s ease',
                borderColor: filterPlatform === p ? '#4f46e5' : '#e2e8f0',
                backgroundColor: filterPlatform === p ? '#eef2ff' : '#fff',
                color: filterPlatform === p ? '#4f46e5' : '#64748b'
              }}
            >
              {p === 'all' ? 'All Platforms' : PLATFORM_CONFIG[p].name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Accounts Grid ── */}
      {filtered.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '60px 20px', borderRadius: '12px', border: '2px dashed #e2e8f0', gap: '12px'
        }}>
          <Wifi size={36} color="#cbd5e1" />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#475569' }}>No accounts found</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>
            {filterStatus !== 'all' || filterPlatform !== 'all'
              ? 'No accounts match the current filters. Try clearing them.'
              : `Connect your first social account to start publishing for ${currentBrand.name}.`
            }
          </p>
          <Button variant="primary" icon={<Plus size={14} />} onClick={() => setIsConnectAccountOpen(true)}>
            Connect Account
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map(account => {
            const st = STATUS_STYLES[account.status];
            const cfg = PLATFORM_CONFIG[account.platform];
            const memberCount = (account.assignedMemberIds || []).length;

            return (
              <div
                key={account.id}
                style={{
                  backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden',
                  border: `1px solid ${account.status !== 'connected' ? st.border : '#e2e8f0'}`,
                  boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
                  transition: 'box-shadow 0.15s ease',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                {/* Card Header */}
                <div style={{
                  padding: '14px 16px', backgroundColor: cfg.bgLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: `1px solid ${account.status !== 'connected' ? st.border : '#f1f5f9'}`
                }}>
                  <PlatformBadge platform={account.platform} />
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px',
                    fontWeight: 700, color: st.text
                  }}>
                    {st.icon}
                    <span>{st.label}</span>
                  </div>
                </div>

                {/* Account Info */}
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={account.avatar} alt={account.name}
                    style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, border: '2px solid #f1f5f9' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {account.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{account.username}</div>
                  </div>
                </div>

                {/* Expiring / Failed Banner */}
                {account.status === 'expiring' && (
                  <div style={{ margin: '0 14px', padding: '8px 10px', borderRadius: '8px', backgroundColor: 'rgba(234,179,8,0.08)', border: '1px solid #fde68a', display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '6px' }}>
                    <AlertTriangle size={14} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '11.5px', color: '#92400e' }}>Token expires in <strong>{account.expiresInDays} days</strong>. Refresh required.</span>
                  </div>
                )}
                {account.status === 'failed' && (
                  <div style={{ margin: '0 14px', padding: '8px 10px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid #fecaca', display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '6px' }}>
                    <AlertTriangle size={14} color="#dc2626" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '11.5px', color: '#991b1b' }}>Connection failed. Reconnection required.</span>
                  </div>
                )}

                {/* Metrics Row */}
                <div style={{ padding: '0 14px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { label: 'Followers', value: formatCompactNumber(account.metrics?.followers || 0) },
                    { label: 'Engagement', value: `${account.metrics?.engagementRate || 0}%` },
                    { label: 'Posts / mo.', value: account.metrics?.postsThisMonth ?? '—' },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{m.value}</div>
                      <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Token & Sync Row */}
                <div style={{
                  padding: '10px 14px', borderTop: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Key size={11} color="#94a3b8" />
                      {account.tokenType}
                    </span>
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>•</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {account.apiVersion}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
                    <Users size={11} color="#94a3b8" />
                    <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Action Footer */}
                <div style={{
                  padding: '10px 14px', borderTop: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => setDrawerAccount(account)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px',
                      fontWeight: 600, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer'
                    }}
                  >
                    <ExternalLink size={13} />
                    <span>Manage</span>
                  </button>

                  {account.status !== 'connected' ? (
                    <Button variant="primary" size="sm" icon={<RotateCcw size={13} />} onClick={() => reconnectAccount(account.id)}>
                      Reconnect
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" icon={<RefreshCw size={13} />} onClick={() => refreshAccount(account.id)}>
                      Sync
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Account Detail Drawer ── */}
      {drawerAccount && (
        <AccountDrawer
          account={drawerAccount}
          onClose={() => setDrawerAccount(null)}
        />
      )}

      <ConnectAccountModal />
    </div>
  );
};
