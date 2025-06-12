import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Field from "../../common/Field";
import DropdownField from "../../common/DropdownField";
import FileUploader from "../../common/FileUploader";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { EQUIPMENT_OPERATIONS } from "../../common/utils";
import axios from "../../../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../../modals/ConfirmationModal";
import EquipmentPrintModal from "../../modals/EquipmentPrintModal";

const EquipmentEditForm = ({
  id,
  totalCleaningJobs = 0,
  totalMaintJobs = 0,
  onChildSelect,
  onPrint,
}) => {
  const navigate = useNavigate();

  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [imageLocation, setImageLocation] = useState(null);
  const [selectedCleaning, setSelectedCleaning] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState("update");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [openEquipmentPrint, setOpenEquipmentPrint] = useState(false);

  const equipmentSchema = yup.object().shape({
    Name: yup.string().required("Name is required"),
    Description: yup.string().required("Description is required"),
    Manufacturer: yup.string().required("Manufacturer is required"),
    Model_Number: yup.string().required("Model Number is required"),
    Serial_Number: yup.string().required("Serial Number is required"),
    Purchase_Date: yup.date().required("Purchase Date is required"),
    Warranty_Date: yup.date().required("Warranty Date is required"),
    Last_Maint_Date: yup.date().nullable(),
    Equipment_TypeID: yup
      .number()
      .integer()
      .required("Equipment Type ID is required"),
    Equipment_BarCode: yup.string().required("Operational Status is required"),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(equipmentSchema),
    defaultValues: {
      Name: "",
      Equipment_BarCode: "",
      Description: "",
      Manufacturer: "",
      Model_Number: "",
      Serial_Number: "",
      Purchase_Date: new Date(),
      Warranty_Date: new Date(),
      Last_Maint_Date: new Date(),
      Equipment_TypeID: null,
      Operational_Status: EQUIPMENT_OPERATIONS[0],
    },
    mode: "onChange",
  });

  const formHandler = (data) => {
    setConfirmationType("equipmentupdate");
    setFormData(data);
    setOpenConfirmation(true);
  };

  const onSubmit = useCallback(() => {
    if (confirmationType === "equipmentupdate") {
      axios
        .put(`/equipments/${id}`, {
          ...formData,
          Image_Location: imageLocation,
        })
        .then((res) => {
          toast.success(`Equipment Updated Successfully`);
          navigate(-1);
        })
        .catch((err) => {
          console.error(err);
          toast.error(`Failed to Update Equipment!`);
        });
    } else {
      resetFormData();
    }
  }, [confirmationType, formData, id, imageLocation, navigate]);

  const handleCancel = () => {
    if (isDirty || isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      navigate(-1);
    }
  };

  const handlePrintBarcode = () => {
    setOpenEquipmentPrint(true);
  };

  const resetFormData = () => {
    getEquipmentByID(id);
    setOpenConfirmation(false);
    setIsUpdated(false);
  };

  const getEquipmentByID = (id) => {
    axios
      .get(`/equipments/${id}`)
      .then((res) => {
        const info = res.data.data;
        reset({
          Name: info.Name,
          Description: info.Description,
          Equipment_BarCode: info.Equipment_BarCode,
          Manufacturer: info.Manufacturer,
          Model_Number: info.Model_Number,
          Serial_Number: info.Serial_Number,
          Purchase_Date: info.Purchase_Date,
          Warranty_Date: info.Warranty_Date,
          Equipment_TypeID: info.Equipment_TypeID,
          Operational_Status: info.Operational_Status,
        });
        setEquipment(info);
        setImageLocation(info.Image_Location);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getEquipmentByID(id);
  }, [id, reset]);

  useEffect(() => {
    axios.get("/equipmentTypes").then((res) => {
      const equipmentData = res.data.data.data;
      setEquipmentTypes(equipmentData);
    });
  }, []);

  return (
    <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-BtnBg">Equipment Details</h2>
        <FileUploader
          bgColor="#A1DAB4"
          defaultValue={imageLocation}
          setter={(path) => {
            setIsUpdated(true);
            setImageLocation(path);
          }}
        />
      </div>
      <div className="border-b-2 border-gray-200 mt-4 mb-6"></div>
      <form onSubmit={handleSubmit(formHandler)} className="space-y-6">
        <Field
          label="Name"
          name="Name"
          placeholder="Enter Name"
          control={control}
          error={errors.name}
          className="grid grid-cols-3 gap-4"
        />
        <Field
          label="Description"
          name="Description"
          placeholder="Enter description"
          control={control}
          error={errors.Description}
          className="grid grid-cols-3 gap-4"
        />
        <Field
          label="Equipment Barcode"
          name="Equipment_BarCode"
          placeholder="Enter Barcode"
          control={control}
          error={errors.Equipment_BarCode}
          className="grid grid-cols-3 gap-4"
        />
        <Field
          label="Manufacturer"
          name="Manufacturer"
          placeholder="Enter manufacturer"
          control={control}
          error={errors.Manufacturer}
          className="grid grid-cols-3 gap-4"
        />
        <Field
          label="Model Number"
          name="Model_Number"
          placeholder="Enter model number"
          control={control}
          error={errors.Model_Number}
          className="grid grid-cols-3 gap-4"
        />
        <Field
          label="Serial Number"
          name="Serial_Number"
          placeholder="Enter serial number"
          control={control}
          error={errors.Serial_Number}
          className="grid grid-cols-3 gap-4"
        />
        <Field
          label="Purchase Date"
          name="Purchase_Date"
          type="date"
          control={control}
          error={errors.Purchase_Date}
          className="grid grid-cols-3 gap-4"
        />
        <Field
          label="Warranty Date"
          name="Warranty_Date"
          type="date"
          control={control}
          error={errors.Warranty_Date}
          className="grid grid-cols-3 gap-4"
        />
        <div className="grid grid-cols-3 gap-4 items-center">
          <label className="text-gray-700">Next Cleaning Date</label>
          <Button
            variant="contained"
            color={selectedCleaning ? "success" : "primary"}
            className="ml-4"
            onClick={() => {
              setSelectedCleaning(true);
              onChildSelect(true);
            }}
          >
            {selectedCleaning ? "SELECTED" : `${totalCleaningJobs} contacts`}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <label className="text-gray-700">
            Next Maint Date<span className="text-red-700">*</span>
          </label>
          <Button
            variant="contained"
            color={!selectedCleaning ? "success" : "primary"}
            className="ml-4"
            onClick={() => {
              setSelectedCleaning(false);
              onChildSelect(false);
            }}
          >
            {!selectedCleaning ? "SELECTED" : `${totalMaintJobs} contacts`}
          </Button>
        </div>
        <Field
          label="Last Maint Date"
          name="Last_Maint_Date"
          type="date"
          control={control}
          error={errors.Last_Maint_Date}
          className="grid grid-cols-3 gap-4"
        />
        <DropdownField
          label="Equipment Type"
          name="Equipment_TypeID"
          control={control}
          error={errors.Equipment_TypeID}
          options={equipmentTypes}
          optionKey="Equipment_TypeID"
          optionValue="Equipment_Description"
          className="grid grid-cols-3 gap-4"
        />
        <DropdownField
          label="Operation Status"
          name="Operational_Status"
          control={control}
          error={errors.Operational_Status}
          options={EQUIPMENT_OPERATIONS}
          className="grid grid-cols-3 gap-4"
        />
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className={`py-2 px-4 text-white rounded-md ${!(equipment && equipment.Equipment_BarCode)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-BtnBg"
              }`}
            disabled={!(equipment && equipment.Equipment_BarCode)}
            onClick={handlePrintBarcode}
          >
            Print Barcode
          </button>
          <div className="flex space-x-4">
            <button
              type="button"
              className="py-2 px-4 bg-BtnBg text-white rounded-md "
              onClick={handleCancel}
            >
              {isDirty || isUpdated ? "Cancel" : "Go Back"}
            </button>
            <button
              type="submit"
              className={`py-2 px-4 rounded-md text-white ${!(isDirty || isUpdated)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-BtnBg"
                }`}
              disabled={!(isDirty || isUpdated)}
            >
              Update
            </button>
          </div>
        </div>
      </form>

      <ConfirmationModal
        type={confirmationType}
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onSubmit={onSubmit}
      />

      {openEquipmentPrint && equipment && equipment.Equipment_BarCode && (
        <EquipmentPrintModal
          open={openEquipmentPrint}
          onClose={() => setOpenEquipmentPrint(false)}
          item={equipment}
        />
      )}
    </div>
  );
};

export default EquipmentEditForm;
