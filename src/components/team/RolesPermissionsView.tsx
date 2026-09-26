import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  Check, 
  X, 
  Lock,
  CheckCircle2
} from 'lucide-react';
import { UserRole, TeamMemberPermissions } from '../../types';
import { 
  ALL_ROLES, 
  ROLE_DESCRIPTIONS, 
  PERMISSION_CATEGORIES, 
  DEFAULT_ROLE_PERMISSIONS,
  getAllowedPages
} from '../../utils/rbac';

const PAGE_DISPLAY_NAMES: Record<string, string> = {
  'dashboard': 'Dashboard',
  'calendar': 'Calendar',
  'scheduled-posts': 'Scheduled Posts',
  'content': 'Content Posts',
  'approvals': 'Multi-Stage Approvals',
  'unpublished': 'Unpublished Posts',
  'analytics': 'Analytics & Reports',
  'media': 'Media Library',
  'social': 'Channels (Social)',
  'team': 'Brand Team',
  'settings': 'Brand Settings',
  'composer': 'Content Composer',
  'org-brands': 'All Brands',
  'roles-permissions': 'Roles & Permissions',
  'org-settings': 'Org Settings',
  'billing': 'Billing & Plans'
};

export const RolesPermissionsView: React.FC = () => {
  const { currentUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Owner');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');

  const currentRolePermissions = DEFAULT_ROLE_PERMISSIONS[selectedRole];
  const allowedPagesForSelectedRole = getAllowedPages(selectedRole);

  return (
    <div className="view-container animate-fade-in" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Access Governance & Security
            </span>
            <span className="badge badge-scheduled" style={{ fontSize: '11px', padding: '2px 8px' }}>
              7 Approved Roles
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-color)', margin: 0 }}>
            Roles & Permissions Matrix
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Authoritative predefined permission matrix across 7 functional categories. All roles use fixed, secure defaults.
          </p>
        </div>

        {/* View Switcher & Admin Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ 
            display: 'flex', 
            backgroundColor: 'var(--bg-color)', 
            padding: '3px', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)' 
          }}>
            <button
              className={`btn btn-sm ${viewMode === 'matrix' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('matrix')}
              style={{ fontSize: '12px', padding: '5px 14px' }}
            >
              Comparison Matrix
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('cards')}
              style={{ fontSize: '12px', padding: '5px 14px' }}
            >
              Role Deep Dive
            </button>
          </div>
        </div>
      </div>

      {/* Role Access / Permission Notice Banner */}
      <div style={{ 
        backgroundColor: 'rgba(100, 116, 139, 0.06)', 
        border: '1px solid rgba(100, 116, 139, 0.2)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '12px 18px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px', 
            backgroundColor: '#64748b', 
            color: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Lock size={16} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-color)' }}>
              Fixed Role Model — Read-Only Matrix
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Permissions are hard-coded to secure defaults and cannot be modified. Review capabilities below.
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-draft" style={{ fontSize: '11px', padding: '3px 8px' }}>
            Read-Only
          </span>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Logged in as: <strong>{currentUser.name}</strong> ({currentUser.role})
          </span>
        </div>
      </div>

      {/* MATRIX VIEW */}
      {viewMode === 'matrix' ? (
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--border-color)', 
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ textAlign: 'left', padding: '14px 18px', fontWeight: 700, color: 'var(--text-color)', width: '310px' }}>
                    Permission Category
                  </th>
                  {ALL_ROLES.map(role => {
                    const isUserRole = role === currentUser.role;
                    return (
                      <th 
                        key={role} 
                        style={{ 
                          textAlign: 'center', 
                          padding: '14px 10px', 
                          fontWeight: 700,
                          minWidth: '95px',
                          color: isUserRole ? 'var(--color-primary)' : 'var(--text-color)',
                          backgroundColor: isUserRole ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                          borderLeft: '1px solid var(--border-color)'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                          <span>{role}</span>
                          {isUserRole && (
                            <span style={{ fontSize: '9px', color: 'var(--color-primary)', fontWeight: 700, backgroundColor: 'rgba(99, 102, 241, 0.12)', padding: '1px 5px', borderRadius: '3px' }}>
                              YOUR ROLE
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {PERMISSION_CATEGORIES.map(category => (
                  <React.Fragment key={category.key}>
                    {/* Category Title Row */}
                    <tr style={{ backgroundColor: 'rgba(0,0,0,0.025)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                      <td 
                        colSpan={ALL_ROLES.length + 1}
                        style={{ padding: '10px 18px', fontWeight: 700, fontSize: '12px', color: 'var(--text-primary)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: 'var(--color-primary)' }}>●</span>
                          <span style={{ letterSpacing: '0.01em' }}>{category.title}</span>
                          <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '11px' }}>— {category.desc}</span>
                        </div>
                      </td>
                    </tr>

                    {/* Permissions rows under this category */}
                    {category.permissions.map(perm => (
                      <tr 
                        key={perm.key}
                        style={{ 
                          borderBottom: '1px solid var(--border-color)',
                          transition: 'background-color 0.1s ease'
                        }}
                      >
                        <td style={{ padding: '9px 18px 9px 32px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            <span style={{ color: 'var(--text-color)', fontSize: '12.5px', fontWeight: 500 }}>
                              {perm.label}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>
                              {perm.desc}
                            </span>
                          </div>
                        </td>

                        {ALL_ROLES.map(role => {
                          const catObj = DEFAULT_ROLE_PERMISSIONS[role][category.key] as Record<string, boolean>;
                          const isAllowed = catObj ? Boolean(catObj[perm.key]) : false;
                          const isUserRole = role === currentUser.role;

                          return (
                            <td 
                              key={role + perm.key}
                              style={{ 
                                textAlign: 'center', 
                                padding: '8px 10px',
                                borderLeft: '1px solid var(--border-color)',
                                backgroundColor: isUserRole ? 'rgba(99, 102, 241, 0.03)' : 'transparent',
                                verticalAlign: 'middle'
                              }}
                            >
                              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isAllowed ? (
                                  <div 
                                    title={`${perm.label}: Enabled for ${role}`}
                                    style={{ 
                                      display: 'inline-flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      width: '20px', 
                                      height: '20px', 
                                      borderRadius: '50%', 
                                      backgroundColor: 'rgba(5, 150, 105, 0.1)', 
                                      color: '#059669' 
                                    }}
                                  >
                                    <Check size={12} strokeWidth={3} />
                                  </div>
                                ) : (
                                  <div 
                                    title={`${perm.label}: Disabled for ${role}`}
                                    style={{ 
                                      display: 'inline-flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      width: '20px', 
                                      height: '20px', 
                                      borderRadius: '50%', 
                                      backgroundColor: 'rgba(148, 163, 184, 0.12)', 
                                      color: '#94a3b8' 
                                    }}
                                  >
                                    <X size={12} strokeWidth={2.5} />
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ROLE DEEP DIVE (View-Only for all users) */
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
          {/* Left: Role Selection List */}
          <div style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderRadius: 'var(--radius-xl)', 
            border: '1px solid var(--border-color)',
            padding: '12px',
            height: 'fit-content'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', letterSpacing: '0.06em', padding: '6px 10px 8px 10px' }}>
              APPROVED ROLES (7)
            </div>
            {ALL_ROLES.map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: selectedRole === role ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: selectedRole === role ? 'var(--color-primary)' : 'var(--text-color)',
                  fontWeight: selectedRole === role ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '4px',
                  transition: 'background-color 0.15s'
                }}
              >
                <span>{role}</span>
                {role === currentUser.role && (
                  <span className="badge badge-scheduled" style={{ fontSize: '9px', padding: '1px 5px' }}>
                    Your Role
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right: Selected Role Deep Dive */}
          <div style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderRadius: 'var(--radius-xl)', 
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Role Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-color)' }}>
                    {selectedRole}
                  </h2>
                  {selectedRole === currentUser.role && (
                    <span className="badge badge-published" style={{ fontSize: '11px' }}>Your Active Role</span>
                  )}
                  {selectedRole === 'Admin' && (
                    <span className="badge badge-scheduled" style={{ fontSize: '11px' }}>System Administrator</span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  {ROLE_DESCRIPTIONS[selectedRole]}
                </p>
              </div>
            </div>

            {/* Accessible Pages Section */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#059669" />
                <span>Accessible Pages & Navigation Routes ({allowedPagesForSelectedRole.length})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {allowedPagesForSelectedRole.map(navId => (
                  <span 
                    key={navId} 
                    className="badge badge-published"
                    style={{ fontSize: '11.5px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Check size={11} strokeWidth={3} />
                    <span>{PAGE_DISPLAY_NAMES[navId] || navId}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Granular Permission Breakdown across all 7 Categories */}
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Functional Capabilities Breakdown
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {PERMISSION_CATEGORIES.map(category => {
                const catObj = (currentRolePermissions[category.key] || {}) as Record<string, boolean>;
                const enabledCount = category.permissions.filter(p => catObj[p.key]).length;

                return (
                  <div 
                    key={category.key}
                    style={{
                      backgroundColor: 'var(--bg-color)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-color)',
                      padding: '14px 16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-color)' }}>
                        {category.title}
                      </div>
                      <span className="badge badge-draft" style={{ fontSize: '10.5px' }}>
                        {enabledCount} / {category.permissions.length}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      {category.desc}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {category.permissions.map(perm => {
                        const isAllowed = Boolean(catObj[perm.key]);
                        return (
                          <div 
                            key={perm.key}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              fontSize: '11.5px',
                              padding: '2px 0',
                              color: isAllowed ? 'var(--text-color)' : 'var(--text-muted)'
                            }}
                          >
                            <span>{perm.label}</span>
                            {isAllowed ? (
                              <span style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}>
                                <Check size={12} strokeWidth={2.5} /> Enabled
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}>
                                <X size={12} strokeWidth={2} /> Disabled
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
