import React, { useState, useEffect } from 'react';
import {Container, Typography, Paper, Grid, Box, Button} from '@mui/material';
import ContentCard from "../../../components/common/ContentCard/ContentCard";
import Dashboard from "../../../components/common/Layout/Dashboard";
import CustomButton from "../../../components/common/CustomButton";
import Stack from "@mui/material/Stack";

const Equipment = () => {

  return (
    <Dashboard transparent={true} >
      <Container
        maxWidth="300px"
        disableGutters
        sx={{
          ml: 0,
          mr: 'auto',
          height: '200px',
          width: '700px'
        }}
      >
        <ContentCard title="Equipment" whiteBackground={true}>

          <Stack
            direction="row"
            flexWrap="wrap"
            rowGap={2}         // Vertical spacing between rows when wrapped
            columnGap={2}
          >

          <CustomButton boldText={true} to={"/production/equipment/equipment-management"}>
            Equipment Management
          </CustomButton>
          <CustomButton boldText={true} to={"/production/equipment/cleaning-schedules"}>
            Cleaning Schedules
          </CustomButton>
          <CustomButton boldText={true} to={"/production/equipment/maintenance-schedules"}>
            Maintenance Schedules
          </CustomButton>

          </Stack>

        </ContentCard>
      </Container>
    </Dashboard>
  );
};

export default Equipment;