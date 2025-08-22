// Modern Table component with consistent styling
import React from 'react';
import Button from './Button';
import Badge, { StatusBadge } from './Badge';

const Table = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'border border-neutral-200 rounded-xl shadow-sm',
    admin: 'border border-neutral-200 rounded-xl shadow-soft',
    simple: 'border border-neutral-200 rounded-lg',
  };

  return (
    <div className={`overflow-hidden bg-white ${variants[variant]}`}>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-neutral-200 ${className}`} {...props}>
          {children}
        </table>
      </div>
    </div>
  );
};

const TableHeader = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-neutral-50',
    admin: 'bg-admin-light/10',
    simple: 'bg-neutral-50',
  };

  return (
    <thead className={`${variants[variant]} ${className}`}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className = '' }) => (
  <tbody className={`bg-white divide-y divide-neutral-100 ${className}`}>
    {children}
  </tbody>
);

const TableRow = ({
  children,
  className = '',
  clickable = false,
  selected = false,
  ...props
}) => {
  const baseClasses = 'transition-colors duration-150';
  const clickableClasses = clickable ? 'hover:bg-neutral-50 cursor-pointer' : '';
  const selectedClasses = selected ? 'bg-flight-light/20' : '';

  const classes = `${baseClasses} ${clickableClasses} ${selectedClasses} ${className}`;

  return (
    <tr className={classes} {...props}>
      {children}
    </tr>
  );
};

const TableHead = ({
  children,
  className = '',
  sortable = false,
  sortDirection = null,
  onSort = null,
  ...props
}) => {
  const baseClasses = 'px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider';
  const sortableClasses = sortable ? 'cursor-pointer hover:text-neutral-900 select-none' : '';

  const handleClick = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  return (
    <th
      className={`${baseClasses} ${sortableClasses} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className="text-neutral-400">
            {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  );
};

const TableCell = ({
  children,
  className = '',
  align = 'left',
  ...props
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      className={`px-6 py-4 text-sm text-neutral-900 ${alignClasses[align]} ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};

// Action cell for buttons and actions
const TableActionCell = ({ children, className = '', ...props }) => (
  <td className={`px-6 py-4 text-right text-sm font-medium ${className}`} {...props}>
    <div className="flex items-center justify-end gap-2">
      {children}
    </div>
  </td>
);

// Status cell for badges
const TableStatusCell = ({ status, className = '', ...props }) => (
  <td className={`px-6 py-4 text-sm ${className}`} {...props}>
    <StatusBadge status={status} />
  </td>
);

// Avatar cell for user info
const TableAvatarCell = ({
  name,
  subtitle = '',
  avatar = null,
  className = '',
  ...props
}) => (
  <td className={`px-6 py-4 ${className}`} {...props}>
    <div className="flex items-center">
      {avatar ? (
        <img className="h-8 w-8 rounded-full" src={avatar} alt={name} />
      ) : (
        <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center">
          <span className="text-xs font-medium text-neutral-600">
            {name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
      )}
      <div className="ml-3">
        <div className="text-sm font-medium text-neutral-900">{name}</div>
        {subtitle && (
          <div className="text-sm text-neutral-500">{subtitle}</div>
        )}
      </div>
    </div>
  </td>
);

// Export all components
export {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableActionCell,
  TableStatusCell,
  TableAvatarCell,
};

export default Table;
