import React, {useState, useEffect} from 'react';
import {Container, Typography, Paper, Grid, Box, Button, Switch} from '@mui/material';
import ContentCard from "../../../../../components/common/ContentCard/ContentCard";
import CustomButton from "../../../../../components/common/CustomButton";
import CustomWideLayout from "../../../../../components/common/Layout/CustomWideLayout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import CustomTextField from '../../../../../components/common/CustomFormFields/CustomTextField'
import CustomTable from "../../../../../components/common/CustomTable";
import CustomRecurringScheduler from "../../../../../components/common/CustomRecurringScheduler";
import {useLocation, useParams} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { equipmentService, maintenanceJobsService} from "../../../../../services";
import CustomApiDropdown from "../../../../../components/common/CustomFormFields/CustomApiDropdown";
import {CancelModal, ContinueModal} from "../../../../../components/common/CustomModals";
import {usePaginatedData} from "../../../../../hooks";
import {maintenanceProceduresService} from "../../../../../services/maintenanceProcedures";


const initialData = {
  maintenanceJobName: '',
  maintenanceJobDescription: '',
  equipmentID: '',
};

const validationSchema = Yup.object({
  maintenanceJobName: Yup.string().required('Name is required'),
  maintenanceJobDescription: Yup.string().required('Description is required'),
});

const MaintenanceJobsEdit = () => {
  // Form data for either POSTing or PUTing
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(initialData)

  // Extract state data, which only sometimes occur, for example from the equipment edit page
  const location = useLocation();

  // ID obtained from URL. If ID is found we POST, if not we PUT
  const {maintenanceJobID} = useParams();
  const isNew = !maintenanceJobID;
  const navigate = useNavigate()

  // For rendering or hiding the modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);

  // Fetch data and populate formData with response data
  useEffect(() => {
    if (isNew) {
      const { equipmentID } = location.state || {};
      if (equipmentID) setFormData({...initialData, equipmentID: equipmentID})
      return
    }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await maintenanceJobsService.getById(maintenanceJobID);
        const data = response.data
        console.log(data)
        setFormData({
          maintenanceJobID: data.Maintenance_JobID,
          maintenanceJobName: data.Maint_Name,
          maintenanceJobDescription: data.Maint_Description,
          equipmentID: data['Equipment-EquipmentID'],
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [maintenanceJobID]);

  const handlePost = async (values) => {
    try {
      const body = {
        "EquipmentID": values.equipmentID,
        "Maint_Name": values.maintenanceJobName,
        "Maint_Description": values.maintenanceJobDescription
      };
      const response = await maintenanceJobsService.post(body);
      const newId = response.data.Maintenance_JobID;
      navigate(`/production/equipment/maintenance-schedules/${newId}`);
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  const handlePut = async (values) => {
    console.log("trying to put", values)
    try {
      const body = {
        "EquipmentID": values.equipmentID,
        "Maint_Name": values.maintenanceJobName,
        "Maint_Description": values.maintenanceJobDescription
      };
      await maintenanceJobsService.put(maintenanceJobID, body);
      navigate(0)
    } catch (error) {
      console.error('Failed to create:', error);
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
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };



  const {
    data: data,
    loading,
    error,
    totalItems,
    currentPage,
    totalPages,
    changePage,
    handleSearch,
    testSearch
  } = usePaginatedData(
    (params) => maintenanceProceduresService.getByMaintenanceJobId(maintenanceJobID, params)
  );

  const handleEdit = (row) => {
    console.log(row)
    navigate(`/production/equipment/maintenance-schedules/${maintenanceJobID}/maintenance-procedure/${row.MaintenanceID}/`);
  };

  const handleDelete = (row) => {
    maintenanceProceduresService.delete(row.MaintenanceID)
    navigate(0)
  };

  const handleAdd = () => {
    navigate(`/production/equipment/maintenance-schedules/${maintenanceJobID}/maintenance-procedure/new`, {
      state: {equipmentID: formData.equipmentID},
    });
  }
  const dataConfig = [
    {
      key: 'Maintenance_JobID',
      header: 'Maint Job ID',
      visible: true,
    },
    {
      key: 'MaintenanceID',
      header: 'Maint Procedure ID',
      visible: true,
    },
    {
      key: 'Procedure',
      header: 'Procedure Name',
      visible: true,
    },
    {
      key: 'Description',
      header: 'Procedure Description',
      visible: true,
    },
    {
      key: 'Employee-First_Name',
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
            title={"Maintenance Schedule"}
          >
            <Formik
              initialValues={formData}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({isSubmitting, isValid, dirty, submitForm}) => (
                <Form style={{display: 'flex', flexDirection: 'column', height: '100%', minHeight: '350px'}}>

                  <Grid container spacing={2}>

                    <Grid item xs={12}>
                      <CustomTextField
                        name="maintenanceJobName"
                        label="Maintenance Name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="maintenanceJobDescription"
                        label="Description"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomApiDropdown
                        name={"equipmentID"}
                        label={"Equipment Name"}
                        fetchOptions={equipmentService.getAll}
                        valueKey={"EquipmentID"}
                        labelKey={"Name"}
                        showIdInLabel={true}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{flexGrow: 1}}/> {/* This empty Box will push the buttons down */}

                  <Grid item xs={12}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>

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

                    <CancelModal
                      open={showCancelModal}
                      onClose={() => setShowCancelModal(false)}
                      onConfirm={() => {
                        setShowCancelModal(false);
                        navigate(-1)
                      }}
                    />

                    <ContinueModal
                      open={showContinueModal}
                      onClose={() => setShowContinueModal(false)}
                      onConfirm={() => {
                        setShowContinueModal(false);
                        submitForm();
                      }}
                    />
                  </Grid>

                </Form>
              )}
            </Formik>
          </ContentCard>
        </Grid>
      </Grid>

      <CustomTable
        titleText={"Maintenance Procedures"}
        isNew={isNew}

        data={data}
        dataConfig={dataConfig}

        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddText="Add New Cleaning Procedure"
        onAddClick={handleAdd}

        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={changePage}

        searchText={"Search Cleaning Procedures"}
        onSearch={handleSearch}
      />
    </CustomWideLayout>
  );
};

export default MaintenanceJobsEdit;