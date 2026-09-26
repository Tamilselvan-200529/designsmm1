import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { MediaPreviewModal } from './MediaPreviewModal';
import { MediaItem } from '../../types';
import { formatBytes } from '../../utils/helpers';
import { 
  Upload, 
  FolderPlus, 
  LayoutGrid, 
  List, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Download, 
  Trash2, 
  Tag,
  Folder
} from 'lucide-react';

export const MediaLibraryView: React.FC = () => {
  const { mediaItems, uploadMedia, deleteMedia, showToast } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  const folders = ['All', 'Brand Assets', 'Product Images', 'Campaign Media', 'Videos'];

  const filteredMedia = mediaItems.filter(item => {
    if (selectedFolder !== 'All' && item.folder !== selectedFolder) {
      return false;
    }
    if (selectedType !== 'all' && item.type !== selectedType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSimulateUpload = () => {
    uploadMedia({
      name: `asset_${Date.now().toString().slice(-4)}.jpg`,
      url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      type: 'image',
      sizeBytes: 2450000,
      dimensions: '2048 x 1365',
      folder: selectedFolder === 'All' ? 'Brand Assets' : selectedFolder,
      tags: ['culinary', 'new-upload']
    });
  };

  const handleCreateFolder = () => {
    const name = prompt('Enter new folder name:');
    if (name) {
      showToast('success', `Created folder "${name}".`);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="text-display" style={{ fontSize: '24px' }}>Media Library</h1>
          <p className="text-body">
            Centralized creative cloud for images, reels, videos, and brand collateral
          </p>
        </div>

        <div className="page-actions">
          <Button
            variant="secondary"
            icon={<FolderPlus size={15} />}
            onClick={handleCreateFolder}
          >
            New Folder
          </Button>
          <Button
            variant="primary"
            icon={<Upload size={15} />}
            onClick={handleSimulateUpload}
          >
            Upload Media
          </Button>
        </div>
      </div>

      {/* Control Bar: Folders Pills, Search, Filters, and Grid/List View Toggles */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Folders */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {folders.map(f => (
              <button
                key={f}
                className={`btn btn-sm ${selectedFolder === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedFolder(f)}
              >
                <Folder size={13} />
                <span>{f}</span>
              </button>
            ))}
          </div>

          {/* Search, Type Filter & View Toggle */}
          <div className="flex items-center gap-3">
            <div className="search-input-wrap" style={{ width: '220px' }}>
              <Search size={14} />
              <input
                type="text"
                className="form-input search-input"
                style={{ height: '32px', fontSize: '12.5px', paddingLeft: '30px' }}
                placeholder="Search assets or tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="form-select"
              style={{ width: 'auto', height: '32px', fontSize: '12.5px', padding: '0 8px' }}
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="gif">GIFs</option>
            </select>

            {/* Grid / List Toggles */}
            <div className="calendar-view-toggle">
              <button
                className={`calendar-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                className={`calendar-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MEDIA ASSETS DISPLAY */}
      {filteredMedia.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Upload size={28} />
          </div>
          <h3 className="empty-state-title">Your media library is empty</h3>
          <p className="empty-state-desc">
            Upload product photos, campaign videos, and behind-the-scenes assets to reuse across campaigns.
          </p>
          <Button variant="primary" onClick={handleSimulateUpload}>
            Upload First Asset
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="media-grid">
          {filteredMedia.map(item => (
            <div 
              key={item.id} 
              className="media-card cursor-pointer"
              onClick={() => setPreviewMedia(item)}
            >
              <div className="media-thumb-container">
                <span className="media-card-type-tag">{item.type}</span>
                <img src={item.url} alt={item.name} />
              </div>

              <div className="media-card-info">
                <span className="media-card-name" title={item.name}>{item.name}</span>
                <div className="media-card-meta">
                  <span>{formatBytes(item.sizeBytes)}</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                    {item.usedCount} posts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="team-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Thumb</th>
                <th>File Name</th>
                <th>Folder</th>
                <th>Format</th>
                <th>Size</th>
                <th>Used In</th>
                <th>Uploaded</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.map(item => (
                <tr key={item.id} onClick={() => setPreviewMedia(item)} className="cursor-pointer">
                  <td>
                    <img src={item.url} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.name}
                  </td>
                  <td>
                    <span className="badge badge-draft">{item.folder}</span>
                  </td>
                  <td style={{ textTransform: 'uppercase', fontSize: '12px' }}>
                    {item.type}
                  </td>
                  <td style={{ fontSize: '12.5px' }}>
                    {formatBytes(item.sizeBytes)}
                  </td>
                  <td style={{ fontSize: '12.5px', color: 'var(--color-primary)', fontWeight: 500 }}>
                    {item.usedCount} posts
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {item.uploadedAt}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-ghost btn-icon-only btn-sm"
                      onClick={e => {
                        e.stopPropagation();
                        setPreviewMedia(item);
                      }}
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Media Fullscreen Preview Modal */}
      <MediaPreviewModal
        media={previewMedia}
        isOpen={Boolean(previewMedia)}
        onClose={() => setPreviewMedia(null)}
        onDelete={deleteMedia}
      />
    </div>
  );
};
