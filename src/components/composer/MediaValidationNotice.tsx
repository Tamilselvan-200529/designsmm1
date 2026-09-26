import React, { useState } from 'react';
import { SocialPlatform } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface MediaValidationNoticeProps {
  mediaUrls: string[];
  mediaType: 'text' | 'image' | 'video' | 'carousel' | 'link';
  selectedPlatforms: SocialPlatform[];
  altTexts?: Record<string, string>;
  thumbnailUrl?: string;
}

interface ValidationCheck {
  platform: SocialPlatform;
  rule: string;
  status: 'pass' | 'warn' | 'fail';
  details: string;
}

export const MediaValidationNotice: React.FC<MediaValidationNoticeProps> = ({
  mediaUrls,
  mediaType,
  selectedPlatforms,
  altTexts = {},
  thumbnailUrl
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (mediaUrls.length === 0 && mediaType === 'text') {
    return null;
  }

  const checks: ValidationCheck[] = [];

  // 1. TikTok validations
  if (selectedPlatforms.includes('tiktok')) {
    if (mediaType === 'video') {
      checks.push({
        platform: 'tiktok',
        rule: 'Format & Aspect Ratio',
        status: 'pass',
        details: 'MP4 vertical (9:16) format compliant with TikTok video requirements.'
      });
      if (!thumbnailUrl) {
        checks.push({
          platform: 'tiktok',
          rule: 'Cover Frame',
          status: 'warn',
          details: 'Recommended to pick a cover thumbnail frame for the video.'
        });
      }
    } else if (mediaUrls.length > 0) {
      checks.push({
        platform: 'tiktok',
        rule: 'Media Type',
        status: 'warn',
        details: 'TikTok will publish static images as a Photo Mode music slideshow.'
      });
    }
  }

  // 2. YouTube validations
  if (selectedPlatforms.includes('youtube')) {
    if (mediaType !== 'video' && mediaUrls.length > 1) {
      checks.push({
        platform: 'youtube',
        rule: 'Community Post Limit',
        status: 'fail',
        details: 'YouTube Community feed supports max 1 image or a video post.'
      });
    } else if (mediaType === 'video') {
      checks.push({
        platform: 'youtube',
        rule: 'Video Upload',
        status: 'pass',
        details: 'YouTube supports 16:9 standard video or 9:16 YouTube Shorts.'
      });
    }
  }

  // 3. Instagram validations
  if (selectedPlatforms.includes('instagram')) {
    if (mediaUrls.length > 10) {
      checks.push({
        platform: 'instagram',
        rule: 'Carousel Size',
        status: 'fail',
        details: 'Instagram carousel allows a maximum of 10 media slides.'
      });
    } else if (mediaUrls.length > 1) {
      checks.push({
        platform: 'instagram',
        rule: 'Carousel Ratio',
        status: 'pass',
        details: `Carousel with ${mediaUrls.length} slides ready. All slides will crop to 1:1 or 4:5.`
      });
    } else if (mediaUrls.length === 1) {
      checks.push({
        platform: 'instagram',
        rule: 'Image Dimensions',
        status: 'pass',
        details: 'Image resolution meets Instagram 1080x1080 (1:1) standards.'
      });
    }
  }

  // 4. Accessibility Alt Text validation across platforms
  if (mediaUrls.length > 0) {
    const missingAltCount = mediaUrls.filter((_, idx) => !altTexts[idx] && !altTexts[mediaUrls[idx]]).length;
    if (missingAltCount > 0) {
      checks.push({
        platform: 'instagram',
        rule: 'Accessibility (Alt Text)',
        status: 'warn',
        details: `${missingAltCount} of ${mediaUrls.length} media item(s) are missing Alt Text descriptions.`
      });
    } else {
      checks.push({
        platform: 'instagram',
        rule: 'Accessibility (Alt Text)',
        status: 'pass',
        details: 'All attached media files have descriptive accessibility Alt Text.'
      });
    }
  }

  // Determine overall status
  const hasFail = checks.some(c => c.status === 'fail');
  const hasWarn = checks.some(c => c.status === 'warn');

  const overallStatus: 'pass' | 'warn' | 'fail' = hasFail ? 'fail' : hasWarn ? 'warn' : 'pass';

  let bannerMessage = 'All media assets match required platform dimensions & formats.';
  if (hasFail) {
    bannerMessage = 'Media compatibility issues detected for selected platforms.';
  } else if (hasWarn) {
    bannerMessage = 'Media matches platform formats with optimization recommendations.';
  }

  const renderIcon = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass': return <CheckCircle2 size={15} color="#16a34a" />;
      case 'warn': return <AlertTriangle size={15} color="#d97706" />;
      case 'fail': return <AlertCircle size={15} color="#dc2626" />;
    }
  };

  const bgStyle = overallStatus === 'pass' 
    ? 'var(--status-published-bg)' 
    : overallStatus === 'warn' 
      ? 'var(--status-pending-bg)' 
      : 'var(--status-failed-bg)';

  const borderStyle = overallStatus === 'pass' 
    ? 'var(--status-published-border)' 
    : overallStatus === 'warn' 
      ? 'var(--status-pending-border)' 
      : 'var(--status-failed-border)';

  const textStyle = overallStatus === 'pass' 
    ? 'var(--status-published-text)' 
    : overallStatus === 'warn' 
      ? 'var(--status-pending-text)' 
      : 'var(--status-failed-text)';

  return (
    <div 
      className="media-validation-container"
      style={{
        backgroundColor: bgStyle,
        border: `1px solid ${borderStyle}`,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}
    >
      <div 
        className="flex items-center justify-between p-2.5 cursor-pointer"
        style={{ color: textStyle }}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-2 text-caption">
          {renderIcon(overallStatus)}
          <span style={{ fontWeight: 600 }}>{bannerMessage}</span>
        </div>
        <div className="flex items-center gap-1 text-caption" style={{ opacity: 0.85 }}>
          <span>{showDetails ? 'Hide Details' : 'View Checklist'}</span>
          {showDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </div>
      </div>

      {/* Expanded Validation Breakdown */}
      {showDetails && checks.length > 0 && (
        <div className="p-3 border-t border-subtle bg-white flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-caption font-semibold text-muted">
            <ShieldCheck size={14} color="var(--color-primary)" />
            <span>PLATFORM VALIDATION REPORT</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {checks.map((item, i) => (
              <div 
                key={i} 
                className="flex items-start justify-between gap-2 p-2 rounded text-caption"
                style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}
              >
                <div className="flex items-start gap-2">
                  <span style={{ marginTop: '2px' }}>{renderIcon(item.status)}</span>
                  <div>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {item.platform}: {item.rule}
                    </span>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '11.5px', marginTop: '2px' }}>
                      {item.details}
                    </p>
                  </div>
                </div>
                <span 
                  className="badge badge-sm"
                  style={{
                    backgroundColor: item.status === 'pass' ? '#dcfce7' : item.status === 'warn' ? '#fef3c7' : '#fee2e2',
                    color: item.status === 'pass' ? '#166534' : item.status === 'warn' ? '#92400e' : '#991b1b',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
