import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { PlatformBadge, StatusBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Post, PostStatus } from '../../types';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2, 
  Send, 
  Clock, 
  CheckCircle2, 
  FileCheck,
  Eye
} from 'lucide-react';

export const ContentListView: React.FC = () => {
  const { 
    posts, 
    openComposer, 
    openReviewDrawer, 
    deletePost, 
    duplicatePost, 
    savePost,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const counts = {
    all: posts.length,
    draft: posts.filter(p => p.status === 'draft').length,
    pending: posts.filter(p => p.status === 'pending').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    published: posts.filter(p => p.status === 'published').length,
    failed: posts.filter(p => p.status === 'failed').length,
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab !== 'all' && post.status !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.content.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="text-display" style={{ fontSize: '24px' }}>Content Library</h1>
          <p className="text-body">
            Manage drafts, review submissions, scheduled queues, and published posts
          </p>
        </div>

        <div className="page-actions">
          <Button
            variant="primary"
            icon={<Plus size={15} />}
            onClick={() => openComposer()}
          >
            Create Post
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Navigation Tabs */}
        <div className="tabs" style={{ padding: '0 20px', backgroundColor: '#ffffff' }}>
          <button
            className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>All Posts</span>
            <span className="tab-count">{counts.all}</span>
          </button>

          <button
            className={`tab-item ${activeTab === 'draft' ? 'active' : ''}`}
            onClick={() => setActiveTab('draft')}
          >
            <span>Drafts</span>
            <span className="tab-count">{counts.draft}</span>
          </button>

          <button
            className={`tab-item ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <span>Pending Approval</span>
            <span className="tab-count">{counts.pending}</span>
          </button>

          <button
            className={`tab-item ${activeTab === 'scheduled' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduled')}
          >
            <span>Scheduled</span>
            <span className="tab-count">{counts.scheduled}</span>
          </button>

          <button
            className={`tab-item ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            <span>Published</span>
            <span className="tab-count">{counts.published}</span>
          </button>

          <button
            className={`tab-item ${activeTab === 'failed' ? 'active' : ''}`}
            onClick={() => setActiveTab('failed')}
          >
            <span>Failed</span>
            <span className="tab-count">{counts.failed}</span>
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div 
          className="flex items-center justify-between p-4 border-b border-subtle"
          style={{ padding: '12px 20px', backgroundColor: 'var(--bg-subtle)' }}
        >
          <div className="search-input-wrap" style={{ maxWidth: '320px', width: '100%' }}>
            <Search size={15} />
            <input
              type="text"
              className="form-input search-input"
              style={{ paddingLeft: '32px', height: '34px', fontSize: '13px' }}
              placeholder="Search captions or authors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <span className="text-caption">
            Showing <strong>{filteredPosts.length}</strong> items
          </span>
        </div>

        {/* Posts Table / Responsive View */}
        {filteredPosts.length === 0 ? (
          <div className="py-12 text-center text-muted">
            <p className="text-body" style={{ fontWeight: 500 }}>No posts found in this view.</p>
            <p className="text-caption" style={{ marginTop: '4px' }}>
              Create a new draft or select another filter tab.
            </p>
          </div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="team-table">
              <thead>
                <tr>
                  <th style={{ width: '64px' }}>Media</th>
                  <th>Post Content</th>
                  <th>Platforms</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Schedule / Published</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => (
                  <tr key={post.id}>
                    <td>
                      {post.mediaUrls[0] ? (
                        <img
                          src={post.mediaUrls[0]}
                          alt="Thumbnail"
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover',
                            border: '1px solid var(--border-subtle)'
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--bg-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-light)',
                            fontSize: '10px'
                          }}
                        >
                          Text
                        </div>
                      )}
                    </td>

                    <td style={{ maxWidth: '340px' }}>
                      <p 
                        style={{ 
                          fontWeight: 500, 
                          color: 'var(--text-primary)', 
                          fontSize: '13.5px',
                          lineClamp: 2, 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                        onClick={() => openReviewDrawer(post)}
                      >
                        {post.content}
                      </p>
                      {post.rejectionReason && (
                        <span className="text-caption" style={{ color: '#dc2626', marginTop: '2px', display: 'block' }}>
                          Error: {post.rejectionReason}
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="flex gap-1 flex-wrap">
                        {post.platforms.map(p => (
                          <PlatformBadge key={p} platform={p} showName={false} />
                        ))}
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar src={post.author.avatar} name={post.author.name} size="sm" />
                        <div className="flex flex-col">
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{post.author.name}</span>
                          <span className="text-caption">{post.author.role}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <StatusBadge status={post.status} />
                    </td>

                    <td>
                      <div className="flex flex-col">
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {post.scheduledTime || post.publishedTime || 'Not scheduled'}
                        </span>
                        <span className="text-caption">
                          Created {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="btn btn-ghost btn-icon-only btn-sm"
                          title="View / Inspect Details"
                          onClick={() => openReviewDrawer(post)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon-only btn-sm"
                          title="Edit Post"
                          onClick={() => openComposer(post)}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon-only btn-sm"
                          title="Duplicate as Draft"
                          onClick={() => duplicatePost(post.id)}
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon-only btn-sm"
                          style={{ color: '#dc2626' }}
                          title="Delete Post"
                          onClick={() => deletePost(post.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
