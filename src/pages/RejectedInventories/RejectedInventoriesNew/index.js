import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../../components/common/TextInput";
import DollarInput from "../../../components/common/DollarInput";
import SearchableField from "../../../components/common/SearchableField";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import AsyncMultiSelect from "../../../components/common/AsyncMultiSelect";
import FileUploader from "../../../components/common/FileUploader";
import {
  Box,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";

const RejectedInventoriesNew = () => {
  const navigate = useNavigate();

  const [imageLocation, setImageLocation] = useState("");
  const [inventory, setInventory] = useState("");
  const [vendor, setVendor] = useState("");
  const [inventoryType, setInventoryType] = useState("");
  const [lotNumID, setLotNumID] = useState("");
  const [container, setContainer] = useState("pallete");
  const [quantity, setQuantity] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  const [productQuestions, setProductQuestions] = useState([]);

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState("cancel");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const inventorySchema = yup.object().shape({
    Description: yup.string().required("Description is required"),
    SKU_Number: yup.string().required("SKU Number is required"),
    Date_Received: yup
      .date()
      .required("Received Date is required")
      .typeError("Invalid date"),
    Unit_Price: yup.number().required("Unit Price is required"),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(inventorySchema),
    defaultValues: {
      Description: "",
      SKU_Number: "",
      Date_Received: new Date(),
      Unit_Price: 0,
    },
    mode: "onChange",
  });

  const description = watch("Description");
  const unitPrice = watch("Unit_Price");

  useEffect(() => {
    const calculateSubTotal = () => {
      setSubTotal((quantity || 0) * (unitPrice || 0));
    };

    calculateSubTotal();
  }, [quantity, unitPrice]);

  const onSubmit = useCallback(
    (data) => {
      axios
        .post("/rejected-inventories", {
          Name:
            inventory && inventory.Inventory_name
              ? inventory.Inventory_name
              : inventory,
          Description: data.Description,
          VendorID: vendor ? vendor.VendorID : null,
          SKU_Number: data.SKU_Number,
          Inventory_TypeID: inventoryType
            ? inventoryType.Inventory_TypeID
            : null,
          Date_Received: data.Date_Received,
          Lot_NumID: lotNumID ? lotNumID.Lot_NumID : null,
          Unit_Price: data.Unit_Price,
          Image_Location: imageLocation,
          Product_Questions: productQuestions,
        })
        .then((res) => {
          toast.success("New Inventory Created Successfully");
          navigate(-1);
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            err.response?.data?.errorMessage || "internal server error"
          );
        });
    },
    [
      imageLocation,
      inventory,
      inventoryType,
      lotNumID,
      navigate,
      productQuestions,
      vendor,
    ]
  );

  const handleCancel = () => {
    if (isDirty || isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      navigate(-1);
    }
  };

  const getSearchableList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(`/inventories/selector?keyword=${keyword}`);
      if (res.status === 200) {
        let list = res.data.data;
        list = list.map((item) => ({
          id: item.InventoryID,
          name: item.Inventory_Name,
          Description: item.Description,
          Inventory_TypeID: item.Inventory_TypeID,
          Inventory_Type: item.Inventory_Type,
          Image_Location: item.Image_Location,
        }));
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  const fetchVendors = async (inputValue) => {
    try {
      const res = await axios.get(
        `/vendors/product?inventoryID=${inventory.id}&keyword=${inputValue}`
      );
      if (res.status === 200) {
        console.log("vendor name=>", res)
        if (res.data.data) {
          return res.data.data.map((item) => ({
            ...item,
            id: item.VendorID,
            name: item.Vendor_Name,
          }));
        }
      } else {
        return [];
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchInventoryTypes = async (inputValue) => {
    try {
      const res = await axios.get(`/inventory-types?keyword=${inputValue}`);
      if (res.status === 200) {
        return res.data.data.data;
      } else {
        return [];
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchLotNumbers = async (inputValue) => {
    try {
      const res = await axios.get(`/lot-numbers?keyword=${inputValue}`);
      if (res.status === 200) {
        return res.data.data.data;
      } else {
        return [];
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const handleInputChange = (index, value) => {
    let tmp = [...productQuestions];
    tmp[index].Answer = value;
    setProductQuestions(tmp.sort((el1, el2) => el1.Arrange - el2.Arrange));
    setIsUpdated(true);
  };

  return (
    <div className="p-5">
      <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            Rejected Inventory Details
          </h2>
          <FileUploader
            bgColor="#A1DAB4"
            setter={(path) => {
              setIsUpdated(true);
              setImageLocation(path);
            }}
          />
        </div>
        <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <label className="text-gray-700 self-center">
            Name<span className="text-red-700">*</span>
          </label>
          <SearchableField
            fetchData={getSearchableList}
            defaultValue={
              inventory && inventory.Inventory_name
                ? inventory.Inventory_name
                : inventory
            }
            onChange={(value) => {
              setIsUpdated(true);
              if (typeof value === "string") {
                setInventory(value);
              } else {
                setInventory(value);
                setInventoryType(value.Inventory_Type);
                reset({
                  Description: value.Description,
                });
              }
            }}
            placeholder="Name"
            className="col-span-2"
            error={!inventory}
          />

          <label className="text-gray-700 self-center">
            Description<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Description"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="Description"
                error={!!errors.Description}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            Vendor Name<span className="text-red-700">*</span>
          </label>
          <AsyncMultiSelect
            className="col-span-2"
            multiple={false}
            fetchOptions={fetchVendors}
            displayField="Vendor_Name"
            onSelect={(value) => {
              setIsUpdated(true);
              setVendor(value);
              reset({
                Description: description,
                SKU_Number: value?.SKU_Number,
                Unit_Price: value?.Unit_Price,
              });
              setProductQuestions(
                value?.Product_Questions?.sort(
                  (el1, el2) => el1.Arrange - el2.Arrange
                )
              );
            }}
            buttonLabel="off"
            placeholder="Type to search vendor..."
            error={!vendor}
            disabled={!inventory}
          />

          <label className="text-gray-700 self-center">
            SKU Number<span className="text-red-700">*</span>
          </label>
          <Controller
            name="SKU_Number"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="SKU Number"
                error={errors.SKU_Number}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            Inventory Type<span className="text-red-700">*</span>
          </label>
          <AsyncMultiSelect
            className="col-span-2"
            multiple={false}
            fetchOptions={fetchInventoryTypes}
            displayField="Inventory_Type"
            defaultValue={inventoryType}
            onSelect={(value) => {
              setIsUpdated(true);
              setInventoryType(value);
            }}
            buttonLabel="off"
            placeholder="Type to search inventory type..."
            error={!inventoryType}
          />

          <label className="text-gray-700 self-center">
            Date Received<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Date_Received"
            control={control}
            render={({ field }) => (
              <TextInput
                type="date"
                className="col-span-2"
                {...field}
                placeholder="MM/DD/YYYY"
                error={errors.Date_Received}
              />
            )}
          />

          <label className="text-gray-700 self-center">Lot Number ID</label>
          <AsyncMultiSelect
            className="col-span-2"
            multiple={false}
            fetchOptions={fetchLotNumbers}
            displayField="Lot_NumID"
            onSelect={(value) => {
              setIsUpdated(true);
              setLotNumID(value);
            }}
            placeholder="Type to search lot number..."
            buttonLabel="off"
          />

          <label className="text-gray-700 self-center">
            Unit Price<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Unit_Price"
            control={control}
            render={({ field }) => (
              <DollarInput
                className="col-span-2"
                {...field}
                placeholder="$0.00"
                error={!!errors.Unit_Price}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            Sub total Price<span className="text-red-700">*</span>
          </label>
          <DollarInput
            className="col-span-2"
            placeholder="$0.00"
            value={parseFloat(subTotal).toFixed(2)}
            disabled={true}
          />

          <h4 className="col-span-3 text-BtnBg font-semibold text-xl">
            Questions
          </h4>

          <div className="flex flex-col col-span-3">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                bgcolor: "#E2E8F0",
                borderRadius: 2,
                py: 2,
                px: 3,
                mb: 2,
                color: "#143664",
                fontWeight: "bold",
              }}
            >
              <div className="pl-4">Question</div>
              <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                Answer
              </div>
            </Box>
            {productQuestions && productQuestions.length > 0 ? (
              productQuestions.map((question, index) => (
                <Box
                  key={index}
                  sx={{
                    bgcolor: "#F3F4F6",
                    borderRadius: 2,
                    py: 2,
                    px: 3,
                    mb: 2,
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    alignItems: "center",
                  }}
                >
                  <div className="text-[#4B5563] pl-4">
                    {question.Question}
                    <span className="text-red-700">*</span>
                    {question.Question === "quantity"
                      ? container === "flat"
                        ? " (flats)"
                        : " (lbs)"
                      : ""}
                  </div>
                  <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                    {question.Type === "float" ? (
                      <input
                        type="number"
                        step="any"
                        className="w-full rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] border border-[rgba(0,0,0,0.23)] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                        placeholder={
                          question.Question === "quantity"
                            ? container === "flat"
                              ? "flats"
                              : "lbs"
                            : question.Value
                        }
                        value={question.Answer || ""}
                        onChange={(e) => {
                          handleInputChange(index, e.target.value);
                          if (question.Question === "quantity")
                            setQuantity(e.target.value);
                        }}
                      />
                    ) : question.Type === "boolean" ? (
                      <RadioGroup
                        row
                        value={question.Answer || ""}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="True"
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="False"
                        />
                      </RadioGroup>
                    ) : question.Type === "list" ? (
                      <Select
                        value={question.Answer || ""}
                        onChange={(e) => {
                          handleInputChange(index, e.target.value);
                          if (question.Question === "container")
                            setContainer(e.target.value);
                        }}
                        displayEmpty
                        fullWidth
                        size="small"
                      >
                        {(question.Value || "")
                          .split("/")
                          .map((option, idx) => (
                            <MenuItem key={idx} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                      </Select>
                    ) : (
                      question.Value
                    )}
                  </div>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  bgcolor: "#F3F4F6",
                  borderRadius: 2,
                  py: 2,
                  px: 3,
                  mb: 3,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 2fr 1fr auto",
                  alignItems: "center",
                  gap: 2,
                  whiteSpace: "nowrap",
                }}
              >
                No Questions
              </Box>
            )}
          </div>

          <div className="col-span-3 flex justify-end mt-3">
            <button
              type="button"
              className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36"
              onClick={handleCancel}
            >
              {!isValid ||
                !vendor ||
                !inventoryType ||
                productQuestions.filter((item) => !item.Answer).length > 0
                ? "Go Back"
                : "Cancel"}
            </button>
            <button
              type="submit"
              className={`py-2 px-6 md:px-16 ml-7 text-center text-white rounded-xl min-w-36 capitalize ${!isValid ||
                !vendor ||
                !inventoryType ||
                productQuestions.filter((item) => !item.Answer).length > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-BtnBg"
                }`}
              disabled={
                !isValid ||
                !vendor ||
                !inventoryType ||
                productQuestions.filter((item) => !item.Answer).length > 0
              }
            >
              Add
            </button>
          </div>
        </form>
        <ConfirmationModal
          type={confirmationType}
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onSubmit={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default RejectedInventoriesNew;
