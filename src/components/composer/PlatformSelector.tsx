import React from 'react';
import type { SocialPlatform } from '../../types';
import { PLATFORM_CONFIG } from '../../utils/helpers';
import { 
  InstagramIcon, 
  FacebookIcon, 
  LinkedinIcon, 
  TiktokIcon, 
  YoutubeIcon 
} from '../common/SocialIcons';
import { Check } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatforms: SocialPlatform[];
  onTogglePlatform: (platform: SocialPlatform) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onTogglePlatform
}) => {
  const platforms: { id: SocialPlatform; label: string; icon: React.ReactNode }[] = [
    { id: 'instagram', label: 'Instagram', icon: <InstagramIcon size={14} /> },
    { id: 'facebook', label: 'Facebook', icon: <FacebookIcon size={14} /> },
    { id: 'linkedin', label: 'LinkedIn', icon: <LinkedinIcon size={14} /> },
    { id: 'tiktok', label: 'TikTok', icon: <TiktokIcon size={14} /> },
    { id: 'youtube', label: 'YouTube', icon: <YoutubeIcon size={14} /> }
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="form-label" style={{ marginBottom: 0 }}>
          <span>1. Select Publishing Platforms</span>
          <span className="text-caption">
            {selectedPlatforms.length} of {platforms.length} selected
          </span>
        </label>
      </div>

      <div className="platform-selector-group">
        {platforms.map(p => {
          const isSelected = selectedPlatforms.includes(p.id);
          const config = PLATFORM_CONFIG[p.id];

          return (
            <button
              key={p.id}
              type="button"
              className={`platform-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => onTogglePlatform(p.id)}
            >
              <div 
                className="platform-chip-icon"
                style={{ color: isSelected ? 'var(--color-primary)' : config.brandColor }}
              >
                {p.icon}
              </div>
              <span>{p.label}</span>
              {isSelected && <Check size={14} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
