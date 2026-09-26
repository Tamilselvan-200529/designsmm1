import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Sparkles, User, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface SignUpViewProps {
  onSwitchView: (view: 'login' | 'signup' | 'forgot') => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({ onSwitchView }) => {
  const { login, navigateTo } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login('Owner');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6" style={{ backgroundColor: '#ffffff' }}>
      <div 
        className="w-full flex flex-col gap-6"
        style={{ 
          maxWidth: '440px', 
          backgroundColor: '#ffffff',
          padding: '40px 36px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <button
          type="button"
          onClick={() => navigateTo('/')}
          style={{
            alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', padding: 0,
            color: '#64748b', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', transition: 'color 150ms ease', marginBottom: '-8px'
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#4f46e5')}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
        >
          <ArrowLeft size={15} /> Back to Website
        </button>
        <div className="flex flex-col items-center text-center gap-2">
          <div 
            style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: 'var(--radius-md)', 
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: '4px'
            }}
          >
            <Sparkles size={22} />
          </div>
          <h1 className="text-display" style={{ fontSize: '24px' }}>Create your account</h1>
          <p className="text-body" style={{ fontSize: '13.5px' }}>
            Start managing multiple social brands with ease
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name</label>
            <div className="search-input-wrap">
              <User size={16} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '34px' }}
                placeholder="Alex Morgan"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Work Email</label>
            <div className="search-input-wrap">
              <Mail size={16} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '34px' }}
                placeholder="alex@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div className="search-input-wrap">
              <Lock size={16} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '34px' }}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Confirm Password</label>
            <div className="search-input-wrap">
              <Lock size={16} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '34px' }}
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
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
            Create Organization & Continue
          </Button>
        </form>

        <div className="flex items-center justify-center gap-1 text-caption">
          <span>Already have an account?</span>
          <button
            type="button"
            className="btn btn-link"
            style={{ fontSize: '12px' }}
            onClick={() => onSwitchView('login')}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
