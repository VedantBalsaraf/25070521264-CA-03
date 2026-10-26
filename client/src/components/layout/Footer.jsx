import { Link } from 'react-router-dom';
import { Heart, Share2, Leaf, Recycle } from 'lucide-react';
import { MailIcon } from '../common/BrandIcons';

const SOCIAL_LINKS = [
  { Icon: MailIcon, href: 'mailto:hello@borrowcircles.com', label: 'Email' }
];

const FOOTER_LINKS = {
  product: [
    { label: 'Explore Items', href: '/explore' },
    { label: 'Share an Item', href: '/share' },
    { label: 'Borrowing Dashboard', href: '/dashboard' },
    { label: 'Impact Dashboard', href: '/impact' }
  ],
  community: [
    { label: 'Books', href: '/explore?category=Books' },
    { label: 'Electronics', href: '/explore?category=Electronics' },
    { label: 'Tools', href: '/explore?category=Tools' },
    { label: 'Project Equipment', href: '/explore?category=Project%20Equipment' }
  ],
  support: [
    { label: 'Sign in', href: '/login' },
    { label: 'Create account', href: '/signup' },
    { label: 'Email support', href: 'mailto:hello@borrowcircles.com', external: true }
  ],
  company: [
    { label: 'How it works', href: '/#how-it-works-title' },
    { label: 'Featured items', href: '/#featured-title' },
    { label: 'Community stories', href: '/#testimonials-title' },
    { label: 'Start sharing', href: '/signup' }
  ]
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="BorrowCircles Home">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>
              <span>BorrowCircles</span>
            </Link>
            <p className="footer-description">
              Share more, buy less. A campus community for lending and borrowing items sustainably.
            </p>
            <div className="footer-social">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="footer-social-link"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <nav key={section} className="footer-section" aria-label={section}>
              <h3 className="footer-title">{section}</h3>
              <ul className="footer-links">
                {links.map(link => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.href} className="footer-link">{link.label}</a>
                    ) : (
                      <Link to={link.href} className="footer-link">{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {year} BorrowCircles. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/explore" className="footer-legal-link">Browse items</Link>
            <Link to="/signup" className="footer-legal-link">Join the community</Link>
          </div>
        </div>

        <div className="footer-impact mt-8 pt-8 border-t border-gray-800 text-center">
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <Heart className="text-error-500" size={16} />
              Made with care for campus communities
            </span>
            <span className="flex items-center gap-2">
              <Leaf className="text-success-500" size={16} />
              Promoting sustainable sharing
            </span>
            <span className="flex items-center gap-2">
              <Recycle className="text-warning-500" size={16} />
              Reducing waste together
            </span>
            <span className="flex items-center gap-2">
              <Share2 className="text-primary-500" size={16} />
              Building stronger connections
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
