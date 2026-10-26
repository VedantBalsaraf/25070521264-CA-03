import { forwardRef, useId } from 'react';
import { cn } from '../../utils/formatters';

export const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      success = false,
      className,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="input-group">
        {label && (
          <label htmlFor={id} className="input-label">
            {label}
          </label>
        )}
        <div className="input-wrapper">
          {leftIcon && <span className="input-icon" aria-hidden="true">{leftIcon}</span>}
          <input
            ref={ref}
            id={id}
            className={cn('input-field', error && 'error', success && 'success', className)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            {...props}
          />
          {rightIcon && <span className="input-icon-right" aria-hidden="true">{rightIcon}</span>}
        </div>
        {error && (
          <p id={errorId} className="input-error" role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="input-hint">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';