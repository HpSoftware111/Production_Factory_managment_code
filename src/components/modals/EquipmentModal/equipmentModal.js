import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, Box, Select, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../common/TextInput";
import ConfirmationModal from "../ConfirmationModal";
import FileUploader from "../../common/FileUploader";
import { EQUIPMENT_OPERATIONS } from "../../common/utils";

const EquipmentModal = ({ open, handleClose, btnValue, id, onSubmit }) => {
  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState(
    btnValue.toLowerCase()
  );
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [imageLocation, setImageLocation] = useState(null);
  const [equipmentTypes, setEquipmentTypes] = useState([]);

  const equipmentSchema = yup.object().shape({
    Name: yup.string().required("Name is required"),
    Description: yup.string().required("Description is required"),
    Manufacturer: yup.string().required("Manufacturer is required"),
    Model_Number: yup.string().required("Model Number is required"),
    Serial_Number: yup.string().required("Serial Number is required"),
    Purchase_Date: yup
      .date()
      .required("Purchase Date is required")
      .typeError("Invalid date"),
    Warranty_Date: yup
      .date()
      .required("Warranty Date is required")
      .typeError("Invalid date"),

    Equipment_TypeID: yup
      .number()
      .integer()
      .required("Equipment Type is required"),
    Operational_Status: yup.string().required("Operational Status is required"),
    Equipment_BarCode: yup.string().required("Operational Status is required"),
  });

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(equipmentSchema),
    defaultValues: {
      Name: "",
      Description: "",
      Manufacturer: "",
      Model_Number: "",
      Serial_Number: "",
      Purchase_Date: new Date(), // Current date
      Warranty_Date: new Date(), // Current date
      Last_Maint_Date: new Date(), // Current date
      Equipment_TypeID: null,
      Operational_Status: EQUIPMENT_OPERATIONS[0],
      Equipment_BarCode: "",
    },
    mode: "onChange",
  });

  const handleModalClose = useCallback(() => {
    reset();
    handleClose();
  }, [handleClose, reset]);

  const resetData = () => {
    console.log("🚀🚀🚀", id);
    if (id) {
      // getReportByID(id);
    } else {
      reset();
      setImageLocation(null);
      // setPrinter(null);
      // setReportType(null);
      // setPaperType(null);
    }
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
      Image_Location: imageLocation,
    };

    switch (confirmationType) {
      case "add":
        axios
          .post("/equipments", reportPayload)
          .then((res) => {
            handleSuccess("Equipment added Successfully");
            setOpenConfirmation(false);
            onSubmit(true);
            handleModalClose();
          })
          .catch(handleError);
        break;
      case "update":
        axios.put(`/equipments/${id}`, reportPayload).then((res) => {
          handleSuccess("Equipment updated Successfully");
          setOpenConfirmation(false);
          onSubmit(true);
          handleModalClose();
        });
        break;
      case "delete":
        axios.delete(`/equipments/${id}`).then((res) => {
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
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else if (btnValue === "delete" || isValid) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      handleModalClose();
    }
  }, [btnValue, handleModalClose, isValid]);
  const isDelete = btnValue === "delete";

  useEffect(() => {
    setConfirmationType(btnValue.toLowerCase());
  }, [btnValue]);

  // GET INITIAL DATA FOR FORM
  useEffect(() => {
    axios.get("/equipmentTypes").then((res) => {
      const equipmentData = res.data.data.data;
      setEquipmentTypes(equipmentData);
      // Set default value to the first element of the fetched data
      if (equipmentData.length > 0) {
        setValue("Equipment_TypeID", equipmentData[0].Equipment_TypeID); // Assuming `id` is the key
      }
    });
  }, [setValue]);

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
                    Equipment
                  </h2>
                  <FileUploader
                    bgColor="#41B6C4"
                    defaultValue={imageLocation}
                    setter={(path) => {
                      setIsUpdated(true);
                      setImageLocation(path);
                    }}
                    disabled={isDelete}
                  />
                </div>

                <div className="border-b border-gray-300 mb-4"></div>
              </div>
              <div className="grid grid-cols-3 gap-4 ">
                {/* Equipment Name */}
                <label className="text-gray-700 self-center">
                  Name<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Name"
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
                  Description<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Description"
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

                {/* Manufacturer */}
                <label className="text-gray-700 self-center">
                  Manufacturer<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Manufacturer"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      type="text"
                      className="col-span-2"
                      {...field}
                      disabled={false}
                      error={!!errors.Manufacturer}
                    />
                  )}
                />

                {/* Model Number */}
                <label className="text-gray-700 self-center">
                  Model Number<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Model_Number"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      type="text"
                      className="col-span-2"
                      {...field}
                      disabled={false}
                      error={!!errors.Model_Number}
                    />
                  )}
                />

                {/* Serial Number */}
                <label className="text-gray-700 self-center">
                  Serial Number<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Serial_Number"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      type="text"
                      className="col-span-2"
                      {...field}
                      disabled={false}
                      error={!!errors.Serial_Number}
                    />
                  )}
                />

                {/* Purchase Date */}
                <label className="text-gray-700 self-center">
                  Purchase Date<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Purchase_Date"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      type="date"
                      className="col-span-2"
                      {...field}
                      disabled={false}
                      error={!!errors.Purchase_Date}
                    />
                  )}
                />

                {/* Warranty Date */}
                <label className="text-gray-700 self-center">
                  Warranty Date<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Warranty_Date"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      type="date"
                      className="col-span-2"
                      {...field}
                      disabled={false}
                      error={!!errors.Warranty_Date}
                    />
                  )}
                />

                {/* Last Maintenance Date */}
                <label className="text-gray-700 self-center">
                  Last Maint Date<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Last_Maint_Date"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      type="date"
                      className="col-span-2"
                      {...field}
                      disabled={false}
                      error={!!errors.Last_Maint_Date}
                    />
                  )}
                />

                {/* Equipment Type */}
                <label className="text-gray-700 self-center">
                  Equipment Type<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Equipment_TypeID"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="bg-[#f4f4f4] col-span-2"
                      disabled={false}
                      error={!!errors.Equipment_TypeID}
                      placeholder="Select Equipment Type"
                      size="small"
                    >
                      {equipmentTypes.map((value) => (
                        <MenuItem
                          key={value.Equipment_TypeID}
                          value={value.Equipment_TypeID}
                        >
                          {value.Equipment_Description}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />

                {/* Operation Status */}
                <label className="text-gray-700 self-center">
                  Operation Status<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Operational_Status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="bg-[#f4f4f4] col-span-2"
                      disabled={false}
                      error={!!errors.Operational_Status}
                      placeholder="Select Operation Status"
                      size="small"
                    >
                      {EQUIPMENT_OPERATIONS.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />

                {/* Equipment Barcode */}
                <label className="text-gray-700 self-center">
                  Equipment Barcode<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Equipment_BarCode"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      type="text"
                      className="col-span-2"
                      {...field}
                      disabled={false}
                      error={!!errors.Equipment_BarCode}
                    />
                  )}
                />
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
                        : // || !group || !printer
                          !isValid ||
                          // !group ||
                          // !printer ||
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
                        ? // || !group || !printer || !paperType
                          "bg-gray-400 cursor-not-allowed"
                        : "bg-BtnBg"
                      : !isValid ||
                        //   !group ||
                        // !printer ||
                        (!isDirty && !isUpdated)
                      ? // )
                        "bg-gray-400 cursor-not-allowed"
                      : "bg-BtnBg"
                  }`}
                  disabled={
                    btnValue !== "delete"
                      ? btnValue === "add"
                        ? !isValid
                        : // || !group || !printer || !paperType
                          !isValid ||
                          // !group ||
                          // !printer ||
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
        }}
        onSubmit={submitHandler}
        from="equipment"
      />
    </>
  );
};

export default EquipmentModal;
