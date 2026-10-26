import { cloneElement, isValidElement } from 'react';
import { cn, getInitials, generateAvatarColor } from '../../utils/formatters';

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-xl'
};

const statusSizeClasses = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5'
};

const statusPositionClasses = {
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0'
};

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  status,
  statusPosition = 'bottom-right',
  className,
  ...props
}) {
  const showStatus = status && status !== 'offline';
  const statusColors = {
    online: 'bg-success-500',
    busy: 'bg-error-500',
    away: 'bg-warning-500',
    offline: 'bg-gray-400'
  };

  return (
    <div
      className={cn(
        'avatar',
        'relative inline-flex items-center justify-center overflow-hidden bg-primary-100 text-primary-600 font-semibold',
        sizeClasses[size],
        shape === 'square' ? 'rounded-lg' : 'rounded-full',
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className="w-full h-full object-cover" />
      ) : name ? (
        <span style={{ backgroundColor: generateAvatarColor(name) }} className="w-full h-full flex items-center justify-center">
          {getInitials(name)}
        </span>
      ) : (
        <svg className="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
      {showStatus && (
        <span
          className={cn(
            'absolute border-2 border-white rounded-full',
            statusColors[status],
            statusSizeClasses[size],
            statusPositionClasses[statusPosition]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

export function AvatarGroup({ children, max = 5, size = 'md', overlap = 8, className, ...props }) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleChildren = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className={cn('avatar-group', className)} {...props}>
      {visibleChildren.map((child, index) =>
        isValidElement(child)
          ? cloneElement(child, {
              key: index,
              size,
              style: {
                ...(child.props.style || {}),
                marginLeft: index > 0 ? `-${overlap}px` : 0,
                zIndex: visibleChildren.length - index
              }
            })
          : child
      )}
      {remainingCount > 0 && (
        <div
          className={cn(
            'avatar',
            'bg-gray-100 text-gray-600 border-2 border-white flex-shrink-0',
            sizeClasses[size]
          )}
          style={{ marginLeft: `-${overlap}px`, zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}