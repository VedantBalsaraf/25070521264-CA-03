import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { buttonVariants } from '../ui/button';

export const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      as: Component = 'button',
      type,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary: 'default',
      secondary: 'secondary',
      outline: 'outline',
      ghost: 'ghost',
      danger: 'destructive',
      success: 'success'
    };
    const sizeClasses = {
      sm: 'sm',
      md: 'default',
      lg: 'lg',
      xl: 'xl',
      icon: 'icon'
    };
    const widthClass = fullWidth ? 'btn-full' : '';

    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant: variantClasses[variant] || 'default', size: sizeClasses[size] || 'default' }), widthClass, className)}
        {...(Component === 'button' ? { type: type || 'button', disabled: disabled || loading } : {})}
        {...props}
      >
        {loading && (
          <span className="loading-dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        )}
        {!loading && leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
        <span className="btn-text">{children}</span>
        {!loading && rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
      </Component>
    );
  }
);

Button.displayName = 'Button';
