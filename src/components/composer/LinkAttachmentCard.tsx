import React, { useState } from 'react';
import { Link2, ExternalLink, X, Globe, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

interface LinkAttachmentProps {
  linkUrl: string;
  linkTitle?: string;
  linkDomain?: string;
  linkDescription?: string;
  linkImage?: string;
  onChangeUrl: (url: string) => void;
  onUpdateMetadata: (data: { title: string; domain: string; description: string; image: string }) => void;
  onRemove: () => void;
}

export const LinkAttachmentCard: React.FC<LinkAttachmentProps> = ({
  linkUrl,
  linkTitle,
  linkDomain,
  linkDescription,
  linkImage,
  onChangeUrl,
  onUpdateMetadata,
  onRemove
}) => {
  const [inputUrl, setInputUrl] = useState(linkUrl);
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchMetadata = () => {
    if (!inputUrl.trim()) return;
    setIsFetching(true);
    onChangeUrl(inputUrl);

    // Simulate metadata extraction from URL
    setTimeout(() => {
      let domain = 'example.com';
      try {
        const parsed = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
        domain = parsed.hostname.replace('www.', '');
      } catch (e) {
        domain = 'website.com';
      }

      onUpdateMetadata({
        title: 'Autumn Harvest & Seasonal Culinary Experience | GreenLeaf Dining',
        domain: domain,
        description: 'Discover our new farm-to-table seasonal tasting menu crafted with local organic produce and sustainable ingredients.',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80'
      });
      setIsFetching(false);
    }, 600);
  };

  return (
    <div className="link-attachment-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-caption font-semibold">
          <Link2 size={14} color="var(--color-primary)" />
          <span>LINK / URL ATTACHMENT</span>
        </div>
        <button 
          type="button" 
          className="btn btn-ghost btn-icon-only btn-sm"
          onClick={onRemove}
          title="Remove link attachment"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="input-group flex-1">
          <span className="input-icon">
            <Globe size={14} />
          </span>
          <input
            type="text"
            className="input-field input-field-sm"
            placeholder="Paste URL (e.g. https://greenleaf.com/menu)..."
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleFetchMetadata();
              }
            }}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!inputUrl.trim() || isFetching}
          onClick={handleFetchMetadata}
          icon={isFetching ? <RefreshCw size={13} className="spin" /> : <ExternalLink size={13} />}
        >
          {isFetching ? 'Fetching...' : 'Attach Link'}
        </Button>
      </div>

      {/* Render rich link preview card if link is loaded */}
      {linkTitle && (
        <div className="link-preview-box">
          {linkImage && (
            <div className="link-preview-thumb-wrap">
              <img src={linkImage} alt="Link thumbnail" className="link-preview-img" />
            </div>
          )}
          <div className="link-preview-details">
            <span className="link-preview-domain">{linkDomain || 'WEBSITE.COM'}</span>
            <h5 className="link-preview-heading">{linkTitle}</h5>
            {linkDescription && (
              <p className="link-preview-summary">{linkDescription}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
