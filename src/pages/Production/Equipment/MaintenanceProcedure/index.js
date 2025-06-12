import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  Switch,
} from "@mui/material";
import ContentCard from "../../../../components/common/ContentCard/ContentCard";
import CustomButton from "../../../../components/common/CustomButton";
import CustomWideLayout from "../../../../components/common/Layout/CustomWideLayout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import CustomTextField from "../../../../components/common/CustomFormFields/CustomTextField";
import CustomCheckboxField from "../../../../components/common/CustomFormFields/CustomCheckboxField";

import CustomTable from "../../../../components/common/CustomTable";
import CustomRecurringScheduler from "../../../../components/common/CustomRecurringScheduler";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomSwitchField from "../../../../components/common/CustomFormFields/CustomSwitchField";
import { usePaginatedData, useTableModal } from "../../../../hooks";
import {
  equipmentService,
  maintenanceJobsService,
  maintenanceMaterialsService,
} from "../../../../services";
import { maintenanceProceduresService } from "../../../../services/maintenanceProcedures";
import { MaintenanceMaterialsModal } from "../../../../components/modals/TableModals";
import { cleaningProceduresService } from "../../../../services/cleaningProcedures";
import CustomApiDropdown from "../../../../components/common/CustomFormFields/CustomApiDropdown";
import { employeesService } from "../../../../services/employees";
import {
  CancelModal,
  ContinueModal,
} from "../../../../components/common/CustomModals";

const initialValues = {
  procedure: "",
  description: "",
  equipmentID: "",
  employeeID: "",
  schedule: {
    scheduleType: "hourly",
    interval: 10,
    timeOfDay: "10:00:00",
    dayOfWeek: [1, 3, 6],
    dayOfMonth: 1,
    month: 1,
    recurring: false,
    notify: false,
  },
};

const validationSchema = Yup.object({
  procedure: Yup.string().required("Procedure is required"),
  description: Yup.string().required("Description is required"),
  equipmentID: Yup.string().required("Equipment name is required"),
  employeeID: Yup.string().required("Employee is required"),
});

const MaintenanceProcedure = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(initialValues);

  const location = useLocation();

  const { maintenanceJobID, maintenanceProcedureID } = useParams();
  const { equipmentID } = location.state || {};

  const isNew = !maintenanceProcedureID;
  const navigate = useNavigate();

  const { isOpen, selectedId, openModal, closeModal } = useTableModal();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);

  useEffect(() => {
    if (isNew) {
      if (equipmentID)
        setFormData({ ...initialValues, equipmentID: equipmentID });
      return;
    }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await maintenanceProceduresService.getById(
          maintenanceProcedureID
        );
        const data = response.data.data;
        console.log("The maint data", data);
        setFormData({
          id: data.MaintenanceID || "",
          procedure: data.Procedure || "",
          description: data.Description || "",
          equipmentID: data["Maintenance_Job-EquipmentID"] || 1,
          employeeID: data["Employee-EmployeeID"] || 1,
          schedule: {
            scheduleType: data["Schedule_Table-ScheduleType"] || "day",
            interval: data["Schedule_Table-RepeatInterval"] || 0,
            timeOfDay: data["Schedule_Table-TimeOfDay"] || "12:00:00",
            dayOfWeek: data["Schedule_Table-DayOfWeek"] || [],
            dayOfMonth: data["Schedule_Table-DayOfMonth"] || 1,
            month: data["Schedule_Table-Month"] || "",
            notify: data["Schedule_Table-Notify"] || false,
            recurring: data["Schedule_Table-Notify"] || true,
          },
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [maintenanceProcedureID]);
  const handleCancel = (dirty) => {
    if (dirty) {
      setShowCancelModal(true); // If dirty, show the popup to make sure user wants to cancel
    } else {
      navigate(-1); // If not dirty we simply just go back
    }
  };
  const handleCancelModalClose = () => {
    setShowCancelModal(false); // The user decides to continue editing
  };
  const handleCancelModalConfirm = () => {
    setShowCancelModal(false); // The user confirms they want to cancel
    navigate(0); // So wipe the form
  };
  const handleContinueModalClose = () => {
    setShowContinueModal(false); // User does not want to proceed with the update/create, close the modal
  };
  const handleContinueModalConfirm = (submitForm) => {
    setShowContinueModal(false); // User does want to proceed with the update/create, submit the form
    submitForm();
  };
  const handlePost = async (values) => {
    console.log("attempting to make a post with the following", values);
    try {
      const body = {
        Maintenance_JobID: maintenanceJobID,

        Procedure: values.procedure,
        Description: values.description,
        EmployeeID: values.employeeID,
        EquipmentID: values.equipmentID,

        ScheduleType: values.schedule.scheduleType,
        RepeatInterval: values.schedule.interval,
        TimeOfDay: values.schedule.timeOfDay,
        DayOfWeek: values.schedule.dayOfWeek,
        DayOfMonth: values.schedule.dayOfMonth,
        Month: values.schedule.month,

        Notify: values.schedule.notify,
        Recurring: values.schedule.recurring,

        StartDate: "2024-02-15",
      };
      const response = await maintenanceProceduresService.post(body);
      const newId = response.data.maintenanceProcedure.MaintenanceID;
      navigate(
        `/production/equipment/maintenance-schedules/${maintenanceJobID}/maintenance-procedure/${newId}`
      );
    } catch (error) {
      console.error("Failed to create:", error);
    }
  };
  const handlePut = async (values) => {
    try {
      const body = {
        Procedure: values.procedure,
        Description: values.description,
        EmployeeID: values.employeeID,
        EquipmentID: values.equipmentID,

        ScheduleType: values.schedule.scheduleType,
        RepeatInterval: values.schedule.interval,
        TimeOfDay: values.schedule.timeOfDay,
        DayOfWeek: values.schedule.dayOfWeek,
        DayOfMonth: values.schedule.dayOfMonth,
        Month: values.schedule.month,

        Notify: values.schedule.notify,
        Recurring: values.schedule.recurring,

        StartDate: "2024-02-15",
      };
      await maintenanceProceduresService.put(maintenanceProcedureID, body);
      navigate(0);
    } catch (error) {
      console.error("Failed to create:", error);
    }
  };
  const handleSubmit = async (values) => {
    try {
      if (isNew) {
        await handlePost(values);
      } else {
        await handlePut(values);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
    testSearch,
  } = usePaginatedData(() =>
    maintenanceMaterialsService.getByMaintenanceProcedureId(
      maintenanceProcedureID
    )
  );

  const handleEdit = (row) => {
    const maintenanceMaterialsID = row.Maintenance_MaterialsID;
    openModal(maintenanceMaterialsID); // Opens modal with existing row data
  };
  const handleDelete = (row) => {
    console.log("Delete:", row);
    maintenanceMaterialsService.delete(row.Maintenance_MaterialsID);
    navigate(0);
  };
  const handleAdd = () => {
    console.log("Add:");
    openModal();
  };

  const dataConfig = [
    {
      key: "MaintenanceID",
      header: "Maintenance Procedure ID",
      visible: true,
    },
    {
      key: "Maintenance_MaterialsID",
      header: "Maintenance Materials ID",
      visible: true,
    },
    {
      key: "Inventory-Inventory_Name",
      header: "Inventory Name",
      visible: true,
    },
    {
      key: "Inventory-Inventory_Description",
      header: "Inventory Description",
      visible: true,
    },
    {
      key: "Inventory-Inventory_Type-Inventory_Type",
      header: "Inventory Type",
      visible: true,
    },
    {
      key: "Unit_Of_Measure",
      header: "Unit of Measure",
      visible: true,
    },
    {
      key: "Qty_Used",
      header: "QTY Used",
      visible: true,
    },
    {
      key: "Unit_Price",
      header: "Unit Price",
      visible: true,
    },
  ];

  return (
    <CustomWideLayout>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{ marginTop: 4 }}>
          <ContentCard whiteBackground={true} title={"Procedure Details"}>
            <Formik
              initialValues={formData}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ isSubmitting, isValid, dirty, submitForm }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CustomTextField name="procedure" label="Procedure" />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField name="description" label="Description" />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomApiDropdown
                        name={"equipmentID"}
                        label={"Equipment Name"}
                        fetchOptions={equipmentService.getAll}
                        valueKey={"EquipmentID"}
                        labelKey={"Name"}
                        showIdInLabel={true}
                        disabled={!!equipmentID || !isNew} // Sloppy, always should be disabled. Edited from parents.
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomApiDropdown
                        name={"employeeID"}
                        label={"Employee Name"}
                        fetchOptions={employeesService.getAll}
                        valueKey={"EmployeeID"}
                        labelKey={"First_Name"}
                        showIdInLabel={true}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <CustomRecurringScheduler name="schedule" />
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        <CustomButton
                          boldText
                          sx={{ mr: 2 }}
                          onClick={() => handleCancel(dirty)}
                        >
                          {dirty ? "Cancel" : "Go Back"}
                        </CustomButton>

                        <CustomButton
                          boldText
                          onClick={() => setShowContinueModal(true)}
                          disabled={
                            isSubmitting || !dirty || (isNew && !isValid)
                          }
                        >
                          {isNew ? "Create" : "Update"}
                        </CustomButton>
                      </Box>

                      <CancelModal
                        open={showCancelModal}
                        onClose={handleCancelModalClose}
                        onConfirm={handleCancelModalConfirm}
                      />

                      <ContinueModal
                        open={showContinueModal}
                        onClose={handleContinueModalClose}
                        onConfirm={() => handleContinueModalConfirm(submitForm)}
                      />
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </ContentCard>
        </Grid>
      </Grid>

      <CustomTable
        titleText={"Maintenance Supplies"}
        isNew={isNew}
        data={data}
        dataConfig={dataConfig}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddText="Add Supplies"
        onAddClick={handleAdd}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={changePage}
        searchText={"Search Schedule"}
        onSearch={handleSearch}
        showSearch={false}
      />
      <MaintenanceMaterialsModal
        open={isOpen}
        onClose={closeModal}
        maintenanceMaterialsID={selectedId}
      />
    </CustomWideLayout>
  );
};

export default MaintenanceProcedure;
