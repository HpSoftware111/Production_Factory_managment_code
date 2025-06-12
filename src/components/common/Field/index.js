import React from "react";
import { Controller } from "react-hook-form";
import TextInput from "../../../components/common/TextInput";
import { Box } from "@mui/material";

const Field = ({
  label,
  name,
  placeholder,
  type = "text",
  control,
  error,
  className = "",
  disabled = false,
}) => {
  return (
    <div className={`${className}`}>
      <label className="text-gray-700 self-center">
        {label}
        <span className="text-red-700">*</span>
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextInput
            type={type}
            className="col-span-2"
            {...field}
            placeholder={placeholder}
            disabled={disabled || false}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
    </div>
  );
};

export default Field;
