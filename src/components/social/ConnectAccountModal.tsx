import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { SocialPlatform } from '../../types';
import { 
  InstagramIcon, 
  FacebookIcon, 
  LinkedinIcon, 
  TiktokIcon, 
  YoutubeIcon 
} from '../common/SocialIcons';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

export const ConnectAccountModal: React.FC = () => {
  const { 
    isConnectAccountOpen, 
    setIsConnectAccountOpen, 
    connectAccount, 
    currentBrand 
  } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [handle, setHandle] = useState('');
  const [step, setStep] = useState<'select' | 'oauth_prompt' | 'authorizing' | 'success'>('select');

  if (!isConnectAccountOpen) return null;

  const platforms: { id: SocialPlatform; name: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { id: 'instagram', name: 'Instagram Professional', desc: 'Connect Instagram Business or Creator profiles', icon: <InstagramIcon size={20} />, color: '#E1306C' },
    { id: 'facebook', name: 'Facebook Pages', desc: 'Connect Facebook Brand or Community Pages', icon: <FacebookIcon size={20} />, color: '#1877F2' },
    { id: 'linkedin', name: 'LinkedIn Company', desc: 'Connect Company Pages or Showcase Pages', icon: <LinkedinIcon size={20} />, color: '#0A66C2' },
    { id: 'tiktok', name: 'TikTok for Business', desc: 'Connect TikTok Creator or Business accounts', icon: <TiktokIcon size={20} />, color: '#000000' },
    { id: 'youtube', name: 'YouTube Channel', desc: 'Connect YouTube Brand Channels & Community', icon: <YoutubeIcon size={20} />, color: '#FF0000' }
  ];

  const handleSelectPlatform = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    setHandle(`@${currentBrand.name.toLowerCase().replace(/\s+/g, '')}`);
    setStep('oauth_prompt');
  };

  const handleSimulateAuthorize = () => {
    setStep('authorizing');
    setTimeout(() => {
      if (selectedPlatform) {
        connectAccount(selectedPlatform, handle || '@newchannel', `${currentBrand.name} (${selectedPlatform.toUpperCase()})`);
      }
      setStep('success');
    }, 1200);
  };

  const handleClose = () => {
    setIsConnectAccountOpen(false);
    setStep('select');
    setSelectedPlatform(null);
  };

  return (
    <Modal
      isOpen={isConnectAccountOpen}
      onClose={handleClose}
      title={step === 'oauth_prompt' ? 'Simulated OAuth 2.0 Authorization' : 'Connect Social Channel'}
      maxWidth="560px"
    >
      {/* STEP 1: SELECT PLATFORM */}
      {step === 'select' && (
        <div className="flex flex-col gap-4">
          <p className="text-body" style={{ fontSize: '13.5px' }}>
            Choose an active Phase 1 social network to link with <strong>{currentBrand.name}</strong>.
          </p>

          <div className="flex flex-col gap-2.5">
            {platforms.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 border border-subtle rounded-lg hover:border-primary cursor-pointer transition-all"
                style={{ borderRadius: 'var(--radius-md)' }}
                onClick={() => handleSelectPlatform(p.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `${p.color}15`,
                      color: p.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {p.icon}
                  </div>
                  <div className="flex flex-col">
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{p.name}</span>
                    <span className="text-caption">{p.desc}</span>
                  </div>
                </div>

                <Button variant="secondary" size="sm">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: OAUTH PERMISSION PROMPT */}
      {step === 'oauth_prompt' && selectedPlatform && (
        <div className="flex flex-col gap-4">
          <div 
            className="flex items-center gap-3 p-3.5 bg-subtle border border-subtle rounded-lg"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <ShieldCheck size={28} color="var(--color-primary)" />
            <div className="flex flex-col">
              <span style={{ fontWeight: 600, fontSize: '13.5px' }}>
                Secure OAuth 2.0 Consent
              </span>
              <span className="text-caption">
                Connecting to {selectedPlatform.toUpperCase()} Open Authentication Endpoint
              </span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Account / Page Username</label>
            <input
              type="text"
              className="form-input"
              value={handle}
              onChange={e => setHandle(e.target.value)}
              placeholder="@brandname"
            />
          </div>

          <div className="flex flex-col gap-2 text-caption">
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Permissions requested by AuraSocial:</span>
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)' }}>
              <li>Publish video, photo, and carousel posts on your behalf</li>
              <li>Read aggregated follower demographics and reach metrics</li>
              <li>Schedule content dispatches through official partner APIs</li>
              <li>Does NOT read private direct messages or personal passwords</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-subtle">
            <Button variant="secondary" onClick={() => setStep('select')}>
              Back
            </Button>
            <Button
              variant="primary"
              icon={<Lock size={14} />}
              onClick={handleSimulateAuthorize}
            >
              Authorize & Connect
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: AUTHORIZING SIMULATION */}
      {step === 'authorizing' && (
        <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
          <div className="btn-loading" style={{ width: '32px', height: '32px' }} />
          <h3 className="text-section-title" style={{ fontSize: '16px' }}>
            Authenticating with {selectedPlatform?.toUpperCase()}...
          </h3>
          <p className="text-caption">
            Exchanging OAuth 2.0 authorization code for long-lived access token...
          </p>
        </div>
      )}

      {/* STEP 4: SUCCESS */}
      {step === 'success' && selectedPlatform && (
        <div className="py-6 flex flex-col items-center justify-center text-center gap-3">
          <div 
            style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--status-published-bg)', 
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle2 size={30} />
          </div>
          <h3 className="text-section-title" style={{ fontSize: '18px' }}>
            {selectedPlatform.toUpperCase()} Connected Successfully!
          </h3>
          <p className="text-body" style={{ fontSize: '13.5px', maxWidth: '380px' }}>
            Your account is linked to brand <strong>{currentBrand.name}</strong>. You can now compose, schedule, and analyze content.
          </p>
          <Button variant="primary" onClick={handleClose} style={{ marginTop: '8px' }}>
            Return to Channels
          </Button>
        </div>
      )}
    </Modal>
  );
};
