// components/modals/UserModal.js
import React, {useEffect, useState} from 'react';
import BaseModal from './../baseModal';
import {TextField, Button, Box, Grid} from '@mui/material';
import {
  cleaningMaterialsService,
  equipmentService,
  unitMeasuresService

} from "../../../../services";
import {Form, Formik} from "formik";
import CustomTextField from "../../../common/CustomFormFields/CustomTextField";
import CustomButton from "../../../common/CustomButton";
import * as Yup from "yup";
import {useNavigate, useParams} from "react-router-dom";
import CustomApiDropdown from "../../../common/CustomFormFields/CustomApiDropdown";
import {inventoryTypesService} from "../../../../services";

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
  // inventoryName: Yup.string().required('Name is required'),
  // description: Yup.string().required('Description is required'),
  // unitOfMeasure: Yup.string().required('Equipment name is required'),
});

export const CleaningMaterialsModal = ({ open, onClose, cleaningMaterialsID }) => {
  const isNew = !cleaningMaterialsID;
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const {cleaningProcedureID} = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      if (cleaningMaterialsID && open) {
        setIsLoading(true);
        setError(null);
        try {
          const data = await cleaningMaterialsService.getById(cleaningMaterialsID)
          setFormData({
            id: data.Cleaning_MaterialsID || '',
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
  }, [cleaningMaterialsID, open]);

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
    const body = {
      "CleaningID": cleaningProcedureID,
      "Qty_Used": values.quantityUsed,
      "InventoryID": 2,
      "EquipmentID": 1,
      "Cleaning_Name": values.inventoryName,
      "Cleaning_Description": values.description
    };
    console.log("Posting with body:" , body)
    await cleaningMaterialsService.post(body);  // Add await
    navigate(0)
  };

  const putFormData = async (values) => {  // Make async and accept values
    console.log("putting!", values);
    const body = {
      "CleaningID": values.id,
      "Qty_Used": values.quantityUsed,
      "InventoryID": 2,
      "EquipmentID": 1,
      "Cleaning_Name": values.inventoryName,
      "Cleaning_Description": values.description
    };
    await cleaningMaterialsService.put(cleaningMaterialsID, body);  // Add await
    console.log("done!")
  };

  return (
    <BaseModal open={open} onClose={onClose} title={cleaningMaterialsID ? 'Edit Supplies' : 'Add Supplies'}>
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
                <CustomApiDropdown
                  name={"inventoryTypeID"}
                  label={"inventory Type"}
                  fetchOptions={inventoryTypesService.getAll}
                  valueKey={"Inventory_TypeID"}
                  labelKey={"Inventory_Type"}
                  showIdInLabel={true}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomApiDropdown
                  name={"unitOfMeasureID"}
                  label={"Unit Measure"}
                  fetchOptions={unitMeasuresService.getAll}
                  valueKey={"Unit_MeasureID"}
                  labelKey={"UM_Description"}
                  showIdInLabel={true}
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