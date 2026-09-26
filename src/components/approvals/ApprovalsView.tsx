import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlatformBadge, StatusBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { CheckSquare, Check, X, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import type { Post } from '../../types';
import { DEFAULT_ROLE_PERMISSIONS } from '../../utils/rbac';

export const ApprovalsView: React.FC = () => {
  const { posts, approvePost, rejectPost, currentMember, currentUser, setActiveNav } = useApp();

  // Rejection modal state
  const [rejectModalPost, setRejectModalPost] = useState<Post | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  // Resolve approve / reject capability from the fixed predefined permission matrix.
  const rolePerms = DEFAULT_ROLE_PERMISSIONS[currentUser.role];
  const canApprove = rolePerms?.approvals?.approvePosts ?? false;
  const canReject  = rolePerms?.approvals?.rejectPosts  ?? false;
  // A user who can approve OR reject has some approval capability (show them the queue)
  const hasAnyApprovalPerm = canApprove || canReject;

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setRejectionError('Rejection reason is required.');
      return;
    }
    if (rejectModalPost) {
      rejectPost(rejectModalPost.id, rejectionReason.trim());
      setRejectModalPost(null);
      setRejectionReason('');
      setRejectionError('');
    }
  };

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const recentlyProcessed = posts
    .filter(p => p.status === 'scheduled' || p.status === 'published')
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <div className="flex items-center gap-2">
            <h1 className="text-display" style={{ fontSize: '24px' }}>Approval Queue</h1>
            {pendingPosts.length > 0 && (
              <span className="badge badge-pending">{pendingPosts.length} Awaiting</span>
            )}
          </div>
          <p className="text-body">Review posts before they are published.</p>
        </div>
      </div>

      {/* Simplified workflow indicator: Draft → Approval */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '6px 14px', borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-subtle)',
        width: 'fit-content'
      }}>
        <span className="badge badge-draft" style={{ fontSize: '11px' }}>Draft</span>
        <ArrowRight size={13} color="var(--text-muted)" />
        <span className="badge badge-pending" style={{ fontSize: '11px' }}>Approval</span>
      </div>

      {!hasAnyApprovalPerm && (
        <div style={{
          padding: '10px 14px', borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(234,88,12,0.06)', border: '1px solid rgba(234,88,12,0.2)',
          fontSize: '12.5px', color: '#c2410c'
        }}>
          🔒 Your role (<strong>{currentUser.role}</strong>) does not have approval permissions.
          Contact your Admin to enable Approve Posts or Reject Posts for this role.
        </div>
      )}

      {/* Pending Approvals */}
      <div className="flex flex-col gap-3">
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Items Requiring Your Decision
        </h2>

        {pendingPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><CheckSquare size={28} /></div>
            <h3 className="empty-state-title">Nothing needs your approval</h3>
            <p className="empty-state-desc">All submitted content has been reviewed.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {pendingPosts.map(post => (
              <div
                key={post.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '12px 14px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Thumbnail (if any) */}
                {post.mediaUrls?.[0] && (
                  <img
                    src={post.mediaUrls[0]}
                    alt=""
                    style={{ width: '52px', height: '52px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                  />
                )}

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Row 1: author + time + platforms */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <Avatar src={post.author.avatar} name={post.author.name} size="sm" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {post.author.name}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-subtle)', padding: '1px 6px', borderRadius: '4px' }}>
                      {post.author.role}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} /> Today
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                      <span className="badge badge-pending" style={{ fontSize: '11px', padding: '1px 8px' }}>
                        Pending Approval
                      </span>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {post.platforms.map(p => (
                          <PlatformBadge key={p} platform={p} showName={false} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: post text preview */}
                  <p style={{
                    fontSize: '13.5px', color: 'var(--text-primary)', margin: '0 0 6px 0',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', lineHeight: 1.5
                  }}>
                    {post.content}
                  </p>

                  {/* Row 3: schedule info + actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    {post.scheduledTime ? (
                      <span style={{ fontSize: '11.5px', color: 'var(--color-primary)', fontWeight: 600 }}>
                        📅 Scheduled: {post.scheduledTime}
                      </span>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Publishes immediately on approval
                      </span>
                    )}

                    {hasAnyApprovalPerm ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {canReject && (
                          <button
                            className="btn btn-sm"
                            style={{
                              display: 'flex', alignItems: 'center', gap: '5px',
                              padding: '5px 12px', fontSize: '12.5px', fontWeight: 600,
                              border: '1px solid #dc2626', color: '#dc2626',
                              backgroundColor: 'rgba(220,38,38,0.05)', borderRadius: 'var(--radius-md)',
                              cursor: 'pointer', transition: 'all var(--transition-fast)'
                            }}
                            onClick={() => {
                              setRejectModalPost(post);
                              setRejectionReason('');
                              setRejectionError('');
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(220,38,38,0.12)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(220,38,38,0.05)'; }}
                          >
                            <X size={13} /> Reject
                          </button>
                        )}
                        {canApprove && (
                          <button
                            className="btn btn-sm"
                            style={{
                              display: 'flex', alignItems: 'center', gap: '5px',
                              padding: '5px 12px', fontSize: '12.5px', fontWeight: 600,
                              border: '1px solid #16a34a', color: '#16a34a',
                              backgroundColor: 'rgba(22,163,74,0.05)', borderRadius: 'var(--radius-md)',
                              cursor: 'pointer', transition: 'all var(--transition-fast)'
                            }}
                            onClick={() => approvePost(post.id)}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(22,163,74,0.12)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(22,163,74,0.05)'; }}
                          >
                            <Check size={13} /> Approve
                          </button>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Approval permissions required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Processed */}
      {recentlyProcessed.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recently Approved
          </h2>
          <div className="flex flex-col gap-1">
            {recentlyProcessed.map(post => (
              <div
                key={post.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                }}
              >
                {post.mediaUrls?.[0] && (
                  <img src={post.mediaUrls[0]} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {post.content.substring(0, 70)}{post.content.length > 70 ? '...' : ''}
                  </p>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>By {post.author.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  {post.platforms.slice(0, 2).map(p => <PlatformBadge key={p} platform={p} showName={false} />)}
                  <StatusBadge status={post.status} showIcon={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Link to Unpublished Posts */}
      <div style={{ marginTop: '4px' }}>
        <button
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={() => setActiveNav('unpublished')}
        >
          View Unpublished &amp; Rejected Posts →
        </button>
      </div>

      {/* ── Reject Reason Dialog / Modal ── */}
      {rejectModalPost && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setRejectModalPost(null);
            }
          }}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg, 12px)',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Reject Post
              </h3>
              <button
                type="button"
                onClick={() => setRejectModalPost(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmReject} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Please provide a reason for rejecting this post. The rejection reason is required and will be saved with the post in Unpublished Posts.
                </p>

                <label 
                  htmlFor="rejection-reason" 
                  style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}
                >
                  Rejection Reason <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <textarea
                  id="rejection-reason"
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (rejectionError && e.target.value.trim()) {
                      setRejectionError('');
                    }
                  }}
                  placeholder="Enter rejection reason..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13.5px',
                    borderRadius: 'var(--radius-md, 6px)',
                    border: rejectionError ? '1.5px solid #dc2626' : '1px solid var(--border-subtle)',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    backgroundColor: '#ffffff'
                  }}
                  autoFocus
                />
                {rejectionError && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '12px', color: '#dc2626', fontWeight: 500 }}>
                    <AlertCircle size={13} /> {rejectionError}
                  </span>
                )}
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRejectModalPost(null)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md, 6px)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectionReason.trim()}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md, 6px)',
                    border: 'none',
                    backgroundColor: rejectionReason.trim() ? '#dc2626' : '#fca5a5',
                    color: '#ffffff',
                    cursor: rejectionReason.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Reject Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
