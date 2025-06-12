import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Modal, Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../../api";
import ConfirmationModal from "../ConfirmationModal";
import TextInput from "../../common/TextInput";
import { isValidIP, isValidSubnetMask } from "../../../utils/ipUtils";

const CrudModalThree = ({ open, fieldData, handleClose, btnName, setData }) => {
  const [confirmationType, setConfirmationType] = useState(btnName);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isUpdated] = useState(false);

  const dataQuestionSchema = yup.object().shape({
    Printer_Name: yup.string().required("Printer Name is required"),
    Printer_Description: yup
      .string()
      .required("Printer Description is required"),
    Printer_Brand: yup.string().required("Printer Brand is required"),
    Printer_Model: yup.string().required("Printer Model is required"),
    Printer_Pin: yup.string().required("Printer PIN is required"),
    Printer_IP: yup
      .string()
      .required("Printer IP is required")
      .test("is-valid-ip", "Invalid IP address", (value) => isValidIP(value)),
    Printer_IP_Mask: yup
      .string()
      .required("Printer IP Mask is required")
      .test("is-valid-mask", "Invalid subnet mask", (value) =>
        isValidSubnetMask(value)
      ),
    Printer_Password: yup.string().required("Printer Password is required"),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(dataQuestionSchema),
    defaultValues: {
      Printer_Name: fieldData?.Printer_Name || "",
      Printer_Description: fieldData?.Printer_Description || "",
      Printer_Brand: fieldData?.Printer_Brand || "",
      Printer_Model: fieldData?.Printer_Model || "",
      Printer_Pin: fieldData?.Printer_Pin || "",
      Printer_IP: fieldData?.Printer_IP || "",
      Printer_IP_Mask: fieldData?.Printer_IP_Mask || "",
      Printer_Password: fieldData?.Printer_Password || "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(() => {
    const contactPayload = { ...formData };

    const handleError = (err) => {
      console.error(err);
      toast.error(err.response?.data?.errorMessage || "Internal server error");
    };

    switch (confirmationType) {
      case "add":
        axios
          .post("/printers", contactPayload)
          .then((res) => {
            setData((prev) => [...prev, res.data.data]);
            toast.success("Printer Added Successfully");
            reset();
            handleClose();
            setOpenConfirmation(false);
          })
          .catch(handleError);
        break;

      case "update":
        axios
          .put(`/printers/${fieldData?.PrinterID}`, contactPayload)
          .then((res) => {
            setData((prev) =>
              prev.map((item) =>
                item.PrinterID === fieldData?.PrinterID ? res.data.data : item
              )
            );
            toast.success("Printer Updated Successfully");
            reset();
            handleClose();
            setOpenConfirmation(false);
          })
          .catch(handleError);
        break;

      case "delete":
        axios
          .delete(`/printers/${fieldData?.PrinterID}`)
          .then(() => {
            setData((prev) =>
              prev.filter((item) => item.PrinterID !== fieldData?.PrinterID)
            );
            toast.success("Printer Deleted Successfully");
            reset();
            handleClose();
            setOpenConfirmation(false);
          })
          .catch(handleError);
        break;

      case "cancel":
        reset();
        handleClose();
        setOpenConfirmation(false);
        break;

      default:
        console.warn("Unknown button action:", btnName);
    }
  }, [
    btnName,
    confirmationType,
    fieldData,
    formData,
    handleClose,
    reset,
    setData,
  ]);

  // Handle the form actions
  const formHandler = useCallback(
    (data) => {
      console.log(data);
      if (btnName === "add") {
        setConfirmationType("add");
        setFormData(data);
        setOpenConfirmation(true);
      } else if (btnName === "update") {
        setConfirmationType("update");
        setFormData(data);
        setOpenConfirmation(true);
      } else {
        setConfirmationType("delete");
        setOpenConfirmation(true);
      }
    },
    [btnName]
  );

  // Handle cancellation
  const handleCancel = useCallback(() => {
    if (isDirty || btnName === "delete") {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      handleClose();
    }
  }, [isDirty, btnName, handleClose]);

  // Set button class and status based on the action
  const getButtonClassName = useCallback(() => {
    if (btnName === "delete") {
      return "py-2 px-6 md:px-16 bg-red-600 text-white rounded-xl min-w-36 cursor-pointer capitalize";
    }
    if (btnName === "add") {
      return `py-2 px-6 md:px-16 text-white ${
        !isValid ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-BtnBg"
      } rounded-xl min-w-36 capitalize`;
    }
    if (btnName === "update") {
      return `py-2 px-6 md:px-16 text-white ${
        !isValid || (!isDirty && !isUpdated)
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-BtnBg"
      } rounded-xl min-w-36 capitalize`;
    }
    return "py-2 px-6 md:px-16 bg-BtnBg text-white rounded-xl min-w-36 capitalize";
  }, [btnName, isValid, isDirty, isUpdated]);

  const getButtonStatus = useCallback(() => {
    switch (btnName) {
      case "add":
        return !isValid;
      case "update":
        return !isValid || (!isDirty && !isUpdated);
      default:
        return false;
    }
  }, [btnName, isValid, isDirty, isUpdated]);

  // Watch fieldData changes and reset form accordingly
  useEffect(() => {
    if (fieldData) {
      reset({
        Printer_Name: fieldData.Printer_Name,
        Printer_Description: fieldData.Printer_Description,
        Printer_Brand: fieldData.Printer_Brand,
        Printer_Model: fieldData.Printer_Model,
        Printer_Pin: fieldData.Printer_Pin,
        Printer_IP: fieldData.Printer_IP,
        Printer_IP_Mask: fieldData.Printer_IP_Mask,
        Printer_Password: fieldData.Printer_Password,
      });
    }
  }, [fieldData, reset]);

  useEffect(() => {
    setConfirmationType(btnName);
  }, [btnName]);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="crud-modal-title">
      <div className="bg-white w-11/12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl max-w-[600px]">
        <form
          onSubmit={handleSubmit(formHandler)}
          className="small_scroller p-5 md:py-6 md:px-10 max-h-[90vh] overflow-y-auto"
        >
          <Box>
            <div className="flex flex-col">
              <h2
                id="crud-modal-title"
                className="text-xl font-semibold mb-2 text-BtnBg capitalize"
              >
                {btnName} Printer
              </h2>
              <div className="border-b border-gray-300 mb-4"></div>

              <div className="grid grid-cols-3 gap-4 ">
                {/* Printer Name Field */}
                <label className="text-gray-700 self-center">
                  Printer Name<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Printer_Name"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      className="col-span-2 !mb-4 bg-[#f4f4f4]"
                      {...field}
                      placeholder="Printer Name"
                      disabled={btnName === "delete"}
                      error={!!errors.Printer_Name}
                    />
                  )}
                />

                {/* Printer Description Field */}
                <label className="text-gray-700 self-center">
                  Printer Description<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Printer_Description"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      className="col-span-2 !mb-4 bg-[#f4f4f4]"
                      {...field}
                      placeholder="Description"
                      disabled={btnName === "delete"}
                      error={!!errors.Printer_Description}
                    />
                  )}
                />

                {/* Printer Brand Field */}
                <label className="text-gray-700 self-center">
                  Printer Brand<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Printer_Brand"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      className="col-span-2 !mb-4 bg-[#f4f4f4]"
                      {...field}
                      placeholder="Printer Brand"
                      disabled={btnName === "delete"}
                      error={!!errors.Printer_Brand}
                    />
                  )}
                />

                {/* Printer Model Field */}
                <label className="text-gray-700 self-center">
                  Printer Model<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Printer_Model"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      className="col-span-2 !mb-4 bg-[#f4f4f4]"
                      {...field}
                      placeholder="Printer Model"
                      disabled={btnName === "delete"}
                      error={!!errors.Printer_Model}
                    />
                  )}
                />

                {/* Printer PIN Field */}
                <label className="text-gray-700 self-center">
                  Printer PIN<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Printer_Pin"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      className="col-span-2 !mb-4 bg-[#f4f4f4]"
                      {...field}
                      placeholder="Printer PIN"
                      disabled={btnName === "delete"}
                      error={!!errors.Printer_Pin}
                    />
                  )}
                />

                {/* Printer IP Field */}
                <label className="text-gray-700 self-center">
                  Printer IP<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Printer_IP"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      className="col-span-2 !mb-4 bg-[#f4f4f4]"
                      {...field}
                      placeholder="0.0.0.0"
                      disabled={btnName === "delete"}
                      error={!!errors.Printer_IP}
                    />
                  )}
                />

                {/* Printer IP Mask Field */}
                <label className="text-gray-700 self-center">
                  Printer IP Mask<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Printer_IP_Mask"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      className="col-span-2 !mb-4 bg-[#f4f4f4]"
                      {...field}
                      placeholder="0.0.0.0"
                      disabled={btnName === "delete"}
                      error={!!errors.Printer_IP_Mask}
                    />
                  )}
                />

                {/* Printer Password Field */}
                <label className="text-gray-700 self-center">
                  Printer Password<span className="text-red-700">*</span>
                </label>
                <Controller
                  name="Printer_Password"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      className="col-span-2 !mb-4 bg-[#f4f4f4]"
                      {...field}
                      placeholder="Printer Password"
                      type="password"
                      disabled={btnName === "delete"}
                      error={!!errors.Printer_Password}
                    />
                  )}
                />

                {/* BUTTONS */}
                <div className="col-span-3 flex justify-end mt-5 gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36 cursor-pointer"
                  >
                    {getButtonStatus() ? "Go Back" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className={getButtonClassName()}
                    disabled={getButtonStatus()}
                  >
                    {btnName}
                  </button>
                </div>
              </div>
            </div>
          </Box>

          {/* Confirmation Modal */}
          <ConfirmationModal
            open={openConfirmation}
            type={confirmationType}
            onClose={() => setOpenConfirmation(false)}
            onSubmit={onSubmit}
            from="Printer"
          />
        </form>
      </div>
    </Modal>
  );
};

export default CrudModalThree;
