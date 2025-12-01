import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Input = ({ 
  label,
  type = 'text',
  placeholder = '',
  error = '',
  icon,
  className = '',
  containerClassName = '',
  required = false,
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'w-full rounded-lg border bg-transparent py-4 pr-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary disabled:bg-gray-100 dark:disabled:bg-boxdark-2';
  
  const paddingLeft = icon ? 'pl-12' : 'pl-6';
  const borderColor = error ? 'border-danger' : 'border-stroke';

  const inputClasses = twMerge(
    baseStyles,
    paddingLeft,
    borderColor,
    className
);

  return (
    <div className={twMerge('w-full', containerClassName)}>
      {label && (
        <label className="mb-2.5 block font-medium text-black dark:text-white">
    {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
)}
      
      <div className="relative">
  {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2">
{icon}
      </span>
        )}
        
 <input
          type={type}
          placeholder={placeholder}
     className={inputClasses}
          disabled={disabled}
    {...props}
   />
  </div>

      {error && (
        <p className="mt-1.5 text-sm text-danger">{error}</p>
  )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Input;
