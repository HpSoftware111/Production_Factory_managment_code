import React, {useState, useEffect} from 'react';
import {Container, Typography, Paper, Grid, Box, Button} from '@mui/material';
import ContentCard from "../../../../../components/common/ContentCard/ContentCard";
import CustomButton from "../../../../../components/common/CustomButton";
import CustomWideLayout from "../../../../../components/common/Layout/CustomWideLayout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import { CustomTextField, CustomSelectField } from '../../../../../components/common/CustomFormFields'
import CustomTable from "../../../../../components/common/CustomTable";
import CustomRecurringScheduler from "../../../../../components/common/CustomRecurringScheduler";

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

const ProductionLineEdit = () => {
  const initialValues = {
    name: '',
    description: '',
  };

  const handleSubmit = (values, {setSubmitting}) => {
    console.log(values);
    // Handle form submission here
    setSubmitting(false);
  };

  const [cleaningData] = useState([
    {
      Procedure: "Daily Cleaning",
      Cleaning_Description: "Standard sanitization protocol",
      Equipment_Name: "Microscope A",
      Date: "2024-01-15",
      Time: "09:00 AM",
      Employee: "John Doe"
    },
    {
      Procedure: "Weekly Maintenance",
      Cleaning_Description: "Deep cleaning and calibration",
      Equipment_Name: "Centrifuge B",
      Date: "2024-01-16",
      Time: "02:30 PM",
      Employee: "Jane Smith"
    },
    {
      Procedure: "Monthly Inspection",
      Cleaning_Description: "Comprehensive cleaning and inspection",
      Equipment_Name: "Analyzer C",
      Date: "2024-01-17",
      Time: "11:15 AM",
      Employee: "Mike Johnson"
    }
  ]);

  const handleEdit = (row) => {
    console.log("Edit:", row);
  };

  const handleDelete = (row) => {
    console.log("Delete:", row);
  };

  return (
    <CustomWideLayout>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{marginTop: 4}}>
          <ContentCard
            whiteBackground={true}
            title={"Equipment Detailsfdsa"}
            icon={<HelpOutlineIcon/>}
            iconTitle={"fdsafdsa"}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({isSubmitting}) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="name"
                        label="Name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="description"
                        label="Description"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="equipment-barcode"
                        label="Equipment Barcode"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="manufacturer"
                        label="Manufacturer"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="model-number"
                        label="Model Number"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="serial-number"
                        label="Serial Number"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="purchase-date"
                        label="Purchase Date"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="warranty-date"
                        label="Warranty Date"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="next-maint-date"
                        label="Next Maint Date"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomSelectField
                        name="nextMaintDate"
                        label="Next Maintenance Date"
                        options={[
                          {value: '1month', label: '1 Month'},
                          {value: '3months', label: '3 Months'},
                          {value: '6months', label: '6 Months'},
                          {value: '1year', label: '1 Year'},
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomRecurringScheduler

                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                        <CustomButton
                          boldText
                          onClick={() => console.log('Print Barcode')}>
                          Print Barcode
                        </CustomButton>
                        <Box>
                          <CustomButton
                            boldText
                            sx={{
                              mr: 2,
                            }}
                            onClick={() => console.log('Cancel')}
                          >
                            Cancel
                          </CustomButton>
                          <CustomButton
                            boldText
                            type="submit"
                            disabled={isSubmitting}
                          >
                            Update
                          </CustomButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </ContentCard>
        </Grid>
      </Grid>

      <CustomTable
        data={cleaningData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddText="Add New Schedule"
        onAddClick={() => {}}
        searchText={"Search Schedule"}
      />
    </CustomWideLayout>
  );
};

export default ProductionLineEdit;