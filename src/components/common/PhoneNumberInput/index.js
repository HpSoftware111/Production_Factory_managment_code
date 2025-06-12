import React, { useEffect, useState } from "react";

const formatPhoneNumber = (value) => {
  const cleaned = ("" + value).replace(/\D/g, "");

  if (cleaned.length <= 3) {
    return cleaned;
  }
  if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)})-${cleaned.slice(3, 6)}`;
  }
  return `(${cleaned.slice(0, 3)})-${cleaned.slice(3, 6)}-${cleaned.slice(
    6,
    10
  )}`;
};

const PhoneNumberInput = ({
  value,
  onChange,
  placeholder = "Main Phone",
  disabled = false,
  className,
  error = false,
  ...props
}) => {
  const [phoneValue, setPhoneValue] = useState(value || "");

  useEffect(() => {
    setPhoneValue(formatPhoneNumber(value || ""));
  }, [value]);

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue);
    setPhoneValue(formattedValue);
    onChange(formattedValue);
  };

  return (
    <input
      className={`col-span-2 rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg ${className} ${
        error ? "bg-red-50 focus:!ring-red-200" : ""
      }`}
      type="text"
      value={phoneValue}
      onChange={handleChange}
      placeholder={placeholder}
      autoComplete="off"
      disabled={disabled}
      {...props}
    />
  );
};

export default PhoneNumberInput;
