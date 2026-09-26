import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, Check, Video } from 'lucide-react';
import { Button } from '../common/Button';

interface ThumbnailSelectorProps {
  currentThumbnail?: string;
  videoUrl?: string;
  onSelectThumbnail: (url: string) => void;
}

export const ThumbnailSelector: React.FC<ThumbnailSelectorProps> = ({
  currentThumbnail,
  videoUrl,
  onSelectThumbnail
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset frame capture simulations from video
  const framePresets = [
    {
      time: '0:01',
      url: videoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
      label: 'Intro Frame'
    },
    {
      time: '0:04',
      url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80',
      label: 'Highlight 1'
    },
    {
      time: '0:08',
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80',
      label: 'Highlight 2'
    },
    {
      time: '0:15',
      url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
      label: 'Action Shot'
    },
  ];

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onSelectThumbnail(url);
    }
  };

  return (
    <div className="thumbnail-selector-container">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-caption font-semibold">
          <Video size={14} color="var(--color-primary)" />
          <span>VIDEO COVER & THUMBNAIL SELECTION</span>
        </div>
        <span className="text-caption text-muted">Used for Reels, Shorts & Feed cards</span>
      </div>

      <div className="thumbnail-frames-grid">
        {framePresets.map((frame, idx) => {
          const isSelected = (currentThumbnail === frame.url) || (!currentThumbnail && idx === 0);
          return (
            <button
              key={idx}
              type="button"
              className={`thumbnail-frame-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectThumbnail(frame.url)}
              title={`Choose frame at ${frame.time}`}
            >
              <img src={frame.url} alt={`Frame ${frame.time}`} className="thumbnail-frame-img" />
              <div className="thumbnail-frame-time">{frame.time}</div>
              {isSelected && (
                <div className="thumbnail-selected-badge">
                  <Check size={11} strokeWidth={3} />
                  <span>Cover</span>
                </div>
              )}
            </button>
          );
        })}

        {/* Custom Upload Slot */}
        <div 
          className="thumbnail-custom-upload"
          onClick={() => fileInputRef.current?.click()}
          title="Upload custom high-res thumbnail image"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleCustomUpload}
          />
          <Upload size={16} color="var(--text-muted)" />
          <span className="text-caption" style={{ fontSize: '11px', textAlign: 'center', lineHeight: 1.2 }}>
            Custom Cover
          </span>
        </div>
      </div>
    </div>
  );
};
