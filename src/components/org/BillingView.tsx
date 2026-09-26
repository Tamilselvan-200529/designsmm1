import React from 'react';
import { Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BillingView: React.FC = () => {
  const { showToast } = useApp();

  const handlePlanAction = (planName: string) => {
    showToast('info', `Proceeding with ${planName} plan selection...`);
  };

  const InfoIcon = ({ tooltip }: { tooltip: string }) => (
    <span title={tooltip} style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '4px', color: 'var(--text-muted)' }}>
      <Info size={13} />
    </span>
  );

  return (
    <div className="view-container animate-fade-in" style={{ padding: '40px 32px', maxWidth: '1100px', margin: '0 auto' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* FREE PLAN */}
        <div style={{ 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          border: '1px solid var(--border-color)', 
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-color)', margin: '0 0 16px 0' }}>Free</h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '42px', fontWeight: 700, color: 'var(--text-color)', lineHeight: 1 }}>Free</span>
            <span style={{ fontSize: '14px', color: 'var(--text-color)', fontWeight: 500 }}>forever</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px 0', minHeight: '40px' }}>
            Connect up to 3 channels
          </p>
          <button 
            className="btn btn-primary" 
            style={{ width: 'fit-content', borderRadius: '24px', padding: '10px 24px', backgroundColor: '#1f2937', borderColor: '#1f2937' }}
            onClick={() => handlePlanAction('Free')}
          >
            Let's go &rarr;
          </button>

          <div style={{ marginTop: '32px', marginBottom: '16px', fontSize: '14px', fontWeight: 700, color: 'var(--text-color)' }}>
            What's included
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>10 scheduled posts per channel - refill anytime<InfoIcon tooltip="Scheduled posts limit" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>100 ideas<InfoIcon tooltip="Ideas limit" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>1 user account<InfoIcon tooltip="User limit" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>AI Assistant<InfoIcon tooltip="AI content assistant" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Insights<InfoIcon tooltip="Basic insights" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>
                API access<InfoIcon tooltip="Developer API" />
                <ul style={{ listStyle: 'circle', paddingLeft: '18px', marginTop: '6px', color: 'var(--text-muted)' }}>
                  <li style={{ marginBottom: '4px' }}>1 API key</li>
                  <li>3,000 requests/month</li>
                </ul>
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Community inbox<InfoIcon tooltip="Engage with community" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>World-class customer support<InfoIcon tooltip="Support" /></span>
            </li>
          </ul>
        </div>

        {/* ESSENTIALS PLAN */}
        <div style={{ 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          border: '1px solid var(--border-color)', 
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '0', 
            left: '24px', 
            transform: 'translateY(-50%)',
            backgroundColor: '#dcfce7',
            color: '#166534',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            Recommended
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-color)', margin: '0 0 16px 0' }}>Essentials</h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
            <span style={{ fontSize: '42px', fontWeight: 700, color: 'var(--text-color)', lineHeight: 1 }}>$5</span>
            <span style={{ fontSize: '14px', color: 'var(--text-color)', fontWeight: 500 }}>/month</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px 0', minHeight: '40px' }}>
            1 channel · $60 billed yearly (save 2 months)
          </p>
          <button 
            className="btn btn-primary" 
            style={{ width: 'fit-content', borderRadius: '24px', padding: '10px 24px', backgroundColor: '#1f2937', borderColor: '#1f2937' }}
            onClick={() => handlePlanAction('Essentials')}
          >
            Start 14-day free trial &rarr;
          </button>

          <div style={{ marginTop: '32px', marginBottom: '16px', fontSize: '14px', fontWeight: 700, color: 'var(--text-color)' }}>
            What's included
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Unlimited scheduled posts per channel<InfoIcon tooltip="No scheduling limits" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Unlimited ideas<InfoIcon tooltip="No ideas limits" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>1 user account<InfoIcon tooltip="User limit" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>AI Assistant<InfoIcon tooltip="AI content assistant" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Advanced analytics<InfoIcon tooltip="Advanced reporting" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>
                API access<InfoIcon tooltip="Developer API" />
                <ul style={{ listStyle: 'circle', paddingLeft: '18px', marginTop: '6px', color: 'var(--text-muted)' }}>
                  <li style={{ marginBottom: '4px' }}>3 API keys</li>
                  <li>7,500 requests/month</li>
                </ul>
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Community inbox<InfoIcon tooltip="Engage with community" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Hashtag manager<InfoIcon tooltip="Manage hashtags" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>First comment scheduling<InfoIcon tooltip="Schedule first comment" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>World-class customer support<InfoIcon tooltip="Support" /></span>
            </li>
          </ul>
        </div>

        {/* TEAM PLAN */}
        <div style={{ 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          border: '1px solid var(--border-color)', 
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-color)', margin: '0 0 16px 0' }}>Team</h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
            <span style={{ fontSize: '42px', fontWeight: 700, color: 'var(--text-color)', lineHeight: 1 }}>$10</span>
            <span style={{ fontSize: '14px', color: 'var(--text-color)', fontWeight: 500 }}>/month</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px 0', minHeight: '40px' }}>
            1 channel · $120 billed yearly (save 2 months)
          </p>
          <button 
            className="btn btn-primary" 
            style={{ width: 'fit-content', borderRadius: '24px', padding: '10px 24px', backgroundColor: '#1f2937', borderColor: '#1f2937' }}
            onClick={() => handlePlanAction('Team')}
          >
            Start 14-day free trial &rarr;
          </button>

          <div style={{ marginTop: '32px', marginBottom: '16px', fontSize: '14px', fontWeight: 700, color: 'var(--text-color)' }}>
            What's included
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Unlimited scheduled posts per channel<InfoIcon tooltip="No scheduling limits" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Unlimited ideas<InfoIcon tooltip="No ideas limits" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Unlimited team members<InfoIcon tooltip="Unlimited collaborator seats" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>AI Assistant<InfoIcon tooltip="AI content assistant" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Advanced analytics<InfoIcon tooltip="Advanced reporting" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>
                API access<InfoIcon tooltip="Developer API" />
                <ul style={{ listStyle: 'circle', paddingLeft: '18px', marginTop: '6px', color: 'var(--text-muted)' }}>
                  <li style={{ marginBottom: '4px' }}>5 API keys</li>
                  <li>15,000 requests/month</li>
                </ul>
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Community inbox<InfoIcon tooltip="Engage with community" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Hashtag manager<InfoIcon tooltip="Manage hashtags" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>First comment scheduling<InfoIcon tooltip="Schedule first comment" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Access levels<InfoIcon tooltip="Custom role access" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>Content approval workflows<InfoIcon tooltip="Multi-stage approval process" /></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-color)' }}>
              <span style={{ marginRight: '10px', fontWeight: 700 }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.4' }}>World-class customer support<InfoIcon tooltip="Support" /></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
