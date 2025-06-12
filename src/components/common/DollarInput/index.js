import React from "react";

const DollarInput = ({
  value,
  onChange,
  className,
  disabled,
  error,
  ...props
}) => {
  const formatValue = (val) => {
    if (!val) return "";
    const numberValue = parseFloat(val);
    return !isNaN(numberValue) ? `$${val}` : "";
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9.-]+/g, "");

    const validNumberRegex = /^\d*\.?\d{0,2}$/;

    if (validNumberRegex.test(rawValue) || rawValue === "") {
      onChange(rawValue);
    }
  };

  return (
    <input
      type="text"
      className={`rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-blue-600 ${className} ${
        disabled ? "cursor-not-allowed" : "cursor-default"
      }`}
      disabled={disabled}
      value={formatValue(value)}
      onChange={handleChange}
      error={error?.toString()}
      {...props}
    />
  );
};

export default DollarInput;
