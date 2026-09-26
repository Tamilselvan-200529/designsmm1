import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { 
  InstagramIcon, 
  FacebookIcon, 
  LinkedinIcon, 
  TiktokIcon, 
  YoutubeIcon 
} from '../common/SocialIcons';
import { 
  Building2, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Lock,
  Clock,
  Globe
} from 'lucide-react';
import type { SocialPlatform } from '../../types';

export const OnboardingWizard: React.FC = () => {
  const { 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    organization, 
    currentBrand, 
    connectAccount,
    showToast 
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Org fields
  const [orgName, setOrgName] = useState(organization.name);
  const [industry, setIndustry] = useState(organization.industry || 'Digital Marketing & Growth');

  // Step 2: Brand fields
  const [brandName, setBrandName] = useState(currentBrand.name);
  const [brandIndustry, setBrandIndustry] = useState(currentBrand.industry);
  const [timezone, setTimezone] = useState(currentBrand.timezone);
  const [website, setWebsite] = useState(currentBrand.website);

  // Step 3: Social connection states
  const [connectedPlatforms, setConnectedPlatforms] = useState<Record<SocialPlatform, boolean>>({
    instagram: true,
    facebook: true,
    linkedin: false,
    tiktok: false,
    youtube: false
  });

  const [authorizingPlatform, setAuthorizingPlatform] = useState<SocialPlatform | null>(null);

  const handleSimulateOAuth = (platform: SocialPlatform) => {
    setAuthorizingPlatform(platform);
    setTimeout(() => {
      setConnectedPlatforms(prev => ({ ...prev, [platform]: true }));
      setAuthorizingPlatform(null);
      connectAccount(platform, `@${brandName.toLowerCase().replace(/\s+/g, '')}`, brandName);
      showToast('success', `${platform.toUpperCase()} authorized and connected to ${brandName}!`);
    }, 900);
  };

  const handleComplete = () => {
    setIsOnboardingOpen(false);
    showToast('success', `Welcome to ${organization.name}! Brand "${brandName}" is ready.`);
  };

  const platformsList: { id: SocialPlatform; name: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { id: 'instagram', name: 'Instagram', desc: 'Feed, Stories & Reels via Graph API', icon: <InstagramIcon size={18} />, color: '#E1306C' },
    { id: 'facebook', name: 'Facebook', desc: 'Pages, Photos & Video publishing', icon: <FacebookIcon size={18} />, color: '#1877F2' },
    { id: 'linkedin', name: 'LinkedIn', desc: 'Company Pages & Personal Profiles', icon: <LinkedinIcon size={18} />, color: '#0A66C2' },
    { id: 'tiktok', name: 'TikTok', desc: 'Direct video and Shorts publishing', icon: <TiktokIcon size={18} />, color: '#000000' },
    { id: 'youtube', name: 'YouTube', desc: 'Video & Shorts publishing connector', icon: <YoutubeIcon size={18} />, color: '#FF0000' }
  ];

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onClose={() => setIsOnboardingOpen(false)}
      maxWidth="680px"
    >
      <div className="flex flex-col gap-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-subtle pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={20} color="var(--color-primary)" />
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Organization & Brand Setup</span>
          </div>
          <div className="flex items-center gap-1 text-caption">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '11px',
                  backgroundColor: step === s ? 'var(--color-primary)' : step > s ? 'var(--status-published-bg)' : 'var(--bg-muted)',
                  color: step === s ? '#ffffff' : step > s ? 'var(--status-published-text)' : 'var(--text-muted)'
                }}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: ORGANIZATION SETUP */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-section-title">Step 1: Organization Profile</h3>
              <p className="text-body" style={{ marginTop: '4px' }}>
                Set up your primary organization. Organizations govern multiple client brand workspaces, billing, and global permissions.
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Organization Name</label>
              <div className="search-input-wrap">
                <Building2 size={16} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '34px' }}
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Agency / Primary Industry</label>
              <input
                type="text"
                className="form-input"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="primary"
                icon={<ArrowRight size={15} />}
                iconPosition="right"
                onClick={() => setStep(2)}
              >
                Continue to First Brand Setup
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: BRAND SETUP */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-section-title">Step 2: Add First Brand</h3>
              <p className="text-body" style={{ marginTop: '4px' }}>
                Create your first isolated brand workspace. Social accounts, content calendars, and team access will be scoped to this brand.
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Brand Name</label>
              <div className="search-input-wrap">
                <Layers size={16} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '34px' }}
                  value={brandName}
                  onChange={e => setBrandName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Brand Industry</label>
              <input
                type="text"
                className="form-input"
                value={brandIndustry}
                onChange={e => setBrandIndustry(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Website URL</label>
              <div className="search-input-wrap">
                <Globe size={16} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '34px' }}
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Brand Timezone</label>
              <div className="search-input-wrap">
                <Clock size={16} />
                <select 
                  className="form-select"
                  style={{ paddingLeft: '34px' }}
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                >
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="primary"
                icon={<ArrowRight size={15} />}
                iconPosition="right"
                onClick={() => setStep(3)}
              >
                Continue to Social Connections
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: CONNECT SOCIAL ACCOUNTS */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-section-title">Step 3: Connect Social Accounts to {brandName}</h3>
              <p className="text-body" style={{ marginTop: '4px' }}>
                Link your active accounts to this brand. Connected channels remain isolated to <strong>{brandName}</strong>.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {platformsList.map(item => {
                const isConnected = connectedPlatforms[item.id];
                const isAuthorizing = authorizingPlatform === item.id;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3"
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isConnected ? 'var(--color-primary-light)' : 'transparent'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ color: item.color }}>{item.icon}</div>
                      <div className="flex flex-col">
                        <span className="text-label font-semibold">{item.name}</span>
                        <span className="text-caption">{item.desc}</span>
                      </div>
                    </div>

                    <div>
                      {isConnected ? (
                        <span className="badge badge-published flex items-center gap-1">
                          <CheckCircle2 size={12} /> Connected
                        </span>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Lock size={12} />}
                          loading={isAuthorizing}
                          onClick={() => handleSimulateOAuth(item.id)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                variant="primary"
                icon={<ArrowRight size={15} />}
                iconPosition="right"
                onClick={() => setStep(4)}
              >
                Review & Finish
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS / READY */}
        {step === 4 && (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div 
              style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--status-published-bg)', 
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h3 className="text-section-title">Brand Ready to Publish!</h3>
            <p className="text-body" style={{ maxWidth: '440px' }}>
              <strong>{brandName}</strong> is initialized under <strong>{orgName}</strong> with connected social channels. You can now schedule posts, review queue dispatches, and invite team members.
            </p>

            <div 
              className="w-full flex flex-col gap-2 p-3 text-left"
              style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '12.5px' }}
            >
              <div className="flex justify-between">
                <span className="text-muted">Organization:</span>
                <strong>{orgName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Active Brand:</span>
                <strong>{brandName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Connected Platforms:</span>
                <span>{Object.entries(connectedPlatforms).filter(([_, v]) => v).map(([k]) => k).join(', ')}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-2"
              onClick={handleComplete}
            >
              Go to Brand Dashboard
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
