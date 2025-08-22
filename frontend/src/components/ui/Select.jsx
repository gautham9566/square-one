// Select component with consistent styling
import React from 'react';

const Select = ({ 
  label,
  error,
  helperText,
  required = false,
  className = '',
  containerClassName = '',
  children,
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white';
  
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400';

  const classes = `${baseClasses} ${stateClasses} ${className}`;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select className={classes} {...props}>
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
