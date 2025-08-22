import React from 'react';

const Input = ({ 
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  fullWidth = true,
  disabled = false,
  required = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
  ...props 
}) => {
  const baseClasses = 'w-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  
  const variants = {
    default: 'border-neutral-300 focus:border-flight-primary focus:ring-flight-primary/20',
    flight: 'border-neutral-300 focus:border-flight-primary focus:ring-flight-primary/20 bg-white',
    admin: 'border-neutral-300 focus:border-admin-primary focus:ring-admin-primary/20',
    error: 'border-status-refunded focus:border-status-refunded focus:ring-status-refunded/20',
    success: 'border-status-completed focus:border-status-completed focus:ring-status-completed/20',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  const roundedStyles = 'rounded-lg';
  
  const inputClasses = `
    ${baseClasses} 
    ${variants[error ? 'error' : variant]} 
    ${sizes[size]} 
    ${roundedStyles}
    ${disabled ? 'bg-neutral-100 cursor-not-allowed opacity-60' : 'bg-white'}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${inputClassName}
  `.trim();

  const wrapperClasses = `
    ${fullWidth ? 'w-full' : 'inline-block'}
    ${className}
  `.trim();

  const labelClasses = `
    block text-sm font-medium text-neutral-700 mb-1.5
    ${labelClassName}
  `.trim();

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconClasses = `
      absolute top-1/2 -translate-y-1/2 text-neutral-400
      ${iconPosition === 'left' ? 'left-3' : 'right-3'}
    `.trim();
    
    return <span className={iconClasses}>{icon}</span>;
  };

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-status-refunded ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {renderIcon()}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-status-refunded' : 'text-neutral-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

// Special input variants for specific use cases
export const SearchInput = ({ className = '', ...props }) => (
  <Input
    variant="flight"
    placeholder="Search..."
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    }
    className={className}
    {...props}
  />
);

// Date picker input
export const DateInput = ({ className = '', ...props }) => (
  <Input
    type="date"
    variant="flight"
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    }
    className={className}
    {...props}
  />
);

// Location input (for From/To fields)
export const LocationInput = ({ className = '', ...props }) => (
  <Input
    variant="flight"
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    }
    className={className}
    {...props}
  />
);

export default Input;
