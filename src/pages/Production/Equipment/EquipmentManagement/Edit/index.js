import React, {useState, useEffect} from 'react';
import {Container, Typography, Paper, Grid, Box, Button} from '@mui/material';
import ContentCard from "../../../../../components/common/ContentCard/ContentCard";
import CustomButton from "../../../../../components/common/CustomButton";
import CustomWideLayout from "../../../../../components/common/Layout/CustomWideLayout";
import {Form, Formik} from "formik";
import * as Yup from "yup";

import CustomTable from "../../../../../components/common/CustomTable";
import { equipmentService } from '../../../../../services';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {usePaginatedData} from "../../../../../hooks";
import {cleaningJobsService} from "../../../../../services";
import CustomTextField from '../../../../../components/common/CustomFormFields/CustomTextField'
import CustomSelectField from '../../../../../components/common/CustomFormFields/CustomSelectField'
import CustomButtonField from '../../../../../components/common/CustomFormFields/CustomButtonField'
import {CancelModal, ContinueModal} from "../../../../../components/common/CustomModals";
import {cleaningProceduresService} from "../../../../../services/cleaningProcedures";

const initialValues = {
  name: '',
  description: '',
  equipment_barcode: '',
  manufacturer: '',
  model_number: '',
  serial_number: '',
  purchase_date: '',
  warranty_date:  '',
  next_cleaning_date: '',
  next_maint_date: '',
  last_maint_date: '',
  equipment_type: '',
  operational_status: ''
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

const EquipmentManagementEdit = () => {
  const {equipmentID} = useParams();
  const isNew = !equipmentID;
  const navigate = useNavigate()

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(initialValues)

  useEffect(() => {
    if (isNew) {
      return
    }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await equipmentService.getById(equipmentID);
        const data = response.data
        setFormData({
          id: data.EquipmentID,
          name: data.Name,
          description: data.Description,
          equipment_barcode: data.Equipment_BarCode,
          manufacturer: data.Manufacturer,
          model_number: data.Model_Number,
          serial_number: data.Serial_Number,
          purchase_date: data.Purchase_Date.split('T')[0],
          warranty_date:  data.Warranty_Date.split('T')[0],
          next_cleaning_date: 'awaiting API implementation',
          next_maint_date: 'awaiting API implementation',
          last_maint_date: 'awaiting API implementation',
          equipment_type: 'cleaning',
          operational_status: data.Operational_Status.toString().toLowerCase()
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [equipmentID]);

  const handlePost = async (values) => {
    try {
      const body = {
        "Name": values.name,
        "Description": values.description,
        "Manufacturer": values.manufacturer,
        "Model_Number": values.model_number,
        "Serial_Number": values.serial_number,
        "Purchase_Date": values.purchase_date,
        "Warranty_Date": values.warranty_date,
        "Last_Maint_Date": "2023-06-01",
        "Operational_Status": values.operational_status,
        "Cycle_Count": 1,
        "Cycle_Multiplier": 2,
        "Equipment_TypeID": 1
      };
      const response = await equipmentService.post(body);
      const newId = response.data.EquipmentID;
      navigate(`/production/equipment/equipment-management/${newId}`);
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };
  const handlePut = async (values) => {
    try {
      const body = {
        "Name": values.name,
        "Description": values.description,
        "Manufacturer": values.manufacturer,
        "Model_Number": values.model_number,
        "Serial_Number": values.serial_number,
        "Purchase_Date": values.purchase_date,
        "Warranty_Date": values.warranty_date,
        "Last_Maint_Date": "2023-06-01",
        "Operational_Status": values.operational_status,
        "Cycle_Count": 1,
        "Cycle_Multiplier": 2,
        "Equipment_TypeID": 1
      };
      const response = await equipmentService.put(equipmentID, body);
      navigate(0);
    } catch (error) {
      console.error('Failed to update:', error);
    }
  }

  const handleCancel = (dirty) => {
    if (dirty) {
      setShowCancelModal(true)
    } else {
      navigate(-1)
    }
  }

  const handleSubmit = async (values) => {
    console.log("handling submit", values)
    try {
      if (isNew) {
        await handlePost(values);
      } else {
        await handlePut(values);
      }
      // Navigate to appropriate page after successful submission
      // navigate('/production/equipment/cleaning-schedules/');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const {
    data,
    loading,
    error,
    totalItems,
    currentPage,
    totalPages,
    changePage,
    handleSearch,
  } = usePaginatedData((params) => cleaningJobsService.getByEquipmentId(equipmentID, params));
  console.log("Data is here!", data)
  const handleAdd = (row) => {
    navigate(`/production/equipment/cleaning-schedules/new`, { state: {equipmentID: equipmentID}});
  }

  const handleEdit = (row) => {
    console.log("Edit:", row);
    navigate(`/production/equipment/cleaning-schedules/${row.Cleaning_JobID}`);
  };

  const handleDelete = async (row) => {
    try {
      await cleaningJobsService.delete(row.Cleaning_JobID);
      navigate(0);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }


  const dataConfig = [
    {
      key: 'EquipmentID',
      header: 'Equipment ID',
      visible: true,
    },
    {
      key: 'Cleaning_JobID',
      header: 'Cleaning Schedule ID',
      visible: true,
    },

    {
      key: 'Cleaning_Name',
      header: 'Cleaning Name',
      visible: true,
    },
    {
      key: 'Cleaning_Description',
      header: 'Cleaning Description',
      visible: true,
    },
    {
      key: 'EquipmentName',
      header: 'Equipment Name',
      visible: true,
    },
    {
      key: 'Date',
      header: 'Date',
      visible: true,
    },
    {
      key: 'Time',
      header: 'Time',
      visible: true,
    },
    {
      key: 'Employee',
      header: 'Employee',
      visible: true,
    },
  ];

  return (
    <CustomWideLayout>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{marginTop: 4}}>
          <ContentCard
            whiteBackground={true}
            title={"Equipment Details"}
            // icon={}
            // iconTitle={""}
          >
            <Formik
              initialValues={formData}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({isSubmitting, isValid, dirty, submitForm}) => (
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
                        name="equipment_barcode"
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
                        name="model_number"
                        label="Model Number"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="serial_number"
                        label="Serial Number"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="purchase_date"
                        label="Purchase Date"
                        type="date"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="warranty_date"
                        label="Warranty Date"
                        type="date"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomButtonField
                        name="next_cleaning-date"
                        label="Next Cleaning Date"
                        buttonText="Selected"
                        // buttonColor={theme.palette.septenary.secondary}
                        onClick={() => {console.log("fdsa")}}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomButtonField
                        name="next_maint_date"
                        label="Next Maint Date"
                        buttonText="3 Schedule"
                        onClick={() => {}}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="last_maint_date"
                        label="Last Maint Date"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomSelectField
                        name="equipment_type"
                        label="Equipment Type"
                        options={[
                          {value: 'cleaning', label: '1 Month'},
                          {value: '3months', label: '3 Months'},
                          {value: '6months', label: '6 Months'},
                          {value: '1year', label: '1 Year'},
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomSelectField
                        name="operational_status"
                        label="Operational Status"
                        options={[
                          {value: 'operational', label: 'Operational'},
                          {value: '3months', label: 'Good'},
                          {value: '6months', label: 'Bad'},
                          {value: '1year', label: 'Critical'},
                        ]}
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
                            sx={{ mr: 2 }}
                            onClick={() => handleCancel(dirty)}  // Pass dirty to handleCancel
                          >
                            {dirty ? 'Cancel' : 'Go Back'}
                          </CustomButton>

                          <CustomButton
                            boldText
                            onClick={() => setShowContinueModal(true)}
                            disabled={isSubmitting || !dirty || (isNew && !isValid)}
                          >
                            {isNew ? 'Create' : 'Update'}
                          </CustomButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <CancelModal
                    open={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={() => {
                      setShowCancelModal(false);
                      navigate(0)
                    }}
                  />

                  <ContinueModal
                    open={showContinueModal}
                    onClose={() => setShowContinueModal(false)}
                    onConfirm={() => {
                      setShowContinueModal(false);
                      submitForm(); // Use the submitForm function provided by Formik
                      // navigate(0)
                    }}
                  />

                </Form>
              )}
            </Formik>
          </ContentCard>
        </Grid>
      </Grid>

      <CustomTable
        titleText={"Cleaning Schedules"}
        isNew={isNew}

        data={data}
        dataConfig={dataConfig}

        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddText="Add Cleaning Schedule"
        onAddClick={handleAdd}

        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={changePage}

        searchText={"Search Cleaning Schedules"}
        onSearch={handleSearch}

      />
    </CustomWideLayout>
  );
};

export default EquipmentManagementEdit;