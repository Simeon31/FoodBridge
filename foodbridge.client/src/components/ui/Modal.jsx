import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Modal = ({ 
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
  ...props 
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
 if (e.key === 'Escape' && isOpen) {
        onClose();
      }
 };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
   document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const modalClasses = twMerge(
    'relative w-full bg-white dark:bg-boxdark rounded-lg shadow-lg',
    sizes[size],
    className
  );

  return (
    <div
      className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={onClose}
      {...props}
    >
      <div
   className={modalClasses}
     onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke dark:border-strokedark px-6 py-4">
          <h3 className="text-xl font-semibold text-black dark:text-white">
  {title}
          </h3>
          {showCloseButton && (
     <button
          type="button"
           className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        onClick={onClose}
     aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
   </svg>
      </button>
          )}
     </div>

   {/* Body */}
     <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;
