import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'default',
  hover = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white transition-all duration-200';
  
  const variants = {
    default: 'rounded-xl shadow-card border border-neutral-100',
    flight: 'rounded-xl shadow-card border border-neutral-100',
    admin: 'rounded-xl shadow-soft',
    flat: 'rounded-lg border border-neutral-200',
    elevated: 'rounded-xl shadow-lg',
    outlined: 'rounded-xl border-2 border-neutral-200',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverClasses = hover ? 'hover:shadow-hover cursor-pointer transform hover:-translate-y-0.5' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const classes = `
    ${baseClasses} 
    ${variants[variant]} 
    ${paddingStyles[padding]}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `.trim();

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

// Card Header component
export const CardHeader = ({ 
  children, 
  className = '',
  border = true,
  ...props 
}) => {
  const borderClass = border ? 'border-b border-neutral-200' : '';
  
  return (
    <div className={`pb-4 mb-4 ${borderClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Title component
export const CardTitle = ({ 
  children, 
  className = '',
  size = 'default',
  ...props 
}) => {
  const sizes = {
    sm: 'text-base',
    default: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };
  
  return (
    <h3 className={`font-semibold text-neutral-900 ${sizes[size]} ${className}`} {...props}>
      {children}
    </h3>
  );
};

// Card Description component
export const CardDescription = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <p className={`text-sm text-neutral-600 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
};

// Card Body component
export const CardBody = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Footer component
export const CardFooter = ({ 
  children, 
  className = '',
  border = true,
  align = 'right',
  ...props 
}) => {
  const borderClass = border ? 'border-t border-neutral-200' : '';
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };
  
  return (
    <div className={`pt-4 mt-4 flex items-center ${alignmentClasses[align]} ${borderClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Flight Card component (specific to flight booking)
export const FlightCard = ({ 
  airline,
  logo,
  departureTime,
  arrivalTime,
  departureCode,
  arrivalCode,
  duration,
  stops,
  price,
  currency = 'PKR',
  onBook,
  className = '',
  ...props 
}) => {
  const isDemo = typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/demo');

  return (
    <Card variant="flight" hover className={className} {...props}>
      <div className="flex items-center justify-between">
        {/* Airline and Flight Info */}
        <div className="flex items-center gap-6">
          {logo && isDemo && (
            <div className="w-12 h-12 flex items-center justify-center">
              <img src={logo} alt={airline} className="max-w-full max-h-full object-contain" />
            </div>
          )}
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-semibold text-neutral-900">{departureTime}</div>
              <div className="text-sm text-neutral-600 mt-1">{departureCode}</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-xs text-neutral-500 mb-1">{duration}</div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-0.5 bg-neutral-300"></div>
                <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
                <div className="w-16 h-0.5 bg-neutral-300"></div>
              </div>
              <div className="text-xs text-neutral-500 mt-1">{stops || 'Non stop'}</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-semibold text-neutral-900">{arrivalTime}</div>
              <div className="text-sm text-neutral-600 mt-1">{arrivalCode}</div>
            </div>
          </div>
        </div>
        
        {/* Price and Book Button */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-neutral-500 uppercase">{currency}</div>
            <div className="text-2xl font-bold text-neutral-900">{price.toLocaleString()}</div>
          </div>
          
          {onBook && (
            <button onClick={onBook} className={isDemo ? 'bg-flight-primary hover:bg-flight-dark text-white font-medium px-6 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5' : 'bg-neutral-200 text-neutral-900 font-medium px-6 py-2.5 rounded-md transition-all duration-200'}>
              Book Now
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Trip Card component (for admin dashboard)
export const TripCard = ({ 
  tripId,
  date,
  from,
  to,
  status,
  progress = [],
  onAddOptions,
  className = '',
  ...props 
}) => {
  return (
    <Card variant="admin" className={className} {...props}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-neutral-500">Trip Id</div>
            <div className="font-semibold text-neutral-900">{tripId}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-500">Date</div>
            <div className="font-medium text-neutral-700">{date}</div>
          </div>
        </div>
        
        {/* Progress indicator */}
        {progress.length > 0 && (() => {
          const isDemo = typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/demo');
          return (
            <div className="flex items-center justify-between">
              {progress.map((step, index) => (
                <React.Fragment key={index}>
                  <div className={`w-3 h-3 rounded-full ${step.completed ? (isDemo ? 'bg-admin-primary' : 'bg-neutral-700') : 'bg-neutral-300'}`} />
                  {index < progress.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 ${(step.completed && progress[index + 1]?.completed) ? (isDemo ? 'bg-admin-primary' : 'bg-neutral-700') : 'bg-neutral-300'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )
        })()}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-neutral-500">From</div>
            <div className="font-medium text-neutral-900">{from}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500">To</div>
            <div className="font-medium text-neutral-900">{to}</div>
          </div>
        </div>
        
        {onAddOptions && (
          <button
            onClick={onAddOptions}
            className="w-full bg-white hover:bg-neutral-50 text-neutral-700 font-medium py-2 px-4 rounded-lg border border-neutral-300 transition-all duration-200"
          >
            Add Options
          </button>
        )}
      </div>
    </Card>
  );
};

export default Card;
