import React from 'react';
import { MediaItem } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { formatBytes } from '../../utils/helpers';
import { Download, Trash2, PenSquare, Tag, Folder, Calendar } from 'lucide-react';

interface MediaPreviewModalProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  media,
  isOpen,
  onClose,
  onDelete
}) => {
  const { openComposer, showToast } = useApp();

  if (!media) return null;

  const handleUseInComposer = () => {
    onClose();
    openComposer({
      id: '',
      brandId: media.brandId,
      platforms: ['instagram', 'facebook'],
      content: '',
      mediaUrls: [media.url],
      mediaType: media.type === 'video' ? 'video' : 'image',
      status: 'draft',
      createdAt: new Date().toISOString(),
      author: {
        id: 'usr-current',
        name: 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        role: 'Owner'
      },
      comments: [],
      auditLog: []
    });
    showToast('info', `Attached "${media.name}" to new post in Composer.`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={media.name}
      maxWidth="680px"
    >
      <div className="flex flex-col gap-4">
        {/* Full Image / Video Frame */}
        <div 
          className="w-full flex items-center justify-center bg-muted rounded-lg overflow-hidden border border-subtle"
          style={{ maxHeight: '380px' }}
        >
          {media.type === 'video' ? (
            <video src={media.url} controls style={{ maxWidth: '100%', maxHeight: '380px' }} />
          ) : (
            <img src={media.url} alt={media.name} style={{ maxWidth: '100%', maxHeight: '380px', objectFit: 'contain' }} />
          )}
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-subtle border border-subtle rounded-lg text-caption" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <span className="text-muted">File Type: </span>
            <strong className="text-primary">{media.type.toUpperCase()}</strong>
          </div>
          <div>
            <span className="text-muted">File Size: </span>
            <strong className="text-primary">{formatBytes(media.sizeBytes)}</strong>
          </div>
          <div>
            <span className="text-muted">Dimensions: </span>
            <strong className="text-primary">{media.dimensions || '1920 x 1080'}</strong>
          </div>
          <div>
            <span className="text-muted">Folder: </span>
            <strong className="text-primary">{media.folder}</strong>
          </div>
          <div>
            <span className="text-muted">Uploaded: </span>
            <strong className="text-primary">{media.uploadedAt}</strong>
          </div>
          <div>
            <span className="text-muted">Used in: </span>
            <strong style={{ color: 'var(--color-primary)' }}>{media.usedCount} published posts</strong>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-caption text-muted flex items-center gap-1"><Tag size={12} /> Tags:</span>
          {media.tags.map(tag => (
            <span key={tag} className="badge badge-draft" style={{ fontSize: '11px' }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-subtle">
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={14} />}
            onClick={() => {
              onDelete(media.id);
              onClose();
            }}
          >
            Delete Asset
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => showToast('info', `Downloading ${media.name}...`)}
            >
              Download
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<PenSquare size={14} />}
              onClick={handleUseInComposer}
            >
              Use in Composer
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
