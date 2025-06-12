import React from "react";
import { Controller } from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const DropdownField = ({
  label,
  name,
  control,
  error,
  options,
  optionKey = null,
  optionValue = null,
  className = "",
}) => {
  return (
    <div className={`form-dropdown ${className}`}>
      <label className="text-gray-700 self-center">
        {label}
        <span className="text-red-700">*</span>
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            className="bg-[#f4f4f4] col-span-2"
            error={!!error}
            displayEmpty
            size="small"
          >
            {/* <MenuItem disabled value="">
              {`Select ${label}`}
            </MenuItem> */}
            {options.map((option, index) => (
              <MenuItem
                key={optionKey ? option[optionKey] : option}
                value={optionKey ? option[optionKey] : option}
              >
                {optionValue ? option[optionValue] : option}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default DropdownField;
