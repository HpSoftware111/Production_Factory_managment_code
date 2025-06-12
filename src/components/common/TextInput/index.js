import React from "react";

const TextInput = ({
  className = "",
  type = "text",
  disabled = false,
  maxLength,
  onChange,
  error = false,
  ...props
}) => {
  if (type === "date") {
    return (
      <input
        type={type}
        {...props}
        className={`rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg ${className} ${
          error ? "bg-red-50 focus:!ring-red-200" : ""
        } ${disabled ? "cursor-not-allowed" : "cursor-default"}`}
        disabled={disabled}
        max="3000-12-31"
        autoComplete="off"
        value={(function () {
          try {
            return new Date(props.value).toISOString().split("T")[0];
          } catch (e) {
            if (e instanceof RangeError) {
              console.error("Invalid time value:", e);
              return "";
            }
            throw e;
          }
        })()}
        onChange={(e) => onChange(new Date(e.target.value))}
        x
      />
    );
  }
  return onChange ? (
    <input
      type={type}
      {...props}
      className={`rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg ${className} ${
        error ? "bg-red-50 focus:!ring-red-200" : ""
      } ${disabled ? "cursor-not-allowed" : "cursor-default"}`}
      disabled={disabled}
      maxLength={type === "text" ? maxLength : undefined}
      max="3000-12-31"
      autoComplete="off"
      onChange={onChange}
    />
  ) : (
    <input
      type={type}
      {...props}
      className={`rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg ${className} ${
        error ? "bg-red-50 focus:!ring-red-200" : ""
      } ${disabled ? "cursor-not-allowed" : "cursor-default"}`}
      disabled={disabled}
      maxLength={type === "text" ? maxLength : undefined}
      autoComplete="off"
      max="3000-12-31"
    />
  );
};

export default TextInput;
