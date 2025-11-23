import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Table = ({ 
  columns,
  data,
  striped = false,
  hoverable = true,
  className = '',
  ...props 
}) => {
const tableClasses = twMerge(
    'w-full table-auto',
    className
  );

  const theadClasses = 'bg-gray-50 dark:bg-meta-4';
  const tbodyClasses = striped ? '[&>tr:nth-child(odd)]:bg-gray-50 dark:[&>tr:nth-child(odd)]:bg-meta-4/50' : '';
  const rowHoverClasses = hoverable ? 'hover:bg-gray-50 dark:hover:bg-meta-4/50' : '';

return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className={tableClasses} {...props}>
 <thead className={theadClasses}>
      <tr>
        {columns.map((column, index) => (
          <th
       key={index}
 className={twMerge(
            'px-4 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white',
                  column.headerClassName
             )}
     >
      {column.header}
 </th>
     ))}
          </tr>
    </thead>
  <tbody className={tbodyClasses}>
    {data.map((row, rowIndex) => (
       <tr
              key={rowIndex}
           className={twMerge(
 'border-b border-stroke dark:border-strokedark',
      rowHoverClasses
  )}
         >
     {columns.map((column, colIndex) => (
  <td
         key={colIndex}
       className={twMerge(
           'px-4 py-5 text-sm text-gray-700 dark:text-gray-300',
          column.cellClassName
        )}
       >
    {column.render ? column.render(row[column.accessor], row, rowIndex) : row[column.accessor]}
  </td>
      ))}
        </tr>
          ))}
      
        {data.length === 0 && (
   <tr>
      <td
          colSpan={columns.length}
         className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
   >
     No data available
    </td>
            </tr>
       )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
   header: PropTypes.string.isRequired,
  accessor: PropTypes.string.isRequired,
      render: PropTypes.func,
headerClassName: PropTypes.string,
      cellClassName: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  striped: PropTypes.bool,
  hoverable: PropTypes.bool,
  className: PropTypes.string,
};

export default Table;
