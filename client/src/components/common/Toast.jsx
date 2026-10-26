import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/formatters';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * @typedef {Object} Toast
 * @property {string} id
 * @property {'success'|'error'|'warning'|'info'} type
 * @property {string} title
 * @property {string} [message]
 * @property {number} [duration]
 * @property {{label: string, onClick: () => void}} [action]
 */

/**
 * @typedef {Object} ToastContextType
 * @property {Toast[]} toasts
 * @property {(toast: Omit<Toast, 'id'>) => string} showToast
 * @property {(id: string) => void} hideToast
 */

const ToastContext = createContext(undefined);

const toastIcons = {
  success: <CheckCircle className="text-success-500" size={20} />,
  error: <AlertCircle className="text-error-500" size={20} />,
  warning: <AlertTriangle className="text-warning-500" size={20} />,
  info: <Info className="text-primary-500" size={20} />
};

const toastBorders = {
  success: 'border-l-success-500',
  error: 'border-l-error-500',
  warning: 'border-l-warning-500',
  info: 'border-l-primary-500'
};

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => onClose(toast.id), toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return (
    <div className={cn('toast', toastBorders[toast.type])} role="alert">
      <div className="toast-icon flex-shrink-0">{toastIcons[toast.type]}</div>
      <div className="toast-content flex-1 min-w-0">
        <p className="toast-title font-semibold text-gray-900">{toast.title}</p>
        {toast.message && <p className="toast-message text-sm text-gray-600">{toast.message}</p>}
        {toast.action && (
          <button
            onClick={() => { toast.action?.onClick(); onClose(toast.id); }}
            className="mt-2 text-sm font-medium text-primary-600 hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="toast-close flex-shrink-0 text-gray-400 hover:text-gray-700 p-1"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function ToastContainer() {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="toast-container" aria-live="polite" aria-label="Notifications">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={hideToast} />
      ))}
    </div>,
    document.body
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function useToastHelpers() {
  const { showToast } = useToast();

  return {
    success: (title, message, options) =>
      showToast({ type: 'success', title, message, ...options }),
    error: (title, message, options) =>
      showToast({ type: 'error', title, message, ...options }),
    warning: (title, message, options) =>
      showToast({ type: 'warning', title, message, ...options }),
    info: (title, message, options) =>
      showToast({ type: 'info', title, message, ...options })
  };
}