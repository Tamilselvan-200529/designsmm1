import React, { useState } from 'react';
import { TeamMember, TeamMemberPermissions } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ShieldCheck, Check, ChevronDown, ChevronRight } from 'lucide-react';

interface PermissionsModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, perms: Partial<TeamMemberPermissions>) => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  member,
  isOpen,
  onClose,
  onSave
}) => {
  if (!member) return null;

  const [perms, setPerms] = useState<TeamMemberPermissions>(member.permissions);
  const [openCategory, setOpenCategory] = useState<string>('contentCreation');

  const toggleAction = (category: keyof TeamMemberPermissions, action: string) => {
    setPerms(prev => {
      const catObj = { ...prev[category] } as Record<string, boolean>;
      catObj[action] = !catObj[action];
      return {
        ...prev,
        [category]: catObj
      };
    });
  };

  const handleSave = () => {
    onSave(member.id, perms);
    onClose();
  };

  const categoryConfigs: { key: keyof TeamMemberPermissions; title: string; desc: string }[] = [
    { key: 'accountConnection', title: '1. Account Connection', desc: 'Connect, disconnect, and manage social channels' },
    { key: 'contentCreation', title: '2. Content Creation', desc: 'Drafts, copy editing, media uploads, and content lifecycle' },
    { key: 'publishing', title: '3. Publishing & Scheduling', desc: 'Immediate dispatch, calendar schedule, queue management' },
    { key: 'approvals', title: '4. Approvals & Collaboration', desc: 'Submit drafts, approve, reject, and feedback commentary' },
    { key: 'analytics', title: '5. Analytics', desc: 'Audience reach, engagement metrics, overview KPIs' },
    { key: 'mediaLibrary', title: '6. Media Library', desc: 'Asset library storage, categorizations, uploads, and media maintenance' },
    { key: 'teamManagement', title: '7. Team & Organization Management', desc: 'Organization hierarchy, team invites, role assignment, and billing' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Permissions: ${member.name} (${member.role})`}
      maxWidth="580px"
    >
      <div className="flex flex-col gap-4">
        <p className="text-body" style={{ fontSize: '13px' }}>
          Configure granular 7-category permissions for this collaborator within the active brand.
        </p>

        <div className="flex flex-col gap-2.5" style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
          {categoryConfigs.map(cat => {
            const isExpanded = openCategory === cat.key;
            const catObj = perms[cat.key] as Record<string, boolean>;
            const enabledCount = Object.values(catObj).filter(Boolean).length;
            const totalCount = Object.values(catObj).length;

            return (
              <div 
                key={cat.key}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: isExpanded ? 'var(--bg-subtle)' : 'var(--card-bg)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onClick={() => setOpenCategory(isExpanded ? '' : cat.key)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-color)' }}>
                        {cat.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {cat.desc}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${enabledCount > 0 ? 'badge-published' : 'badge-draft'}`} style={{ fontSize: '10.5px' }}>
                    {enabledCount} / {totalCount} active
                  </span>
                </button>

                {isExpanded && (
                  <div style={{ padding: '8px 14px 12px 14px', backgroundColor: 'var(--bg-color)', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Object.entries(catObj).map(([action, allowed]) => (
                        <label 
                          key={action}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <span style={{ color: allowed ? 'var(--text-color)' : 'var(--text-muted)', fontWeight: allowed ? 500 : 400 }}>
                            {action.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
                          </span>
                          <input
                            type="checkbox"
                            checked={allowed}
                            onChange={() => toggleAction(cat.key, action)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-subtle">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Permissions
          </Button>
        </div>
      </div>
    </Modal>
  );
};
