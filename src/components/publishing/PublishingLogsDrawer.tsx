import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PlatformBadge } from '../common/Badge';
import { RefreshCw, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export const PublishingLogsDrawer: React.FC = () => {
  const { isPublishingLogsOpen, setIsPublishingLogsOpen, publishingLogs, retryFailedPost } = useApp();

  return (
    <Modal
      isOpen={isPublishingLogsOpen}
      onClose={() => setIsPublishingLogsOpen(false)}
      title="Publishing Engine & Dispatch Logs"
      maxWidth="680px"
    >
      <div className="flex flex-col gap-4">
        <p className="text-body" style={{ fontSize: '13px' }}>
          Real-time background worker queue and platform API response telemetry for the active workspace.
        </p>

        <div className="table-responsive-wrapper">
          <table className="team-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Post Caption</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Time</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {publishingLogs.map(log => (
                <tr key={log.id}>
                  <td>
                    <PlatformBadge platform={log.platform} showName={false} />
                  </td>
                  <td style={{ maxWidth: '220px' }}>
                    <span className="text-caption font-semibold" style={{ color: 'var(--text-primary)', display: 'block' }}>
                      {log.postCaption}
                    </span>
                    {log.error && (
                      <span className="text-caption" style={{ color: '#dc2626', fontSize: '11px' }}>
                        {log.error}
                      </span>
                    )}
                  </td>
                  <td>
                    {log.status === 'success' ? (
                      <span className="badge badge-published">
                        <CheckCircle2 size={11} /> Success
                      </span>
                    ) : log.status === 'failed' ? (
                      <span className="badge badge-failed">
                        <AlertTriangle size={11} /> Failed
                      </span>
                    ) : (
                      <span className="badge badge-pending">
                        <Clock size={11} /> Processing
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {log.attempts}
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {log.timestamp}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {log.status === 'failed' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<RefreshCw size={12} />}
                        onClick={() => retryFailedPost(log.postId)}
                      >
                        Retry
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
