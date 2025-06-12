import React from "react";
import { Grid, Typography } from "@mui/material";
import CustomButton from "../CustomButton"; // adjust path as needed

const CustomButtonField = (
  {
    label,
    buttonText,
    buttonColor,
    ...props
  }) => {
  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={4}>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item xs={8}>
        <CustomButton
          boldText
          sx={{
            backgroundColor: buttonColor,
            color: 'white',
            '&:hover': {
              backgroundColor: buttonColor,
            },
          }}
          {...props}
        >
          {buttonText}
        </CustomButton>
      </Grid>
    </Grid>
  );
};

export default CustomButtonField;