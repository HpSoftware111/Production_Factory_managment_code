import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import ConfirmationModal from "../../modals/ConfirmationModal";

const CrudModalTwo = ({ open, fieldData, handleClose, btnName, setData }) => {
  const [confirmationType, setConfirmationType] = useState(btnName);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [storageMethod, setStorageMethod] = useState(null);

  const dataQuestionSchema = yup.object().shape({
    Inventory_Type: yup.string().required("Inventory Type is required"),
    Cooler_Schedule: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : value
      )
      .min(0, "It must be greater than or equal to 0."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(dataQuestionSchema),
    defaultValues: {
      Inventory_Type: fieldData?.Inventory_Type || "",
      Cooler_Schedule: fieldData?.Cooler_Schedule || null,
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(() => {
    const contactPayload = {
      ...formData,
      Storage_Method: storageMethod,
    };

    const handleError = (err) => {
      console.error(err);
      toast.error(err.response?.data?.errorMessage || "internal server error");
    };

    switch (confirmationType) {
      case "add":
        axios
          .post("/inventory-types", contactPayload)
          .then((res) => {
            setData((prev) => [...prev, res.data.data]);
            toast.success("Inventory Type Added Successfully");
            reset();
            handleClose();
            setOpenConfirmation(false);
          })
          .catch(handleError);
        break;

      case "update":
        axios
          .put(
            `/inventory-types/${fieldData?.Inventory_TypeID}`,
            contactPayload
          )
          .then((res) => {
            setData((prev) =>
              prev.map((item) =>
                item.Inventory_TypeID === fieldData?.Inventory_TypeID
                  ? res.data.data
                  : item
              )
            );
            toast.success("Inventory Type Updated Successfully");
            reset();
            handleClose();
            setOpenConfirmation(false);
          })
          .catch(handleError);
        break;

      case "delete":
        axios
          .delete(`/inventory-types/${fieldData?.Inventory_TypeID}`)
          .then((res) => {
            setData((prev) => {
              return prev.filter(
                (item) => item.Inventory_TypeID !== fieldData?.Inventory_TypeID
              );
            });
            toast.success("Inventory Type Deleted Successfully");
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
    fieldData?.Inventory_TypeID,
    formData,
    handleClose,
    reset,
    setData,
    storageMethod,
  ]);

  const formHandler = useCallback(
    (data) => {
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

  const handleCancel = useCallback(() => {
    // if (isDirty || btnName === "delete") {
    if (!getButtonStatus()) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      handleClose();
    }
  }, [btnName, handleClose, isDirty]);

  const getButtonClassName = useCallback(() => {
    if (btnName === "delete") {
      return "py-2 px-6 md:px-16 bg-red-600 text-white rounded-xl min-w-36 cursor-pointer capitalize bg-red-400";
    }
    if (btnName === "add") {
      return `py-2 px-6 md:px-16 text-white ${
        !isValid || !storageMethod
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-BtnBg"
      } rounded-xl min-w-36 capitalize`;
    }
    if (btnName === "update") {
      return `py-2 px-6 md:px-16 text-white ${
        !isValid || !storageMethod || (!isDirty && !isUpdated)
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-BtnBg"
      } rounded-xl min-w-36 capitalize`;
    }
    return "py-2 px-6 md:px-16 bg-BtnBg text-white rounded-xl min-w-36 capitalize";
  }, [btnName, isDirty, isUpdated, isValid, storageMethod]);

  const getButtonStatus = useCallback(() => {
    switch (btnName) {
      case "add":
        return !isValid || !storageMethod;
      case "update":
        return !isValid || !storageMethod || (!isDirty && !isUpdated);
      default:
        return false;
    }
  }, [btnName, isDirty, isUpdated, isValid, storageMethod]);

  const isDelete = btnName === "delete";

  useEffect(() => {
    if (fieldData) {
      reset({
        Inventory_Type: fieldData.Inventory_Type,
        Cooler_Schedule: fieldData.Cooler_Schedule,
      });
      setStorageMethod(fieldData.Storage_Method);
    }
  }, [fieldData, reset]);

  useEffect(() => {
    setConfirmationType(btnName);
  }, [btnName]);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="crud-modal-title">
      <div className="bg-white w-11/12  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg shadow-xl max-w-[600px]">
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
                {btnName} Inventory Type
              </h2>
              <div className="border-b border-gray-300 mb-4"></div>
              <TextField
                id="inventoryType"
                className="col-span-2 !mb-4 bg-[#f4f4f4]"
                label="Inventory Type"
                variant="outlined"
                placeholder="Inventory Type"
                {...register("Inventory_Type")}
                error={!!errors.Inventory_Type}
                helperText={errors.Inventory_Type?.message}
                size="small"
                disabled={isDelete}
              />
              <FormControl
                sx={{ minWidth: 120 }}
                size="small"
                className="col-span-2 !mb-4 bg-[#f4f4f4]"
              >
                <InputLabel id="storage-method-label">
                  Storage Method
                </InputLabel>
                <Select
                  labelId="storage-method-label"
                  id="storage-method"
                  value={storageMethod || ""}
                  onChange={(e) => {
                    setIsUpdated(true);
                    setStorageMethod(e.target.value);
                  }}
                  label="Storage Method"
                  disabled={isDelete}
                >
                  <MenuItem value="Freezer">Freezer</MenuItem>
                  <MenuItem value="Reefer">Reefer</MenuItem>
                  <MenuItem value="Production Storage">
                    Production Storage
                  </MenuItem>
                  <MenuItem value="Cleaning Storage">Cleaning Storage</MenuItem>
                  <MenuItem value="Shipping Storage">Shipping Storage</MenuItem>
                  <MenuItem value="Mechanics Storage">
                    Mechanics Storage
                  </MenuItem>
                  <MenuItem value="Ask Manager">Ask Manager</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="coolerSchedule"
                className="col-span-2 !mb-4 bg-[#f4f4f4]"
                label="Cooler Schedule"
                variant="outlined"
                type="number"
                placeholder="Cooler Schedule"
                {...register("Cooler_Schedule")}
                error={!!errors.Cooler_Schedule}
                helperText={errors.Cooler_Schedule?.message}
                size="small"
                disabled={isDelete}
              />

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
          </Box>
        </form>
        <ConfirmationModal
          type={confirmationType}
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onSubmit={onSubmit}
          from="inventory type"
        />
      </div>
    </Modal>
  );
};

export default CrudModalTwo;
