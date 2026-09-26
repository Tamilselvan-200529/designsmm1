import React, { useState, useRef, useEffect } from 'react';
import type { SocialPlatform } from '../../types';
import { ChevronDown, ChevronUp, X, Check, Pencil } from 'lucide-react';
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  TiktokIcon,
  YoutubeIcon,
} from '../common/SocialIcons';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CalendarFilterState {
  types: string[];          // content type: post, story, reel, …
  postTypes: string[];      // post status: published, scheduled, …
  networkTypes: SocialPlatform[];
  createdBy: string[];
}

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  /** Color for the icon bubble background, e.g. "#e1306c". Falls back to green. */
  iconBg?: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

// ─── Multi-Select Dropdown ────────────────────────────────────────────────────
const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value],
    );
  };

  const clearThis = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setOpen(false);
  };

  const hasSelection = selected.length > 0;

  return (
    <div className="cal-filter-dropdown" ref={ref}>
      {/* ── Trigger button ── */}
      <button
        className={`cal-filter-btn ${hasSelection ? 'active' : ''} ${open ? 'open' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        type="button"
        id={`filter-btn-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <span className="cal-filter-btn-label">{label}</span>

        {/* Green edit icon when filter is active */}
        {hasSelection && (
          <span className="cal-filter-edit-icon" aria-hidden>
            <Pencil size={10} />
          </span>
        )}

        {/* × clear THIS filter only */}
        {hasSelection && (
          <span
            className="cal-filter-clear-btn"
            onClick={clearThis}
            role="button"
            aria-label={`Clear ${label} filter`}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && clearThis(e as unknown as React.MouseEvent)}
          >
            <X size={11} />
          </span>
        )}

        {/* Chevron toggles direction */}
        {open
          ? <ChevronUp size={13} className="cal-filter-chevron" />
          : <ChevronDown size={13} className="cal-filter-chevron" />}
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="cal-filter-menu" role="listbox" aria-label={`${label} options`}>
          {placeholder && (
            <div className="cal-filter-menu-header">{placeholder}</div>
          )}

          {options.map(opt => {
            const isSelected = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                className={`cal-filter-option ${isSelected ? 'selected' : ''}`}
                onClick={() => toggle(opt.value)}
                type="button"
                role="option"
                aria-selected={isSelected}
              >
                {/* Green rounded checkbox */}
                <span className={`cal-filter-checkbox ${isSelected ? 'checked' : ''}`}>
                  {isSelected && <Check size={9} strokeWidth={3} />}
                </span>

                {/* Icon bubble (platform/avatar) */}
                {opt.icon && (
                  <span
                    className="cal-filter-option-icon-bubble"
                    style={opt.iconBg ? { background: opt.iconBg + '22' } : undefined}
                  >
                    {opt.icon}
                  </span>
                )}

                <span className="cal-filter-option-label">{opt.label}</span>
              </button>
            );
          })}

          {hasSelection && (
            <button
              className="cal-filter-clear-row"
              onClick={() => onChange([])}
              type="button"
            >
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── CalendarFilters ─────────────────────────────────────────────────────────
interface CalendarFiltersProps {
  filters: CalendarFilterState;
  onChange: (filters: CalendarFilterState) => void;
  brandMembers: Array<{ id: string; name: string; avatar: string }>;
}

// ─── Content-type options (the "Type" filter) ────────────────────────────────
const TYPE_OPTIONS: FilterOption[] = [
  {
    value: 'post',
    label: 'Post',
    iconBg: '#22c55e',
    icon: (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 14,
          height: 14,
          borderRadius: 4,
          background: '#22c55e',
          color: '#fff',
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '-0.5px',
        }}
      >
        P
      </span>
    ),
  },
];



const POST_TYPE_OPTIONS: FilterOption[] = [
  { value: 'published', label: 'Published Posts',     iconBg: '#15803d', icon: <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#15803d', display: 'block' }} /> },
  { value: 'scheduled', label: 'Scheduled Posts',     iconBg: '#1d4ed8', icon: <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#1d4ed8', display: 'block' }} /> },
  { value: 'pending',   label: 'Unpublished / Review', iconBg: '#b45309', icon: <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#b45309', display: 'block' }} /> },
  { value: 'draft',     label: 'Draft Posts',         iconBg: '#64748b', icon: <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#64748b', display: 'block' }} /> },
  { value: 'failed',    label: 'Failed Posts',        iconBg: '#b91c1c', icon: <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#b91c1c', display: 'block' }} /> },
];

const NETWORK_TYPE_OPTIONS: FilterOption[] = [
  { value: 'instagram', label: 'Instagram', iconBg: '#e1306c', icon: <InstagramIcon size={13} color="#e1306c" /> },
  { value: 'facebook',  label: 'Facebook',  iconBg: '#1877f2', icon: <FacebookIcon  size={13} color="#1877f2" /> },
  { value: 'linkedin',  label: 'LinkedIn',  iconBg: '#0a66c2', icon: <LinkedinIcon  size={13} color="#0a66c2" /> },
  { value: 'tiktok',    label: 'TikTok',    iconBg: '#000000', icon: <TiktokIcon    size={13} color="#000000" /> },
  { value: 'youtube',   label: 'YouTube',   iconBg: '#ff0000', icon: <YoutubeIcon   size={13} color="#ff0000" /> },
];

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onChange,
  brandMembers,
}) => {
  const hasAnyFilter =
    filters.types.length > 0 ||
    filters.postTypes.length > 0 ||
    filters.networkTypes.length > 0 ||
    filters.createdBy.length > 0;

  const memberOptions: FilterOption[] = brandMembers.map(m => ({
    value: m.id,
    label: m.name,
    icon: (
      <img
        src={m.avatar}
        alt={m.name}
        style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover' }}
      />
    ),
  }));

  const clearAll = () =>
    onChange({ types: [], postTypes: [], networkTypes: [], createdBy: [] });

  return (
    <div className="calendar-filters-bar">
      <span className="cal-filter-label">Filter by:</span>

      {/* ── Type (content type: Post / Story / Reel / Video) ── */}
      <MultiSelectDropdown
        label="Type"
        options={TYPE_OPTIONS}
        selected={filters.types}
        onChange={vals => onChange({ ...filters, types: vals })}
        placeholder="Select content type"
      />

      <MultiSelectDropdown
        label="Post Type"
        options={POST_TYPE_OPTIONS}
        selected={filters.postTypes}
        onChange={vals => onChange({ ...filters, postTypes: vals })}
        placeholder="Select post types"
      />

      <MultiSelectDropdown
        label="Network Type"
        options={NETWORK_TYPE_OPTIONS}
        selected={filters.networkTypes as string[]}
        onChange={vals => onChange({ ...filters, networkTypes: vals as SocialPlatform[] })}
        placeholder="Select networks"
      />

      <MultiSelectDropdown
        label="Created By"
        options={memberOptions}
        selected={filters.createdBy}
        onChange={vals => onChange({ ...filters, createdBy: vals })}
        placeholder="Select team members"
      />

      {hasAnyFilter && (
        <button
          className="cal-filter-clear-all"
          id="calendar-filter-clear-all-btn"
          onClick={clearAll}
          type="button"
        >
          <X size={11} />
          Clear all
        </button>
      )}
    </div>
  );
};
