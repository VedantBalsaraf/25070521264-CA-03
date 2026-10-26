import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/formatters';
import { X } from 'lucide-react';

const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
};

/**
 * Accessible modal.
 *
 * The dialog is rendered *inside* the overlay so the overlay's flexbox centres
 * it. Rendering them as siblings meant the overlay (which has a z-index) painted
 * over the position-static dialog and swallowed every click inside it.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape' && closeOnEscape) onClose();
    };

    document.addEventListener('keydown', handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="presentation"
    >
      <div
        className={cn('modal', SIZE_CLASSES[size])}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 id="modal-title" className="modal-title">{title}</h2>
            )}
            {showCloseButton && (
              <button className="modal-close" onClick={onClose} aria-label="Close modal" type="button">
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className="modal-body" id={description ? 'modal-description' : undefined}>
          {description && <p className="text-gray-600 mb-4">{description}</p>}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false
}) {
  const variantClasses = {
    primary: 'btn-primary',
    danger: 'btn-danger',
    warning: 'btn-warning'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
          {cancelText}
        </button>
        <button
          type="button"
          className={cn('btn', variantClasses[variant])}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
