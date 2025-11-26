import PropTypes from 'prop-types';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon,
  bgColor = 'bg-gray-100',
darkBgColor = 'dark:bg-meta-4',
  iconColor = 'text-primary'
}) => {
  return (
    <div className="bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark p-6 shadow-card hover:shadow-lg transition-all duration-300">
   <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Icon Circle */}
  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgColor} ${darkBgColor} ${iconColor} mb-4`}>
    {icon}
          </div>
          
       {/* Title */}
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          
 {/* Value */}
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
  </h4>
        </div>
      </div>

      {/* Change Indicator */}
      {change && (
        <div className="mt-4 flex items-center gap-2">
        <span
       className={`inline-flex items-center gap-1 text-sm font-medium ${
   isPositive ? 'text-success' : 'text-danger'
        }`}
>
      {isPositive ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
       ) : (
         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
   </svg>
     )}
    {change}
          </span>
   <span className="text-xs text-gray-500 dark:text-gray-400">vs last period</span>
   </div>
      )}
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  isPositive: PropTypes.bool,
  icon: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
  darkBgColor: PropTypes.string,
  iconColor: PropTypes.string,
};

export default StatsCard;
