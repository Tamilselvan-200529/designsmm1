import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
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
  AtSign, 
  Smile, 
  Link2, 
  X, 
  Clock, 
  Send, 
  FileCheck,
  FolderOpen,
  Layers,
  Video,
  FileText,
  HelpCircle,
  Plus
} from 'lucide-react';

export const ComposerModal: React.FC = () => {
  const { 
    isComposerOpen, 
    closeComposer, 
    editingPost, 
    savePost, 
    openScheduleModal,
    mediaItems, 
    currentBrand,
    currentMember,
    teamMembers,
    showToast 
  } = useApp();

  // Role-based publishing capability
  const canPublishDirectly = currentMember 
    ? ['Owner', 'Admin', 'Manager'].includes(currentMember.role)
    : true;
  const canSchedule = currentMember
    ? ['Owner', 'Admin', 'Manager', 'Editor'].includes(currentMember.role)
    : true;

  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['instagram', 'facebook']);
  const [content, setContent] = useState('');
  const [platformCustomizations, setPlatformCustomizations] = useState<Partial<Record<SocialPlatform, string>>>({});
  const [activeTab, setActiveTab] = useState<string>('all');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'text' | 'image' | 'video' | 'carousel' | 'link'>('image');
  
  // Alt text state: index/url -> alt text
  const [altTexts, setAltTexts] = useState<Record<string, string>>({});
  const [editingAltIndex, setEditingAltIndex] = useState<number | null>(null);

  // Video thumbnail state
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  // Link attachment state
  const [isLinkAttached, setIsLinkAttached] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDomain, setLinkDomain] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [linkImage, setLinkImage] = useState('');

  // Dropdowns and Modals
  const [isLibraryPickerOpen, setIsLibraryPickerOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingPost) {
      setSelectedPlatforms(editingPost.platforms);
      setContent(editingPost.content);
      setPlatformCustomizations(editingPost.platformCustomizations || {});
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
      } else {
        setIsLinkAttached(false);
      }
    } else {
      setSelectedPlatforms(['instagram', 'facebook']);
      setContent('');
      setPlatformCustomizations({});
      setMediaUrls(['https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80']);
      setMediaType('image');
      setAltTexts({});
      setThumbnailUrl('');
      setIsLinkAttached(false);
      setLinkUrl('');
      setLinkTitle('');
      setLinkDomain('');
      setLinkDescription('');
      setLinkImage('');
    }
  }, [editingPost, isComposerOpen]);

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

  // Platform-specific character limit calculation
  const activeLimit = activeTab === 'all'
    ? Math.min(...selectedPlatforms.map(p => PLATFORM_CONFIG[p].charLimit))
    : (PLATFORM_CONFIG[activeTab as SocialPlatform]?.charLimit || 2200);

  const currentText = activeTab === 'all' ? content : (platformCustomizations[activeTab as SocialPlatform] ?? content);
  const charCount = currentText.length;
  const isOverLimit = charCount > activeLimit;

  // Insert hashtag helper
  const handleInsertHashtag = (tag: string) => {
    if (activeTab === 'all') {
      setContent(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + tag + ' ');
    } else {
      const current = platformCustomizations[activeTab as SocialPlatform] ?? content;
      setPlatformCustomizations(prev => ({
        ...prev,
        [activeTab]: current + (current.endsWith(' ') || current === '' ? '' : ' ') + tag + ' '
      }));
    }
  };

  // Insert mention helper
  const handleInsertMention = (mention: string) => {
    const formatted = mention.startsWith('@') ? mention : `@${mention}`;
    if (activeTab === 'all') {
      setContent(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + formatted + ' ');
    } else {
      const current = platformCustomizations[activeTab as SocialPlatform] ?? content;
      setPlatformCustomizations(prev => ({
        ...prev,
        [activeTab]: current + (current.endsWith(' ') || current === '' ? '' : ' ') + formatted + ' '
      }));
    }
    setShowMentionPicker(false);
  };

  // Insert emoji helper
  const handleInsertEmoji = (emoji: string) => {
    if (activeTab === 'all') {
      setContent(prev => prev + emoji);
    } else {
      const current = platformCustomizations[activeTab as SocialPlatform] ?? content;
      setPlatformCustomizations(prev => ({
        ...prev,
        [activeTab]: current + emoji
      }));
    }
    setShowEmojiPicker(false);
  };

  // Process files (from file picker or drag-and-drop)
  const processFiles = (files: File[]) => {
    const newUrls: string[] = [];
    let isVideoFound = false;

    files.forEach(file => {
      const url = URL.createObjectURL(file);
      newUrls.push(url);
      if (file.type.startsWith('video/')) {
        isVideoFound = true;
      }
    });

    if (newUrls.length > 0) {
      setMediaUrls(prev => {
        const combined = [...prev, ...newUrls];
        if (isVideoFound) {
          setMediaType('video');
          if (!thumbnailUrl) setThumbnailUrl(newUrls[0]);
        } else if (combined.length > 1) {
          setMediaType('carousel');
        } else {
          setMediaType('image');
        }
        return combined;
      });
      showToast('success', `Attached ${newUrls.length} file(s) to post`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUploadSampleMedia = () => {
    const sample = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80';
    setMediaUrls(prev => {
      const updated = [...prev, sample];
      setMediaType(updated.length > 1 ? 'carousel' : 'image');
      return updated;
    });
    showToast('success', 'Sample media asset attached.');
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setMediaType('text');
      } else if (updated.length === 1 && mediaType === 'carousel') {
        setMediaType('image');
      }
      return updated;
    });
  };

  const handleSelectFromLibrary = (item: typeof mediaItems[0]) => {
    setMediaUrls(prev => {
      const updated = [...prev, item.url];
      if (item.type === 'video') {
        setMediaType('video');
        setThumbnailUrl(item.url);
      } else if (updated.length > 1) {
        setMediaType('carousel');
      } else {
        setMediaType('image');
      }
      return updated;
    });
    setIsLibraryPickerOpen(false);
    showToast('success', `Added "${item.name}" from library`);
  };

  // Alt text save
  const handleSaveAltText = (text: string) => {
    if (editingAltIndex !== null && mediaUrls[editingAltIndex]) {
      const url = mediaUrls[editingAltIndex];
      setAltTexts(prev => ({
        ...prev,
        [editingAltIndex]: text,
        [url]: text
      }));
      showToast('success', `Alt text saved for Image #${editingAltIndex + 1}`);
    }
  };

  // Format Switcher action
  const handleFormatChange = (format: 'text' | 'image' | 'carousel' | 'video' | 'link') => {
    setMediaType(format);
    if (format === 'text') {
      setMediaUrls([]);
      setIsLinkAttached(false);
    } else if (format === 'link') {
      setIsLinkAttached(true);
      if (!linkUrl) {
        setLinkUrl('https://greenleafrestaurant.com/seasonal-menu');
        setLinkTitle('Autumn Harvest & Seasonal Menu | GreenLeaf');
        setLinkDomain('greenleafrestaurant.com');
        setLinkDescription('Taste chef-curated organic seasonal creations made with farm-fresh local produce.');
      }
    } else if (format === 'video') {
      if (!thumbnailUrl && mediaUrls.length > 0) {
        setThumbnailUrl(mediaUrls[0]);
      }
    }
  };

  // Publish / Draft handlers
  const handleSaveDraft = () => {
    if (!content.trim() && mediaUrls.length === 0 && !linkUrl) {
      showToast('warning', 'Please enter some caption text or attach media before saving.');
      return;
    }
    savePost({
      platforms: selectedPlatforms,
      content,
      platformCustomizations,
      mediaUrls,
      mediaType,
      altTexts,
      thumbnailUrl,
      linkUrl: isLinkAttached ? linkUrl : undefined,
      linkTitle: isLinkAttached ? linkTitle : undefined,
      linkDomain: isLinkAttached ? linkDomain : undefined,
      linkDescription: isLinkAttached ? linkDescription : undefined,
    }, 'draft');
  };

  const handleSubmitForApproval = () => {
    if (!content.trim()) {
      showToast('warning', 'Post content cannot be empty.');
      return;
    }
    savePost({
      platforms: selectedPlatforms,
      content,
      platformCustomizations,
      mediaUrls,
      mediaType,
      altTexts,
      thumbnailUrl,
      linkUrl: isLinkAttached ? linkUrl : undefined,
      linkTitle: isLinkAttached ? linkTitle : undefined,
      linkDomain: isLinkAttached ? linkDomain : undefined,
      linkDescription: isLinkAttached ? linkDescription : undefined,
    }, 'pending');
  };

  const handlePublishNow = () => {
    if (!content.trim()) {
      showToast('warning', 'Post content cannot be empty.');
      return;
    }
    savePost({
      platforms: selectedPlatforms,
      content,
      platformCustomizations,
      mediaUrls,
      mediaType,
      altTexts,
      thumbnailUrl,
      linkUrl: isLinkAttached ? linkUrl : undefined,
      linkTitle: isLinkAttached ? linkTitle : undefined,
      linkDomain: isLinkAttached ? linkDomain : undefined,
      linkDescription: isLinkAttached ? linkDescription : undefined,
    }, 'published');
  };

  const handleOpenScheduler = () => {
    if (!content.trim()) {
      showToast('warning', 'Post content cannot be empty.');
      return;
    }
    openScheduleModal({
      id: editingPost?.id || '',
      brandId: currentBrand.id,
      platforms: selectedPlatforms,
      content,
      platformCustomizations,
      mediaUrls,
      mediaType,
      altTexts,
      thumbnailUrl,
      linkUrl: isLinkAttached ? linkUrl : undefined,
      linkTitle: isLinkAttached ? linkTitle : undefined,
      linkDomain: isLinkAttached ? linkDomain : undefined,
      linkDescription: isLinkAttached ? linkDescription : undefined,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      author: {
        id: currentMember?.id || 'usr-current',
        name: currentMember?.name || 'Alex Morgan',
        avatar: currentMember?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        role: currentMember?.role || 'Owner'
      },
      comments: [],
      auditLog: []
    });
  };

  const popularHashtags = ['#FarmToTable', '#SeasonalMenu', '#ChefSpecial', '#WeekendBrunch', '#OrganicEats', '#FoodieLife'];

  return (
    <Modal
      isOpen={isComposerOpen}
      onClose={closeComposer}
      title="Create New Post"
      className="composer-modal"
    >
      <div className="composer-grid">
        {/* Left Side: Composer Controls */}
        <div className="composer-editor-panel">
          {/* Step 1: Platforms */}
          <PlatformSelector
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={togglePlatform}
          />

          {/* Post Format Selector: Text, Image, Carousel, Video, Link */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="form-label" style={{ marginBottom: 0 }}>
                <span>Content Format</span>
              </label>
              <span className="text-caption text-muted">Supports all selected networks</span>
            </div>
            <div className="content-format-switcher">
              <button
                type="button"
                className={`format-tab-btn ${mediaType === 'text' ? 'active' : ''}`}
                onClick={() => handleFormatChange('text')}
              >
                <FileText size={13} />
                <span>Text Only</span>
              </button>
              <button
                type="button"
                className={`format-tab-btn ${mediaType === 'image' ? 'active' : ''}`}
                onClick={() => handleFormatChange('image')}
              >
                <ImageIcon size={13} />
                <span>Image</span>
              </button>
              <button
                type="button"
                className={`format-tab-btn ${mediaType === 'carousel' ? 'active' : ''}`}
                onClick={() => handleFormatChange('carousel')}
              >
                <Layers size={13} />
                <span>Carousel</span>
              </button>
              <button
                type="button"
                className={`format-tab-btn ${mediaType === 'video' ? 'active' : ''}`}
                onClick={() => handleFormatChange('video')}
              >
                <Video size={13} />
                <span>Video</span>
              </button>
              <button
                type="button"
                className={`format-tab-btn ${mediaType === 'link' || isLinkAttached ? 'active' : ''}`}
                onClick={() => handleFormatChange('link')}
              >
                <Link2 size={13} />
                <span>Link Post</span>
              </button>
            </div>
          </div>

          {/* Step 2: Content & Platform Customization Tabs */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="form-label" style={{ marginBottom: 0 }}>
                <span>2. Content & Customization</span>
              </label>
              <span className="text-caption text-muted">Customize per platform</span>
            </div>

            <div className="platform-customization-tabs">
              <button
                type="button"
                className={`platform-custom-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Platforms
              </button>
              {selectedPlatforms.map(p => (
                <button
                  key={p}
                  type="button"
                  className={`platform-custom-tab ${activeTab === p ? 'active' : ''}`}
                  onClick={() => setActiveTab(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                  {platformCustomizations[p] && <span style={{ color: 'var(--color-primary)', marginLeft: '4px' }}>•</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Caption Text Area & Rich Toolbar */}
          <div className="composer-textarea-wrap">
            <textarea
              className="composer-textarea"
              placeholder={activeTab === 'all' ? "What's on your mind? Write your post caption..." : `Customizing caption specifically for ${activeTab}...`}
              value={activeTab === 'all' ? content : (platformCustomizations[activeTab as SocialPlatform] ?? content)}
              onChange={e => {
                const val = e.target.value;
                if (activeTab === 'all') {
                  setContent(val);
                } else {
                  setPlatformCustomizations(prev => ({
                    ...prev,
                    [activeTab]: val
                  }));
                }
              }}
            />

            {/* Toolbar */}
            <div className="composer-toolbar">
              <div className="composer-toolbar-left">
                {/* Rich Emoji Picker Trigger */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="composer-tool-btn"
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowMentionPicker(false);
                    }}
                    title="Insert Emoji"
                  >
                    <Smile size={16} />
                    <span>Emoji</span>
                  </button>

                  {showEmojiPicker && (
                    <EmojiPicker
                      onSelectEmoji={handleInsertEmoji}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  )}
                </div>

                {/* Hashtag Insertion */}
                <button
                  type="button"
                  className="composer-tool-btn"
                  onClick={() => handleInsertHashtag('#Special')}
                  title="Add hashtag"
                >
                  <Hash size={16} />
                  <span>Hashtag</span>
                </button>

                {/* Mention Picker Trigger */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="composer-tool-btn"
                    onClick={() => {
                      setShowMentionPicker(!showMentionPicker);
                      setShowEmojiPicker(false);
                    }}
                    title="Insert Mention"
                  >
                    <AtSign size={16} />
                    <span>Mention</span>
                  </button>

                  {showMentionPicker && (
                    <div 
                      className="dropdown-menu"
                      style={{ position: 'absolute', bottom: '38px', left: 0, padding: '8px', zIndex: 400, width: '220px' }}
                    >
                      <span className="text-caption font-semibold px-2 py-1 text-muted" style={{ display: 'block' }}>
                        SELECT MENTION
                      </span>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => handleInsertMention(currentBrand.name.toLowerCase().replace(/\s+/g, ''))}
                      >
                        <strong>@{currentBrand.name.toLowerCase().replace(/\s+/g, '')}</strong> (Brand)
                      </button>
                      {teamMembers.slice(0, 3).map(m => (
                        <button
                          key={m.id}
                          type="button"
                          className="dropdown-item"
                          onClick={() => handleInsertMention(m.name.toLowerCase().replace(/\s+/g, ''))}
                        >
                          <span>@{m.name.toLowerCase().replace(/\s+/g, '')}</span> ({m.role})
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Link URL Attachment Button */}
                <button
                  type="button"
                  className={`composer-tool-btn ${isLinkAttached ? 'active' : ''}`}
                  onClick={() => {
                    setIsLinkAttached(!isLinkAttached);
                    if (!isLinkAttached && !linkUrl) {
                      setLinkUrl('https://greenleafrestaurant.com/seasonal-menu');
                      setLinkTitle('Autumn Harvest & Seasonal Menu | GreenLeaf');
                      setLinkDomain('greenleafrestaurant.com');
                      setLinkDescription('Taste chef-curated organic seasonal creations made with farm-fresh local produce.');
                    }
                  }}
                  title="Attach link or URL preview card"
                >
                  <Link2 size={16} />
                  <span>Link</span>
                </button>
              </div>

              {/* Character Counter */}
              <div className={`char-counter ${isOverLimit ? 'exceeded' : charCount > activeLimit * 0.85 ? 'warning' : ''}`}>
                {charCount} / {activeLimit}
                {activeTab !== 'all' && (
                  <span style={{ fontSize: '10px', marginLeft: '4px', textTransform: 'capitalize' }}>
                    ({activeTab})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Hashtags Chips */}
          <div className="flex flex-col gap-1">
            <span className="text-caption">Suggested Brand Hashtags:</span>
            <div className="hashtag-chips-wrap">
              {popularHashtags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className="hashtag-chip"
                  onClick={() => handleInsertHashtag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Link Attachment Section */}
          {isLinkAttached && (
            <LinkAttachmentCard
              linkUrl={linkUrl}
              linkTitle={linkTitle}
              linkDomain={linkDomain}
              linkDescription={linkDescription}
              linkImage={linkImage || (mediaUrls[0] || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80')}
              onChangeUrl={setLinkUrl}
              onUpdateMetadata={data => {
                setLinkTitle(data.title);
                setLinkDomain(data.domain);
                setLinkDescription(data.description);
                setLinkImage(data.image);
              }}
              onRemove={() => setIsLinkAttached(false)}
            />
          )}

          {/* Step 3: Media Attachments with Drag & Drop */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="form-label" style={{ marginBottom: 0 }}>
                <span>3. Media Attachments</span>
                <span className="text-caption" style={{ marginLeft: '8px' }}>
                  {mediaUrls.length} attached {mediaType === 'carousel' ? '(Carousel)' : mediaType === 'video' ? '(Video)' : ''}
                </span>
              </label>
              {mediaUrls.length > 0 && (
                <span className="text-caption text-muted">
                  Click ALT on image to add accessibility description
                </span>
              )}
            </div>

            {/* Hidden File Input for Real Uploads */}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />

            {mediaUrls.length === 0 ? (
              <div 
                className={`media-attachment-box ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <ImageIcon size={28} color="var(--text-muted)" />
                <span className="text-body" style={{ fontWeight: 500 }}>
                  {isDragging ? 'Drop media files here now!' : 'Drag & drop images or videos here'}
                </span>
                <span className="text-caption">Supports JPG, PNG, MP4, GIF (up to 50MB)</span>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={<Upload size={14} />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Asset
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={<FolderOpen size={14} />}
                    onClick={() => setIsLibraryPickerOpen(!isLibraryPickerOpen)}
                  >
                    Choose from Library
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                className={`flex flex-col gap-3 p-3 rounded-lg border border-subtle bg-white ${isDragging ? 'dragging' : ''}`}
                style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)' }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Media Thumbnails with ALT Button and Remove */}
                <div className="media-preview-list" style={{ marginTop: 0 }}>
                  {mediaUrls.map((url, idx) => {
                    const hasAlt = !!altTexts[idx] || !!altTexts[url];
                    return (
                      <div key={idx} className="media-preview-thumb">
                        <img src={url} alt={`Asset ${idx + 1}`} />

                        {/* Top-Right Remove Button */}
                        <button
                          type="button"
                          className="media-remove-btn"
                          onClick={() => handleRemoveMedia(idx)}
                          aria-label="Remove media"
                          title="Remove media"
                        >
                          <X size={12} />
                        </button>

                        {/* Bottom Overlay with ALT Button */}
                        <div className="media-thumb-overlay">
                          <button
                            type="button"
                            className={`media-alt-badge-btn ${hasAlt ? 'has-alt' : ''}`}
                            onClick={() => setEditingAltIndex(idx)}
                            title={hasAlt ? `Alt text: ${altTexts[idx] || altTexts[url]}` : 'Click to add Alt text'}
                          >
                            {hasAlt ? '✓ ALT' : '+ ALT'}
                          </button>
                          <span style={{ color: '#ffffff', fontSize: '9.5px', fontWeight: 600 }}>
                            #{idx + 1}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add more via file picker slot */}
                  <div 
                    className="media-preview-thumb"
                    style={{
                      border: '1.5px dashed var(--border-strong)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      backgroundColor: 'var(--bg-subtle)'
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    title="Add more photos or videos"
                  >
                    <Plus size={20} color="var(--text-muted)" />
                    <span className="text-caption" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Add Media
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={<Upload size={14} />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Files
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={<FolderOpen size={14} />}
                    onClick={() => setIsLibraryPickerOpen(!isLibraryPickerOpen)}
                  >
                    From Library
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleUploadSampleMedia}
                  >
                    + Sample
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Media Library Picker Dropdown */}
            {isLibraryPickerOpen && (
              <div 
                className="p-3 border border-subtle rounded-lg bg-subtle flex flex-col gap-2 mt-2"
                style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-caption font-semibold">SELECT ASSET FROM MEDIA LIBRARY</span>
                  <button className="btn btn-ghost btn-icon-only btn-sm" onClick={() => setIsLibraryPickerOpen(false)}>
                    <X size={14} />
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {mediaItems.map(item => (
                    <div
                      key={item.id}
                      className="cursor-pointer border border-subtle rounded hover:border-primary overflow-hidden flex-shrink-0"
                      style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)' }}
                      onClick={() => handleSelectFromLibrary(item)}
                      title={`Insert ${item.name}`}
                    >
                      <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Thumbnail Selection (shows when video media type is selected or video url exists) */}
            {(mediaType === 'video' || mediaUrls.some(u => u.includes('video') || u.includes('.mp4'))) && (
              <ThumbnailSelector
                currentThumbnail={thumbnailUrl}
                videoUrl={mediaUrls[0]}
                onSelectThumbnail={url => {
                  setThumbnailUrl(url);
                  showToast('success', 'Custom video thumbnail cover updated.');
                }}
              />
            )}

            {/* Live Media Validation Banner & Platform Rules */}
            <MediaValidationNotice
              mediaUrls={mediaUrls}
              mediaType={mediaType}
              selectedPlatforms={selectedPlatforms}
              altTexts={altTexts}
              thumbnailUrl={thumbnailUrl}
            />
          </div>
        </div>

        {/* Right Side: Live Platform Previews */}
        <div className="composer-preview-panel">
          <span className="text-metadata">LIVE SOCIAL PREVIEW</span>
          <PlatformPreviews
            content={content}
            mediaUrls={mediaUrls}
            mediaType={mediaType}
            selectedPlatforms={selectedPlatforms}
            platformCustomizations={platformCustomizations}
            thumbnailUrl={thumbnailUrl}
            altTexts={altTexts}
            linkUrl={isLinkAttached ? linkUrl : undefined}
            linkTitle={isLinkAttached ? linkTitle : undefined}
            linkDomain={isLinkAttached ? linkDomain : undefined}
            linkDescription={isLinkAttached ? linkDescription : undefined}
          />
        </div>
      </div>

      {/* Footer Publishing Actions */}
      <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>
          <Button
            variant="secondary"
            icon={<FileCheck size={14} />}
            onClick={handleSubmitForApproval}
          >
            Submit for Approval
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Role context indicator */}
          {currentMember && !canPublishDirectly && (
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🔒</span>
              <span>{currentMember.role}: submit for approval</span>
            </span>
          )}

          {canSchedule && (
            <Button
              variant="secondary"
              icon={<Clock size={14} />}
              onClick={handleOpenScheduler}
            >
              Schedule...
            </Button>
          )}

          {canPublishDirectly ? (
            <Button
              variant="primary"
              icon={<Send size={14} />}
              onClick={handlePublishNow}
            >
              Publish Now
            </Button>
          ) : (
            <Button
              variant="secondary"
              icon={<FileCheck size={14} />}
              onClick={handleSubmitForApproval}
              title={`${currentMember?.role ?? 'Your role'} cannot publish directly. Content will be submitted for approval by a Manager or Admin.`}
              style={{ opacity: 0.7 }}
            >
              Needs Approval
            </Button>
          )}
        </div>
      </div>

      {/* Alt Text Modal */}
      {editingAltIndex !== null && mediaUrls[editingAltIndex] && (
        <AltTextModal
          isOpen={editingAltIndex !== null}
          onClose={() => setEditingAltIndex(null)}
          mediaUrl={mediaUrls[editingAltIndex]}
          mediaIndex={editingAltIndex}
          initialAltText={altTexts[editingAltIndex] || altTexts[mediaUrls[editingAltIndex]] || ''}
          onSave={handleSaveAltText}
        />
      )}
    </Modal>
  );
};
