import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";

import axios from "../../../api";
import TextInput from "../../../components/common/TextInput";
import DollarInput from "../../../components/common/DollarInput";
import SearchableField from "../../../components/common/SearchableField";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import AsyncMultiSelect from "../../../components/common/AsyncMultiSelect";
import FileUploader from "../../../components/common/FileUploader";

const RejectedInventoriesDelete = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [imageLocation, setImageLocation] = useState(null);
  const [inventoryName, setInventoryName] = useState(null);
  const [vendorDefault, setVendorDefault] = useState(null);
  const [inventoryTypeDefault, setInventoryTypeDefault] = useState(null);
  const [container] = useState("pallete");
  const [quantity, setQuantity] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [rejectedReason, setRejectedReason] = useState("");
  const [lotNumID, setLotNumID] = useState(null);

  const [productQuestions, setProductQuestions] = useState([]);

  const [confirmationType, setConfirmationType] = useState("delete");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const formHandler = () => {
    setConfirmationType("delete");
    setOpenConfirmation(true);
  };

  const { id } = location.state || {};

  const inventorySchema = yup.object().shape({
    Description: yup.string().required("Description is required"),
    SKU_Number: yup.string().required("SKU Number is required"),
    Date_Received: yup
      .date()
      .required("Received Date is required")
      .typeError("Invalid date"),
    Unit_Price: yup.number().required("Unit Price is required"),
  });

  const { control, reset, handleSubmit, watch } = useForm({
    resolver: yupResolver(inventorySchema),
    defaultValues: {
      Description: "",
      SKU_Number: "",
      Date_Received: new Date(),
      Unit_Price: 0,
    },
    mode: "onChange",
  });

  const unitPrice = watch("Unit_Price");

  useEffect(() => {
    const calculateSubTotal = () => {
      setSubTotal((quantity || 0) * (unitPrice || 0));
    };

    calculateSubTotal();
  }, [quantity, unitPrice]);

  const onSubmit = useCallback(() => {
    if (confirmationType === "delete") {
      axios
        .delete(`/rejected-inventories/${id}`)
        .then((res) => {
          toast.error("Inventory Deleted Successfully");
          navigate(-1);
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            err.response?.data?.errorMessage || "internal server error"
          );
        });
    } else {
      navigate(-1);
    }
  }, [confirmationType, id, navigate]);

  const handleCancel = () => {
    setConfirmationType("cancel");
    setOpenConfirmation(true);
  };

  const getSearchableList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(
        `/rejected-inventories/names?keyword=${keyword}&size=5`
      );
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          id: item.InventoryID,
          name: item.Name,
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
      const res = await axios.get(`/vendors?keyword=${inputValue}`);
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

  const fetchInventoryTypes = async (inputValue) => {
    try {
      const res = await axios.get(`/inventory_types?keyword=${inputValue}`);
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

  const isDelete = true;

  useEffect(() => {
    if (id) {
      axios
        .get(`/rejected-inventories/${id}`)
        .then((res) => {
          const info = res.data.data;
          reset({
            Description: info.Description,
            SKU_Number: info.SKU_Number,
            Date_Received: info.Date_Received,
            Unit_Price: info.Unit_Price,
          });
          setImageLocation(info.Image_Location);
          setInventoryName(info.Name);
          setQuantity(info.Unit_Qty);
          setVendorDefault(info.Vendor);
          setInventoryTypeDefault(info.Inventory_Type);
          setLotNumID(info.Lot_NumID);

          setProductQuestions(
            info.Product_Questions?.sort(
              (el1, el2) => el1.Arrange - el2.Arrange
            ).map((item) =>
              item.Question === "temp of product"
                ? {
                    ...item,
                    Answer: parseFloat(
                      item.Answer.replace("F", "").replace("C", "")
                    ),
                  }
                : item
            )
          );
          setRejectedReason(info.Rejected_Reason);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [id, reset]);

  return (
    <div className="p-5">
      <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            Rejected Inventory Details
          </h2>
          <FileUploader
            bgColor="#A1DAB4"
            defaultValue={imageLocation}
            setter={setImageLocation}
            disabled={isDelete}
          />
        </div>
        <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
        <form
          onSubmit={handleSubmit(formHandler)}
          className="grid grid-cols-3 gap-4"
        >
          <label className="text-gray-700 self-center">
            Name<span className="text-red-700">*</span>
          </label>
          <SearchableField
            fetchData={getSearchableList}
            defaultValue={inventoryName}
            onInputChange={setInventoryName}
            onSelect={setInventoryName}
            placeholder="Name"
            className="col-span-2"
            disabled={isDelete}
          />
          {!inventoryName && (
            <p className="text-red-500 col-span-3">
              Inventory Name is required
            </p>
          )}

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
                disabled={isDelete}
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
            defaultValue={vendorDefault}
            buttonLabel="off"
            placeholder="Type to search vendor..."
            disabled={isDelete}
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
                disabled={isDelete}
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
            defaultValue={inventoryTypeDefault}
            buttonLabel="off"
            placeholder="Type to search inventory type..."
            disabled={isDelete}
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
                disabled={isDelete}
              />
            )}
          />

          <label className="text-gray-700 self-center">Lot Number ID</label>

          <TextInput
            type="text"
            className="col-span-2"
            value={`Lot-${String(lotNumID).padStart(8, "0")}`}
            placeholder="Not Assigned"
            disabled={true}
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
                disabled={isDelete}
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
              <div>Question</div>
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
                  <div className="text-[#4B5563]">
                    {`${question.Question.trim()
                      .charAt(0)
                      .toUpperCase()}${question.Question.trim().slice(1)}`}
                    <span className="text-red-700">*</span>
                    {question.Question === "quantity"
                      ? container === "flat"
                        ? " (flats)"
                        : " (lbs)"
                      : ""}
                  </div>
                  <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                    {question.Type === "float" ? (
                      <div className="flex border border-[rgba(0,0,0,0.23)] rounded-lg">
                        <input
                          type="number"
                          step="any"
                          className="flex-1  rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                          placeholder={
                            question.Question === "temp of product"
                              ? `0.0`
                              : question.Question === "quantity"
                              ? container === "flat"
                                ? "0.0"
                                : "0.0"
                              : question.Value
                          }
                          value={question.Answer || ""}
                          disabled={true}
                        />
                        <div className="flex justify-center items-center w-10 border-l rounded-r-lg">
                          {question.Question === "quantity"
                            ? container === "flat"
                              ? "flats"
                              : "lbs"
                            : question.Value}
                        </div>
                      </div>
                    ) : question.Type === "boolean" ? (
                      <RadioGroup row value={question.Answer || ""}>
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="True"
                          disabled={true}
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="False"
                          disabled={true}
                        />
                      </RadioGroup>
                    ) : question.Type === "list" ? (
                      <Select
                        value={question.Answer || ""}
                        displayEmpty
                        fullWidth
                        size="small"
                        disabled={true}
                      >
                        {(question.Value || "")
                          .split("/")
                          .map((option, idx) => (
                            <MenuItem key={idx} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                      </Select>
                    ) : question.Type === "string" ? (
                      <textarea
                        type="text"
                        required={true}
                        maxLength={256}
                        className="w-full rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] border border-[rgba(0,0,0,0.23)] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                        value={question.Answer || ""}
                        disabled={true}
                      />
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
            {rejectedReason && (
              <Box
                sx={{
                  bgcolor: "#F3F4F6",
                  borderRadius: 2,
                  py: 2,
                  px: 3,
                  mb: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <div className="col-span-2 text-[#4B5563]">Rejected Reason</div>
                <div className="col-span-2 text-[#4B5563]">
                  <textarea
                    type="text"
                    className="w-full rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] border border-[rgba(0,0,0,0.23)] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                    value={rejectedReason || ""}
                    onChange={(e) => {
                      setRejectedReason(e.target.value);
                    }}
                    disabled={true}
                  />
                </div>
              </Box>
            )}
          </div>

          <div className="col-span-3 flex justify-end mt-3">
            <button
              type="button"
              className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="py-2 px-6 md:px-16 ml-7 text-center text-white rounded-xl min-w-36 capitalize bg-red-500"
            >
              Delete
            </button>
          </div>
        </form>

        <ConfirmationModal
          type={confirmationType}
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default RejectedInventoriesDelete;
