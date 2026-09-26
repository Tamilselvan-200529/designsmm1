import React, { useState } from 'react';
import { Post } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Calendar, Clock, Globe } from 'lucide-react';

interface RescheduleModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (postId: string, newTime: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  post,
  isOpen,
  onClose,
  onReschedule
}) => {
  const [date, setDate] = useState('2026-09-25');
  const [time, setTime] = useState('18:30');

  if (!post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `${date} at ${time}`;
    onReschedule(post.id, formatted);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reschedule Post"
      maxWidth="460px"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-body" style={{ fontSize: '13px' }}>
          Select a new target date and dispatch time for: <strong>"{post.content.substring(0, 45)}..."</strong>
        </p>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">New Date</label>
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
          <label className="form-label">New Time</label>
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

        <div className="flex items-center gap-1.5 text-caption" style={{ color: 'var(--text-muted)' }}>
          <Globe size={13} />
          <span>Publishing in America/New_York (EST) timezone</span>
        </div>

        <div className="flex items-center justify-end gap-2 mt-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Confirm Reschedule
          </Button>
        </div>
      </form>
    </Modal>
  );
};
