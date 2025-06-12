import React from "react";

const SelectInput = ({
  options,
  value,
  onChange,
  placeholder,
  className = "",
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`rounded-lg py-2 px-4 bg-[#f4f4f4] text-gray-700 focus:outline-none focus:ring-2 focus:ring-BtnBg ${className}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
