import { cn } from '../../utils/formatters';
import { X } from 'lucide-react';
import { useState, useRef } from 'react';

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className,
  ...props
}) {
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    gray: 'badge-gray',
    outline: 'badge-outline'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={cn(
        'badge inline-flex items-center gap-1.5 font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            variant === 'primary' && 'bg-primary-500',
            variant === 'secondary' && 'bg-secondary-500',
            variant === 'success' && 'bg-success-500',
            variant === 'warning' && 'bg-warning-500',
            variant === 'error' && 'bg-error-500',
            variant === 'gray' && 'bg-gray-400',
            variant === 'outline' && 'bg-current'
          )}
          aria-hidden="true"
        />
      )}
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 p-0.5 rounded-full hover:bg-black/10 hover:bg-white/10 transition-colors"
          aria-label="Remove"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}

export function TagInput({
  value,
  onChange,
  placeholder = 'Add tags...',
  maxTags = 10,
  suggestions = [],
  variant = 'gray',
  size = 'sm'
}) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const handleAddTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tag) => {
    onChange(value.filter(t => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemoveTag(value[value.length - 1]);
    }
  };

  const filteredSuggestions = suggestions
    .filter(s => !value.includes(s) && s.toLowerCase().includes(inputValue.toLowerCase()))
    .slice(0, 5);

  return (
    <div className="tag-input flex flex-wrap gap-2 items-center p-2 border border-gray-200 rounded-lg bg-white focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
      {value.map(tag => (
        <Badge
          key={tag}
          variant={variant}
          size={size}
          removable
          onRemove={() => handleRemoveTag(tag)}
        >
          {tag}
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={value.length >= maxTags ? undefined : placeholder}
        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm"
        disabled={value.length >= maxTags}
        aria-autocomplete="list"
        aria-controls="tag-suggestions"
        aria-expanded={showSuggestions && filteredSuggestions.length > 0}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul id="tag-suggestions" className="absolute z-50 mt-1 w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          {filteredSuggestions.map(suggestion => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => {
                  if (!value.includes(suggestion) && value.length < maxTags) {
                    onChange([...value, suggestion]);
                    setInputValue('');
                  }
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}