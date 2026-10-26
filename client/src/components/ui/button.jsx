import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  'btn btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'btn-primary bg-primary-600 text-white shadow-sm hover:bg-primary-700',
        destructive: 'btn-danger bg-error-600 text-white hover:bg-error-700',
        outline: 'btn-outline border border-gray-200 bg-white text-gray-800 hover:bg-gray-50',
        secondary: 'btn-secondary bg-gray-100 text-gray-800 hover:bg-gray-200',
        ghost: 'btn-ghost text-gray-700 hover:bg-gray-100',
        success: 'btn-success bg-success-600 text-white hover:bg-success-700',
        link: 'text-primary-700 underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'btn-sm h-8 px-3 text-xs',
        lg: 'btn-lg h-12 px-7',
        xl: 'btn-xl h-14 px-8 text-lg',
        icon: 'btn-icon size-10 p-2'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export function Button({ className, variant, size, type = 'button', ...props }) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
