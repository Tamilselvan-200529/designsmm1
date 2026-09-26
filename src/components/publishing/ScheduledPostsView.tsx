import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { PlatformBadge } from '../common/Badge';
import { Post, SocialPlatform } from '../../types';
import {
  Calendar,
  PenSquare,
  Search,
  Filter,
  Clock,
  Repeat,
  Layers,
  AlignLeft,
  Image as ImageIcon,
  Film,
  Play,
  ChevronDown,
  X
} from 'lucide-react';

// ── helpers ────────────────────────────────────────────────────
const PLATFORM_FILTER_OPTIONS: { value: SocialPlatform | 'all'; label: string }[] = [
  { value: 'all',       label: 'All Platforms' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook',  label: 'Facebook' },
  { value: 'linkedin',  label: 'LinkedIn' },
  { value: 'tiktok',   label: 'TikTok' },
  { value: 'youtube',  label: 'YouTube' },
];

const SCHEDULE_TYPES: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  custom:    { label: 'Custom',    color: '#4f46e5', bg: 'rgba(99,102,241,0.09)',   icon: <Clock size={11} /> },
  queue:     { label: 'Queue',     color: '#0891b2', bg: 'rgba(8,145,178,0.09)',    icon: <Layers size={11} /> },
  recurring: { label: 'Recurring', color: '#16a34a', bg: 'rgba(22,163,74,0.09)',    icon: <Repeat size={11} /> },
};

// Simple heuristic: assign a schedule type based on post id (for mock variety)
function getScheduleType(postId: string): 'custom' | 'queue' | 'recurring' {
  const n = parseInt(postId.replace(/\D/g, ''), 10) || 0;
  if (n % 3 === 0) return 'recurring';
  if (n % 2 === 0) return 'queue';
  return 'custom';
}

// ── Media preview cell ──────────────────────────────────────────
const MediaPreviewCell: React.FC<{ post: Post }> = ({ post }) => {
  const { mediaType, mediaUrls, content } = post;

  const hasMedia = mediaUrls && mediaUrls.length > 0;
  const thumb = hasMedia ? mediaUrls[0] : null;

  if (!hasMedia || mediaType === 'text') {
    // Text-only
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', maxWidth: '380px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
          backgroundColor: 'rgba(99,102,241,0.08)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <AlignLeft size={15} color="var(--color-primary)" />
        </div>
        <p style={{
          fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.45,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {content}
        </p>
      </div>
    );
  }

  const isVideo = mediaType === 'video';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', maxWidth: '380px' }}>
      {/* Thumbnail / preview */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={thumb!}
          alt="media"
          style={{
            width: '52px', height: '52px', borderRadius: '8px',
            objectFit: 'cover', border: '1px solid var(--border-subtle)'
          }}
        />
        {isVideo && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.38)', borderRadius: '8px'
          }}>
            <Play size={16} color="#fff" fill="#fff" />
          </div>
        )}
        {/* Media type badge */}
        <div style={{
          position: 'absolute', bottom: '-5px', right: '-5px',
          width: '18px', height: '18px', borderRadius: '50%',
          backgroundColor: isVideo ? '#1d1d1d' : '#4f46e5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid #fff'
        }}>
          {isVideo ? <Film size={9} color="#fff" /> : <ImageIcon size={9} color="#fff" />}
        </div>
      </div>
      {/* Caption */}
      <p style={{
        fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.45,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
      }}>
        {content}
      </p>
    </div>
  );
};

// ── Main view ────────────────────────────────────────────────────
export const ScheduledPostsView: React.FC = () => {
  const {
    currentBrand,
    currentMember,
    posts,
    openComposer,
    openReviewDrawer,
    reschedulePost,
  } = useApp();

  const [searchQuery, setSearchQuery]   = useState('');
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | 'all'>('all');
  const [isPlatformDropOpen, setIsPlatformDropOpen] = useState(false);

  // Only show 'scheduled' posts for the current brand (already filtered by context)
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');

  // Apply search
  const filteredPosts = scheduledPosts.filter(post => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      post.content.toLowerCase().includes(q) ||
      post.author.name.toLowerCase().includes(q) ||
      post.platforms.some(pl => pl.toLowerCase().includes(q));

    const matchesPlatform =
      platformFilter === 'all' || post.platforms.includes(platformFilter);

    return matchesSearch && matchesPlatform;
  });

  const activePlatformLabel =
    PLATFORM_FILTER_OPTIONS.find(o => o.value === platformFilter)?.label ?? 'All Platforms';

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="text-display" style={{ fontSize: '24px' }}>Scheduled Posts</h1>
          <p className="text-body">
            Upcoming scheduled content for <strong>{currentBrand.name}</strong>
            {currentMember && (
              <span style={{ color: 'var(--text-muted)' }}> · viewed as <strong>{currentMember.name}</strong></span>
            )}
          </p>
        </div>
        <div className="page-actions">
          <Button
            variant="primary"
            icon={<PenSquare size={15} />}
            onClick={() => openComposer()}
          >
            Create Post
          </Button>
        </div>
      </div>

      {/* ── Filters bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '340px' }}>
          <Search size={15} color="var(--text-muted)" style={{
            position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search posts, authors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', paddingLeft: '34px', paddingRight: searchQuery ? '30px' : '12px',
              paddingTop: '8px', paddingBottom: '8px',
              fontSize: '13px', border: '1px solid var(--border-subtle)',
              borderRadius: '8px', outline: 'none', backgroundColor: '#fff',
              color: 'var(--text-primary)', boxShadow: 'var(--shadow-xs)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Platform filter */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsPlatformDropOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 12px',
              border: platformFilter !== 'all' ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              borderRadius: '8px', backgroundColor: platformFilter !== 'all' ? 'var(--color-primary-light)' : '#fff',
              color: platformFilter !== 'all' ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <Filter size={14} />
            {activePlatformLabel}
            <ChevronDown size={13} style={{ transform: isPlatformDropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>

          {isPlatformDropOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 990 }}
                onClick={() => setIsPlatformDropOpen(false)}
              />
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 1000,
                backgroundColor: '#fff', border: '1px solid var(--border-subtle)',
                borderRadius: '10px', boxShadow: '0 12px 30px rgba(15,23,42,0.15)',
                padding: '6px', minWidth: '160px'
              }}>
                {PLATFORM_FILTER_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setPlatformFilter(opt.value as SocialPlatform | 'all'); setIsPlatformDropOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', width: '100%',
                      padding: '7px 10px', borderRadius: '6px', border: 'none',
                      cursor: 'pointer', fontSize: '13px',
                      backgroundColor: platformFilter === opt.value ? 'var(--color-primary-light)' : 'transparent',
                      color: platformFilter === opt.value ? 'var(--color-primary)' : 'var(--text-primary)',
                      fontWeight: platformFilter === opt.value ? 600 : 400
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
          {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      {/* ── Table / List ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredPosts.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '64px 24px', gap: '12px'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              backgroundColor: 'var(--color-primary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Calendar size={26} color="var(--color-primary)" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              No scheduled posts
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, textAlign: 'center', maxWidth: '300px' }}>
              {searchQuery || platformFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Use "Create Post" to schedule your first post for this brand.'}
            </p>
            {!searchQuery && platformFilter === 'all' && (
              <Button variant="primary" icon={<PenSquare size={14} />} onClick={() => openComposer()}>
                Create Post
              </Button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
                  {['Scheduled On', 'Post Content', 'Scheduled For', 'Schedule Type', 'Scheduled By', ''].map((col, i) => (
                    <th key={i} style={{
                      padding: '11px 16px', fontSize: '11.5px', fontWeight: 700,
                      color: 'var(--text-muted)', textAlign: 'left', letterSpacing: '0.04em',
                      textTransform: 'uppercase', whiteSpace: 'nowrap'
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, idx) => {
                  const schedType = getScheduleType(post.id);
                  const st = SCHEDULE_TYPES[schedType];
                  const isLast = idx === filteredPosts.length - 1;

                  return (
                    <tr
                      key={post.id}
                      style={{
                        borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
                        transition: 'background-color 0.12s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Scheduled On */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-primary)' }}>
                            {post.scheduledTime || '—'}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Created {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                          </span>
                        </div>
                      </td>

                      {/* Post Content */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', maxWidth: '400px' }}>
                        <MediaPreviewCell post={post} />
                      </td>

                      {/* Scheduled For (platforms) */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', maxWidth: '180px' }}>
                          {post.platforms.map(p => (
                            <PlatformBadge key={p} platform={p} showName={true} />
                          ))}
                        </div>
                      </td>

                      {/* Schedule Type */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '4px 10px', borderRadius: '20px',
                          fontSize: '11.5px', fontWeight: 700,
                          backgroundColor: st.bg, color: st.color
                        }}>
                          {st.icon}
                          {st.label}
                        </span>
                      </td>

                      {/* Scheduled By */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Avatar
                            src={post.author.avatar}
                            name={post.author.name}
                            size="sm"
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {post.author.name}
                            </span>
                            <span style={{
                              fontSize: '10.5px', fontWeight: 600, padding: '1px 6px',
                              borderRadius: '4px', backgroundColor: 'var(--bg-muted)',
                              color: 'var(--text-muted)', alignSelf: 'flex-start'
                            }}>
                              {post.author.role}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openReviewDrawer(post)}
                          >
                            View
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Calendar size={13} />}
                            onClick={() => {
                              const newTime = window.prompt('Reschedule to (e.g. Monday at 10:00 AM):', post.scheduledTime || '');
                              if (newTime) reschedulePost(post.id, newTime);
                            }}
                          >
                            Reschedule
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
