import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return <div data-slot="card" className={cn('rounded-xl border border-gray-100 bg-white text-gray-900 shadow-sm', className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div data-slot="card-header" className={cn('flex flex-col gap-1.5', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 data-slot="card-title" className={cn('font-semibold leading-none tracking-tight', className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p data-slot="card-description" className={cn('text-sm text-gray-600', className)} {...props} />;
}

export function CardAction({ className, ...props }) {
  return <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn(className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div data-slot="card-footer" className={cn('flex items-center', className)} {...props} />;
}
