import { useState, useEffect, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/formatters';
import { useAuth } from '../../context';

import { Avatar } from '../common/Avatar';
import PillNav from '../ui/PillNav';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import {
  Menu,
  X,
  House,
  Search,
  LayoutDashboard,
  PlusCircle,
  TrendingUp,
  Package,
  LogOut,
  ChevronDown,
  Clock3
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: House },
  { label: 'Explore', href: '/explore', icon: Search },
  { label: 'Share Item', href: '/share', icon: PlusCircle },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Impact', href: '/impact', icon: TrendingUp }
];

const RouterNavLink = ({ href, ...props }) => <Link to={href} {...props} />;

const USER_NAV_ITEMS = [
  { label: 'My Items', href: '/dashboard?tab=my-items', icon: Package },
  { label: 'Sent Requests', href: '/dashboard?tab=sent', icon: Package },
  { label: 'Received Requests', href: '/dashboard?tab=received', icon: TrendingUp },
  { label: 'Active Borrows', href: '/dashboard?tab=active', icon: Package },
  { label: 'History', href: '/dashboard?tab=history', icon: Clock3 },
  { label: 'Impact', href: '/impact', icon: TrendingUp },
];

export function Navbar() {
  const { user, logout: doLogout, loading: authLoading } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pillItems = NAV_ITEMS.map(({ label, href, icon: Icon }) => ({ label, href, icon: <Icon size={16} /> }));
  const activeHref = NAV_ITEMS.find(item => item.href === location.pathname)?.href ?? '';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    doLogout();
    setUserMenuOpen(false);
  };

  if (authLoading) {
    return (
      <header className="navbar" style={{ height: '64px' }}>
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" aria-label="BorrowCircles Home">
            <div className="navbar-brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </div>
            <span>BorrowCircles</span>
          </Link>
        </div>
      </header>
    );
  }

  const mobileMenuContent = mobileMenuOpen ? (
    <Fragment>
      <div id="mobile-menu" className="mobile-menu open">
        <nav className="mobile-nav">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                'mobile-nav-link',
                location.pathname === item.href || location.pathname.startsWith(item.href + '?') ? 'active' : ''
              )}
              aria-current={location.pathname === item.href ? 'page' : undefined}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
        {user && (
          <div className="mobile-user">
            <Avatar src={user.avatar} name={user.name} size="lg" />
            <div className="mobile-user-info">
              <p className="mobile-user-name">{user.name}</p>
              <p className="mobile-user-email">{user.email}</p>
            </div>
            <div className="mobile-user-actions">
              {USER_NAV_ITEMS.map(item => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="btn btn-secondary btn-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
              <button className="btn btn-danger btn-full justify-start" onClick={handleLogout}>
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        )}
        {!user && (
          <div className="mobile-user-actions" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-gray-100)' }}>
            <Link to="/login" className="btn btn-secondary btn-full" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-full" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </Fragment>
  ) : null;

  return (
    <>
      <header className={cn('navbar', scrolled && 'scrolled')}>
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" aria-label="BorrowCircles Home">
            <div className="navbar-brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </div>
            <span>BorrowCircles</span>
          </Link>

          <div className="navbar-pill-wrap">
            <PillNav
              items={pillItems}
              activeHref={activeHref}
              linkComponent={RouterNavLink}
              ariaLabel="Primary navigation"
              theme="light"
              layout="joined"
              size="md"
              surface="glass"
              itemStyle="pill"
              hoverEffect="fill"
              indicator="dot"
              highlightColor="linear-gradient(135deg, #7654e8, #e879cf)"
              highlightTextColor="#ffffff"
              barColor="rgba(255, 255, 255, 0.5)"
              textColor="#30284a"
              collapse="auto"
              className="navbar-pill-nav"
            />
          </div>

          <div className="navbar-actions">
            {user ? (
              <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-gray-100" aria-label="User menu">
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <span className="nav-user-name hidden sm:block">{user.name}</span>
                    <ChevronDown size={16} className={cn('transition-transform', userMenuOpen && 'rotate-180')} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" className="profile-menu-content">
                  <DropdownMenuLabel className="profile-menu-header">
                    <div className="profile-menu-identity">
                      <Avatar src={user.avatar} name={user.name} size="lg" />
                      <div className="profile-menu-user-copy">
                        <p className="profile-menu-name">{user.name}</p>
                        <p className="profile-menu-email">{user.email}</p>
                      </div>
                    </div>
                    {(user.rollNumber || user.department || user.year) && (
                      <div className="profile-menu-details">
                        {user.rollNumber && <span>{user.rollNumber}</span>}
                        {user.department && <span>{user.department}</span>}
                        {user.year && <span>Year {user.year}</span>}
                      </div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <p className="profile-menu-section-label">Your activity</p>
                  {USER_NAV_ITEMS.map(item => (
                    <DropdownMenuItem key={item.label} asChild>
                      <Link to={item.href} className="profile-menu-item" onClick={() => setUserMenuOpen(false)}>
                        <item.icon size={18} />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                    <LogOut size={18} />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Fragment>
                <Link to="/login" className="btn btn-ghost hidden sm:inline-flex">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary hidden sm:inline-flex">
                  Get Started
                </Link>
              </Fragment>
            )}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {createPortal(mobileMenuContent, document.body)}
    </>
  );
}
