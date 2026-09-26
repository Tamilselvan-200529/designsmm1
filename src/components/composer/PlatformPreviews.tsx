import React, { useState } from 'react';
import type { SocialPlatform } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  InstagramIcon, 
  FacebookIcon, 
  LinkedinIcon, 
  TiktokIcon, 
  YoutubeIcon 
} from '../common/SocialIcons';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  ThumbsUp, 
  Share2, 
  Repeat, 
  Music2, 
  Play,
  Globe,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface PlatformPreviewsProps {
  content: string;
  mediaUrls: string[];
  mediaType: 'text' | 'image' | 'video' | 'carousel' | 'link';
  selectedPlatforms: SocialPlatform[];
  platformCustomizations: Partial<Record<SocialPlatform, string>>;
  thumbnailUrl?: string;
  altTexts?: Record<string, string>;
  linkUrl?: string;
  linkTitle?: string;
  linkDomain?: string;
  linkDescription?: string;
}

export const PlatformPreviews: React.FC<PlatformPreviewsProps> = ({
  content,
  mediaUrls,
  mediaType,
  selectedPlatforms,
  platformCustomizations,
  thumbnailUrl,
  altTexts = {},
  linkUrl,
  linkTitle,
  linkDomain,
  linkDescription
}) => {
  const { currentBrand, socialAccounts } = useApp();

  const [activePreviewPlatform, setActivePreviewPlatform] = useState<SocialPlatform>(() => {
    return selectedPlatforms[0] || 'instagram';
  });

  // Carousel slide index
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const currentPlatform = selectedPlatforms.includes(activePreviewPlatform) 
    ? activePreviewPlatform 
    : selectedPlatforms[0] || 'instagram';

  const displayedContent = platformCustomizations[currentPlatform] || content || 'Write your caption to see the live preview...';
  
  // Choose media to show
  const currentMediaUrl = mediaUrls.length > 0
    ? (mediaUrls[activeSlideIndex] || mediaUrls[0])
    : 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80';

  // For video, use thumbnailUrl if available
  const displayMedia = (mediaType === 'video' && thumbnailUrl) ? thumbnailUrl : currentMediaUrl;

  const currentAltText = altTexts[activeSlideIndex] || altTexts[currentMediaUrl];

  const currentAccount = socialAccounts.find(a => a.platform === currentPlatform) || {
    name: currentBrand.name,
    username: `@${currentBrand.name.toLowerCase().replace(/\s+/g, '')}`,
    avatar: currentBrand.logo
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlideIndex(prev => (prev > 0 ? prev - 1 : mediaUrls.length - 1));
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlideIndex(prev => (prev < mediaUrls.length - 1 ? prev + 1 : 0));
  };

  // Helper to format content with highlighted hashtags and mentions
  const renderFormattedCaption = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#') && part.length > 1) {
        return <span key={index} style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{part}</span>;
      }
      if (part.startsWith('@') && part.length > 1) {
        return <span key={index} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{part}</span>;
      }
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return <span key={index} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Platform Switcher Pills for Preview */}
      <div className="flex items-center gap-1 p-1 bg-white border border-subtle rounded-md" style={{ borderRadius: 'var(--radius-md)', padding: '3px' }}>
        {selectedPlatforms.map(p => {
          const isActive = p === currentPlatform;
          return (
            <button
              key={p}
              type="button"
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '11px', padding: '3px 8px' }}
              onClick={() => {
                setActivePreviewPlatform(p);
                setActiveSlideIndex(0);
              }}
            >
              {p.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* INSTAGRAM PREVIEW */}
      {currentPlatform === 'instagram' && (
        <div className="preview-container">
          <div className="preview-platform-bar">
            <span className="flex items-center gap-1.5" style={{ color: '#E1306C' }}>
              <InstagramIcon size={14} color="#E1306C" />
              <span>Instagram Feed Preview</span>
            </span>
            <span className="text-caption">Organic Feed</span>
          </div>

          <div className="ig-preview-header">
            <div className="ig-profile-info">
              <Avatar src={currentAccount.avatar} name={currentAccount.name} size="sm" />
              <span className="ig-username">{currentAccount.username}</span>
            </div>
            <MoreHorizontal size={16} color="var(--text-muted)" />
          </div>

          {/* Media with Carousel Controls */}
          {mediaUrls.length > 0 && (
            <div className="ig-media-wrap relative-wrap">
              <img src={displayMedia} alt={currentAltText || 'Post asset'} />

              {/* Video Play Overlay */}
              {mediaType === 'video' && (
                <div className="preview-video-overlay">
                  <div className="preview-play-icon">
                    <Play size={24} fill="#ffffff" style={{ marginLeft: '3px' }} />
                  </div>
                </div>
              )}

              {/* Carousel Next/Prev Controls */}
              {mediaUrls.length > 1 && (
                <>
                  <button type="button" className="carousel-nav-btn prev" onClick={handlePrevSlide}>
                    <ChevronLeft size={16} />
                  </button>
                  <button type="button" className="carousel-nav-btn next" onClick={handleNextSlide}>
                    <ChevronRight size={16} />
                  </button>
                  <div className="carousel-counter-badge">
                    <Layers size={11} />
                    <span>{activeSlideIndex + 1}/{mediaUrls.length}</span>
                  </div>
                  <div className="carousel-dots-indicator">
                    {mediaUrls.map((_, idx) => (
                      <span key={idx} className={`carousel-dot ${idx === activeSlideIndex ? 'active' : ''}`} />
                    ))}
                  </div>
                </>
              )}

              {/* Alt Text Badge */}
              {currentAltText && (
                <div className="preview-alt-badge" title={currentAltText}>
                  ALT
                </div>
              )}
            </div>
          )}

          <div className="ig-actions-row">
            <div className="flex items-center gap-3">
              <Heart size={20} />
              <MessageCircle size={20} />
              <Send size={19} />
            </div>
            <Bookmark size={20} />
          </div>

          <div className="ig-caption-wrap">
            <p>
              <strong style={{ marginRight: '6px' }}>{currentAccount.username}</strong>
              {renderFormattedCaption(displayedContent)}
            </p>
            <span className="text-caption" style={{ fontSize: '11px', marginTop: '6px', display: 'block' }}>
              View all 24 comments • Just now
            </span>
          </div>
        </div>
      )}

      {/* FACEBOOK PREVIEW */}
      {currentPlatform === 'facebook' && (
        <div className="preview-container">
          <div className="preview-platform-bar">
            <span className="flex items-center gap-1.5" style={{ color: '#1877F2' }}>
              <FacebookIcon size={14} color="#1877F2" />
              <span>Facebook Page Preview</span>
            </span>
            <span className="text-caption">Public Post</span>
          </div>

          <div className="fb-preview-header">
            <Avatar src={currentAccount.avatar} name={currentAccount.name} size="md" />
            <div className="flex flex-col">
              <span className="fb-page-title">{currentAccount.name}</span>
              <div className="flex items-center gap-1 text-caption">
                <span>Just now</span>
                <span>•</span>
                <Globe size={11} />
              </div>
            </div>
          </div>

          <div className="fb-caption">
            {renderFormattedCaption(displayedContent)}
          </div>

          {/* Media or Link Preview */}
          {linkTitle && mediaUrls.length === 0 ? (
            <div className="link-preview-box-fb">
              <div className="ig-media-wrap" style={{ aspectRatio: '1.91/1' }}>
                <img src={displayMedia} alt="Link thumbnail" />
              </div>
              <div className="p-3 bg-subtle border-t border-subtle">
                <span className="text-caption" style={{ textTransform: 'uppercase', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {linkDomain || 'WEBSITE.COM'}
                </span>
                <h5 style={{ fontSize: '14px', fontWeight: 600, margin: '2px 0', color: 'var(--text-primary)' }}>
                  {linkTitle}
                </h5>
                {linkDescription && (
                  <p className="text-caption line-clamp-2" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {linkDescription}
                  </p>
                )}
              </div>
            </div>
          ) : mediaUrls.length > 0 ? (
            <div className="ig-media-wrap relative-wrap" style={{ aspectRatio: '16/9' }}>
              <img src={displayMedia} alt={currentAltText || 'Post asset'} />
              {mediaType === 'video' && (
                <div className="preview-video-overlay">
                  <div className="preview-play-icon">
                    <Play size={24} fill="#ffffff" style={{ marginLeft: '3px' }} />
                  </div>
                </div>
              )}
              {mediaUrls.length > 1 && (
                <>
                  <button type="button" className="carousel-nav-btn prev" onClick={handlePrevSlide}>
                    <ChevronLeft size={16} />
                  </button>
                  <button type="button" className="carousel-nav-btn next" onClick={handleNextSlide}>
                    <ChevronRight size={16} />
                  </button>
                  <div className="carousel-counter-badge">
                    <span>{activeSlideIndex + 1}/{mediaUrls.length}</span>
                  </div>
                </>
              )}
            </div>
          ) : null}

          <div className="fb-action-footer">
            <span className="flex items-center gap-1.5"><ThumbsUp size={15} /> Like</span>
            <span className="flex items-center gap-1.5"><MessageCircle size={15} /> Comment</span>
            <span className="flex items-center gap-1.5"><Share2 size={15} /> Share</span>
          </div>
        </div>
      )}

      {/* LINKEDIN PREVIEW */}
      {currentPlatform === 'linkedin' && (
        <div className="preview-container">
          <div className="preview-platform-bar">
            <span className="flex items-center gap-1.5" style={{ color: '#0A66C2' }}>
              <LinkedinIcon size={14} color="#0A66C2" />
              <span>LinkedIn Feed Preview</span>
            </span>
            <span className="text-caption">Company Update</span>
          </div>

          <div className="li-preview-header">
            <Avatar src={currentAccount.avatar} name={currentAccount.name} size="md" />
            <div className="flex flex-col">
              <span className="li-author-name">{currentAccount.name}</span>
              <span className="li-author-tagline">3,410 followers • 1m • Edited</span>
            </div>
          </div>

          <div className="li-caption">
            {renderFormattedCaption(displayedContent)}
          </div>

          {/* Media or Link preview */}
          {linkTitle && mediaUrls.length === 0 ? (
            <div className="border border-subtle mx-3 mb-2 rounded overflow-hidden">
              <div className="ig-media-wrap" style={{ aspectRatio: '1.91/1' }}>
                <img src={displayMedia} alt="Article Preview" />
              </div>
              <div className="p-3 bg-subtle">
                <span className="text-caption text-muted" style={{ fontSize: '11px' }}>{linkDomain || 'WEBSITE.COM'}</span>
                <h5 style={{ fontSize: '13.5px', fontWeight: 600, margin: '2px 0' }}>{linkTitle}</h5>
                {linkDescription && <p className="text-caption text-muted line-clamp-2">{linkDescription}</p>}
              </div>
            </div>
          ) : mediaUrls.length > 0 ? (
            <div className="ig-media-wrap relative-wrap" style={{ aspectRatio: '1.91/1' }}>
              <img src={displayMedia} alt={currentAltText || 'Post asset'} />
              {mediaType === 'video' && (
                <div className="preview-video-overlay">
                  <div className="preview-play-icon">
                    <Play size={24} fill="#ffffff" style={{ marginLeft: '3px' }} />
                  </div>
                </div>
              )}
              {mediaUrls.length > 1 && (
                <>
                  <button type="button" className="carousel-nav-btn prev" onClick={handlePrevSlide}>
                    <ChevronLeft size={16} />
                  </button>
                  <button type="button" className="carousel-nav-btn next" onClick={handleNextSlide}>
                    <ChevronRight size={16} />
                  </button>
                  <div className="carousel-counter-badge">
                    <span>Slide {activeSlideIndex + 1} of {mediaUrls.length}</span>
                  </div>
                </>
              )}
            </div>
          ) : null}

          <div className="fb-action-footer" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <span className="flex items-center gap-1"><ThumbsUp size={14} /> Like</span>
            <span className="flex items-center gap-1"><MessageCircle size={14} /> Comment</span>
            <span className="flex items-center gap-1"><Repeat size={14} /> Repost</span>
            <span className="flex items-center gap-1"><Send size={14} /> Send</span>
          </div>
        </div>
      )}

      {/* TIKTOK PREVIEW */}
      {currentPlatform === 'tiktok' && (
        <div className="preview-container" style={{ maxWidth: '290px' }}>
          <div className="preview-platform-bar">
            <span className="flex items-center gap-1.5" style={{ color: '#000000' }}>
              <TiktokIcon size={14} color="#000000" />
              <span>TikTok Feed Preview</span>
            </span>
            <span className="text-caption">FYP Simulation</span>
          </div>

          <div className="tt-preview-frame">
            <img src={displayMedia} alt="Video preview" className="tt-preview-media" />
            
            {mediaType === 'video' && (
              <div className="preview-video-overlay">
                <div className="preview-play-icon" style={{ opacity: 0.9 }}>
                  <Play size={24} fill="#ffffff" style={{ marginLeft: '3px' }} />
                </div>
              </div>
            )}

            <div className="tt-overlay-content">
              <div className="tt-text-content">
                <div className="tt-username">{currentAccount.username}</div>
                <div className="tt-desc">{renderFormattedCaption(displayedContent)}</div>
                <div className="flex items-center gap-1.5 text-caption" style={{ color: '#ffffff', opacity: 0.85, marginTop: '8px' }}>
                  <Music2 size={12} />
                  <span>Original Audio - {currentAccount.name}</span>
                </div>
              </div>

              <div className="tt-side-actions">
                <div className="flex flex-col items-center">
                  <Heart size={20} fill="#ffffff" />
                  <span>24.5K</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle size={20} fill="#ffffff" />
                  <span>1.8K</span>
                </div>
                <div className="flex flex-col items-center">
                  <Bookmark size={20} fill="#ffffff" />
                  <span>582</span>
                </div>
                <div className="flex flex-col items-center">
                  <Share2 size={20} fill="#ffffff" />
                  <span>312</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YOUTUBE PREVIEW */}
      {currentPlatform === 'youtube' && (
        <div className="preview-container">
          <div className="preview-platform-bar">
            <span className="flex items-center gap-1.5" style={{ color: '#FF0000' }}>
              <YoutubeIcon size={14} color="#FF0000" />
              <span>YouTube Video Preview</span>
            </span>
            <span className="text-caption">Channel Video</span>
          </div>

          <div className="yt-preview-box">
            <div className="yt-player-mockup">
              <img src={displayMedia} alt="Video Thumbnail" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
              <div className="yt-play-btn" style={{ position: 'relative', zIndex: 2 }}>
                <Play size={20} fill="#ffffff" style={{ marginLeft: '3px' }} />
              </div>
              {thumbnailUrl && (
                <div className="thumbnail-cover-tag">Custom Thumbnail</div>
              )}
            </div>
            <div className="yt-info-block">
              <h4 className="yt-title">{displayedContent.substring(0, 70)}...</h4>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Avatar src={currentAccount.avatar} name={currentAccount.name} size="sm" />
                  <div className="flex flex-col">
                    <span style={{ fontSize: '12.5px', fontWeight: 600 }}>{currentAccount.name}</span>
                    <span className="yt-channel-meta">6.4K subscribers</span>
                  </div>
                </div>
                <button className="btn btn-sm" style={{ backgroundColor: '#cc0000', color: '#ffffff', borderRadius: 'var(--radius-full)' }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
