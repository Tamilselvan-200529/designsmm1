import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Tag, Globe, Clock, FileText, Briefcase } from 'lucide-react';

export const BrandModal: React.FC = () => {
  const { isCreateBrandOpen, setIsCreateBrandOpen, createBrand } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [timezone, setTimezone] = useState('America/New_York (EST)');
  const [industry, setIndustry] = useState('General');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Brand name is required');
      return;
    }
    createBrand({
      name: name.trim(),
      description: description.trim(),
      website: website.trim(),
      timezone,
      industry
    });
    setName('');
    setDescription('');
    setWebsite('');
    setError('');
  };

  const industries = [
    'General', 'Hospitality & Fine Dining', 'Sustainable Apparel & Fashion',
    'Consumer Electronics & Audio', 'Health & Wellness', 'Beauty & Cosmetics',
    'Retail & E-commerce', 'Sports & Fitness', 'Travel & Tourism',
    'Education & EdTech', 'Financial Services', 'Real Estate',
    'Technology & SaaS', 'Media & Entertainment', 'Non-Profit'
  ];

  return (
    <Modal
      isOpen={isCreateBrandOpen}
      onClose={() => setIsCreateBrandOpen(false)}
      title="Create New Brand"
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-body" style={{ fontSize: '13.5px' }}>
          Each brand has its own social accounts, content calendar, media library, analytics, approvals, and team access — all isolated within your organization.
        </p>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            <span>Brand Name *</span>
          </label>
          <div className="search-input-wrap">
            <Tag size={16} />
            <input
              type="text"
              className={`form-input ${error ? 'error' : ''}`}
              style={{ paddingLeft: '34px' }}
              placeholder="e.g. ABC Restaurant"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
          </div>
          {error && <span className="form-error-msg">{error}</span>}
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Brand Description</label>
          <div className="search-input-wrap">
            <FileText size={16} style={{ top: '10px', position: 'absolute', left: '10px' }} />
            <textarea
              className="form-textarea"
              style={{ paddingLeft: '34px', minHeight: '72px', resize: 'vertical' }}
              placeholder="Brief description of this brand..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Industry / Category</label>
          <div className="search-input-wrap">
            <Briefcase size={16} />
            <select
              className="form-select"
              style={{ paddingLeft: '34px' }}
              value={industry}
              onChange={e => setIndustry(e.target.value)}
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Website</label>
          <div className="search-input-wrap">
            <Globe size={16} />
            <input
              type="url"
              className="form-input"
              style={{ paddingLeft: '34px' }}
              placeholder="https://brand.example.com"
              value={website}
              onChange={e => setWebsite(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Publishing Timezone</label>
          <div className="search-input-wrap">
            <Clock size={16} />
            <select
              className="form-select"
              style={{ paddingLeft: '34px' }}
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
            >
              <option value="America/New_York (EST)">America/New_York (EST - UTC-5)</option>
              <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST - UTC-8)</option>
              <option value="America/Chicago (CST)">America/Chicago (CST - UTC-6)</option>
              <option value="Europe/London (GMT)">Europe/London (GMT - UTC+0)</option>
              <option value="Europe/Paris (CET)">Europe/Paris (CET - UTC+1)</option>
              <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST - UTC+9)</option>
              <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST - UTC+5:30)</option>
              <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT - UTC+8)</option>
              <option value="Australia/Sydney (AEST)">Australia/Sydney (AEST - UTC+10)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2" style={{ marginTop: '8px' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsCreateBrandOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Brand
          </Button>
        </div>
      </form>
    </Modal>
  );
};
