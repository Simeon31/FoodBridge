import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Dropdown = ({ 
  trigger,
  children,
  position = 'bottom-right',
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

 document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positions = {
  'bottom-left': 'left-0 top-full mt-2',
    'bottom-right': 'right-0 top-full mt-2',
    'top-left': 'left-0 bottom-full mb-2',
    'top-right': 'right-0 bottom-full mb-2',
  };

  const dropdownClasses = twMerge(
    'absolute z-40 min-w-max rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark',
    positions[position],
    className
  );

  return (
    <div className="relative" ref={dropdownRef} {...props}>
  <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={dropdownClasses}>
       {children}
     </div>
      )}
    </div>
  );
};

const DropdownItem = ({ 
  children, 
  onClick, 
  icon,
  className = '',
  ...props 
}) => {
  const itemClasses = twMerge(
    'flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-meta-4/50 first:rounded-t-lg last:rounded-b-lg',
    className
  );

  return (
    <button
      type="button"
      className={itemClasses}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
    {children}
    </button>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right']),
  className: PropTypes.string,
};

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  className: PropTypes.string,
};

Dropdown.Item = DropdownItem;

export default Dropdown;
