import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { PlatformBadge, StatusBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { PlatformPreviews } from '../composer/PlatformPreviews';
import { 
  X, 
  Check, 
  AlertCircle, 
  RotateCcw, 
  Send, 
  Clock, 
  Calendar, 
  User, 
  Layers, 
  AtSign,
  History,
  MessageSquare
} from 'lucide-react';

export const PostReviewDrawer: React.FC = () => {
  const { 
    reviewDrawerPost, 
    closeReviewDrawer, 
    approvePost, 
    rejectPost, 
    requestChangesPost, 
    currentBrand,
    currentUser,
    showToast 
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState<'comments' | 'audit'>('comments');

  if (!reviewDrawerPost) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    approvePost(reviewDrawerPost.id, commentText);
    setCommentText('');
    showToast('success', 'Feedback comment added.');
  };

  const handleQuickMention = (name: string) => {
    setCommentText(prev => prev + `@${name} `);
  };

  return (
    <div className="drawer-overlay" onClick={closeReviewDrawer}>
      <div 
        className="drawer-container"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <h2 className="modal-title">Content Review & Feedback</h2>
            <StatusBadge status={reviewDrawerPost.status} />
          </div>
          <button 
            className="btn btn-ghost btn-icon-only"
            onClick={closeReviewDrawer}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content Body: Two Columns */}
        <div className="flex-1 overflow-y-auto" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', minHeight: 0 }}>
          {/* Left Column: Live Platform Feed Preview */}
          <div 
            className="p-6 border-r border-subtle flex flex-col items-center gap-4"
            style={{ backgroundColor: 'var(--bg-subtle)', overflowY: 'auto' }}
          >
            <span className="text-metadata">LIVE PLATFORM PREVIEW</span>
            <PlatformPreviews
              content={reviewDrawerPost.content}
              mediaUrls={reviewDrawerPost.mediaUrls}
              mediaType={reviewDrawerPost.mediaType || 'image'}
              selectedPlatforms={reviewDrawerPost.platforms}
              platformCustomizations={reviewDrawerPost.platformCustomizations || {}}
            />
          </div>

          {/* Right Column: Metadata, Comments, and Audit Log */}
          <div className="p-6 flex flex-col gap-5 overflow-y-auto">
            {/* Metadata Summary */}
            <div className="flex flex-col gap-2.5 p-3.5 bg-subtle border border-subtle rounded-lg text-caption">
              <div className="flex justify-between items-center">
                <span className="text-muted flex items-center gap-1.5"><User size={13} /> Author:</span>
                <div className="flex items-center gap-1.5 font-semibold text-primary">
                  <Avatar src={reviewDrawerPost.author.avatar} name={reviewDrawerPost.author.name} size="sm" />
                  <span>{reviewDrawerPost.author.name} ({reviewDrawerPost.author.role})</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted flex items-center gap-1.5"><Layers size={13} /> Brand:</span>
                <span className="font-semibold text-primary">{currentBrand.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted flex items-center gap-1.5"><Calendar size={13} /> Scheduled For:</span>
                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {reviewDrawerPost.scheduledTime || 'Unscheduled Draft'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted">Target Channels:</span>
                <div className="flex gap-1">
                  {reviewDrawerPost.platforms.map(p => (
                    <PlatformBadge key={p} platform={p} showName={false} />
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle Tabs: Feedback Comments vs Audit Timeline */}
            <div className="tabs">
              <button
                className={`tab-item ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                <MessageSquare size={14} />
                <span>Comments & Feedback ({reviewDrawerPost.comments.length})</span>
              </button>
              <button
                className={`tab-item ${activeTab === 'audit' ? 'active' : ''}`}
                onClick={() => setActiveTab('audit')}
              >
                <History size={14} />
                <span>Activity & Audit ({reviewDrawerPost.auditLog.length})</span>
              </button>
            </div>

            {/* TAB 1: COMMENTS */}
            {activeTab === 'comments' && (
              <div className="flex flex-col gap-4 flex-1">
                <div className="comments-thread">
                  {reviewDrawerPost.comments.length === 0 ? (
                    <div className="py-6 text-center text-muted text-caption">
                      No comments yet. Leave feedback or @mention team members below.
                    </div>
                  ) : (
                    reviewDrawerPost.comments.map(c => (
                      <div key={c.id} className="comment-bubble">
                        <div className="comment-header">
                          <span className="comment-author">{c.authorName} ({c.authorRole})</span>
                          <span className="comment-time">{c.createdAt}</span>
                        </div>
                        <p className="comment-body">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Mention shortcuts */}
                <div className="flex items-center gap-1.5 text-caption">
                  <span className="text-muted">Mention:</span>
                  {['Sarah', 'David', 'Alex', 'Michael'].map(name => (
                    <button
                      key={name}
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '2px 6px', fontSize: '11px', color: 'var(--color-primary)' }}
                      onClick={() => handleQuickMention(name)}
                    >
                      @{name}
                    </button>
                  ))}
                </div>

                {/* Add Feedback Input */}
                <form onSubmit={handleAddComment} className="flex flex-col gap-2">
                  <div className="search-input-wrap">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add review feedback or instruction... (@mention supported)"
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      icon={<Send size={13} />}
                      disabled={!commentText.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: AUDIT LOG TIMELINE */}
            {activeTab === 'audit' && (
              <div className="audit-timeline">
                {reviewDrawerPost.auditLog.map(entry => (
                  <div key={entry.id} className="audit-item">
                    <div className="audit-dot" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{entry.action}</span>
                    <span className="text-caption">By <strong>{entry.user}</strong> • {entry.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <Button
            variant="danger"
            onClick={() => rejectPost(reviewDrawerPost.id, 'Declined during final review')}
          >
            <X size={15} /> Reject
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon={<RotateCcw size={14} />}
              onClick={() => requestChangesPost(reviewDrawerPost.id, 'Minor edits requested')}
            >
              Request Changes
            </Button>
            <Button
              variant="primary"
              icon={<Check size={15} />}
              onClick={() => approvePost(reviewDrawerPost.id, 'Approved and ready to schedule')}
            >
              Approve Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
