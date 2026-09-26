import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Plus, 
  ExternalLink, 
  ArrowRight, 
  Users, 
  Share2, 
  FileText, 
  Globe, 
  Clock, 
  Sparkles,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../common/Button';

export const OrgBrandsView: React.FC = () => {
  const { 
    organization, 
    allBrands, 
    currentBrand, 
    switchBrand, 
    setIsCreateBrandOpen, 
    allSocialAccounts, 
    allPosts,
    setActiveNav 
  } = useApp();

  const totalAccounts = allSocialAccounts.length;
  const totalPosts = allPosts.length;
  const publishedCount = allPosts.filter(p => p.status === 'published').length;

  return (
    <div className="view-container animate-fade-in" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 700, 
              color: 'var(--color-primary)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}>
              Organization Level
            </span>
            <span className="badge badge-scheduled" style={{ fontSize: '11px' }}>
              {organization.plan} Tier
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-color)', margin: 0 }}>
            Brands in {organization.name}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Manage multiple client and company brands with isolated social accounts, content pipelines, and team permissions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsCreateBrandOpen(true)}
        >
          Add New Brand
        </Button>
      </div>

      {/* Organization Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '28px' 
      }}>
        <div style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Active Brands</span>
            <Layers size={18} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-color)' }}>
            {allBrands.length}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Under {organization.name}
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Total Connected Accounts</span>
            <Share2 size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-color)' }}>
            {totalAccounts}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Across all {allBrands.length} brands
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Total Posts Managed</span>
            <FileText size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-color)' }}>
            {totalPosts}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {publishedCount} live published
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '18px 20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Plan Capacity</span>
            <ShieldCheck size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-color)' }}>
            Unlimited
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>
            Agency License Active
          </span>
        </div>
      </div>

      {/* Brands Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
        gap: '20px' 
      }}>
        {allBrands.map(brand => {
          const brandAccounts = allSocialAccounts.filter(a => a.brandId === brand.id);
          const brandPosts = allPosts.filter(p => p.brandId === brand.id);
          const isCurrent = brand.id === currentBrand.id;

          return (
            <div 
              key={brand.id}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderRadius: 'var(--radius-xl)',
                border: isCurrent ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                boxShadow: isCurrent ? '0 4px 16px rgba(99, 102, 241, 0.15)' : 'var(--shadow-sm)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {isCurrent && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  Active Brand
                </div>
              )}

              <div style={{ padding: '20px', flex: 1 }}>
                {/* Brand Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '10px', 
                      objectFit: 'cover',
                      border: '1px solid var(--border-color)'
                    }} 
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-color)', margin: 0 }}>
                      {brand.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                      <span className="badge badge-draft" style={{ fontSize: '10px', padding: '1px 6px' }}>
                        {brand.industry}
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 16px 0', minHeight: '35px' }}>
                  {brand.description || 'No description provided.'}
                </p>

                {/* Metadata details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {brand.website && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Globe size={13} />
                      <a href={brand.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                        {brand.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} />
                    <span>{brand.timezone}</span>
                  </div>
                </div>

                {/* Connected Channels */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-light)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Connected Channels ({brandAccounts.length})
                  </div>
                  {brandAccounts.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {brandAccounts.map(acc => (
                        <div 
                          key={acc.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            backgroundColor: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '11px'
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{acc.platform}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{acc.username}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No social accounts connected yet
                    </span>
                  )}
                </div>

                {/* Quick stats row */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '8px', 
                  backgroundColor: 'var(--bg-color)',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-color)' }}>
                      {brandAccounts.length}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Accounts</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-color)' }}>
                      {brandPosts.length}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Posts</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-color)' }}>
                      {brand.memberCount || 1}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Members</div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ 
                padding: '12px 20px', 
                borderTop: '1px solid var(--border-color)', 
                backgroundColor: 'rgba(0,0,0,0.01)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    switchBrand(brand.id);
                    setActiveNav('settings');
                  }}
                  style={{ fontSize: '12px' }}
                >
                  Brand Settings
                </button>

                <button
                  className={`btn btn-sm ${isCurrent ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => {
                    switchBrand(brand.id);
                    setActiveNav('dashboard');
                  }}
                  style={{ fontSize: '12px', gap: '6px' }}
                >
                  <span>{isCurrent ? 'Go to Dashboard' : 'Switch & Open'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
