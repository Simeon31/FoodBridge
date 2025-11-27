import React from 'react';

const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  rows = 4,
  className = ''
}) => {
  return (
    <div className={className}>
  {label && (
        <label className="mb-2.5 block text-black dark:text-white">
          {label} {required && <span className="text-danger">*</span>}
 </label>
      )}
      <textarea
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
     className={`w-full rounded border-[1.5px] ${
          error ? 'border-danger' : 'border-stroke'
        } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
          disabled ? 'opacity-60' : ''
      }`}
    />
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormTextarea;
