import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Eye, Sparkles, Check, Info } from 'lucide-react';

interface AltTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaIndex: number;
  initialAltText: string;
  onSave: (altText: string) => void;
}

export const AltTextModal: React.FC<AltTextModalProps> = ({
  isOpen,
  onClose,
  mediaUrl,
  mediaIndex,
  initialAltText,
  onSave
}) => {
  const [altText, setAltText] = useState(initialAltText);

  useEffect(() => {
    setAltText(initialAltText);
  }, [initialAltText, isOpen]);

  const handleGenerateAI = () => {
    // Simulated smart auto-alt text generator
    const suggestions = [
      'A fresh gourmet farm-to-table lunch dish served on a rustic wooden board with herbs and organic ingredients.',
      'Close-up view of freshly prepared chef special with vibrant greens, roasted vegetables, and salmon.',
      'Delicious handcrafted artisan dish beautifully presented in natural ambient restaurant lighting.',
      'Behind-the-scenes preparation in kitchen featuring fresh seasonal organic produce and culinary styling.'
    ];
    const picked = suggestions[mediaIndex % suggestions.length];
    setAltText(picked);
  };

  const handleSave = () => {
    onSave(altText.trim());
    onClose();
  };

  const charLimit = 1000;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Image Alt Text (Accessibility Description)"
      className="alt-text-modal"
    >
      <div className="flex flex-col gap-4 p-4">
        {/* Info Banner */}
        <div 
          className="flex items-start gap-2.5 p-3 rounded-md"
          style={{ backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary-border)' }}
        >
          <Info size={16} color="var(--color-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div className="text-caption" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--color-primary)' }}>Why write Alt Text?</strong> Alt text enables visually impaired people using screen readers to experience your content. It is also indexed by search engines and required by accessibility compliance standards.
          </div>
        </div>

        {/* Media Preview & Input Grid */}
        <div className="alt-text-content-grid">
          <div className="alt-media-preview-box">
            <img src={mediaUrl} alt="Preview" className="alt-preview-img" />
            <div className="alt-media-label">Image #{mediaIndex + 1}</div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between">
              <label className="form-label" style={{ marginBottom: 0 }}>
                Describe this image
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleGenerateAI}
                style={{ color: 'var(--color-primary)', fontSize: '12px', gap: '4px' }}
                title="Generate descriptive alt text suggestion"
              >
                <Sparkles size={13} />
                <span>Suggest with AI</span>
              </button>
            </div>

            <textarea
              className="composer-textarea"
              style={{ minHeight: '120px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '10px' }}
              placeholder="e.g. A vibrant plate of grilled salmon with roasted vegetables and fresh herbs served on a rustic wooden platter..."
              value={altText}
              onChange={e => setAltText(e.target.value.slice(0, charLimit))}
            />

            <div className="flex items-center justify-between text-caption text-muted">
              <span>Aim for 1-2 clear, descriptive sentences</span>
              <span className={altText.length > charLimit * 0.9 ? 'text-warning' : ''}>
                {altText.length} / {charLimit}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-subtle">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={<Check size={14} />} onClick={handleSave}>
            Save Alt Text
          </Button>
        </div>
      </div>
    </Modal>
  );
};
