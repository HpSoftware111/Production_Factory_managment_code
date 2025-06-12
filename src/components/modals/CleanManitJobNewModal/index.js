import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, Box, Select, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../common/TextInput";
import ConfirmationModal from "../ConfirmationModal";
import SearchableField from "../../common/SearchableField";
import AsyncMultiSelect from "../../common/AsyncMultiSelect";
import { set } from "date-fns";

const CleanManitJobNewModal = ({
  open,
  handleClose,
  btnValue,
  id,
  isCleaningOrMaint,
  onSubmit,
}) => {
  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState(
    btnValue.toLowerCase()
  );
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  // const [selectedEquipment, setSelectedEquipment] = useState(null);
  // const [defaultEquipment, setDefaultEquipment] = useState(null);

  const cleaningJobSchema = yup.object().shape({
    Cleaning_Name: yup.string().required("Name is required"),
    Cleaning_Description: yup.string().required("Description is required"),
  });
  const maintJobSchema = yup.object().shape({
    Maint_Name: yup.string().required("Name is required"),
    Maint_Description: yup.string().required("Description is required"),
  });

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(
      isCleaningOrMaint ? cleaningJobSchema : maintJobSchema
    ),
    defaultValues: isCleaningOrMaint
      ? {
          Cleaning_Name: "",
          Cleaning_Description: "",
        }
      : {
          Maint_Name: "",
          Maint_Description: "",
        },
    mode: "onChange",
  });

  const handleModalClose = useCallback(() => {
    reset();
    handleClose();
  }, [handleClose, reset]);

  const resetData = () => {
    reset();
    setIsUpdated(false);
    setConfirmationType(btnValue.toLowerCase());
  };

  const submitHandler = useCallback(() => {
    const handleError = (err) => {
      console.error(err);
      toast.error(err.response?.data?.errorMessage || "internal server error");
    };

    const handleSuccess = (message) => {
      toast.success(message);
      handleModalClose();
    };

    const reportPayload = {
      ...formData,
      EquipmentID: id,
    };

    switch (confirmationType) {
      case "add":
        const url = isCleaningOrMaint ? "/cleaningJobs" : "/maintenanceJobs";
        axios
          .post(url, reportPayload)
          .then((res) => {
            handleSuccess(
              `${
                isCleaningOrMaint ? "Cleaning" : "Maintenance"
              } Job added Successfully`
            );
            setOpenConfirmation(false);
            onSubmit(true);
            handleModalClose();
          })
          .catch(handleError);
        break;
      case "update":
        axios.put(`/cleaningJobs/${id}`, reportPayload).then((res) => {
          handleSuccess("Job updated Successfully");
          setOpenConfirmation(false);
          onSubmit(true);
          handleModalClose();
        });
        break;
      case "delete":
        axios.delete(`/cleaningJobs/${id}`).then((res) => {
          handleSuccess("Report Deleted Successfully");
          setOpenConfirmation(false);
          onSubmit(true);
          handleModalClose();
        });
        break;
      case "cancel":
        setOpenConfirmation(false);
        // handleModalClose();
        resetData();
        break;
      default:
        console.warn("Unknown button action:", btnValue);
    }
  }, [btnValue, confirmationType, formData, handleModalClose, id, onSubmit]);

  const formHandler = useCallback(
    (data) => {
      switch (confirmationType) {
        case "add":
          setFormData({
            ...data,
            // Report_Name: reportName,
            // Report_Description:
            // SYSTEM_REPORT_DESCS[SYSTEM_REPORT_NAMES.indexOf(reportName)],
          });
          setConfirmationType("add");
          setOpenConfirmation(true);
          break;
        case "update":
          setFormData(data);
          setConfirmationType("update");
          setOpenConfirmation(true);
          break;
        case "delete":
          setConfirmationType("delete");
          setOpenConfirmation(true);
          break;
        default:
          break;
      }
    },
    [confirmationType]
  );

  const handleCancel = useCallback(() => {
    if (btnValue === "cancel") {
      reset();
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else if (btnValue === "delete" || isValid) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      reset();
      handleModalClose();
    }
  }, [btnValue, handleModalClose, isValid]);

  useEffect(() => {
    setConfirmationType(btnValue.toLowerCase());
  }, [btnValue]);

  // const fetchEquipments = async () => {
  //   try {
  //     const res = await axios.get(`/equipments`);
  //     if (res.status === 200) {
  //       if (res.data.data.data) {
  //         const data = res.data.data.data;

  //         const equipment = data.find(
  //           (equipment) => equipment.EquipmentID === id
  //         );
  //         if (equipment) {
  //           setDefaultEquipment(equipment);
  //         }
  //         return data;
  //       }
  //     } else {
  //       return [];
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     return [];
  //   }
  // };

  return (
    <>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="inventory-detail-modal-title"
      >
        <div className="bg-white w-11/12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl max-w-[700px] overflow-y-auto">
          <form
            onSubmit={handleSubmit(formHandler)}
            className="small_scroller p-5 md:py-6 md:px-10 max-h-[90vh] overflow-y-auto"
          >
            <Box>
              <div className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
                    {btnValue.charAt(0).toUpperCase() + btnValue.slice(1)}{" "}
                    {isCleaningOrMaint ? "Cleaning Job" : "Maintenance Job"}
                  </h2>
                </div>

                <div className="border-b border-gray-300 mb-4"></div>
              </div>
              <div className="grid grid-cols-3 gap-4 ">
                {/* Job Name */}
                <label className="text-gray-700 self-center">
                  {isCleaningOrMaint ? "Cleaning" : "Maintenance"} Name
                  <span className="text-red-700">*</span>
                </label>
                <Controller
                  name={isCleaningOrMaint ? "Cleaning_Name" : "Maint_Name"}
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      type="text"
                      className="col-span-2 "
                      {...field}
                      disabled={false}
                      error={!!errors.Name}
                      autoFocus={true}
                    />
                  )}
                />

                {/* Description */}
                <label className="text-gray-700 self-center">
                  {isCleaningOrMaint ? "Cleaning" : "Maintenance"} Description
                  <span className="text-red-700">*</span>
                </label>
                <Controller
                  name={
                    isCleaningOrMaint
                      ? "Cleaning_Description"
                      : "Maint_Description"
                  }
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      type="text"
                      className="col-span-2"
                      {...field}
                      disabled={false}
                      error={!!errors.Description}
                    />
                  )}
                />

                {/* Equipment Select */}
                {/* <label className="text-gray-700 self-center">
                  Equipment
                  <span className="text-red-700">*</span>
                </label> */}
                {/* <AsyncMultiSelect
                  className="col-span-2"
                  multiple={false}
                  fetchOptions={fetchEquipments}
                  displayField="Name"
                  defaultValue={defaultEquipment}
                  buttonLabel="off"
                  placeholder="Type to search equipment..."
                  disabled={false}
                  onSelect={setSelectedEquipment}
                  error={!selectedEquipment}
                /> */}
              </div>
              <div className="col-span-3 flex justify-end mt-5">
                <button
                  type="button"
                  className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36"
                  onClick={handleCancel}
                >
                  {(
                    btnValue !== "delete"
                      ? btnValue === "add"
                        ? !isValid
                        : // || !selectedEquipment
                          !isValid ||
                          // !selectedEquipment ||
                          (!isDirty && !isUpdated)
                      : false
                  )
                    ? "Go Back"
                    : "Cancel"}
                </button>
                <button
                  type="submit"
                  className={`py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize ${
                    btnValue === "delete"
                      ? "bg-red-500"
                      : btnValue === "add"
                      ? !isValid
                        ? // || !selectedEquipment
                          "bg-gray-400 cursor-not-allowed"
                        : "bg-BtnBg"
                      : !isValid ||
                        // !selectedEquipment ||
                        (!isDirty && !isUpdated)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-BtnBg"
                  }`}
                  disabled={
                    btnValue !== "delete"
                      ? btnValue === "add"
                        ? !isValid
                        : // || !selectedEquipment
                          !isValid ||
                          // !selectedEquipment ||
                          (!isDirty && !isUpdated)
                      : false
                  }
                >
                  {btnValue}
                </button>
              </div>
            </Box>
          </form>
        </div>
      </Modal>
      <ConfirmationModal
        type={confirmationType}
        open={openConfirmation}
        onClose={() => {
          setOpenConfirmation(false);
          setConfirmationType(btnValue.toLowerCase());
        }}
        onSubmit={submitHandler}
        from={isCleaningOrMaint ? "cleaning job" : "maintenance job"}
      />
    </>
  );
};

export default CleanManitJobNewModal;
