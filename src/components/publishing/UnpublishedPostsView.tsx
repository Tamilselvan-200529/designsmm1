import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { PlatformBadge, StatusBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { 
  Search, 
  FileEdit, 
  Trash2, 
  AlertCircle, 
  Building2,
  ChevronRight,
  Plus
} from 'lucide-react';

export const UnpublishedPostsView: React.FC = () => {
  const { 
    posts, 
    organization,
    currentBrand,
    openComposer, 
    deletePost,   } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'rejected' | 'draft' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Unpublished posts = all posts that are NOT 'published' and NOT 'scheduled'
  // i.e., draft, rejected, failed, (and optionally pending can be listed or redirected to approval queue)
  const unpublishedPosts = posts.filter(p => p.status === 'rejected' || p.status === 'draft' || p.status === 'failed');

  const counts = {
    all: unpublishedPosts.length,
    rejected: unpublishedPosts.filter(p => p.status === 'rejected').length,
    draft: unpublishedPosts.filter(p => p.status === 'draft').length,
    failed: unpublishedPosts.filter(p => p.status === 'failed').length,
  };

  const filteredPosts = unpublishedPosts.filter(post => {
    if (activeTab !== 'all' && post.status !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.content.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q) ||
        (post.rejectionReason && post.rejectionReason.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* ── Hierarchy Breadcrumb: Organization → Brand → Unpublished Posts ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500
      }}>
        <Building2 size={13} />
        <span>{organization.name}</span>
        <ChevronRight size={12} />
        <span style={{ color: currentBrand?.color || 'var(--color-primary)', fontWeight: 600 }}>
          {currentBrand?.name}
        </span>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Unpublished Posts</span>
      </div>

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-title-wrap">
          <div className="flex items-center gap-2">
            <h1 className="text-display" style={{ fontSize: '24px' }}>Unpublished Posts</h1>
            {counts.rejected > 0 && (
              <span className="badge" style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)', fontSize: '11.5px', fontWeight: 600 }}>
                {counts.rejected} Rejected
              </span>
            )}
          </div>
          <p className="text-body">
            Posts that have not been published, including drafts and posts rejected during approval.
          </p>
        </div>


      </div>

      {/* ── Filter Tabs & Search Bar ── */}
      <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '5px 14px', fontSize: '12.5px' }}
            onClick={() => setActiveTab('all')}
          >
            All Unpublished ({counts.all})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'rejected' ? 'btn-danger' : 'btn-ghost'}`}
            style={{ 
              borderRadius: 'var(--radius-full)', 
              padding: '5px 14px', 
              fontSize: '12.5px',
              backgroundColor: activeTab === 'rejected' ? '#dc2626' : undefined,
              color: activeTab === 'rejected' ? '#ffffff' : counts.rejected > 0 ? '#dc2626' : undefined
            }}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected ({counts.rejected})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'draft' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '5px 14px', fontSize: '12.5px' }}
            onClick={() => setActiveTab('draft')}
          >
            Drafts ({counts.draft})
          </button>
          {counts.failed > 0 && (
            <button
              className={`btn btn-sm ${activeTab === 'failed' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '5px 14px', fontSize: '12.5px' }}
              onClick={() => setActiveTab('failed')}
            >
              Failed ({counts.failed})
            </button>
          )}
        </div>

        <div style={{ position: 'relative', minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search unpublished posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '6px 12px 6px 30px',
              fontSize: '13px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              width: '100%',
              backgroundColor: 'var(--bg-subtle)'
            }}
          />
        </div>
      </div>

      {/* ── Compact Cards List ── */}
      {filteredPosts.length === 0 ? (
        <div className="card empty-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div className="empty-state-icon" style={{ margin: '0 auto 12px' }}>
            <FileEdit size={32} color="var(--text-muted)" />
          </div>
          <h3 className="empty-state-title" style={{ fontSize: '16px', fontWeight: 600 }}>
            {activeTab === 'rejected' ? 'No rejected posts' : 'No unpublished posts found'}
          </h3>
          <p className="empty-state-desc" style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '400px', margin: '4px auto 16px' }}>
            {activeTab === 'rejected' 
              ? 'Great news! All submitted posts have either been approved or are currently pending review.'
              : 'Posts that you save as draft or that are rejected during approval will appear here.'}
          </p>
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => openComposer()}
          >
            Create New Draft
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredPosts.map(post => {
            const isRejected = post.status === 'rejected';

            return (
              <div
                key={post.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: isRejected ? '#fffbfb' : '#ffffff',
                  border: isRejected ? '1px solid #fecaca' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                {/* Thumbnail if available */}
                {post.mediaUrls?.[0] && (
                  <img
                    src={post.mediaUrls[0]}
                    alt=""
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '6px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />
                )}

                {/* Content details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Row 1: Creator + Date + Platforms + Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <Avatar src={post.author.avatar} name={post.author.name} size="sm" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {post.author.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-subtle)', padding: '1px 6px', borderRadius: '4px' }}>
                      {post.author.role}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      • {post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently'}
                    </span>

                    {/* Social platforms */}
                    <div style={{ display: 'flex', gap: '3px', marginLeft: '4px' }}>
                      {post.platforms.map(p => (
                        <PlatformBadge key={p} platform={p} showName={false} />
                      ))}
                    </div>

                    {/* Prominent Status Chip */}
                    <div style={{ marginLeft: 'auto' }}>
                      {isRejected ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fca5a5'
                        }}>
                          <AlertCircle size={12} />
                          Rejected
                        </span>
                      ) : (
                        <StatusBadge status={post.status} showIcon={false} />
                      )}
                    </div>
                  </div>

                  {/* Row 2: Post text preview */}
                  <p style={{
                    fontSize: '13.5px',
                    color: 'var(--text-primary)',
                    margin: '0 0 6px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.45
                  }}>
                    {post.content}
                  </p>

                  {/* Rejection notice / feedback reason if rejected */}
                  {isRejected && post.rejectionReason && (
                    <div style={{
                      padding: '6px 10px',
                      borderRadius: '4px',
                      backgroundColor: '#fff1f2',
                      border: '1px solid #ffe4e6',
                      fontSize: '12px',
                      color: '#be123c',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <strong>Reason:</strong>
                      <span>{post.rejectionReason}</span>
                    </div>
                  )}

                  {/* Row 3: Action buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {post.scheduledTime && (
                        <span>Original target: {post.scheduledTime}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>

                      <button
                        className="btn btn-sm btn-ghost"
                        style={{ padding: '4px 8px', fontSize: '12px', color: '#dc2626' }}
                        onClick={() => deletePost(post.id)}
                        title="Delete post"
                      >
                        <Trash2 size={13} />
                      </button>

                      <Button
                        variant="primary"
                        size="sm"
                        icon={<FileEdit size={13} />}
                        onClick={() => openComposer(post)}
                      >
                        {isRejected ? 'Edit & Resubmit' : 'Edit Post'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}


    </div>
  );
};
