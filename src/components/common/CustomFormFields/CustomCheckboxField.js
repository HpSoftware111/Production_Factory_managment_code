import React from "react";
import { Field } from "formik";
import { Checkbox, FormControlLabel } from "@mui/material";

const CustomCheckbox = ({ label, ...props }) => {

  return (
    <Field name={props.name}>
      {({ field, form }) => (
        <FormControlLabel
          labelPlacement="start"
          control={
            <Checkbox
              disableRipple
              checked={Boolean(field.value)}
              onChange={(e) => {
                form.setFieldValue(field.name, e.target.checked);
              }}
              icon={
                <svg width="22" height="22" viewBox="0 0 22 22">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="21"
                    height="21"
                    rx="8" // Increased corner radius
                    stroke="#143664"
                    fill="none"
                    strokeWidth="1" // 1 pixel border
                  />
                </svg>
              }
              checkedIcon={
                <svg width="22" height="22" viewBox="0 0 22 22">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="21"
                    height="21"
                    rx="8" // Increased corner radius
                    stroke="#143664"
                    fill="none"
                    strokeWidth="1" // 1 pixel border
                  />
                  <circle cx="11" cy="11" r="5" fill="#143664" />
                </svg>
              }
              sx={{
                padding: '4px',
              }}
            />
          }
          label={label}
          sx={{
            marginRight: 10,
            marginLeft: 0,
            '& .MuiTypography-root': {
              marginRight: 1,
            }
          }}
        />
      )}
    </Field>
  );
};

export default CustomCheckbox;