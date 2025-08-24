import React from 'react';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const isDemo = typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/demo');

  const variants = {
    // Flight booking theme
    primary: isDemo
      ? 'bg-flight-primary hover:bg-flight-dark text-white focus:ring-flight-primary shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
      : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm',
    secondary: isDemo ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900 focus:ring-neutral-400' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900 focus:ring-neutral-400',
    
    // Admin theme
    admin: isDemo ? 'bg-admin-primary hover:bg-admin-dark text-white focus:ring-admin-primary shadow-md hover:shadow-lg' : 'bg-neutral-300 text-neutral-900',
    adminOutline: isDemo ? 'border-2 border-admin-primary text-admin-primary hover:bg-admin-light focus:ring-admin-primary' : 'border-2 border-neutral-300 text-neutral-900',
    
    // Status variants
    success: isDemo ? 'bg-status-completed hover:bg-green-700 text-white focus:ring-status-completed shadow-md' : 'bg-neutral-200 text-neutral-900',
    danger: isDemo ? 'bg-status-refunded hover:bg-red-700 text-white focus:ring-status-refunded shadow-md' : 'bg-neutral-200 text-neutral-900',
    warning: isDemo ? 'bg-status-pending hover:bg-amber-600 text-white focus:ring-status-pending shadow-md' : 'bg-neutral-200 text-neutral-900',
    
    // Other variants
    outline: isDemo ? 'border-2 border-flight-primary text-flight-primary hover:bg-flight-light focus:ring-flight-primary' : 'border-2 border-neutral-300 text-neutral-900',
    ghost: isDemo ? 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-400' : 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-400',
    link: isDemo ? 'text-flight-primary hover:text-flight-dark hover:underline focus:ring-flight-primary p-0' : 'text-neutral-700 hover:underline p-0',
    
    // Special variants from reference
    bookNow: isDemo ? 'bg-flight-primary hover:bg-flight-dark text-white focus:ring-flight-primary shadow-md hover:shadow-lg rounded-md' : 'bg-neutral-200 text-neutral-900',
    addOptions: isDemo ? 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 focus:ring-neutral-400' : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 focus:ring-neutral-400',
    addOptionsPrimary: isDemo ? 'bg-admin-primary hover:bg-admin-dark text-white focus:ring-admin-primary shadow-md' : 'bg-neutral-300 text-neutral-900',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const roundedStyles = {
    primary: 'rounded-lg',
    secondary: 'rounded-lg',
    admin: 'rounded-lg',
    adminOutline: 'rounded-lg',
    success: 'rounded-lg',
    danger: 'rounded-lg',
    warning: 'rounded-lg',
    outline: 'rounded-lg',
    ghost: 'rounded-lg',
    link: 'rounded-none',
    bookNow: 'rounded-md',
    addOptions: 'rounded-lg',
    addOptionsPrimary: 'rounded-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${roundedStyles[variant]} ${widthClass} ${className}`;

  const renderIcon = () => {
    if (!icon) return null;
    return <span className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}>{icon}</span>;
  };

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          {children}
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </button>
  );
};

export default Button;
