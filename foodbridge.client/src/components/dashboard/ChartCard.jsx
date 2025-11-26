import PropTypes from 'prop-types';

const ChartCard = ({ 
  title, 
  subtitle,
  children, 
  tabs,
  actions,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark p-6 shadow-card ${className}`}>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  {/* Title Section */}
        <div>
 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
{title}
    </h3>
       {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
  {subtitle}
 </p>
     )}
        </div>

     {/* Tabs or Actions */}
        {tabs && (
 <div className="flex gap-2 border-b border-stroke dark:border-strokedark">
         {tabs.map((tab, index) => (
     <button
                key={index}
   className={`px-4 py-2 text-sm font-medium transition-colors ${
        tab.active
         ? 'border-b-2 border-primary text-primary'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
     }`}
     onClick={tab.onClick}
   >
                {tab.label}
   </button>
   ))}
          </div>
 )}

        {actions && (
    <div className="flex items-center gap-2">
     {actions}
</div>
        )}
      </div>

   {/* Content */}
<div>
   {children}
    </div>
    </div>
  );
};

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
   active: PropTypes.bool,
 onClick: PropTypes.func,
})
  ),
  actions: PropTypes.node,
  className: PropTypes.string,
};

export default ChartCard;
