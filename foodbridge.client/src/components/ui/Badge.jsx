import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium';
  
  const variants = {
    primary: 'bg-primary/10 text-primary dark:bg-primary/20',
    success: 'bg-success/10 text-success dark:bg-success/20',
    danger: 'bg-danger/10 text-danger dark:bg-danger/20',
    warning: 'bg-warning/10 text-warning dark:bg-warning/20',
    info: 'bg-meta-5/10 text-meta-5 dark:bg-meta-5/20',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const badgeClasses = twMerge(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'success', 'danger', 'warning', 'info', 'gray']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Badge;
