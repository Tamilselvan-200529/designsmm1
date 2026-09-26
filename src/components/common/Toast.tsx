import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => {
        const renderIcon = () => {
          switch (toast.type) {
            case 'success': return <CheckCircle2 size={18} color="#16a34a" />;
            case 'warning': return <AlertTriangle size={18} color="#d97706" />;
            case 'error': return <AlertCircle size={18} color="#dc2626" />;
            default: return <Info size={18} color="#2563eb" />;
          }
        };

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {renderIcon()}
            <span style={{ flex: 1, fontSize: '13px', color: 'var(--text-primary)' }}>
              {toast.message}
            </span>
            <button
              className="btn btn-ghost btn-icon-only"
              onClick={() => removeToast(toast.id)}
              style={{ padding: '2px', color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
