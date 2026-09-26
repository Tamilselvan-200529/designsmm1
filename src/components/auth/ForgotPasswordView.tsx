import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Sparkles, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

interface ForgotPasswordViewProps {
  onSwitchView: (view: 'login' | 'signup' | 'forgot') => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onSwitchView }) => {
  const { navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
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
          <h1 className="text-display" style={{ fontSize: '24px' }}>Reset password</h1>
          <p className="text-body" style={{ fontSize: '13.5px' }}>
            Enter your email to receive secure recovery instructions
          </p>
        </div>

        {submitted ? (
          <div 
            className="flex flex-col items-center text-center gap-3 p-4"
            style={{ 
              backgroundColor: 'var(--status-published-bg)', 
              border: '1px solid var(--status-published-border)', 
              borderRadius: 'var(--radius-lg)' 
            }}
          >
            <CheckCircle2 size={32} color="#16a34a" />
            <h4 style={{ fontWeight: 600, color: '#15803d' }}>Password Reset Link Sent</h4>
            <p className="text-caption" style={{ color: '#166534' }}>
              We have sent a simulated password recovery email to <strong>{email}</strong>. Please check your inbox.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSwitchView('login')}
              style={{ marginTop: '8px' }}
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email address</label>
              <div className="search-input-wrap">
                <Mail size={16} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '34px' }}
                  placeholder="alex@acmedigital.agency"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
            >
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="flex items-center justify-center">
          <button
            type="button"
            className="btn btn-ghost btn-sm flex items-center gap-1"
            onClick={() => onSwitchView('login')}
          >
            <ArrowLeft size={14} />
            <span>Return to login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
