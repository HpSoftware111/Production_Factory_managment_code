import React from "react";
import { useField } from "formik";
import { TextField, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CustomTextField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  const theme = useTheme();

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={4}>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item xs={8}>
        <TextField
          {...field}
          {...props}
          fullWidth
          helperText={errorText}
          error={!!errorText}
          style={{
            padding: 0,
          }}
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: "#F3F4F6",
              borderRadius: "0.75rem",
              fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
              fontWeight: 400,
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#E5E7EB",
              },
              "&:hover fieldset": {
                borderColor: "#D1D5DB",
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& .MuiInputBase-input": {
              color: "#4D5658",
              fontSize: "0.8rem",
            },
            "& .MuiFormHelperText-root": {
              fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
              fontSize: "0.7rem",
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default CustomTextField;




