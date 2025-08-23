import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'default',
  dot = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium transition-colors duration-200';
  
  const isDemo = typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/demo');
  const variants = {
    // Default variants
    default: 'bg-neutral-100 text-neutral-700',
    primary: isDemo ? 'bg-flight-primary/10 text-flight-primary' : 'bg-neutral-100 text-neutral-700',
    secondary: 'bg-neutral-200 text-neutral-800',
    
    // Status variants (from reference)
    pending: 'bg-status-pending/10 text-status-pending',
    completed: 'bg-status-completed/10 text-status-completed',
    refunded: 'bg-status-refunded/10 text-status-refunded',
    cancelled: 'bg-status-cancelled/10 text-status-cancelled',
    
    // Flight status variants
    onTime: 'bg-green-100 text-green-700',
    delayed: 'bg-red-100 text-red-700',
    boarding: 'bg-blue-100 text-blue-700',
    departed: 'bg-purple-100 text-purple-700',
    
    // Admin variants
    admin: isDemo ? 'bg-admin-primary/10 text-admin-primary' : 'bg-neutral-100 text-neutral-700',
    adminSuccess: 'bg-green-100 text-green-700',
    adminWarning: 'bg-amber-100 text-amber-700',
    adminDanger: 'bg-red-100 text-red-700',
    
    // Outline variants
    outline: 'border border-neutral-300 text-neutral-700',
    outlinePrimary: isDemo ? 'border border-flight-primary text-flight-primary' : 'border border-neutral-300 text-neutral-700',
    outlineSuccess: 'border border-status-completed text-status-completed',
    outlineDanger: 'border border-status-refunded text-status-refunded',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    default: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm',
  };

  const roundedStyles = 'rounded-full';
  
  const classes = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${roundedStyles}
    ${className}
  `.trim();

  return (
    <span className={classes} {...props}>
      {dot && (
        <span className={`w-2 h-2 rounded-full bg-current mr-1.5 ${size === 'xs' ? 'w-1.5 h-1.5' : ''}`} />
      )}
      {children}
    </span>
  );
};

// Status Badge component with predefined status mappings
export const StatusBadge = ({ status, className = '', ...props }) => {
  const statusVariantMap = {
    pending: 'pending',
    completed: 'completed',
    refunded: 'refunded',
    cancelled: 'cancelled',
    active: 'completed',
    inactive: 'cancelled',
    paid: 'completed',
    unpaid: 'pending',
    confirmed: 'completed',
    processing: 'pending',
  };

  const variant = statusVariantMap[status?.toLowerCase()] || 'default';
  
  return (
    <Badge variant={variant} className={className} {...props}>
      {status}
    </Badge>
  );
};

// Flight Status Badge
export const FlightStatusBadge = ({ status, className = '', ...props }) => {
  const statusVariantMap = {
    'on time': 'onTime',
    'delayed': 'delayed',
    'boarding': 'boarding',
    'departed': 'departed',
    'arrived': 'completed',
    'cancelled': 'cancelled',
    'scheduled': 'default',
  };

  const variant = statusVariantMap[status?.toLowerCase()] || 'default';
  
  return (
    <Badge variant={variant} dot className={className} {...props}>
      {status}
    </Badge>
  );
};

// Count Badge (for notifications, etc.)
export const CountBadge = ({ count, max = 99, className = '', ...props }) => {
  const displayCount = count > max ? `${max}+` : count;
  
  return (
    <Badge 
      variant="primary" 
      size="xs" 
      className={`min-w-[1.25rem] h-5 px-1.5 justify-center ${className}`} 
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

// Icon Badge (badge with icon)
export const IconBadge = ({ icon, children, className = '', ...props }) => {
  return (
    <Badge className={`gap-1.5 ${className}`} {...props}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </Badge>
  );
};

export default Badge;
