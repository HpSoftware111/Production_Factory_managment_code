import React, {useState, useEffect} from 'react';
import {Container, Typography, Paper, Grid, Box, Button} from '@mui/material';
import ContentCard from "../../../components/common/ContentCard/ContentCard";
import Dashboard from "../../../components/common/Layout/Dashboard";
import CustomButton from "../../../components/common/CustomButton";
import Stack from "@mui/material/Stack";

const ProductAssembly = () => {
  return (
    <Dashboard transparent={true}>
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
        <ContentCard title="Product Assembly" whiteBackground={true}>

          <Stack
            direction="row"
            flexWrap="wrap"
            rowGap={2}
            columnGap={2}
          >

            <CustomButton boldText={true} to={"/production/product-assembly/recipe-management"}>
              Recipe Management
            </CustomButton>
            <CustomButton boldText={true} to={"/production/product-assembly/production-line"}>
              Production Line
            </CustomButton>

          </Stack>

        </ContentCard>
      </Container>
    </Dashboard>
  );
};

export default ProductAssembly;