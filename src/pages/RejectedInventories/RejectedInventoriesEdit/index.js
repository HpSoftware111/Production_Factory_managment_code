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
import { convertTemperature } from "../../../utils/tempUtils";

const RejectedInventoriesEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [imageLocation, setImageLocation] = useState(null);
  const [inventoryName, setInventoryName] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [inventoryType, setInventoryType] = useState(null);
  const [container, setContainer] = useState("pallete");
  const [quantity, setQuantity] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [rejectedReason, setRejectedReason] = useState("");
  const [receiveReason, setReceiveReason] = useState("");
  const [returningReason, setReturningReason] = useState("");
  const [inventoryID, setInventoryID] = useState(null);

  const [productQuestions, setProductQuestions] = useState([]);

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState("update");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openReturnConfirmation, setOpenReturnConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errorList, setErrorList] = useState([]);
  const [lotNumID, setLotNumID] = useState(null);

  const [tempUnit, setTempUnit] = useState("F");

  const handleTempUnitChange = (event) => {
    setTempUnit(event.target.value);
  };

  const formHandler = (data) => {
    setConfirmationType("update");
    setFormData(data);
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

  const {
    control,
    reset,
    handleSubmit,
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

  const unitPrice = watch("Unit_Price");

  useEffect(() => {
    setSubTotal((quantity || 0) * (unitPrice || 0));
  }, [quantity, unitPrice]);

  const onSubmit = useCallback(() => {
    console.log(id, errorList.length);
    if (confirmationType === "update") {
      if (errorList.length > 0) {
        axios
          .put(`/rejected-inventories/${id}`, {
            Name: inventoryName.name ? inventoryName.name : inventoryName,
            Description: formData ? formData.Description : null,
            VendorID: vendor ? vendor.VendorID : null,
            SKU_Number: formData ? formData.SKU_Number : null,
            Inventory_TypeID: inventoryType
              ? inventoryType.Inventory_TypeID
              : null,
            Date_Received: formData ? formData.Date_Received : null,
            Lot_NumID: lotNumID,
            Unit_Price: formData ? formData.Unit_Price : null,
            Image_Location: imageLocation,
            Product_Questions: productQuestions.map((item) =>
              item.Question === "temp of product"
                ? {
                    ...item,
                    Answer: `${item.Answer}${tempUnit}`,
                  }
                : item
            ),
            Notes: rejectedReason,
          })
          .then((res) => {
            toast.success("Inventory Updated Successfully");
            navigate(-1);
          })
          .catch((err) => {
            console.error(err);
            toast.error(
              err.response?.data?.errorMessage || "internal server error"
            );
          });
      } else {
        setOpenConfirmation(false);
        setOpenReturnConfirmation(true);
      }
    } else {
      // navigate(-1);
      resetData();
    }
  }, [
    confirmationType,
    errorList.length,
    formData,
    id,
    imageLocation,
    inventoryName,
    inventoryType,
    lotNumID,
    navigate,
    productQuestions,
    rejectedReason,
    receiveReason,
    tempUnit,
    vendor,
  ]);

  const handleCancel = () => {
    if (isDirty || isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      navigate(-1);
    }
  };

  const resetData = () => {
    getRejectedInventoryByID(id);
    setOpenConfirmation(false);
    setIsUpdated(false);
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

  const inventoryNameChangeHandler = useCallback(
    (value) => {
      if (inventoryName !== value) {
        setInventoryName(value);
        setIsUpdated(true);
      }
    },
    [inventoryName]
  );

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

  const handleInputChange = (index, value) => {
    let tmp = [...productQuestions];
    tmp[index].Answer = value;
    setProductQuestions(tmp.sort((el1, el2) => el1.Arrange - el2.Arrange));
    setIsUpdated(true);
  };

  const returnHandler = useCallback(() => {
    axios
      .post("/inventory-children", {
        VendorID: vendor ? vendor.VendorID : null,
        Vendor: vendor,
        InventoryID: inventoryID,
        SKU_Number: formData ? formData.SKU_Number : "",
        Date_Received: formData ? formData.Date_Received : null,
        Lot_NumID: formData ? formData.Lot_NumID : null,
        Unit_Price: formData ? formData.Unit_Price : null,
        Product_Questions: productQuestions.map((item) =>
          item.Question === "temp of product"
            ? {
                ...item,
                Answer: `${item.Answer}${tempUnit}`,
              }
            : item
        ),
        Notes: returningReason,
      })
      .then(async (res) => {
        await axios.delete(`/rejected-inventories/${id}`);
        toast.success("Rejected Inventory returned successfully");
        setOpenConfirmation(false);
        navigate(-1);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err.response?.data?.errorMessage || "internal server error"
        );
        setOpenConfirmation(false);
        setOpenReturnConfirmation(false);
      });
  }, [
    formData,
    id,
    inventoryID,
    navigate,
    productQuestions,
    returningReason,
    tempUnit,
    vendor,
  ]);

  useEffect(() => {
    getRejectedInventoryByID(id);
  }, [id, reset]);

  const getRejectedInventoryByID = (id) => {
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
          setRejectedReason(info.Lot_Number?.Quality_Notes);
          setVendor(info.Vendor);
          setLotNumID(info.Lot_NumID);
          setInventoryID(info.InventoryID);
          setInventoryType(info.Inventory_Type);
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
          setTempUnit(
            info.Product_Questions.find(
              (item) => item.Question === "temp of product"
            ).Answer.includes("C")
              ? "C"
              : "F"
          );

          let tmp = [];
          info.Product_Questions.forEach((qu) => {
            if (
              qu.Question === "temp of product" &&
              parseFloat(qu.Answer) > 33
            ) {
              tmp.push({
                type: "temp of product",
                msg: "The product temperature exceeds the allowed limit!",
              });
            }

            const questions = {
              quality: "Quality check failed!",
              receive: "Receiving process unsuccessful!",
            };
            if (qu.Type === "boolean" && qu.Answer === "false") {
              tmp.push({
                type: qu.Question,
                msg: questions[qu.Question],
              });
            }
          });
          setErrorList(tmp);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleTempertureChange = (question) => {
    let fTemp = 0.0;
    let cTemp = 0.0;
    let value = parseFloat(question.Answer);
    console.log("value", value);
    if (question.Value === "F") {
      fTemp = value;
      cTemp = convertTemperature(value, "F");
    } else {
      cTemp = value;
      fTemp = convertTemperature(value, "C");
    }

    let tmp = [...productQuestions];
    tmp.forEach((item) => {
      if (item.Question === "temp of product") {
        if (question.Value === "F" && item.Value == "C") {
          item.Answer = `${cTemp}`;
        } else if (question.Value === "C" && item.Value == "F") {
          item.Answer = `${fTemp}`;
        }
      }
    });
    setProductQuestions(tmp);
    setIsUpdated(true);

    if (fTemp > 33) {
      setErrorList([
        ...errorList.filter((item) => item.type !== "temp of product"),
        {
          type: "temp of product",
          msg: "The product temperature exceeds the allowed limit!",
        },
      ]);
    } else {
      setErrorList(errorList.filter((item) => item.type !== "temp of product"));
    }
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
            defaultValue={imageLocation}
            setter={(path) => {
              setIsUpdated(true);
              setImageLocation(path);
            }}
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
            onChange={inventoryNameChangeHandler}
            placeholder="Name"
            className="col-span-2"
            error={!inventoryName}
            disabled={true}
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
                disabled={true}
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
            defaultValue={vendor}
            onSelect={(value) => {
              setVendor(value);
              setIsUpdated(true);
            }}
            buttonLabel="off"
            placeholder="Type to search vendor..."
            error={!vendor}
            disabled={true}
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
                error={!!errors.SKU_Number}
                disabled={true}
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
              setInventoryType(value);
              setIsUpdated(true);
            }}
            buttonLabel="off"
            placeholder="Type to search inventory type..."
            error={!inventoryType}
            disabled={true}
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
                error={!!errors.Date_Received}
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
                error={!!errors.Unit_Price}
                disabled={true}
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
                          className="flex-1 rounded-l-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                          placeholder={
                            question.Question === "temp of product"
                              ? tempUnit
                              : question.Question === "quantity"
                              ? container === "flat"
                                ? "flats"
                                : "lbs"
                              : question.Value
                          }
                          value={question.Answer || ""}
                          onChange={(e) => {
                            handleInputChange(index, e.target.value);
                            if (question.Question === "quantity") {
                              setQuantity(e.target.value);
                            } else if (
                              question.Question === "temp of product"
                            ) {
                              handleTempertureChange(question, e.target.value);
                            }
                          }}
                        />
                        {/* {question.Question === "temp of product" ? (
                          <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={tempUnit}
                            onChange={handleTempUnitChange}
                            className="flex"
                          >
                            <FormControlLabel
                              value="F"
                              control={<Radio />}
                              label="F"
                            />
                            <FormControlLabel
                              value="C"
                              control={<Radio />}
                              label="C"
                            />
                          </RadioGroup>
                        ) : ( */}

                        <div className="flex justify-center items-center w-10 border-l rounded-r-lg">
                          {question.Question === "quantity"
                            ? container === "flat"
                              ? "flats"
                              : "lbs"
                            : question.Value}
                        </div>
                        {/* )} */}
                      </div>
                    ) : question.Type === "boolean" ? (
                      <RadioGroup
                        row
                        value={question.Answer || ""}
                        onChange={(e) => {
                          handleInputChange(index, e.target.value);

                          const questions = {
                            quality: "Quality check failed!",
                            receive: "Receiving process unsuccessful!",
                          };

                          if (e.target.value === "false") {
                            setErrorList([
                              ...errorList.filter(
                                (item) => item.type !== question.Question
                              ),
                              {
                                type: question.Question,
                                msg: questions[question.Question],
                              },
                            ]);
                          } else {
                            setErrorList(
                              errorList.filter(
                                (item) => item.type !== question.Question
                              )
                            );
                          }
                        }}
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
                    ) : question.Type === "string" ? (
                      <div className="col-span-2 text-[#4B5563]">
                        <textarea
                          type="text"
                          required={true}
                          maxLength={255}
                          className="w-full rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] border border-[rgba(0,0,0,0.23)] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                          value={question.Answer || ""}
                          onChange={(e) => {
                            handleInputChange(index, e.target.value);
                            if (question.Question === "quality notes") {
                              setRejectedReason(e.target.value);
                            } else if (question.Question === "receive notes") {
                              setReceiveReason(e.target.value);
                            }
                          }}
                          disabled={false}
                        />
                        {question.Answer.length > 254 && (
                          <p className="mt-2 text-red-600 col-span-2">
                            {`${question.Question.charAt(
                              0
                            ).toUpperCase()}${question.Question.slice(
                              1
                            )} should be less than 255 characters`}
                          </p>
                        )}
                      </div>
                    ) : (
                      question.Value
                    )}
                  </div>
                  {errorList.filter((item) => item.type === question.Question)
                    .length > 0 ? (
                    <p className="mt-2 text-red-600 col-span-2">
                      {
                        errorList.find((el) => el.type === question.Question)
                          .msg
                      }
                    </p>
                  ) : (
                    <></>
                  )}
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
            {/* {rejectedReason && (
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
                      setIsUpdated(true);
                      setRejectedReason(e.target.value);
                    }}
                  />
                </div>
              </Box>
            )} */}
            {errorList.length === 0 && (
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
                <div className="col-span-2 text-[#4B5563]">
                  Returning Reason
                </div>
                <div className="col-span-2 text-[#4B5563]">
                  <textarea
                    type="text"
                    className="w-full rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] border border-[rgba(0,0,0,0.23)] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                    value={returningReason || ""}
                    onChange={(e) => {
                      setReturningReason(e.target.value);
                    }}
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
              {!isValid ||
              !vendor ||
              !inventoryType ||
              productQuestions.filter((item) => !item.Answer).length > 0 ||
              (!isDirty && !isUpdated)
                ? "Go Back"
                : "Cancel"}
            </button>

            <button
              type="submit"
              className={`py-2 px-6 md:px-16 ml-7 text-center text-white rounded-xl min-w-36 capitalize ${
                !isValid ||
                !vendor ||
                !inventoryType ||
                productQuestions.filter((item) => !item.Answer).length > 0 ||
                (!isDirty && !isUpdated)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-BtnBg"
              }`}
              disabled={
                !isValid ||
                !vendor ||
                !inventoryType ||
                productQuestions.filter((item) => !item.Answer).length > 0 ||
                (!isDirty && !isUpdated)
              }
            >
              Update
            </button>
          </div>
        </form>
        <ConfirmationModal
          type={confirmationType}
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onSubmit={onSubmit}
        />
        <ConfirmationModal
          type="returnInvConfirmation"
          open={openReturnConfirmation}
          onClose={() => setOpenReturnConfirmation(false)}
          onSubmit={returnHandler}
        />
      </div>
    </div>
  );
};

export default RejectedInventoriesEdit;
