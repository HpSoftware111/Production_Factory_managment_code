import React from "react";
import { Grid } from "@mui/material";

const FourCardRow = ({ children }) => {
  return (
    <Grid container spacing={3} mb={3}>
      {React.Children.map(children, (child) => (
        <Grid item xs={12} sm={6} md={3}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

export default FourCardRow;
