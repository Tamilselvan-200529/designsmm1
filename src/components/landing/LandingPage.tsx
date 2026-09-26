import React, { useState, useEffect } from 'react';
import {
  Sparkles, ArrowRight, Menu, X, CheckCircle2, Building2, Users,
  BarChart3, Shield, Zap, Globe, ChevronRight, Play, Star, TrendingUp,
  Clock, Eye, Lock, Bell, Layers, GitBranch, UserCheck,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

const InstagramIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="ig-grad-lp" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#F58529" />
        <stop offset="30%" stopColor="#DD2A7B" />
        <stop offset="65%" stopColor="#8134AF" />
        <stop offset="100%" stopColor="#515BD4" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#ig-grad-lp)" />
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="#1877F2" style={{ width: '100%', height: '100%' }}>
    <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.791-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z" />
  </svg>
);

const LinkedInIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="#0A66C2" style={{ width: '100%', height: '100%' }}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TikTokIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.99a8.18 8.18 0 004.77 1.53V7.07a4.85 4.85 0 01-1.01-.38z" />
  </svg>
);

const YouTubeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="#FF0000" style={{ width: '100%', height: '100%' }}>
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const getPlatformIcon = (name: string): React.ReactNode => {
  switch (name) {
    case 'Instagram': return <InstagramIcon />;
    case 'Facebook': return <FacebookIcon />;
    case 'LinkedIn': return <LinkedInIcon />;
    case 'TikTok': return <TikTokIcon />;
    case 'YouTube': return <YouTubeIcon />;
    default: return null;
  }
};

const RoleBadge: React.FC<{
  role: string; description: string; color: string; bg: string; permissions: string[];
}> = ({ role, description, color, bg, permissions }) => (
  <div
    style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'all 220ms ease', cursor: 'default' }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
  >
    <div style={{ background: bg, color, borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, display: 'inline-block' }}>{role}</div>
    <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>{description}</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {permissions.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
          <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0 }} />{p}
        </div>
      ))}
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onNavigateToSignup }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const platforms = [
    { name: 'Instagram', color: '#E1306C', bg: '#fdf2f8', users: '2B+ users' },
    { name: 'Facebook', color: '#1877F2', bg: '#eff6ff', users: '3B+ users' },
    { name: 'LinkedIn', color: '#0A66C2', bg: '#f0f7ff', users: '950M+ users' },
    { name: 'TikTok', color: '#000000', bg: '#f4f4f5', users: '1B+ users' },
    { name: 'YouTube', color: '#FF0000', bg: '#fef2f2', users: '2.7B+ users' },
  ];

  const roles = [
    { role: 'Owner', description: 'Full control over the organization, billing, and all brands.', color: '#7c3aed', bg: '#f5f3ff', permissions: ['Manage organization', 'Manage billing', 'All brand access'] },
    { role: 'Admin', description: 'Manage brands, members, invitations, and social accounts.', color: '#1d4ed8', bg: '#dbeafe', permissions: ['Create & edit brands', 'Invite members', 'Assign roles'] },
    { role: 'Manager', description: 'Oversee content workflows and approve or reject posts.', color: '#059669', bg: '#d1fae5', permissions: ['Approve/reject posts', 'Manage schedule', 'View analytics'] },
    { role: 'Editor', description: 'Create, edit, and submit posts for approval.', color: '#b45309', bg: '#fef3c7', permissions: ['Create content', 'Edit drafts', 'Submit for approval'] },
    { role: 'Contributor', description: 'Create draft content and upload media assets.', color: '#0891b2', bg: '#cffafe', permissions: ['Create drafts', 'Upload media', 'View content'] },
    { role: 'Analyst', description: 'View analytics and performance reports only.', color: '#4f46e5', bg: '#eef2ff', permissions: ['View dashboard', 'View analytics', 'Export reports'] },
    { role: 'Client', description: 'Review and approve content before publishing.', color: '#be185d', bg: '#fce7f3', permissions: ['View posts', 'Client approval', 'View analytics'] },
  ];

  const approvalSteps = [
    { label: 'Draft', icon: <Layers size={16} />, color: '#64748b', bg: '#f1f5f9', desc: 'Content created and saved as draft' },
    { label: 'Manager Review', icon: <Eye size={16} />, color: '#1d4ed8', bg: '#dbeafe', desc: 'Manager reviews for quality and accuracy' },
    { label: 'Client Approval', icon: <UserCheck size={16} />, color: '#b45309', bg: '#fef3c7', desc: 'Client gives final sign-off before publishing' },
    { label: 'Scheduled', icon: <Clock size={16} />, color: '#059669', bg: '#d1fae5', desc: 'Post queued and scheduled to go live' },
    { label: 'Published', icon: <Zap size={16} />, color: '#15803d', bg: '#dcfce7', desc: 'Published live to social networks' },
  ];

  const primaryBtnStyle: React.CSSProperties = {
    padding: '15px 30px', fontSize: '16px', fontWeight: 700, color: 'white',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', cursor: 'pointer',
    borderRadius: '12px', boxShadow: '0 6px 20px rgba(79,70,229,0.4)',
    transition: 'all 220ms ease', display: 'inline-flex', alignItems: 'center', gap: '8px',
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif", color: '#0f172a', background: '#ffffff', overflowX: 'hidden' }}>

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .lp-nav-links { display: flex !important; }
        .lp-nav-cta { display: flex !important; }
        .lp-hamburger { display: none !important; }
        .lp-two-col { grid-template-columns: 1fr 1fr !important; }
        .lp-brands-grid { grid-template-columns: repeat(3,1fr) !important; }
        .lp-analytics-grid { grid-template-columns: repeat(5,1fr) !important; }
        .lp-footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr 1fr !important; }
        .lp-steps { flex-direction: row !important; }
        .lp-step-arrow { display: flex !important; }
        @media (max-width: 1024px) {
          .lp-footer-grid { grid-template-columns: 1fr 1fr 1fr !important; }
          .lp-analytics-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media (max-width: 768px) {
          .lp-nav-links { display: none !important; }
          .lp-nav-cta { display: none !important; }
          .lp-hamburger { display: flex !important; }
          .lp-two-col { grid-template-columns: 1fr !important; gap: 40px !important; }
          .lp-brands-grid { grid-template-columns: 1fr !important; }
          .lp-analytics-grid { grid-template-columns: repeat(2,1fr) !important; }
          .lp-footer-grid { grid-template-columns: 1fr 1fr !important; }
          .lp-steps { flex-direction: column !important; align-items: center; }
          .lp-step-arrow { display: none !important; }
        }
        @media (max-width: 480px) {
          .lp-analytics-grid { grid-template-columns: 1fr !important; }
          .lp-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, backgroundColor: isScrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0)', backdropFilter: isScrolled ? 'blur(20px)' : 'none', borderBottom: isScrolled ? '1px solid rgba(226,232,240,0.8)' : '1px solid transparent', transition: 'all 300ms ease', boxShadow: isScrolled ? '0 1px 20px rgba(15,23,42,0.06)' : 'none' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: '68px', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(79,70,229,0.35)' }}><Sparkles size={19} /></div>
            <span style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>AuraSocial</span>
          </div>
          <div className="lp-nav-links" style={{ alignItems: 'center', gap: '2px', flex: 1, marginLeft: '24px' }}>
            {['Features', 'Solutions', 'Resources', 'Pricing'].map(item => (
              <button key={item} style={{ padding: '8px 14px', fontSize: '14px', fontWeight: 500, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'all 150ms ease' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.background = '#f5f3ff'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'none'; }}
              >{item}</button>
            ))}
          </div>
          <div className="lp-nav-cta" style={{ alignItems: 'center', gap: '10px' }}>
            <button onClick={onNavigateToLogin} style={{ padding: '9px 18px', fontSize: '14px', fontWeight: 600, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'all 150ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#4f46e5'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
            >Log In</button>
            <button onClick={onNavigateToSignup} style={{ padding: '9px 20px', fontSize: '14px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', cursor: 'pointer', borderRadius: '10px', boxShadow: '0 4px 12px rgba(79,70,229,0.3)', transition: 'all 200ms ease', display: 'flex', alignItems: 'center', gap: '6px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(79,70,229,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)'; }}
            >Get Started <ArrowRight size={14} /></button>
          </div>
          <button className="lp-hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ marginLeft: 'auto', padding: '8px', color: '#475569', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px' }}>
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 8px 24px rgba(15,23,42,0.12)' }}>
            {['Features', 'Solutions', 'Resources', 'Pricing'].map(item => (
              <button key={item} style={{ padding: '12px 16px', fontSize: '15px', fontWeight: 500, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }}>{item}</button>
            ))}
            <div style={{ height: '1px', background: '#f1f5f9', margin: '8px 0' }} />
            <button onClick={() => { onNavigateToLogin(); setIsMobileMenuOpen(false); }} style={{ padding: '12px 16px', fontSize: '15px', fontWeight: 600, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }}>Log In</button>
            <button onClick={() => { onNavigateToSignup(); setIsMobileMenuOpen(false); }} style={{ padding: '14px 20px', fontSize: '15px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', cursor: 'pointer', borderRadius: '10px', textAlign: 'center', marginTop: '4px' }}>Get Started Free</button>
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fafbff 0%, #f5f3ff 40%, #fdf2f8 80%, #fafbff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '15%', left: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', width: '100%', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '100px', padding: '6px 16px', fontSize: '12.5px', fontWeight: 700, color: '#4f46e5', marginBottom: '28px', letterSpacing: '0.02em' }}>
            <Sparkles size={13} /> Social Media Management Platform
          </div>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 900, color: '#0f172a', lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: '24px', maxWidth: '820px', margin: '0 auto 24px' }}>
            Manage Every Brand.{' '}
            <span style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Every Social Channel.</span>
            {' '}From One Place.
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#475569', lineHeight: 1.65, maxWidth: '580px', margin: '0 auto 40px', fontWeight: 400 }}>
            Plan, create, schedule, approve, publish, and analyze social media content across multiple brands and social accounts — with one organized workspace.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '52px' }}>
            <button style={primaryBtnStyle} onClick={onNavigateToSignup}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(79,70,229,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.4)'; }}
            >Get Started Free <ArrowRight size={17} /></button>
            <button style={{ padding: '14px 26px', fontSize: '15px', fontWeight: 600, color: '#4f46e5', background: 'white', border: '2px solid #c7d2fe', cursor: 'pointer', borderRadius: '12px', transition: 'all 220ms ease', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.transform = 'translateY(0)'; }}
            ><Play size={15} style={{ fill: '#4f46e5' }} /> See How It Works</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px', flexWrap: 'wrap', marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex' }}>{['#818cf8','#a78bfa','#c4b5fd','#f0abfc','#fda4af'].map((c,i) => <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i > 0 ? '-8px' : 0 }} />)}</div>
              <span style={{ fontSize: '13.5px', color: '#64748b', fontWeight: 500 }}><strong style={{ color: '#0f172a' }}>2,400+</strong> teams worldwide</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}<span style={{ fontSize: '13.5px', color: '#64748b' }}><strong style={{ color: '#0f172a' }}>4.9/5</strong> rating</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={15} color="#10b981" /><span style={{ fontSize: '13.5px', color: '#64748b' }}>No credit card required</span></div>
          </div>

          {/* Dashboard Mockup */}
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 30px 80px rgba(15,23,42,0.15), 0 0 0 1px rgba(226,232,240,0.6)', overflow: 'hidden', maxWidth: '980px', margin: '0 auto' }}>
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fca5a5' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fde68a' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a7f3d0' }} />
              <div style={{ flex: 1, margin: '0 16px', background: '#eef2ff', borderRadius: '6px', padding: '5px 12px', fontSize: '11px', color: '#64748b', textAlign: 'center' }}>app.aurasocial.io — GreenLeaf Restaurant</div>
            </div>
            <div style={{ display: 'flex', minHeight: '380px', background: '#fafbff' }}>
              <div style={{ width: '200px', background: 'white', borderRight: '1px solid #f1f5f9', padding: '16px 12px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#eef2ff', color: '#4f46e5', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <BarChart3 size={14} /> Dashboard
                </div>
                {['Calendar', 'Scheduled Posts', 'Content', 'Approvals', 'Analytics'].map(l => (
                  <div key={l} style={{ padding: '7px 12px', borderRadius: '8px', color: '#64748b', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />{l}
                  </div>
                ))}
                <div style={{ marginTop: 'auto', padding: '10px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Organization</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>Acme Digital Agency</div>
                  <div style={{ fontSize: '10px', color: '#4f46e5', fontWeight: 600, marginTop: '2px' }}>GreenLeaf Restaurant ▼</div>
                </div>
              </div>
              <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {[{l:'Followers',v:'48.2K',t:'↑ 12.4%',c:'#10b981'},{l:'Posts/Month',v:'34',t:'↑ 8 new',c:'#4f46e5'},{l:'Engagement',v:'4.8%',t:'↑ 0.6%',c:'#7c3aed'},{l:'Reach',v:'112K',t:'↑ 18%',c:'#ec4899'}].map(s => (
                    <div key={s.l} style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', boxShadow: '0 1px 6px rgba(15,23,42,0.06)', border: '1px solid #f1f5f9', minWidth: '110px', flex: 1 }}>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{s.v}</div>
                      <div style={{ fontSize: '11px', color: s.c, fontWeight: 600, marginTop: '2px' }}>{s.t}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Upcoming Posts</div>
                    {[
                      {pl:'Instagram',time:'Today 3:00 PM',status:'Scheduled',sc:'#1d4ed8',sb:'#dbeafe',content:'Discover our new seasonal menu. Fresh ingredients, bold flavors. 🌿'},
                      {pl:'Facebook',time:'Tomorrow 10:00 AM',status:'Pending Review',sc:'#b45309',sb:'#fef3c7',content:'Join us this weekend for our farm-to-table brunch experience.'},
                    ].map((p,i) => (
                      <div key={i} style={{ background: 'white', borderRadius: '9px', padding: '10px 12px', boxShadow: '0 1px 4px rgba(15,23,42,0.05)', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '16px', height: '16px' }}>{getPlatformIcon(p.pl)}</div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>{p.pl}</span>
                          </div>
                          <span style={{ fontSize: '10px', background: p.sb, color: p.sc, padding: '1px 7px', borderRadius: '20px', fontWeight: 600 }}>{p.status}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>{p.content}</p>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={9} />{p.time}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ width: '155px', flexShrink: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>Approvals</div>
                    {[{l:'Awaiting Review',n:'3',c:'#b45309',b:'#fef3c7'},{l:'Client Approval',n:'1',c:'#7c3aed',b:'#f5f3ff'},{l:'Ready',n:'5',c:'#059669',b:'#d1fae5'}].map(q => (
                      <div key={q.l} style={{ background: 'white', borderRadius: '7px', padding: '8px 10px', border: '1px solid #f1f5f9', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', color: '#475569' }}>{q.l}</span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: q.c, background: q.b, padding: '1px 6px', borderRadius: '5px' }}>{q.n}</span>
                      </div>
                    ))}
                    <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '9px', padding: '12px', color: 'white', marginTop: '10px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, opacity: 0.85, marginBottom: '8px' }}>Quick Compose</div>
                      <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '6px', padding: '5px 8px', fontSize: '10px', textAlign: 'center', fontWeight: 600 }}>+ New Post</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORMS ────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Phase 1 Platforms</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '14px' }}>All Your Social Channels,<br />One Simple Workflow</h2>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '500px', margin: '0 auto 48px', lineHeight: 1.65 }}>Connect the platforms that matter most and manage them all from a single unified dashboard.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {platforms.map(p => (
              <div key={p.name} style={{ background: p.bg, border: `1px solid ${p.color}20`, borderRadius: '16px', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '160px', cursor: 'default', transition: 'all 220ms ease', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${p.color}20`; e.currentTarget.style.borderColor = `${p.color}50`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,23,42,0.04)'; e.currentTarget.style.borderColor = `${p.color}20`; }}
              >
                <div style={{ width: '48px', height: '48px' }}>{getPlatformIcon(p.name)}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{p.users}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ──────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'linear-gradient(160deg, #fafbff, #f5f3ff 50%, #fafbff)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="lp-two-col" style={{ display: 'grid', gap: '60px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>The Problem</div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '20px' }}>Managing Multiple Brands Is Chaos</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Switching between multiple platforms and logins', 'Sharing credentials with your entire team', 'Scattered team workflows with no clear ownership', 'Losing track of content approvals and feedback', 'Missing scheduled content without clear oversight', 'Manually separating analytics across brands'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '11px 14px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}><X size={10} color="#ef4444" /></div>
                    <span style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>The Solution</div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '20px' }}>One Platform to Rule Them All</h2>
              <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.7, marginBottom: '24px' }}>AuraSocial gives you a structured, role-based workspace for every brand you manage.</p>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(15,23,42,0.06)' }}>
                {[
                  { label: 'Organization', color: '#4f46e5', bg: '#eef2ff', icon: <Building2 size={15} />, desc: 'Acme Digital Agency' },
                  { label: 'Brands', color: '#7c3aed', bg: '#f5f3ff', icon: <Layers size={15} />, desc: 'GreenLeaf · ABC Clothing · XYZ Academy' },
                  { label: 'Social Accounts', color: '#0891b2', bg: '#cffafe', icon: <Globe size={15} />, desc: 'Instagram · Facebook · LinkedIn · TikTok · YouTube' },
                  { label: 'Members & Roles', color: '#059669', bg: '#d1fae5', icon: <Users size={15} />, desc: 'Owner · Admin · Manager · Editor · Contributor' },
                ].map((item, i, arr) => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', background: item.bg, border: `1px solid ${item.color}25`, borderRadius: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>{item.icon}</div>
                      <div><div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{item.label}</div><div style={{ fontSize: '11px', color: '#64748b' }}>{item.desc}</div></div>
                      <CheckCircle2 size={15} color="#10b981" style={{ marginLeft: 'auto' }} />
                    </div>
                    {i < arr.length - 1 && <div style={{ display: 'flex', justifyContent: 'center', padding: '5px 0' }}><ChevronRight size={15} color="#cbd5e1" style={{ transform: 'rotate(90deg)' }} /></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ORG + BRAND ARCHITECTURE ────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Multi-Brand Architecture</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            One Organization.{' '}
            <span style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Unlimited Brands.</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '540px', margin: '0 auto 52px', lineHeight: 1.65 }}>One organization can manage multiple brands, each with its own social accounts, team members, and content — all perfectly isolated.</p>
          <div style={{ background: 'linear-gradient(160deg, #fafbff, #f5f3ff)', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '36px', maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '14px', color: 'white', marginBottom: '28px', boxShadow: '0 4px 20px rgba(79,70,229,0.3)', textAlign: 'left' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={22} /></div>
              <div><div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>Acme Digital Agency</div><div style={{ fontSize: '12px', opacity: 0.8 }}>Organization · Agency Plan · 3 Brands</div></div>
            </div>
            <div className="lp-brands-grid" style={{ display: 'grid', gap: '16px' }}>
              {[
                { name: 'GreenLeaf Restaurant', color: '#059669', bg: '#d1fae5', icon: '🌿', accounts: ['Instagram', 'Facebook', 'LinkedIn'], members: 4 },
                { name: 'ABC Clothing', color: '#7c3aed', bg: '#f5f3ff', icon: '👗', accounts: ['Instagram', 'TikTok', 'YouTube'], members: 3 },
                { name: 'XYZ Academy', color: '#1d4ed8', bg: '#dbeafe', icon: '🎓', accounts: ['Facebook', 'LinkedIn'], members: 2 },
              ].map(brand => (
                <div key={brand.name} style={{ background: 'white', border: `1px solid ${brand.color}25`, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(15,23,42,0.05)', textAlign: 'left' }}>
                  <div style={{ padding: '16px', background: brand.bg, borderBottom: `1px solid ${brand.color}20` }}>
                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>{brand.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{brand.name}</div>
                    <div style={{ fontSize: '11px', color: brand.color, fontWeight: 600, marginTop: '3px' }}>{brand.members} members</div>
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {brand.accounts.map(acc => (
                      <div key={acc} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>
                        <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>{getPlatformIcon(acc)}</div>{acc}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ROLES (dark) ────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Team Collaboration</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: '16px' }}>Right Access for Every Team Member</h2>
          <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '520px', margin: '0 auto 52px', lineHeight: 1.65 }}>Different users work inside the same organization without sharing passwords. Access is determined by role — not by who knows the login.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', textAlign: 'left' }}>
            {roles.map(role => <RoleBadge key={role.role} {...role} />)}
          </div>
          <div style={{ marginTop: '56px', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {[
              { name: 'Alex Morgan', role: 'Manager', brand: 'GreenLeaf Restaurant', initials: 'AM', color: '#4f46e5' },
              { name: 'Priya Kumar', role: 'Editor', brand: 'ABC Clothing', initials: 'PK', color: '#7c3aed' },
              { name: 'Rahul Sharma', role: 'Analyst', brand: 'XYZ Academy', initials: 'RS', color: '#059669' },
              { name: 'Jordan Lee', role: 'Contributor', brand: 'GreenLeaf Restaurant', initials: 'JL', color: '#b45309' },
            ].map(m => (
              <div key={m.name} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', minWidth: '150px', transition: 'all 220ms ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `linear-gradient(135deg, ${m.color}, ${m.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: 'white' }}>{m.initials}</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{m.name}</div>
                  <div style={{ fontSize: '11px', color: '#a5b4fc', marginTop: '2px' }}>{m.role}</div>
                  <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>{m.brand}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Simple Onboarding</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '16px' }}>Get Started in Minutes</h2>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '440px', margin: '0 auto 60px', lineHeight: 1.65 }}>From setup to first post, our streamlined workflow gets your team publishing in no time.</p>
          <div className="lp-steps" style={{ display: 'flex', justifyContent: 'center', gap: '0', flexWrap: 'wrap' }}>
            {[
              { n: '01', title: 'Create Organization', desc: 'Set up your agency or company workspace.', icon: <Building2 size={22} /> },
              { n: '02', title: 'Add Brands', desc: 'Create separate brand workspaces with isolated data.', icon: <Layers size={22} /> },
              { n: '03', title: 'Connect Channels', desc: 'Link Instagram, Facebook, LinkedIn, TikTok, YouTube.', icon: <Globe size={22} /> },
              { n: '04', title: 'Invite Members', desc: 'Add team members and assign predefined roles.', icon: <Users size={22} /> },
              { n: '05', title: 'Start Publishing', desc: 'Create, schedule, approve and publish.', icon: <Zap size={22} /> },
            ].map((step, i, arr) => (
              <div key={step.n} style={{ display: 'flex', alignItems: 'flex-start', flex: 1, minWidth: '150px', maxWidth: '200px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '14px', boxShadow: '0 4px 14px rgba(79,70,229,0.3)' }}>{step.icon}</div>
                  <div style={{ background: '#4f46e5', color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 700, marginBottom: '10px' }}>{step.n}</div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: '8px' }}>{step.title}</h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', textAlign: 'center', lineHeight: 1.5, maxWidth: '160px', margin: 0 }}>{step.desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="lp-step-arrow" style={{ alignItems: 'center', paddingTop: '28px', flexShrink: 0 }}>
                    <ChevronRight size={18} color="#cbd5e1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPROVAL WORKFLOW ────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'linear-gradient(160deg, #fafbff, #f5f3ff 50%, #fafbff)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="lp-two-col" style={{ display: 'grid', gap: '60px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Content Governance</div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '20px' }}>Approval Workflows That Keep Everyone Aligned</h2>
              <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7, marginBottom: '28px' }}>Control who can create, review, approve, and publish. Every post goes through the right hands before going live.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { icon: <Shield size={16} />, text: 'Role-based content permissions', color: '#4f46e5' },
                  { icon: <Users size={16} />, text: 'Manager + Client approval stages', color: '#7c3aed' },
                  { icon: <Bell size={16} />, text: 'Instant notifications on approval/rejection', color: '#059669' },
                  { icon: <GitBranch size={16} />, text: 'Full audit log for every post action', color: '#0891b2' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>{item.icon}</div>
                    <span style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {approvalSteps.map((step, i) => (
                <div key={step.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: 'white', border: `1px solid ${step.color}30`, borderRadius: '12px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', transition: 'all 220ms ease', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 4px 16px ${step.color}20`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,23,42,0.04)'; }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, flexShrink: 0 }}>{step.icon}</div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{step.label}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{step.desc}</div>
                    </div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: step.color }} />
                  </div>
                  {i < approvalSteps.length - 1 && <div style={{ display: 'flex', paddingLeft: '28px', padding: '3px 0 3px 28px' }}><ChevronRight size={13} color="#cbd5e1" style={{ transform: 'rotate(90deg)' }} /></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ANALYTICS ────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Performance Analytics</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '16px' }}>Insights Across Every Brand & Channel</h2>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '500px', margin: '0 auto 48px', lineHeight: 1.65 }}>Track growth, engagement, and content performance for each brand and social channel — from one place.</p>
          <div style={{ background: 'linear-gradient(160deg, #fafbff, #f5f3ff)', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px', maxWidth: '900px', margin: '0 auto', boxShadow: '0 8px 32px rgba(15,23,42,0.06)' }}>
            <div className="lp-analytics-grid" style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Total Followers', value: '186.4K', trend: '+12.4%', color: '#4f46e5' },
                { label: 'New Followers', value: '+3.2K', trend: 'This month', color: '#10b981' },
                { label: 'Total Posts', value: '127', trend: 'All brands', color: '#7c3aed' },
                { label: 'Avg. Impressions', value: '28.9K', trend: 'Per post', color: '#0891b2' },
                { label: 'Engagement Rate', value: '4.8%', trend: '+0.6% avg', color: '#ec4899' },
              ].map(m => (
                <div key={m.label} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', textAlign: 'left', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{m.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{m.value}</div>
                  <div style={{ fontSize: '11px', color: m.color, fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}><TrendingUp size={10} />{m.trend}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textAlign: 'left' }}>Followers Growth — All Brands</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['7d', '30d', '90d'].map((d, i) => <div key={d} style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: i === 1 ? '#4f46e5' : '#f1f5f9', color: i === 1 ? 'white' : '#64748b' }}>{d}</div>)}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '72px' }}>
                {[55,70,60,85,72,90,78,95,88,102,96,118].map((h,i) => (
                  <div key={i} style={{ flex: 1, height: `${h * 0.65}px`, background: 'linear-gradient(180deg, #4f46e5, #7c3aed)', borderRadius: '4px 4px 0 0', opacity: 0.5 + (i / 12) * 0.5 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MULTI-BRAND ISOLATION (dark) ────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Brand Isolation</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: '16px' }}>Manage Every Brand Without Mixing Them Up</h2>
          <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '540px', margin: '0 auto 48px', lineHeight: 1.65 }}>When you select a brand, you only see that brand's data. Zero cross-contamination.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { brand: 'GreenLeaf Restaurant', icon: '🌿', items: ['Instagram · Facebook · LinkedIn', '4 Team Members', '12 Scheduled Posts'], color: '#059669', active: false },
              { brand: 'ABC Clothing', icon: '👗', items: ['Instagram · TikTok · YouTube', '3 Team Members', '8 Scheduled Posts'], color: '#7c3aed', active: true },
              { brand: 'XYZ Academy', icon: '🎓', items: ['Facebook · LinkedIn', '2 Team Members', '5 Scheduled Posts'], color: '#1d4ed8', active: false },
            ].map(brand => (
              <div key={brand.brand} style={{ background: brand.active ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${brand.active ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`, borderRadius: '16px', padding: '24px', minWidth: '220px', maxWidth: '260px', flex: 1, textAlign: 'left', transition: 'all 220ms ease', boxShadow: brand.active ? '0 8px 24px rgba(124,58,237,0.3)' : 'none' }}
                onMouseEnter={e => { if (!brand.active) { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.transform = 'translateY(-3px)'; } }}
                onMouseLeave={e => { if (!brand.active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
              >
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{brand.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '14px' }}>
                  {brand.brand}{brand.active && <span style={{ marginLeft: '8px', background: '#7c3aed', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>Active</span>}
                </div>
                {brand.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#94a3b8', marginBottom: '7px' }}>
                    <CheckCircle2 size={13} color={brand.color} />{item}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginTop: '40px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px 24px' }}>
            <Lock size={15} color="#a5b4fc" />
            <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>Complete data isolation — <strong style={{ color: 'white' }}>Brand A can never access Brand B data.</strong> Enforced server-side.</span>
          </div>
        </div>
      </section>

      {/* ── TEAM ACCESS + INVITATION ────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="lp-two-col" style={{ display: 'grid', gap: '60px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Cross-Organization Access</div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '20px' }}>Give Every Team Member the Access They Need</h2>
              <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7, marginBottom: '24px' }}>The same person can belong to multiple organizations and have completely different roles in each. Permissions update automatically based on context.</p>
              <div style={{ background: '#fafbff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Example: Alex's Memberships</div>
                {[
                  { org: 'ABC Digital Agency', role: 'Admin', color: '#1d4ed8', bg: '#dbeafe' },
                  { org: 'XYZ Marketing', role: 'Manager', color: '#059669', bg: '#d1fae5' },
                  { org: 'Demo Agency', role: 'Analyst', color: '#64748b', bg: '#f1f5f9' },
                ].map(item => (
                  <div key={item.org} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: 'white', border: '1px solid #f1f5f9', borderRadius: '10px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={14} color="#64748b" /></div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{item.org}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: item.color, background: item.bg, padding: '3px 10px', borderRadius: '20px' }}>{item.role}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Secure Invitation Flow</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { step: 'Admin enters member name & email', icon: <Users size={14} />, color: '#4f46e5' },
                  { step: 'Selects organization + brand(s)', icon: <Building2 size={14} />, color: '#7c3aed' },
                  { step: 'Assigns a predefined role', icon: <Shield size={14} />, color: '#0891b2' },
                  { step: 'Secure invitation email sent', icon: <Bell size={14} />, color: '#059669' },
                  { step: 'User creates their own password', icon: <Lock size={14} />, color: '#b45309' },
                  { step: 'Account activated & ready to go', icon: <CheckCircle2 size={14} />, color: '#10b981' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '48px', flexShrink: 0 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${item.color}15`, border: `2px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>{item.icon}</div>
                      {i < 5 && <div style={{ width: '2px', flex: 1, background: '#e2e8f0', minHeight: '20px' }} />}
                    </div>
                    <div style={{ paddingLeft: '14px', paddingBottom: i < 5 ? '18px' : 0, paddingTop: '6px' }}>
                      <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>{item.step}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', color: '#065f46', fontWeight: 600 }}>
                <Lock size={14} /> Admin never sees user passwords — ever.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #5b21b6 70%, #312e81 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Ready to Scale?</div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: '20px', lineHeight: 1.1 }}>Bring Your Brands, Teams, and Social Channels Together.</h2>
          <p style={{ fontSize: '18px', color: '#c4b5fd', lineHeight: 1.65, marginBottom: '44px', maxWidth: '520px', margin: '0 auto 44px' }}>Join thousands of agencies and brands managing their social presence with AuraSocial.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={onNavigateToSignup} style={{ padding: '18px 36px', fontSize: '17px', fontWeight: 700, color: '#4f46e5', background: 'white', border: 'none', cursor: 'pointer', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'all 220ms ease', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
            >Get Started <ArrowRight size={18} /></button>
            <button onClick={onNavigateToSignup} style={{ padding: '17px 32px', fontSize: '16px', fontWeight: 600, color: 'white', background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.25)', cursor: 'pointer', borderRadius: '14px', transition: 'all 220ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
            >Start Free Trial</button>
          </div>
          <p style={{ fontSize: '13px', color: '#a5b4fc', marginTop: '24px' }}>No credit card required · Free 14-day trial · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '72px 24px 36px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="lp-footer-grid" style={{ display: 'grid', gap: '40px', marginBottom: '56px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Sparkles size={17} /></div>
                <span style={{ fontSize: '17px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>AuraSocial</span>
              </div>
              <p style={{ fontSize: '13.5px', lineHeight: 1.7, maxWidth: '260px', marginBottom: '20px' }}>The professional social media management platform for agencies and brands.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {platforms.map(p => (
                  <div key={p.name} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', cursor: 'pointer', transition: 'all 150ms ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#334155'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1e293b'; }}
                  >{getPlatformIcon(p.name)}</div>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Analytics', 'Scheduling', 'Collaboration'] },
              { title: 'Company', links: ['About', 'Contact', 'Careers', 'Blog'] },
              { title: 'Resources', links: ['Help Center', 'Documentation', 'API Docs', 'Status Page'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'white', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{col.title}</div>
                {col.links.map(link => (
                  <div key={link} style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '10px', cursor: 'pointer', transition: 'color 150ms ease' }}
                    onMouseEnter={e => { (e.target as HTMLDivElement).style.color = '#c4b5fd'; }}
                    onMouseLeave={e => { (e.target as HTMLDivElement).style.color = '#64748b'; }}
                  >{link}</div>
                ))}
                {col.title === 'Legal' && (
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'white', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Account</div>
                    <button onClick={onNavigateToLogin} style={{ display: 'block', fontSize: '13.5px', color: '#a5b4fc', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 8px', textAlign: 'left' }}>Log In</button>
                    <button onClick={onNavigateToSignup} style={{ display: 'block', fontSize: '13.5px', color: '#a5b4fc', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>Sign Up</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#475569' }}>© 2026 AuraSocial. All rights reserved.</span>
            <span style={{ fontSize: '13px', color: '#475569' }}>Built for agencies and brands that mean business.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};