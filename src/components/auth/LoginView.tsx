import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Sparkles, Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, BarChart3, Users, Calendar, CheckCircle } from 'lucide-react';
import { UserRole } from '../../types';

interface AuthViewsProps {
  onSwitchView: (view: 'login' | 'signup' | 'forgot') => void;
}

export const LoginView: React.FC<AuthViewsProps> = ({ onSwitchView }) => {
  const { login, navigateTo } = useApp();
  const [email, setEmail] = useState('alex@acmedigital.agency');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('Owner');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selectedDemoRole);
      setLoading(false);
    }, 400);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setSelectedDemoRole(role);
    setLoading(true);
    setTimeout(() => {
      login(role);
      setLoading(false);
    }, 300);
  };

  const features = [
    { icon: <Calendar size={18} />, text: 'Smart content calendar with multi-platform scheduling' },
    { icon: <BarChart3 size={18} />, text: 'Unified analytics across all social channels' },
    { icon: <Users size={18} />, text: 'Team collaboration with approval workflows' },
    { icon: <CheckCircle size={18} />, text: 'One-click publishing to Instagram, Facebook, LinkedIn & more' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#ffffff'
    }}>
      {/* Left Panel - Brand Hero */}
      <div style={{
        flex: '0 0 45%',
        background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 35%, #4c1d95 70%, #5b21b6 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(129, 140, 248, 0.4)'
          }}>
            <Sparkles size={20} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            AuraSocial
          </span>
        </div>

        {/* Hero content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h2 style={{ 
              fontSize: '36px', 
              fontWeight: 800, 
              color: '#ffffff', 
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '16px'
            }}>
              Manage every channel.<br />
              <span style={{ color: '#c4b5fd' }}>From one workspace.</span>
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(196, 181, 253, 0.85)', lineHeight: 1.6 }}>
              The professional Social Media Management platform trusted by agencies and brands worldwide.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c4b5fd',
                  flexShrink: 0
                }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.4 }}>
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom social proof */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          paddingTop: '24px'
        }}>
          <div style={{ display: 'flex' }}>
            {['#818cf8', '#a78bfa', '#c4b5fd'].map((c, i) => (
              <div key={i} style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: c,
                border: '2px solid #1e1b4b',
                marginLeft: i > 0 ? '-8px' : '0'
              }} />
            ))}
          </div>
          <p style={{ fontSize: '12.5px', color: 'rgba(196, 181, 253, 0.8)' }}>
            Join <strong style={{ color: '#c4b5fd' }}>2,400+</strong> marketing teams worldwide
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Back to Website */}
          <button
            type="button"
            onClick={() => navigateTo('/')}
            style={{
              alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none', padding: 0,
              color: '#64748b', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'color 150ms ease'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#4f46e5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            <ArrowLeft size={15} /> Back to Website
          </button>

          {/* Header */}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              Sign in to your account
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Enter your credentials or use a demo role below
            </p>
          </div>

          {/* Quick Demo Login Panel */}
          <div style={{
            backgroundColor: 'var(--color-primary-light)',
            border: '1px solid var(--color-primary-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 18px'
          }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <ShieldCheck size={16} color="var(--color-primary)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1-Click Demo Access
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['Owner', 'Admin', 'Manager', 'Editor', 'Contributor', 'Analyst', 'Client'] as UserRole[]).map(role => (
                <button
                  key={role}
                  type="button"
                  className={`btn btn-sm ${selectedDemoRole === role ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '11.5px', padding: '4px 10px' }}
                  onClick={() => handleQuickDemoLogin(role)}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email address</label>
              <div className="search-input-wrap">
                <Mail size={16} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  className="btn btn-link"
                  style={{ fontSize: '12px' }}
                  onClick={() => onSwitchView('forgot')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="search-input-wrap">
                <Lock size={16} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between" style={{ fontSize: '13px' }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)', width: '14px', height: '14px' }}
                />
                <span className="text-body" style={{ fontSize: '13px' }}>Remember for 30 days</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="flex items-center justify-center gap-1 text-caption">
            <span>Don't have an organization account?</span>
            <button
              type="button"
              className="btn btn-link"
              style={{ fontSize: '12.5px' }}
              onClick={() => onSwitchView('signup')}
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
