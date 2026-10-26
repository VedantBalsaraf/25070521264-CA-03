import { useState, useRef, useEffect, Children, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/formatters';

export function Dropdown({ trigger, content, children, align = 'right', offset = 8 }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const childNodes = Children.toArray(children);
  const triggerNode = trigger ?? childNodes[0];
  const contentNode = content ?? childNodes[1];
  const contentClassName = isValidElement(contentNode) ? contentNode.props.className : '';
  const contentChildren = isValidElement(contentNode) ? contentNode.props.children : contentNode;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current?.contains(event.target)) return;
      if (contentRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);

  const dropdownContent = isOpen ? (
    <div
      ref={contentRef}
      className={cn(
        'dropdown-menu',
        align === 'right' ? 'right-0' : 'left-0',
        contentClassName,
        'animate-dropdown-enter'
      )}
      style={{ marginTop: offset }}
      role="menu"
    >
      {contentChildren}
    </div>
  ) : null;

  return (
    <div className="dropdown relative inline-block" ref={triggerRef}>
      <div onClick={toggle}>{triggerNode}</div>
      {createPortal(dropdownContent, document.body)}
    </div>
  );
}

export function DropdownItem({ children, icon, variant = 'default', divider = false, className, onClick, ...props }) {
  const handleClick = (e) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      const dropdown = e.currentTarget.closest('[class*="dropdown"]');
      if (dropdown) {
        const event = new MouseEvent('mousedown', { bubbles: true });
        document.dispatchEvent(event);
      }
    }
  };

  if (divider) {
    return <div className="dropdown-divider" role="separator" />;
  }

  return (
    <button
      className={cn(
        'dropdown-item',
        variant === 'danger' && 'danger',
        className
      )}
      onClick={handleClick}
      role="menuitem"
      {...props}
    >
      {icon && <span className="dropdown-item-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
