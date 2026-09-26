import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Building2, Users, Mail, Shield, Settings, LogOut,
  Plus, Sparkles, ChevronDown, ChevronRight, Trash2, Edit3, RefreshCw,
  CheckCircle2, Clock, XCircle, AlertCircle, Globe, Layers, UserPlus,
  Briefcase, BarChart3, Check, X, Eye, Send, MoreHorizontal, Lock
} from 'lucide-react';
import { UserRole, MemberInvitation, Brand, TeamMember } from '../../types';

// ─── Sidebar ───────────────────────────────────────────────────────────────

const ADMIN_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
  { id: 'brands', label: 'Brands', icon: <Layers size={16} /> },
  { id: 'members', label: 'Members', icon: <Users size={16} /> },
  { id: 'invitations', label: 'Invitations', icon: <Mail size={16} /> },
  { id: 'social', label: 'Social Accounts', icon: <Globe size={16} /> },
  { id: 'roles', label: 'Roles & Permissions', icon: <Shield size={16} /> },
  { id: 'org-settings', label: 'Organization Settings', icon: <Settings size={16} /> },
];

const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  Owner:       { bg: 'rgba(99,102,241,0.12)',  text: '#4f46e5' },
  Admin:       { bg: 'rgba(234,88,12,0.12)',   text: '#ea580c' },
  Manager:     { bg: 'rgba(37,99,235,0.12)',   text: '#2563eb' },
  Editor:      { bg: 'rgba(16,185,129,0.12)',  text: '#059669' },
  Contributor: { bg: 'rgba(202,138,4,0.12)',   text: '#b45309' },
  Analyst:     { bg: 'rgba(139,92,246,0.12)',  text: '#7c3aed' },
  Client:      { bg: 'rgba(100,116,139,0.12)', text: '#475569' },
};

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const c = ROLE_COLORS[role] || { bg: '#f1f5f9', text: '#64748b' };
  return (
    <span style={{
      fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '5px',
      background: c.bg, color: c.text, letterSpacing: '0.02em'
    }}>{role}</span>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    active:    { bg: 'rgba(16,185,129,0.1)', text: '#059669', label: 'Active' },
    invited:   { bg: 'rgba(234,179,8,0.1)',  text: '#b45309', label: 'Invited' },
    pending:   { bg: 'rgba(234,179,8,0.1)',  text: '#b45309', label: 'Pending' },
    accepted:  { bg: 'rgba(16,185,129,0.1)', text: '#059669', label: 'Accepted' },
    expired:   { bg: 'rgba(239,68,68,0.1)',  text: '#dc2626', label: 'Expired' },
    cancelled: { bg: 'rgba(100,116,139,0.1)', text: '#475569', label: 'Cancelled' },
    suspended: { bg: 'rgba(239,68,68,0.1)',  text: '#dc2626', label: 'Suspended' },
  };
  const s = map[status] || { bg: '#f1f5f9', text: '#64748b', label: status };
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '5px',
      background: s.bg, color: s.text
    }}>{s.label}</span>
  );
};

// ─── Invite Modal ───────────────────────────────────────────────────────────

const InviteModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { orgBrands, currentOrgId, organization, inviteMember } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Editor');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev => prev.includes(brandId) ? prev.filter(b => b !== brandId) : [...prev, brandId]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { setError('Name and email are required.'); return; }
    if (selectedBrands.length === 0) { setError('Select at least one brand.'); return; }
    setSending(true);
    setError('');
    setTimeout(() => {
      const result = inviteMember({ name: name.trim(), email: email.trim(), organizationId: currentOrgId, brandIds: selectedBrands, role });
      setSending(false);
      if (result.success) {
        setSent(true);
        setTimeout(onClose, 1800);
      } else {
        setError(result.error || 'Failed to send invitation.');
      }
    }, 600);
  };

  const ROLES: UserRole[] = ['Manager', 'Editor', 'Contributor', 'Analyst', 'Client'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '540px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}>
          <X size={16} color="#64748b" />
        </button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={32} color="#059669" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Invitation Sent!</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              {name} will receive an email at <strong>{email}</strong> with instructions to create their account.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={18} color="white" />
                </div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Invite Member</h2>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                Invite a member to <strong>{organization.name}</strong>. They'll receive an email to create their password.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Full Name *</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Sarah Jenkins" required
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Email Address *</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="sarah@example.com" required
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Role *</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ROLES.map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      style={{ padding: '6px 14px', borderRadius: '8px', border: `1.5px solid ${role === r ? '#4f46e5' : '#e2e8f0'}`,
                        background: role === r ? 'rgba(79,70,229,0.08)' : '#fff', color: role === r ? '#4f46e5' : '#64748b',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Brand Access * (select one or more)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto', padding: '2px' }}>
                  {orgBrands.map(brand => (
                    <label key={brand.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', border: `1.5px solid ${selectedBrands.includes(brand.id) ? '#4f46e5' : '#e2e8f0'}`, borderRadius: '10px', cursor: 'pointer', background: selectedBrands.includes(brand.id) ? 'rgba(79,70,229,0.05)' : '#fff' }}>
                      <input type="checkbox" checked={selectedBrands.includes(brand.id)} onChange={() => toggleBrand(brand.id)}
                        style={{ accentColor: '#4f46e5', width: '14px', height: '14px' }} />
                      <img src={brand.logo} alt={brand.name} style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={sending}
                  style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: sending ? 0.7 : 1 }}>
                  {sending ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={14} />}
                  {sending ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Add Brand Modal ────────────────────────────────────────────────────────

const AddBrandModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { createBrand } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [timezone, setTimezone] = useState('America/New_York (EST)');
  const [industry, setIndustry] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const timezones = ['America/New_York (EST)', 'America/Los_Angeles (PST)', 'America/Chicago (CST)', 'America/Denver (MST)', 'Europe/London (GMT)', 'Europe/Paris (CET)', 'Asia/Kolkata (IST)', 'Asia/Tokyo (JST)', 'Australia/Sydney (AEDT)'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Brand name is required.'); return; }
    setCreating(true); setError('');
    setTimeout(() => {
      const result = createBrand({ name: name.trim(), description, website, timezone, industry, color });
      setCreating(false);
      if (result.success) onClose();
      else setError(result.error || 'Failed to create brand.');
    }, 400);
  };

  const COLORS = ['#6366f1', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#16a34a', '#0891b2', '#0284c7', '#0f172a'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '500px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}>
          <X size={16} color="#64748b" />
        </button>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Create New Brand</h2>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Add a new brand to this organization to manage its social accounts, content, and members separately.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Brand Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. GreenLeaf Restaurant" required
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of this brand..." rows={2}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Website</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://brand.com"
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Industry</label>
              <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Retail, Food & Beverage"
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Timezone</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
              {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Brand Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: color === c ? `3px solid ${c}` : '2px solid transparent', outline: color === c ? '2px solid #e2e8f0' : 'none', cursor: 'pointer' }} />
              ))}
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer' }} />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={creating}
              style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', opacity: creating ? 0.7 : 1 }}>
              {creating ? 'Creating...' : 'Create Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Overview Tab ───────────────────────────────────────────────────────────

const OverviewTab: React.FC = () => {
  const { organization, orgBrands, orgMembers, orgInvitations, allSocialAccounts, navigateTo, adminActiveTab: _, setAdminActiveTab } = useApp();
  const pendingInvitations = orgInvitations.filter(i => i.status === 'pending').length;
  const totalSocialAccounts = allSocialAccounts.filter(a => orgBrands.some(b => b.id === a.brandId)).length;

  const metrics = [
    { label: 'Total Brands', value: orgBrands.length, icon: <Layers size={20} />, color: '#4f46e5', bg: 'rgba(79,70,229,0.1)', action: 'brands' },
    { label: 'Organization Members', value: orgMembers.length, icon: <Users size={20} />, color: '#0891b2', bg: 'rgba(8,145,178,0.1)', action: 'members' },
    { label: 'Pending Invitations', value: pendingInvitations, icon: <Mail size={20} />, color: '#d97706', bg: 'rgba(217,119,6,0.1)', action: 'invitations' },
    { label: 'Social Accounts', value: totalSocialAccounts, icon: <Globe size={20} />, color: '#059669', bg: 'rgba(5,150,105,0.1)', action: 'social' },
  ];

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Admin Overview</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
          Managing <strong>{organization.name}</strong> — {organization.plan} Plan
        </p>
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {metrics.map(m => (
          <div key={m.label} onClick={() => setAdminActiveTab(m.action)}
            style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'all 200ms ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${m.color}20`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, marginBottom: '16px' }}>{m.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Brand overview */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Brand Overview</h2>
          <button onClick={() => setAdminActiveTab('brands')} style={{ fontSize: '13px', color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Manage Brands →</button>
        </div>
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orgBrands.map(brand => {
            const brandAccounts = allSocialAccounts.filter(a => a.brandId === brand.id);
            const brandMembersCount = orgMembers.filter(m => m.brandId === brand.id).length;
            return (
              <div key={brand.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#fafafa' }}>
                <img src={brand.logo} alt={brand.name} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{brand.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{brand.industry}</div>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                  <span><Globe size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />{brandAccounts.length} accounts</span>
                  <span><Users size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />{brandMembersCount} members</span>
                </div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: brand.color || '#6366f1' }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent invitations */}
      {orgInvitations.filter(i => i.status === 'pending').length > 0 && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', marginTop: '16px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Pending Invitations</h2>
            <button onClick={() => setAdminActiveTab('invitations')} style={{ fontSize: '13px', color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All →</button>
          </div>
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {orgInvitations.filter(i => i.status === 'pending').slice(0, 3).map(inv => (
              <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', border: '1px solid #fef3c7', background: '#fffbeb' }}>
                <Mail size={14} color="#d97706" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{inv.name}</span>
                  <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>{inv.email}</span>
                </div>
                <RoleBadge role={inv.role} />
                <StatusBadge status={inv.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Brands Tab ─────────────────────────────────────────────────────────────

const BrandsTab: React.FC = () => {
  const { orgBrands, orgMembers, allSocialAccounts, deleteBrand, switchBrand, navigateTo } = useApp();
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div style={{ padding: '32px' }}>
      {showAddBrand && <AddBrandModal onClose={() => setShowAddBrand(false)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Brands</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{orgBrands.length} brand{orgBrands.length !== 1 ? 's' : ''} in this organization</p>
        </div>
        <button onClick={() => setShowAddBrand(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={16} /> Add Brand
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {orgBrands.map(brand => {
          const brandAccounts = allSocialAccounts.filter(a => a.brandId === brand.id);
          const brandMembersCount = orgMembers.filter(m => m.brandId === brand.id).length;
          return (
            <div key={brand.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              {/* Color stripe */}
              <div style={{ height: '4px', background: brand.color || '#6366f1' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                  <img src={brand.logo} alt={brand.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{brand.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{brand.industry}</div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{brand.description}</p>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{brandAccounts.length}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Social Accounts</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{brandMembersCount}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Members</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{brand.postCount || 0}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Posts</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { switchBrand(brand.id); navigateTo('/app'); }}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                    Manage Brand
                  </button>
                  {confirmDelete === brand.id ? (
                    <>
                      <button onClick={() => { deleteBrand(brand.id); setConfirmDelete(null); }}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Confirm Delete</button>
                      <button onClick={() => setConfirmDelete(null)}
                        style={{ padding: '8px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmDelete(brand.id)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #fee2e2', background: '#fff', color: '#dc2626', fontSize: '12px', cursor: 'pointer' }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Members Tab ─────────────────────────────────────────────────────────────

const MembersTab: React.FC = () => {
  const { orgMembers, orgBrands, removeMemberFromOrg, updateMemberRole } = useApp();
  const [showInvite, setShowInvite] = useState(false);
  const [search, setSearch] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const ROLES: UserRole[] = ['Owner', 'Admin', 'Manager', 'Editor', 'Contributor', 'Analyst', 'Client'];

  const filtered = orgMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  // Deduplicate by email + role (a member might appear in multiple brands)
  const unique = filtered.filter((m, idx, self) => self.findIndex(s => s.id === m.id) === idx);

  const getBrandName = (brandId: string) => orgBrands.find(b => b.id === brandId)?.name || brandId;

  return (
    <div style={{ padding: '32px' }}>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Members</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{unique.length} member{unique.length !== 1 ? 's' : ''} across all brands</p>
        </div>
        <button onClick={() => setShowInvite(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members by name, email, or role..."
          style={{ width: '100%', padding: '11px 16px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              {['Member', 'Email', 'Brand', 'Role', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {unique.map((m, idx) => (
              <tr key={m.id} style={{ borderBottom: idx < unique.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={m.avatar} alt={m.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{m.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{m.email}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569' }}>{getBrandName(m.brandId)}</td>
                <td style={{ padding: '14px 16px' }}>
                  {editingRole === m.id ? (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <select defaultValue={m.role} onChange={e => { updateMemberRole(m.id, e.target.value as UserRole); setEditingRole(null); }}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #4f46e5', fontSize: '12px', outline: 'none' }}
                        autoFocus>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <button onClick={() => setEditingRole(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={13} color="#64748b" /></button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RoleBadge role={m.role} />
                      <button onClick={() => setEditingRole(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}><Edit3 size={12} color="#64748b" /></button>
                    </div>
                  )}
                </td>
                <td style={{ padding: '14px 16px' }}><StatusBadge status={m.status} /></td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => removeMemberFromOrg(m.id)}
                    style={{ padding: '5px 10px', borderRadius: '7px', border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {unique.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>No members found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Invitations Tab ─────────────────────────────────────────────────────────

const InvitationsTab: React.FC = () => {
  const { orgInvitations, orgBrands, resendInvitation, cancelInvitation } = useApp();
  const [showInvite, setShowInvite] = useState(false);

  const getBrandNames = (brandIds: string[]) => brandIds.map(id => orgBrands.find(b => b.id === id)?.name || id).join(', ');

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return iso; }
  };

  return (
    <div style={{ padding: '32px' }}>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Invitations</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{orgInvitations.filter(i => i.status === 'pending').length} pending invitation{orgInvitations.filter(i => i.status === 'pending').length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowInvite(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          <UserPlus size={16} /> New Invitation
        </button>
      </div>

      {/* Info box about secure flow */}
      <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.06), rgba(124,58,237,0.06))', border: '1px solid rgba(79,70,229,0.15)', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Lock size={16} color="#4f46e5" style={{ marginTop: '1px', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#4f46e5', marginBottom: '2px' }}>Secure Invitation Flow</div>
          <div style={{ fontSize: '12px', color: '#475569' }}>
            Members receive an email with a secure link to create their own password. Admin never sees or sets user passwords. Invitations expire after 7 days.
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              {['Recipient', 'Role', 'Brand(s)', 'Invited By', 'Expires', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orgInvitations.map((inv, idx) => (
              <tr key={inv.id} style={{ borderBottom: idx < orgInvitations.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{inv.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{inv.email}</div>
                </td>
                <td style={{ padding: '14px 16px' }}><RoleBadge role={inv.role} /></td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569', maxWidth: '180px' }}>
                  <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{getBrandNames(inv.brandIds)}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{inv.invitedBy}</td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b' }}>{formatDate(inv.expiresAt)}</td>
                <td style={{ padding: '14px 16px' }}><StatusBadge status={inv.status} /></td>
                <td style={{ padding: '14px 16px' }}>
                  {inv.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => resendInvitation(inv.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '7px', border: '1px solid #e2e8f0', background: '#fff', color: '#4f46e5', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        <RefreshCw size={11} /> Resend
                      </button>
                      <button onClick={() => cancelInvitation(inv.id)}
                        style={{ padding: '5px 10px', borderRadius: '7px', border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  )}
                  {inv.status !== 'pending' && (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {orgInvitations.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>No invitations yet. Start by inviting a team member.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Social Accounts Tab ─────────────────────────────────────────────────────

const SocialAccountsTab: React.FC = () => {
  const { orgBrands, allSocialAccounts } = useApp();
  const orgAccountIds = orgBrands.map(b => b.id);
  const orgAccounts = allSocialAccounts.filter(a => orgAccountIds.includes(a.brandId));

  const PLATFORM_COLORS: Record<string, string> = {
    instagram: '#e1306c', facebook: '#1877f2', linkedin: '#0a66c2',
    tiktok: '#010101', youtube: '#ff0000'
  };

  const getBrandName = (brandId: string) => orgBrands.find(b => b.id === brandId)?.name || brandId;

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Social Accounts</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{orgAccounts.length} connected accounts across all brands</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {orgAccounts.map(acc => {
          const platColor = PLATFORM_COLORS[acc.platform] || '#64748b';
          const statusBg = acc.status === 'connected' ? 'rgba(5,150,105,0.1)' : acc.status === 'expiring' ? 'rgba(217,119,6,0.1)' : 'rgba(239,68,68,0.1)';
          const statusColor = acc.status === 'connected' ? '#059669' : acc.status === 'expiring' ? '#d97706' : '#dc2626';
          return (
            <div key={acc.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ height: '3px', background: platColor }} />
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <img src={acc.avatar} alt={acc.name} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{acc.username}</div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: statusBg, color: statusColor, textTransform: 'capitalize' }}>{acc.status}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: 600, color: platColor }}>{acc.platform}</span>
                  <span>{getBrandName(acc.brandId)}</span>
                </div>
                {acc.metrics && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '12px', borderTop: '1px solid #f8fafc', paddingTop: '10px' }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{acc.metrics.followers.toLocaleString()}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Followers</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{acc.metrics.engagementRate}%</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Engagement</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Roles & Permissions Tab ──────────────────────────────────────────────────

const RolesTab: React.FC = () => {
  const ROLES_INFO: { role: UserRole; description: string; color: string; capabilities: string[] }[] = [
    { role: 'Owner', description: 'Full control over the organization', color: '#4f46e5', capabilities: ['Manage organization settings', 'Create/delete brands', 'Invite & manage all members', 'Connect/disconnect social accounts', 'Full publishing & analytics access'] },
    { role: 'Admin', description: 'Organization administration', color: '#ea580c', capabilities: ['Manage brands', 'Invite members', 'Assign roles', 'Manage social accounts', 'Full publishing & analytics access'] },
    { role: 'Manager', description: 'Brand-level management', color: '#2563eb', capabilities: ['Manage brand content', 'Approve & reject posts', 'Schedule & publish content', 'View analytics', 'Manage media library'] },
    { role: 'Editor', description: 'Content creation and editing', color: '#059669', capabilities: ['Create & edit content', 'Submit for approval', 'Schedule posts', 'Upload media', 'View analytics'] },
    { role: 'Contributor', description: 'Draft content creation', color: '#b45309', capabilities: ['Create draft content', 'Upload media', 'View calendar', 'Submit for review'] },
    { role: 'Analyst', description: 'Analytics access only', color: '#7c3aed', capabilities: ['View analytics dashboard', 'View post performance', 'View follower metrics', 'View impressions & reach'] },
    { role: 'Client', description: 'Content review & approval', color: '#475569', capabilities: ['Review submitted content', 'Approve or request changes', 'View published content', 'View brand calendar'] },
  ];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Roles & Permissions</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Predefined role hierarchy — roles are automatically scoped to organization or brand level</p>
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.06), rgba(124,58,237,0.06))', border: '1px solid rgba(79,70,229,0.15)', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Shield size={16} color="#4f46e5" style={{ marginTop: '1px', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#4f46e5', marginBottom: '2px' }}>Predefined Role System</div>
          <div style={{ fontSize: '12px', color: '#475569' }}>
            Roles are fixed and cannot be customized. Owner and Admin operate at organization level; Manager, Editor, Contributor, Analyst, and Client operate at brand level. Role permissions are enforced server-side.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
        {ROLES_INFO.map(r => (
          <div key={r.role} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ height: '3px', background: r.color }} />
            <div style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={16} color={r.color} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{r.role}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{r.description}</div>
                </div>
              </div>
              <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {r.capabilities.map(cap => (
                  <li key={cap} style={{ fontSize: '12px', color: '#475569' }}>{cap}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Organization Settings Tab ────────────────────────────────────────────────

const OrgSettingsTab: React.FC = () => {
  const { organization, organizations, currentOrgId, updateOrganization, switchOrganization, currentUser } = useApp();
  const [name, setName] = useState(organization.name);
  const [website, setWebsite] = useState(organization.website);
  const [industry, setIndustry] = useState(organization.industry);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateOrganization({ name: name.trim(), website: website.trim(), industry: industry.trim() });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 500);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '680px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Organization Settings</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Manage your organization information and preferences</p>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '28px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>General Information</h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Organization Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Website</label>
            <input value={website} onChange={e => setWebsite(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Industry</label>
            <input value={industry} onChange={e => setIndustry(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="submit" disabled={saving}
              style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: saved ? '#059669' : 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: saving ? 0.7 : 1 }}>
              {saved ? <><CheckCircle2 size={15} /> Saved!</> : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Plan Info */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '28px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Current Plan</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(79,70,229,0.07), rgba(124,58,237,0.07))', border: '1px solid rgba(79,70,229,0.12)' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#4f46e5', marginBottom: '2px' }}>{organization.plan}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Current subscription plan</div>
          </div>
        </div>
      </div>

      {/* Organization ID */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '28px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>Organization ID</h2>
        <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <code style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>{organization.id}</code>
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#94a3b8' }}>Use this ID for API integrations and webhooks.</p>
      </div>
    </div>
  );
};

// ─── Main Admin Portal ────────────────────────────────────────────────────────

export const AdminPortal: React.FC = () => {
  const { currentUser, organization, organizations, currentOrgId, switchOrganization, logout, navigateTo, adminActiveTab, setAdminActiveTab } = useApp();

  // RBAC guard: only Owner and Admin can access Admin Portal
  if (currentUser.role !== 'Owner' && currentUser.role !== 'Admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', gap: '16px', textAlign: 'center', padding: '40px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={32} color="#ef4444" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Admin Portal Restricted</h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0, maxWidth: '380px' }}>
          The Admin Portal is only accessible to <strong>Owner</strong> and <strong>Admin</strong> roles.
          Your current role is <strong>{currentUser.role}</strong>.
        </p>
        <button onClick={() => navigateTo('/app')}
          style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          Go to Application →
        </button>
      </div>
    );
  }

  const renderTab = () => {
    switch (adminActiveTab) {
      case 'overview':     return <OverviewTab />;
      case 'brands':       return <BrandsTab />;
      case 'members':      return <MembersTab />;
      case 'invitations':  return <InvitationsTab />;
      case 'social':       return <SocialAccountsTab />;
      case 'roles':        return <RolesTab />;
      case 'org-settings': return <OrgSettingsTab />;
      default:             return <OverviewTab />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#fff', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={17} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>AuraSocial</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Portal</div>
            </div>
          </div>

          {/* Org Switcher */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Organization</div>
            <select value={currentOrgId} onChange={e => switchOrganization(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#0f172a', background: '#fff', outline: 'none', cursor: 'pointer' }}>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
          {ADMIN_NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setAdminActiveTab(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px',
                border: 'none', background: adminActiveTab === item.id ? 'rgba(79,70,229,0.08)' : 'transparent',
                color: adminActiveTab === item.id ? '#4f46e5' : '#64748b', fontSize: '14px', fontWeight: adminActiveTab === item.id ? 700 : 500,
                cursor: 'pointer', marginBottom: '2px', textAlign: 'left', transition: 'all 150ms ease'
              }}>
              <span style={{ color: adminActiveTab === item.id ? '#4f46e5' : '#94a3b8' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #f1f5f9' }}>
          {/* Switch to App */}
          <button onClick={() => navigateTo('/app')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', border: 'none', background: 'rgba(79,70,229,0.06)', color: '#4f46e5', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginBottom: '4px' }}>
            <BarChart3 size={15} /> Open Application
          </button>
          {/* Current user */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700 }}>
              {currentUser.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{currentUser.role}</div>
            </div>
          </div>
          <button onClick={logout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', border: 'none', background: 'transparent', color: '#ef4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>
        {renderTab()}
      </main>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminPortal;
