// components/modals/UserModal.js
import React, {useEffect, useState} from 'react';
import BaseModal from './../baseModal';
import {TextField, Button, Box, Grid} from '@mui/material';
import {maintenanceMaterialsService} from "../../../../services";
import {Form, Formik} from "formik";
import CustomTextField from "../../../common/CustomFormFields/CustomTextField";
import CustomButton from "../../../common/CustomButton";
import * as Yup from "yup";

const initialFormData = {
  id: '',
  inventoryName: '',
  description: '',
  inventoryTypeID: '',
  unitOfMeasureID: '',
  quantityUsed: '',
  unitPrice: '',
};

const validationSchema = Yup.object({
  inventoryName: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  unitOfMeasure: Yup.string().required('Equipment name is required'),
});

export const MaintenanceMaterialsModal = ({ open, onClose, maintenanceMaterialsID }) => {
  const isNew = !maintenanceMaterialsID;
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (maintenanceMaterialsID && open) {
        setIsLoading(true);
        setError(null);
        try {
          const data = await maintenanceMaterialsService.getById(maintenanceMaterialsID)
          setFormData({
            id: data.MaintenanceID || '',
            inventoryName: data['Inventory-Inventory_Name'] || '',
            description: data['Inventory-Inventory_Description'] || '',
            inventoryTypeID: data['Inventory-Inventory_TypeID'] || 1,
            unitOfMeasureID: data['Unit_Of_Measure'] || 1,
            quantityUsed: data['Qty_Used'] || '',
            unitPrice: data['Unit_Price'] || '',
          });
        } catch (err) {
          setError('Failed to fetch user data');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setFormData(initialFormData);
      }
    };

    fetchUserData();
  }, [maintenanceMaterialsID, open]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isNew) {
        await postFormData(values);  // Pass values here
      } else {
        await putFormData(values);   // Pass values here
      }
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const postFormData = async (values) => {  // Make async and accept values
    console.log("posting!");
    const body = {
      "MaintenanceID": values.id,
      "Qty_Used": values.quantityUsed,
      "InventoryID": 2,
      "EquipmentID": 1,
      "Maintenance_Name": values.inventoryName,
      "Maintenance_Description": values.description
    };
    await maintenanceMaterialsService.post(body);  // Add await
  };

  const putFormData = async (values) => {  // Make async and accept values
    console.log("putting!");
    const body = {
      "MaintenanceID": values.id,
      "Qty_Used": values.quantityUsed,
      "InventoryID": 2,
      "EquipmentID": 1,
      "Maintenance_Name": values.inventoryName,
      "Maintenance_Description": values.description
    };
    await maintenanceMaterialsService.put(maintenanceMaterialsID, body);  // Add await
  };

  return (
    <BaseModal open={open} onClose={onClose} title={maintenanceMaterialsID ? 'Edit Supplies' : 'Add Supplies'}>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({isSubmitting, isValid, dirty}) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomTextField
                  name="inventoryName"
                  label="Inventory Name"
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
                  name="inventoryType"
                  label="Inventory Type"
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  name="unitOfMeasure"
                  label="Unit of Measure"
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  name="quantityUsed"
                  label="Quantity Used"
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  name="unitPrice"
                  label="Unit Price"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{display: 'flex', justifyContent: 'end', mt: 2}}>
                  <Box>
                    <CustomButton
                      boldText
                      sx={{
                        mr: 2,
                      }}
                      onClick={onClose}
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton
                      boldText
                      type="submit"
                      disabled={!dirty || (isNew && !isValid)}
                    >
                      {isNew ? 'Create' : 'Update'}
                    </CustomButton>
                  </Box>
                </Box>
              </Grid>

            </Grid>
          </Form>
        )}
      </Formik>
    </BaseModal>
  );
};
