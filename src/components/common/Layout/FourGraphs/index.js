import React from "react";
import { Grid } from "@mui/material";

const FourGraphs = ({ children }) => {
  return (
    <Grid container spacing={3}>
      {React.Children.map(children, (child) => (
        <Grid item xs={12} md={6}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

export default FourGraphs;
