import { useState, useRef, useEffect, useId, useCallback, Children, isValidElement, cloneElement } from 'react';
import { cn } from '../../utils/formatters';

export function Tabs({ defaultValue, value, onChange, children, variant = 'line', className }) {
  const [activeValue, setActiveValue] = useState(value || defaultValue || '');
  const isControlled = value !== undefined;
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ transform: 'translateX(0)', width: 0 });

  const updateIndicator = useCallback(() => {
    if (!tabsRef.current) return;
    const activeTab = tabsRef.current.querySelector('[data-tab-active]');
    if (activeTab) {
      const rect = activeTab.getBoundingClientRect();
      const containerRect = tabsRef.current.getBoundingClientRect();
      setIndicatorStyle({
        transform: `translateX(${rect.left - containerRect.left}px)`,
        width: rect.width
      });
    }
  }, []);

  useEffect(() => {
    updateIndicator();
    const observer = new ResizeObserver(updateIndicator);
    if (tabsRef.current) observer.observe(tabsRef.current);
    return () => observer.disconnect();
  }, [activeValue, updateIndicator]);

  useEffect(() => {
    if (value !== undefined) {
      setActiveValue(value);
    }
  }, [value]);

  const handleTabClick = (tabValue) => {
    if (!isControlled) setActiveValue(tabValue);
    onChange?.(tabValue);
  };

  return (
    <div className={cn('tabs', className)} data-tabs>
      <div className="tab-list" role="tablist" ref={tabsRef} aria-label="Tabs">
        {typeof children === 'function' ? children({ activeValue, onTabClick: handleTabClick }) : children}
      </div>
      {variant === 'line' && (
        <div
          className="tab-indicator"
          style={indicatorStyle}
          role="presentation"
          aria-hidden="true"
        />
      )}
      <div className="tab-panels">
        {Children.map(children, child => {
          if (!isValidElement(child)) return null;
          if (child.type === TabContent) {
            return child.props.value === activeValue ? child : null;
          }
          return child;
        })}
      </div>
    </div>
  );
}

export function TabList({ children, ...props }) {
  return (
    <div className="tab-list" role="tablist" {...props}>
      {children}
    </div>
  );
}

export function TabTrigger({ value, disabled, icon, children, className, ...props }) {
  const isActive = false;
  const id = useId();

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      id={id}
      aria-controls={`${id}-panel`}
      className={cn(
        'tab-trigger',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      data-tab-value={value}
      onClick={() => {
        const tabs = document.querySelector('[data-tabs]');
        if (tabs) {
          const event = new CustomEvent('tab-click', { detail: { value } });
          tabs.dispatchEvent(event);
        }
      }}
      {...props}
    >
      {icon && <span className="tab-trigger-icon">{icon}</span>}
      {children}
    </button>
  );
}

export function TabContent({ value, children, className, ...props }) {
  const id = useId();

  return (
    <div
      role="tabpanel"
      id={`${id}-panel`}
      aria-labelledby={id}
      className={cn('tab-panel', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function AnimatedTabs({
  defaultValue,
  value,
  onChange,
  children,
  variant = 'line',
  className
}) {
  const [activeValue, setActiveValue] = useState(value || defaultValue || '');
  const isControlled = value !== undefined;
  const tabsRef = useRef(null);
  const triggerRefs = useRef(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState({ transform: 'translateX(0)', width: 0, opacity: 0 });

  const registerTrigger = useCallback((tabValue, element) => {
    if (element) {
      triggerRefs.current.set(tabValue, element);
    } else {
      triggerRefs.current.delete(tabValue);
    }
  }, []);

  const updateIndicator = useCallback(() => {
    const activeTrigger = triggerRefs.current.get(activeValue);
    if (activeTrigger && tabsRef.current) {
      const rect = activeTrigger.getBoundingClientRect();
      const containerRect = tabsRef.current.getBoundingClientRect();
      setIndicatorStyle({
        transform: `translateX(${rect.left - containerRect.left}px)`,
        width: rect.width,
        opacity: 1
      });
    }
  }, [activeValue]);

  useEffect(() => {
    updateIndicator();
    const observer = new ResizeObserver(updateIndicator);
    if (tabsRef.current) observer.observe(tabsRef.current);
    return () => observer.disconnect();
  }, [activeValue, updateIndicator]);

  useEffect(() => {
    if (value !== undefined) {
      setActiveValue(value);
    }
  }, [value]);

  const handleTabClick = (tabValue) => {
    if (!isControlled) setActiveValue(tabValue);
    onChange?.(tabValue);
  };

  return (
    <div className={cn('tabs', className)} data-tabs>
      <div className="tab-list relative" role="tablist" ref={tabsRef}>
        <div
          className={cn(
            'tab-indicator absolute bottom-0 h-1 rounded-t-full bg-primary-500 transition-all duration-300 ease-spring-press',
            variant === 'pills' && 'bg-primary-100'
          )}
          style={indicatorStyle}
          role="presentation"
          aria-hidden="true"
        />
        {Children.map(children, child => {
          if (!isValidElement(child) || child.type !== TabTrigger) return child;
          return cloneElement(child, {
            ref: (el) => registerTrigger(child.props.value, el),
            'data-tab-active': child.props.value === activeValue,
            onClick: () => handleTabClick(child.props.value)
          });
        })}
      </div>
      <div className="tab-panels">
        {Children.map(children, child => {
          if (!isValidElement(child) || child.type !== TabContent) return null;
          return child.props.value === activeValue ? child : null;
        })}
      </div>
    </div>
  );
}