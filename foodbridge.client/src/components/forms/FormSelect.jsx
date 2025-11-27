import React from 'react';

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  placeholder = 'Select...',
  disabled = false,
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2.5 block text-black dark:text-white">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        name={name}
     value={value || ''}
     onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full rounded border-[1.5px] ${
     error ? 'border-danger' : 'border-stroke'
        } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
     disabled ? 'opacity-60' : ''
        }`}
      >
      <option value="">{placeholder}</option>
        {options.map((option, index) => (
  <option key={index} value={option.value}>
            {option.label}
       </option>
        ))}
      </select>
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormSelect;
