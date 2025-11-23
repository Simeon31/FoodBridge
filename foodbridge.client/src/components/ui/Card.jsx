import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Card = ({ 
  children, 
  className = '',
  padding = true,
  shadow = true,
  ...props 
}) => {
  const baseStyles = 'bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark';
  const paddingStyles = padding ? 'p-6' : '';
  const shadowStyles = shadow ? 'shadow-card' : '';

  const cardClasses = twMerge(
    baseStyles,
paddingStyles,
    shadowStyles,
    className
  );

  return (
    <div className={cardClasses} {...props}>
 {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.bool,
  shadow: PropTypes.bool,
};

export default Card;
