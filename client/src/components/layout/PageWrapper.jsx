import { cn } from '../../utils/formatters';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.showNavbar=true]
 * @param {boolean} [props.showFooter=true]
 * @param {Object} [props.navbarProps]
 */
export function PageWrapper({
  children,
  className,
  showNavbar = true,
  showFooter = true,
  navbarProps
}) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {showNavbar && <Navbar {...navbarProps} />}
      <main className={cn('flex-1', showNavbar && 'app-main')} id="main-content" role="main">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.illustration]
 */
export function AuthLayout({ children, className, title, subtitle, illustration }) {
  return (
    <div className={cn('auth-page', className)}>
      <div className="auth-container">
        {illustration && (
          <div className="auth-illustration" aria-hidden="true">
            {illustration}
          </div>
        )}
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </div>
            <h1 className="auth-title">{title || 'Welcome to BorrowCircles'}</h1>
            <p className="auth-subtitle">{subtitle || 'Share more, buy less. Join the campus sharing community.'}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.actions]
 */
export function DashboardLayout({ children, className, title, description, actions }) {
  return (
    <div className={cn('dashboard-layout', className)}>
      <header className="page-header">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">{title}</h1>
              {description && <p className="page-description">{description}</p>}
            </div>
            {actions && <div className="page-actions">{actions}</div>}
          </div>
        </div>
      </header>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.icon]
 * @param {string} props.title
 * @param {string} props.message
 * @param {React.ReactNode} [props.action]
 * @param {string} [props.className]
 */
export function EmptyState({ icon, title, message, action, className }) {
  return (
    <div className={cn('empty-state', className)}>
      {icon && (
        <div className="empty-state-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.text]
 * @param {string} [props.className]
 */
export function LoadingState({ size = 'md', text, className }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-12', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-gray-200 border-t-primary-600',
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-gray-600 text-center">{text}</p>}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {'text'|'circular'|'rectangular'|'card'} [props.variant='text']
 * @param {number} [props.lines=3]
 * @param {string} [props.className]
 */
export function Skeleton({ variant = 'text', lines = 3, className, ...props }) {
  const baseClasses = 'skeleton';

  if (variant === 'circular') {
    return <div className={cn(baseClasses, 'rounded-full', className)} {...props} />;
  }

  if (variant === 'rectangular') {
    return <div className={cn(baseClasses, 'rounded-lg', className)} {...props} />;
  }

  if (variant === 'card') {
    return (
      <div className={cn('card overflow-hidden', className)} {...props}>
        <div className={cn(baseClasses, 'h-48 w-full')} />
        <div className="p-5 space-y-3">
          <div className={cn(baseClasses, 'h-6 w-3/4 rounded')} />
          <div className={cn(baseClasses, 'h-4 w-full rounded')} />
          <div className={cn(baseClasses, 'h-4 w-2/3 rounded')} />
          <div className="flex gap-2">
            <div className={cn(baseClasses, 'h-6 w-20 rounded-full')} />
            <div className={cn(baseClasses, 'h-6 w-20 rounded-full')} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(baseClasses, className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={cn('h-4 rounded', i === lines - 1 && 'w-3/4')} />
      ))}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {1|2|3|4|5|6} [props.cols=3]
 * @param {number} [props.gap=6]
 * @param {boolean} [props.responsive=true]
 * @param {string} [props.className]
 */
export function Grid({ children, cols = 3, gap = 6, responsive = true, className, ...props }) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
  };

  const gapClasses = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <div
      className={cn(
        'grid',
        responsive ? colClasses[cols] : `grid-cols-${cols}`,
        gapClasses[gap] || `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {'row'|'col'|'row-reverse'|'col-reverse'} [props.direction='row']
 * @param {'start'|'center'|'end'|'stretch'|'baseline'} [props.align='stretch']
 * @param {'start'|'center'|'end'|'between'|'around'|'evenly'} [props.justify='start']
 * @param {number} [props.gap=4]
 * @param {boolean} [props.wrap=false]
 * @param {string} [props.className]
 */
export function Flex({
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap = 4,
  wrap = false,
  className,
  ...props
}) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        gapClasses[gap] || `gap-${gap}`,
        wrap && 'flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
