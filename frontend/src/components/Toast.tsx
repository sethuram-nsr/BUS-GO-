import React, { useEffect } from 'react';
import { AlertCircleIcon, CheckIcon, CloseIcon } from './icons/Icons';

interface ToastProps {
  message: string;
  type?: 'error' | 'info' | 'success';
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'error', onDismiss }) => {
  // Auto-dismiss after 4s
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const Icon = type === 'success' ? CheckIcon : AlertCircleIcon;

  return (
    <div className={`notification-toast ${type}`} role="alert" aria-live="assertive">
      <div className="toast-icon-side">
        <Icon size={20} />
      </div>
      <div className="toast-content-side">
        <p className="toast-message">{message}</p>
      </div>
      <button
        type="button"
        className="toast-dismiss-btn"
        onClick={onDismiss}
        aria-label="Dismiss message"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
};
