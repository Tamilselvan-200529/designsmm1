import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Calendar, Clock, Globe, Repeat, UploadCloud, CheckCircle2 } from 'lucide-react';
import { PlatformBadge } from '../common/Badge';

export const ScheduleModal: React.FC = () => {
  const { 
    isScheduleModalOpen, 
    closeScheduleModal, 
    editingPost, 
    savePost, 
    currentBrand,
    showToast 
  } = useApp();

  const [scheduleType, setScheduleType] = useState<'specific' | 'next_slot' | 'recurring' | 'bulk'>('specific');
  const [date, setDate] = useState('2026-09-24');
  const [time, setTime] = useState('18:30');
  const [timezone, setTimezone] = useState(currentBrand.timezone);
  const [recurringFreq, setRecurringFreq] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [csvUploaded, setCsvUploaded] = useState(false);

  if (!isScheduleModalOpen) return null;

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) {
      closeScheduleModal();
      return;
    }

    let scheduledTimeString = `${date} at ${time}`;
    if (scheduleType === 'next_slot') {
      scheduledTimeString = 'Next Available Slot (Tomorrow 9:00 AM)';
    } else if (scheduleType === 'recurring') {
      scheduledTimeString = `Recurring (${recurringFreq}): ${date} at ${time}`;
    } else if (scheduleType === 'bulk') {
      scheduledTimeString = 'Batch schedule (12 dispatches queued)';
      showToast('success', '12 CSV posts validated and scheduled successfully!');
      closeScheduleModal();
      return;
    }

    savePost({
      ...editingPost,
      scheduledTime: scheduledTimeString
    }, 'scheduled');

    closeScheduleModal();
  };

  return (
    <Modal
      isOpen={isScheduleModalOpen}
      onClose={closeScheduleModal}
      title="Publishing & Scheduling Engine"
      maxWidth="580px"
    >
      <form onSubmit={handleConfirmSchedule} className="flex flex-col gap-4">
        {/* Post Summary Header */}
        {editingPost && (
          <div 
            className="flex items-center justify-between p-3 rounded-md"
            style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-caption font-semibold">TARGET PLATFORMS:</span>
              <div className="flex gap-1">
                {editingPost.platforms.map(p => (
                  <PlatformBadge key={p} platform={p} showName={false} />
                ))}
              </div>
            </div>
            <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
              {editingPost.content.substring(0, 32)}...
            </span>
          </div>
        )}

        {/* Schedule Mode Selector */}
        <div className="flex flex-col gap-2">
          <label className="form-label" style={{ marginBottom: 0 }}>
            <span>Scheduling Method</span>
          </label>
          <div className="calendar-view-toggle w-full">
            <button
              type="button"
              className={`calendar-view-btn flex-1 ${scheduleType === 'specific' ? 'active' : ''}`}
              onClick={() => setScheduleType('specific')}
            >
              Date & Time
            </button>
            <button
              type="button"
              className={`calendar-view-btn flex-1 ${scheduleType === 'next_slot' ? 'active' : ''}`}
              onClick={() => setScheduleType('next_slot')}
            >
              Next Slot
            </button>
            <button
              type="button"
              className={`calendar-view-btn flex-1 ${scheduleType === 'recurring' ? 'active' : ''}`}
              onClick={() => setScheduleType('recurring')}
            >
              Recurring
            </button>
            <button
              type="button"
              className={`calendar-view-btn flex-1 ${scheduleType === 'bulk' ? 'active' : ''}`}
              onClick={() => setScheduleType('bulk')}
            >
              Bulk CSV
            </button>
          </div>
        </div>

        {/* MODE 1: SPECIFIC DATE & TIME */}
        {scheduleType === 'specific' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Dispatch Date</label>
                <div className="search-input-wrap">
                  <Calendar size={16} />
                  <input
                    type="date"
                    className="form-input"
                    style={{ paddingLeft: '34px' }}
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Target Time</label>
                <div className="search-input-wrap">
                  <Clock size={16} />
                  <input
                    type="time"
                    className="form-input"
                    style={{ paddingLeft: '34px' }}
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Publishing Timezone</label>
              <div className="search-input-wrap">
                <Globe size={16} />
                <select
                  className="form-select"
                  style={{ paddingLeft: '34px' }}
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                >
                  <option value="America/New_York (EST)">America/New_York (EST - UTC-5)</option>
                  <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST - UTC-8)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT - UTC+0)</option>
                  <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST - UTC+5:30)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: NEXT AVAILABLE QUEUE SLOT */}
        {scheduleType === 'next_slot' && (
          <div className="p-4 bg-subtle border border-subtle rounded-lg flex flex-col gap-2" style={{ borderRadius: 'var(--radius-md)' }}>
            <span className="text-label" style={{ fontWeight: 600 }}>Optimal Queue Timeslot</span>
            <p className="text-body" style={{ fontSize: '13px' }}>
              Next open queue slot is computed automatically based on your brand posting schedule:
            </p>
            <div className="flex items-center gap-2 p-2 bg-white border border-subtle rounded text-body font-semibold" style={{ color: 'var(--color-primary)' }}>
              <Clock size={16} />
              <span>Tomorrow, Sep 24 at 09:00 AM EST</span>
            </div>
          </div>
        )}

        {/* MODE 3: RECURRING POST */}
        {scheduleType === 'recurring' && (
          <div className="flex flex-col gap-3">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Recurrence Cadence</label>
              <div className="flex gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                  <button
                    key={freq}
                    type="button"
                    className={`btn flex-1 ${recurringFreq === freq ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setRecurringFreq(freq)}
                  >
                    <Repeat size={14} />
                    <span>{freq.charAt(0).toUpperCase() + freq.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Start Date</label>
                <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Time</label>
                <input type="time" className="form-input" value={time} onChange={e => setTime(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* MODE 4: BULK CSV SCHEDULING UI */}
        {scheduleType === 'bulk' && (
          <div className="flex flex-col gap-3">
            <div 
              className="p-6 border border-dashed border-strong rounded-lg flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-subtle"
              style={{ borderRadius: 'var(--radius-lg)' }}
              onClick={() => setCsvUploaded(true)}
            >
              <UploadCloud size={32} color="var(--color-primary)" />
              <span className="text-body font-semibold">
                {csvUploaded ? 'social_posts_september_batch.csv' : 'Upload Bulk Posts CSV'}
              </span>
              <span className="text-caption">
                {csvUploaded ? '✓ 12 rows parsed, 0 validation errors' : 'Columns: caption, platforms, datetime, media_url'}
              </span>
            </div>

            {csvUploaded && (
              <div className="flex flex-col gap-1 p-3 bg-subtle border border-subtle rounded text-caption">
                <span className="font-semibold text-primary">Previewing Sample Rows:</span>
                <div>1. "Meet Chef Julian..." → Instagram, Facebook → Sep 25, 18:30</div>
                <div>2. "Artisan sourdough batch..." → Facebook, LinkedIn → Sep 26, 11:00</div>
                <div>3. "Weekend brunch special..." → Instagram, TikTok → Sep 27, 09:30</div>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-subtle">
          <Button type="button" variant="secondary" onClick={closeScheduleModal}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Confirm & Queue Post
          </Button>
        </div>
      </form>
    </Modal>
  );
};
