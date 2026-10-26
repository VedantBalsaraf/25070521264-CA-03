import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Card as UiCard } from '../ui/card';

export const Card = forwardRef(
  ({ children, variant = 'default', padding = 'md', className, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6'
    };

    return (
      <UiCard
        ref={ref}
        className={cn(
          'card',
          variant === 'hover' && 'card-hover',
          variant === 'bordered' && 'border-2',
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </UiCard>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('card-header', className)} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardBody = forwardRef(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('card-body', className)} {...props}>
      {children}
    </div>
  )
);

CardBody.displayName = 'CardBody';

export const CardFooter = forwardRef(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('card-footer', className)} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export const CardImage = forwardRef(
  ({ className, ...props }, ref) => (
    <img ref={ref} className={cn('card-image', className)} {...props} />
  )
);

CardImage.displayName = 'CardImage';
