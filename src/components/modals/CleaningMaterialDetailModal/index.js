import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, Box, Button, Select, MenuItem, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "../../../api";
import ConfirmationModal from "../ConfirmationModal";
import * as yup from "yup";
import TextInput from "../../common/TextInput";
import Field from "../../common/Field";
import SearchableField from "../../common/SearchableField";
import AsyncMultiSelect from "../../common/AsyncMultiSelect";
import SelectInput from "../../common/SelectInput";
import DollarInput from "../../common/DollarInput";

const CleaningMaterialDetailModal = ({
  open,
  handleClose,
  btnValue,
  data,
  cleaningID,
  onSubmit,
}) => {
  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState(
    btnValue.toLowerCase()
  );
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState(null);

  const [inventory, setInventory] = useState(null);

  const cleaningMaterialSchema = yup.object().shape({
    Inventory_Type: yup.string().required("Inventory Type is required"),
    Inventory_Description: yup.string().required("Description is required"),
    Qty_Used: yup
      .number()
      .required("Quantity Used is required")
      .positive()
      .integer(),
    Unit_Price: yup.number().required("Unit Price is required").positive(),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(cleaningMaterialSchema),
    defaultValues: {
      Inventory_Description: data?.Inventory_Description || "",
      Inventory_Type: data?.Inventory_Type || "",
      Qty_Used: data?.Qty_Used || "",
      Unit_Price: data?.Unit_Price || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    fetchUnitOptions();
    if (data) {
      fetchInventoryOptions();
    }
  }, [reset, data]);

  const fetchInventoryOptions = async (keyword = "") => {
    try {
      const res = await axios.get(`/inventories?all=true&keyword=${keyword}`);
      if (res.status === 200) {
        const list = res.data.data.data;
        const options = list.map((item) => ({
          id: item.InventoryID,
          name: item.Name,
          Description: item.Description,
          Inventory_TypeID: item.Inventory_TypeID,
          Inventory_Type: item.Inventory_Type,
        }));

        if (data?.InventoryID) {
          const selected = options.find((item) => item.id === data.InventoryID);
          setInventory(selected);
        }
        return options;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching inventory options:", error);
      return [];
    }
  };

  const fetchUnitOptions = async () => {
    const res = await axios.get(`/unit-measures?all=true`);
    const list = res.data.data.data;
    const options = list.map((item) => ({
      value: item.UM_Description,
      label: item.UM_Description,
    }));
    setUnits(options);

    if (data?.Unit_Of_Measure) {
      setUnit(data?.Unit_Of_Measure);
    } else if (options.length > 0) {
      setUnit(options[0].value);
    }
  };

  const handleFormSubmit = useCallback(
    (data) => {
      console.log("🚀🚀🚀Form Data:", unit);
      switch (confirmationType) {
        case "add":
          setFormData({
            ...data,
            Unit_Of_Measure: unit,
          });
          setConfirmationType("add");
          setOpenConfirmation(true);
          break;
        case "update":
          setFormData({
            ...data,
            Unit_Of_Measure: unit,
          });
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
    [confirmationType, unit]
  );

  const handleConfirm = async () => {
    try {
      console.log("🚀🚀🚀Confirmation type:", confirmationType, data);

      if (confirmationType === "add") {
        const sendData = {
          InventoryID: inventory.id,
          CleaningID: cleaningID || data?.CleaningID,
          Qty_Used: formData.Qty_Used,
          Unit_Of_Measure: formData.Unit_Of_Measure,
          Unit_Price: formData.Unit_Price,
        };
        await axios.post("/cleaningMaterials", sendData);
        toast.success("Cleaning Material added successfully");
        onSubmit();
      } else if (confirmationType === "update") {
        const sendData = {
          InventoryID: inventory.id,
          CleaningID: cleaningID || data?.CleaningID,
          Qty_Used: formData.Qty_Used,
          Unit_Of_Measure: formData.Unit_Of_Measure,
          Unit_Price: formData.Unit_Price,
        };
        await axios.put(
          `/cleaningMaterials/${data.Cleaning_MaterialsID}`,
          sendData
        );
        toast.success("Cleaning Material updated successfully");
        onSubmit();
      } else if (confirmationType === "delete") {
        await axios.delete(`/cleaningMaterials/${data.Cleaning_MaterialsID}`);
        toast.success("Cleaning Material deleted successfully");
        onSubmit();
      } else if (confirmationType === "cancel") {
        resetData();
      }
      handleClose();
    } catch (error) {
      console.error("Error handling confirmation:", error);
      toast.error("Failed to process the request");
    }
  };

  const resetData = () => {
    reset();
    setConfirmationType(btnValue);
    setOpenConfirmation(false);
    setInventory(null);
    fetchInventoryOptions();
    fetchUnitOptions();
    setIsUpdated(false);
  };

  const handleCancel = useCallback(() => {
    if (isDirty || isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      reset();
      handleClose();
    }
  }, [handleClose, isValid, isUpdated]);

  const getCancelButtonStatus = () => {
    let updated = false;
    // switch (btnValue) {
    //   case "add":
    //     updated = isDirty || isUpdated;
    //     break;
    //   case "update":
    //     updated = isDirty || isUpdated;
    //     break;

    //   default:
    //     break;
    // }

    return isDirty || isUpdated;
  };

  const getSubmitButtonStatus = () => {
    let updated = false;
    console.log(
      "🚀🚀🚀Submit Button Status:",
      isDirty,
      isValid,
      inventory,
      unit
    );
    switch (btnValue) {
      case "add":
        updated = isDirty && isValid && inventory && unit;
        break;
      case "delete":
        updated = true;
        break;
      case "update":
        updated = (isUpdated && isValid) || (isValid && inventory);
        break;

      default:
        break;
    }
    return updated;
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="inventory-detail-modal-title"
      >
        <div className="bg-white w-11/12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl max-w-[700px] overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="small_scroller p-5 md:py-6 md:px-10 max-h-[90vh] overflow-y-auto"
          >
            <Box className="space-y-6">
              <div className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <h2 className="text-2xl font-semibold mb-2 text-BtnBg capitalize">
                    {`${btnValue} Cleaning Supply`}
                  </h2>
                </div>

                <div className="border-b border-gray-300 mb-4"></div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <label className="text-gray-700 self-center">
                  Inventory<span className="text-red-700">*</span>
                </label>
                <SearchableField
                  fetchData={fetchInventoryOptions}
                  defaultValue={inventory}
                  onChange={(value) => {
                    if (typeof value === "string") {
                      setIsUpdated(false);
                      setInventory(null);
                    } else {
                      setIsUpdated(true);
                      setInventory(value);
                      setValue("Inventory_Description", value.Description);
                      setValue("Inventory_Type", value.Inventory_Type);
                    }
                  }}
                  // onBlur={(value) => {
                  //   if (typeof value === "string") {
                  //     setIsUpdated(false);
                  //     setInventory(null);
                  //   } else {
                  //     setIsUpdated(true);
                  //     setInventory(value);
                  //     setValue("Inventory_Description", value.Description);
                  //     setValue("Inventory_Type", value.Inventory_Type);
                  //   }
                  // }}
                  placeholder="Type to search equipment..."
                  className="col-span-2"
                  error={!inventory}
                  disabled={false}
                />
              </div>

              <Field
                label="Inventory Description"
                name="Inventory_Description"
                placeholder="Enter Name"
                control={control}
                disabled={true}
                error={errors.Inventory_Description}
                className="grid grid-cols-3 gap-4"
              />
              <Field
                label="Inventory Type"
                name="Inventory_Type"
                placeholder="Inventory Type"
                control={control}
                error={errors.Inventory_Type}
                className="grid grid-cols-3 gap-4"
                disabled={true}
              />
              <div className="grid grid-cols-3 gap-4">
                <label className="text-gray-700 self-center">
                  Unit Of Measure
                  <span className="text-red-700">*</span>
                </label>
                <SelectInput
                  options={units}
                  value={unit}
                  onChange={(value) => {
                    console.log(value);
                    setIsUpdated(true);
                    setUnit(value);
                  }}
                  placeholder="Choose Unit of Measure"
                  className="border border-gray-300 col-span-2"
                />
              </div>

              <Field
                label="Quantity Used"
                name="Qty_Used"
                placeholder="Quantity Used"
                control={control}
                error={errors.Qty_Used}
                className="grid grid-cols-3 gap-4"
              />

              <div className="grid grid-cols-3 gap-4">
                <label className="text-gray-700 self-center">Unit Price</label>
                <Controller
                  name="Unit_Price"
                  control={control}
                  render={({ field }) => (
                    <DollarInput
                      className="col-span-2"
                      {...field}
                      placeholder="$0.00"
                      disabled={false}
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
                  {!getCancelButtonStatus() ? "Go Back" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className={`py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize ${
                    btnValue === "delete"
                      ? "bg-red-500"
                      : !getSubmitButtonStatus()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-BtnBg"
                  }`}
                  disabled={
                    btnValue !== "delete" ? !getSubmitButtonStatus() : false
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
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onSubmit={handleConfirm}
        type={confirmationType}
      />
    </>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default CleaningMaterialDetailModal;
