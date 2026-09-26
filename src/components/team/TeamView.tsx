import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Modal } from '../common/Modal';
import { UserRole } from '../../types';
import { ROLE_CONFIG } from '../../utils/helpers';
import { getCapabilities } from '../../utils/rbac';
import { 
  UserPlus, 
  Mail, 
  User, 
  Trash2,
  ShieldCheck
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const { 
    teamMembers, 
    inviteTeamMember, 
    removeMember,
    currentBrand,
    currentUser,
    showToast 
  } = useApp();

  const caps = getCapabilities(currentUser.role);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Editor');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      showToast('warning', 'Please provide both name and email.');
      return;
    }
    inviteTeamMember({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      brandId: currentBrand.id
    });
    setInviteName('');
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  const rolesList: UserRole[] = ['Owner', 'Admin', 'Manager', 'Editor', 'Contributor', 'Analyst', 'Client'];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="text-display" style={{ fontSize: '24px' }}>Team & Access Control</h1>
          <p className="text-body">
            Manage brand collaborators, client reviewers, and granular permissions for <strong>{currentBrand.name}</strong>
          </p>
        </div>

        <div className="page-actions">
          {/* Only Admin can invite — per spec */}
          {caps.canInviteMembers && (
            <Button
              variant="primary"
              icon={<UserPlus size={15} />}
              onClick={() => setIsInviteOpen(true)}
            >
              Invite Team Member
            </Button>
          )}
        </div>
      </div>

      {/* Role Summary Banner */}
      <div className="card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-subtle)' }}>
        <span className="text-metadata" style={{ marginBottom: '8px', display: 'block' }}>SUPPORTED ROLES HIERARCHY</span>
        <div className="flex flex-wrap gap-2">
          {rolesList.map(r => (
            <div key={r} className="badge badge-draft" style={{ padding: '4px 10px', fontSize: '12px' }}>
              <strong>{r}</strong>: <span style={{ color: 'var(--text-muted)' }}>{ROLE_CONFIG[r].desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="team-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Role</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Last Active</th>
              {caps.canRemoveMembers && <th style={{ textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(member => (
              <tr key={member.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar src={member.avatar} name={member.name} size="md" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {member.email}
                </td>
                <td>
                  <span className="badge badge-scheduled" style={{ fontWeight: 600 }}>
                    {member.role}
                  </span>
                </td>
                <td>
                  <span className="text-caption font-semibold">{currentBrand.name}</span>
                </td>
                <td>
                  <span className={member.status === 'active' ? 'badge badge-published' : 'badge badge-pending'}>
                    {member.status === 'active' ? 'Active' : 'Invited'}
                  </span>
                </td>
                <td style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  {member.lastActive}
                </td>
                {/* Remove button visible to Admin only */}
                {caps.canRemoveMembers && (
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Trash2 size={13} />}
                        onClick={() => removeMember(member.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite New Team Member"
        maxWidth="480px"
      >
        <form onSubmit={handleSendInvite} className="flex flex-col gap-4">
          <p className="text-body" style={{ fontSize: '13px' }}>
            Send an invitation to join <strong>{currentBrand.name}</strong> with role-specific access permissions.
          </p>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name</label>
            <div className="search-input-wrap">
              <User size={16} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '34px' }}
                placeholder="Jane Doe"
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <div className="search-input-wrap">
              <Mail size={16} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '34px' }}
                placeholder="jane@company.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Assign Role</label>
            <select
              className="form-select"
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value as UserRole)}
            >
              {rolesList.map(r => (
                <option key={r} value={r}>
                  {r} — {ROLE_CONFIG[r].desc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-subtle">
            <Button type="button" variant="secondary" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
