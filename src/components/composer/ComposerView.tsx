import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { PlatformSelector } from './PlatformSelector';
import { PlatformPreviews } from './PlatformPreviews';
import { MediaValidationNotice } from './MediaValidationNotice';
import { EmojiPicker } from './EmojiPicker';
import { AltTextModal } from './AltTextModal';
import { ThumbnailSelector } from './ThumbnailSelector';
import { LinkAttachmentCard } from './LinkAttachmentCard';
import { PLATFORM_CONFIG } from '../../utils/helpers';
import { SocialPlatform } from '../../types';
import { 
  Upload, 
  Image as ImageIcon, 
  Hash, 
  Smile, 
  Link2, 
  X, 
  FolderOpen,
  Send,
  Calendar,
  FileCheck,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';

export const ComposerView: React.FC = () => {
  const { 
    editingPost, 
    savePost, 
    mediaItems, 
    currentBrand,
    currentMember,
    setActiveNav,
    showToast 
  } = useApp();

  // Role-based publishing capability
  const canPublishDirectly = currentMember 
    ? ['Owner', 'Admin', 'Manager'].includes(currentMember.role)
    : true;

  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['instagram', 'facebook', 'linkedin', 'tiktok', 'youtube']);
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'text' | 'image' | 'video' | 'carousel' | 'link'>('image');
  
  // Publishing options
  const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  
  // Alt text & thumbnails
  const [altTexts, setAltTexts] = useState<Record<string, string>>({});
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  // Link attachment
  const [isLinkAttached, setIsLinkAttached] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDomain, setLinkDomain] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [linkImage, setLinkImage] = useState('');

  // UI state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingPost) {
      setSelectedPlatforms(editingPost.platforms.filter(p => ['instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'].includes(p)));
      setContent(editingPost.content);
      setMediaUrls(editingPost.mediaUrls || []);
      setMediaType(editingPost.mediaType || (editingPost.mediaUrls?.length > 1 ? 'carousel' : 'image'));
      setAltTexts(editingPost.altTexts || {});
      setThumbnailUrl(editingPost.thumbnailUrl || '');
      if (editingPost.linkUrl) {
        setIsLinkAttached(true);
        setLinkUrl(editingPost.linkUrl);
        setLinkTitle(editingPost.linkTitle || '');
        setLinkDomain(editingPost.linkDomain || '');
        setLinkDescription(editingPost.linkDescription || '');
        setLinkImage(editingPost.linkImage || '');
      }
      if (editingPost.status === 'scheduled') {
        setPublishMode('schedule');
        setScheduledDateTime(new Date().toISOString().slice(0, 16));
      }
    } else {
      setSelectedPlatforms(['instagram', 'facebook']);
    }
  }, [editingPost]);

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        if (prev.length === 1) {
          showToast('warning', 'At least one social platform must remain selected.');
          return prev;
        }
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  const activeLimit = Math.min(...selectedPlatforms.map(p => PLATFORM_CONFIG[p]?.charLimit || 2200));
  const charCount = content.length;
  const isOverLimit = charCount > activeLimit;

  const handleInsertEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleInsertHashtag = () => {
    setContent(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + '#');
  };

  const processFiles = (files: File[]) => {
    const newUrls: string[] = [];
    let isVideoFound = false;

    files.forEach(file => {
      const url = URL.createObjectURL(file);
      newUrls.push(url);
      if (file.type.startsWith('video/')) isVideoFound = true;
    });

    if (newUrls.length > 0) {
      setMediaUrls(prev => {
        const combined = [...prev, ...newUrls];
        if (isVideoFound) {
          setMediaType('video');
          if (!thumbnailUrl) setThumbnailUrl(newUrls[0]);
        } else if (combined.length > 1) setMediaType('carousel');
        else setMediaType('image');
        return combined;
      });
      showToast('success', `Attached ${newUrls.length} file(s) to post`);
    }
  };

  const handlePublish = () => {
    if (!content.trim() && mediaUrls.length === 0 && !linkUrl) {
      showToast('warning', 'Post content cannot be empty.');
      return;
    }
    
    if (publishMode === 'schedule' && !scheduledDateTime) {
      showToast('warning', 'Please select a valid date and time for scheduling.');
      return;
    }

    const postData = {
      platforms: selectedPlatforms,
      content,
      mediaUrls,
      mediaType,
      altTexts,
      thumbnailUrl,
      linkUrl: isLinkAttached ? linkUrl : undefined,
      linkTitle: isLinkAttached ? linkTitle : undefined,
      linkDomain: isLinkAttached ? linkDomain : undefined,
      linkDescription: isLinkAttached ? linkDescription : undefined,
      scheduledTime: publishMode === 'schedule' ? new Date(scheduledDateTime).toLocaleString() : undefined
    };

    if (!canPublishDirectly) {
      savePost(postData, 'pending');
    } else {
      savePost(postData, publishMode === 'schedule' ? 'scheduled' : 'published');
    }
    setActiveNav('dashboard');
  };

  return (
    <div className="composer-page-view">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '16px', padding: '0 4px' }}>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-icon-only" onClick={() => setActiveNav('dashboard')} title="Back">
            <ChevronLeft size={20} />
          </button>
          <div className="page-title-wrap">
            <h1 className="text-display" style={{ fontSize: '22px' }}>New Post</h1>
            <p className="text-body" style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>
              {currentBrand.name}
              {currentMember ? ` · ${currentMember.name} · ${currentMember.role}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={e => e.target.files && processFiles(Array.from(e.target.files))}
      />

      {/* 3-Column Grid */}
      <div className="composer-three-col-grid">

        {/* ── COL 1: POST COMPOSITION ── */}
        <div className="composer-col card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: 0 }}>
            Post Composition
          </h2>

          {/* Rejection Feedback Banner */}
          {editingPost?.status === 'rejected' && editingPost?.rejectionReason && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecaca',
              fontSize: '13px',
              color: '#991b1b'
            }}>
              <AlertCircle size={18} style={{ color: '#dc2626', flexShrink: 0, marginTop: '1px' }} />
              <div>
                <strong style={{ display: 'block', color: '#dc2626', marginBottom: '3px' }}>
                  Post was rejected during approval review
                </strong>
                <span style={{ lineHeight: 1.45 }}>
                  <strong>Rejection reason:</strong> {editingPost.rejectionReason}
                </span>
              </div>
            </div>
          )}

          {/* Platform Selector */}
          <PlatformSelector selectedPlatforms={selectedPlatforms} onTogglePlatform={togglePlatform} />

          {/* Text Editor */}
          <div className="composer-textarea-wrap" style={{ flex: 1, position: 'relative' }}>
            <textarea
              className="composer-textarea"
              placeholder="It's a beautiful day to create..."
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{ minHeight: '260px', resize: 'none' }}
            />
            {/* inline char counter */}
            {charCount > 0 && (
              <div style={{ position: 'absolute', bottom: '10px', right: '12px', pointerEvents: 'none' }}>
                <span className={`char-counter ${isOverLimit ? 'exceeded' : charCount > activeLimit * 0.85 ? 'warning' : ''}`}>
                  {charCount}/{activeLimit}
                </span>
              </div>
            )}
          </div>

          {/* Link Attachment Card */}
          {isLinkAttached && (
            <LinkAttachmentCard
              linkUrl={linkUrl}
              linkTitle={linkTitle}
              linkDomain={linkDomain}
              linkDescription={linkDescription}
              linkImage={linkImage || mediaUrls[0]}
              onChangeUrl={setLinkUrl}
              onUpdateMetadata={d => {
                setLinkTitle(d.title);
                setLinkDomain(d.domain);
                setLinkDescription(d.description);
                setLinkImage(d.image);
              }}
              onRemove={() => setIsLinkAttached(false)}
            />
          )}

          {/* Media Thumbnails */}
          {mediaUrls.length > 0 && (
            <div className="media-preview-list">
              {mediaUrls.map((url, idx) => (
                <div key={idx} className="media-preview-thumb">
                  <img src={url} alt="" />
                  <button
                    type="button"
                    className="media-remove-btn"
                    onClick={() => setMediaUrls(prev => prev.filter((_, i) => i !== idx))}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Media Validation */}
          <MediaValidationNotice
            mediaUrls={mediaUrls}
            mediaType={mediaType}
            selectedPlatforms={selectedPlatforms}
            altTexts={altTexts}
            thumbnailUrl={thumbnailUrl}
          />
        </div>

        {/* ── COL 2: PUBLISHING OPTIONS ── */}
        <div className="composer-col card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: 0 }}>
            Publishing Options
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Publish Now */}
            <label
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
                border: `1px solid ${publishMode === 'now' ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                backgroundColor: publishMode === 'now' ? 'var(--color-primary-light)' : '#ffffff',
                transition: 'all var(--transition-fast)'
              }}
            >
              <input
                type="radio"
                name="publishMode"
                checked={publishMode === 'now'}
                onChange={() => setPublishMode('now')}
                style={{ marginTop: '2px', accentColor: 'var(--color-primary)' }}
              />
              <div>
                <span style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>Publish Now</span>
                <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Send this post immediately to selected networks.
                </span>
              </div>
            </label>

            {/* Schedule for a Specific Date */}
            <label
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
                border: `1px solid ${publishMode === 'schedule' ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                backgroundColor: publishMode === 'schedule' ? 'var(--color-primary-light)' : '#ffffff',
                transition: 'all var(--transition-fast)'
              }}
            >
              <input
                type="radio"
                name="publishMode"
                checked={publishMode === 'schedule'}
                onChange={() => setPublishMode('schedule')}
                style={{ marginTop: '2px', accentColor: 'var(--color-primary)' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                  Schedule for a Specific Date
                </span>

                {publishMode === 'schedule' && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                      type="datetime-local"
                      className="form-input"
                      style={{ width: '100%' }}
                      value={scheduledDateTime}
                      onChange={e => setScheduledDateTime(e.target.value)}
                    />
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Time Zone: <span style={{ color: 'var(--color-primary)' }}>IST</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--color-primary)' }} />
                      <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Repeat this Post</span>
                    </label>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Role restriction note */}
          {!canPublishDirectly && (
            <div style={{
              marginTop: 'auto', padding: '10px 14px', borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(234,88,12,0.06)', border: '1px solid rgba(234,88,12,0.2)',
              fontSize: '12.5px', color: '#c2410c', lineHeight: 1.5
            }}>
              🔒 Your role (<strong>{currentMember?.role}</strong>) requires manager approval before publishing.
              Your post will be submitted for review.
            </div>
          )}
        </div>

        {/* ── COL 3: POST PREVIEW ── */}
        <div className="composer-col card" style={{ padding: '20px', backgroundColor: 'var(--bg-subtle)', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: 0 }}>
            Post Preview
          </h2>
          <PlatformPreviews
            content={content}
            mediaUrls={mediaUrls}
            mediaType={mediaType}
            selectedPlatforms={selectedPlatforms}
            platformCustomizations={{}}
            thumbnailUrl={thumbnailUrl}
            altTexts={altTexts}
            linkUrl={isLinkAttached ? linkUrl : undefined}
            linkTitle={isLinkAttached ? linkTitle : undefined}
            linkDomain={isLinkAttached ? linkDomain : undefined}
            linkDescription={isLinkAttached ? linkDescription : undefined}
          />
        </div>
      </div>

      {/* ── BOTTOM TOOLBAR ── */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#ffffff',
        padding: '10px 4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        bottom: 0,
        zIndex: 50,
        marginTop: '16px'
      }}>
        {/* Left: icon tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            type="button"
            className="icon-action-btn"
            title="Add Media (images, videos, GIFs)"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={20} />
          </button>
          <button
            type="button"
            className={`icon-action-btn ${isLinkAttached ? 'active-tool' : ''}`}
            title="Add Link"
            onClick={() => {
              setIsLinkAttached(v => !v);
              if (!isLinkAttached && !linkUrl) setLinkUrl('https://');
            }}
          >
            <Link2 size={20} />
          </button>
          <button
            type="button"
            className="icon-action-btn"
            title="Add Hashtag"
            onClick={handleInsertHashtag}
          >
            <Hash size={20} />
          </button>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className={`icon-action-btn ${showEmojiPicker ? 'active-tool' : ''}`}
              title="Add Emoji"
              onClick={() => setShowEmojiPicker(v => !v)}
            >
              <Smile size={20} />
            </button>
            {showEmojiPicker && (
              <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, zIndex: 200 }}>
                <EmojiPicker
                  onSelectEmoji={handleInsertEmoji}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </div>

          {/* Over-limit warning badge */}
          {isOverLimit && (
            <div style={{
              marginLeft: '12px', padding: '3px 9px', borderRadius: '6px',
              backgroundColor: 'rgba(220,38,38,0.08)', color: '#dc2626',
              fontSize: '12px', fontWeight: 700
            }}>
              ⚠ {charCount}/{activeLimit} — over limit
            </div>
          )}
        </div>

        {/* Right: action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant="secondary"
            onClick={() => showToast('info', 'Draft saved successfully.')}
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            icon={
              !canPublishDirectly
                ? <FileCheck size={15} />
                : publishMode === 'schedule'
                  ? <Calendar size={15} />
                  : <Send size={15} />
            }
            onClick={handlePublish}
          >
            {!canPublishDirectly
              ? 'Send for Approval'
              : publishMode === 'schedule'
                ? 'Schedule'
                : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
};
