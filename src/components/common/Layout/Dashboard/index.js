import React from "react";
import { Box, Grid, Container } from "@mui/material";

const Dashboard = ({ children, transparent = false, compact = false }) => {
  return (
    <Container maxWidth="xl" sx={{
      mt: compact ? 2 : 4,
      mb: compact ? 2 : 4
    }}>
      <Box
        sx={{
          backgroundColor: transparent ? 'transparent' : "white",
          borderRadius: 2,
          p: 3,
          boxShadow: transparent ? 0 : 1,
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default Dashboard;
