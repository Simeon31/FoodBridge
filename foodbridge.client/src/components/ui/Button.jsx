import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
  onClick,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-90 focus:ring-primary disabled:opacity-50',
    secondary: 'bg-white text-gray-700 border border-stroke hover:bg-gray-50 focus:ring-gray-200 dark:bg-meta-4 dark:text-white dark:border-strokedark dark:hover:bg-meta-4/80',
    danger: 'bg-danger text-white hover:bg-opacity-90 focus:ring-danger disabled:opacity-50',
    success: 'bg-success text-white hover:bg-opacity-90 focus:ring-success disabled:opacity-50',
    warning: 'bg-warning text-white hover:bg-opacity-90 focus:ring-warning disabled:opacity-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const buttonClasses = twMerge(
    baseStyles,
    variants[variant],
    sizes[size],
    widthClass,
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
};

export default Button;
