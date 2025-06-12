import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

const PasswordInput = ({
  placeholder,
  onChange,
  value,
  className = "",
  disabled = false,
  error = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full rounded-lg py-2 px-4 bg-[#f4f4f4] text-gray-700 focus:outline-none focus:ring-2 focus:ring-BtnBg  ${
          error ? "bg-red-50 focus:!ring-red-200" : ""
        } ${disabled ? "cursor-not-allowed" : "cursor-default"}`}
        disabled={disabled}
        autoComplete="off"
      />
      <IconButton
        sx={{ position: "absolute" }}
        onClick={togglePasswordVisibility}
        className="top-1/2 transform -translate-y-1/2 right-2"
      >
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </div>
  );
};

export default PasswordInput;
