import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Modal,
  Box,
  useMediaQuery,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../common/TextInput";
import ConfirmationModal from "../../modals/ConfirmationModal";
import DollarInput from "../../common/DollarInput";
import SearchableField from "../../common/SearchableField";
import { convertTemperature } from "../../../utils/tempUtils";

const InventoryDetailModal = ({
  open,
  handleClose,
  btnValue,
  onSubmit,
  id,
  inventory,
  inventoryID,
}) => {
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [vendor, setVendor] = useState(null);
  const [container, setContainer] = useState("pallete");
  const [quantity, setQuantity] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [rejectedReason, setRejectedReason] = useState("");
  const [receiveReason, setReceiveReason] = useState("");
  const [returningReason, setReturningReason] = useState("");

  const [productQuestions, setProductQuestions] = useState([]);

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState(
    btnValue.toLowerCase()
  );
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openRejectConfirmation, setOpenRejectConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errorList, setErrorList] = useState([]);
  const [lotNumID, setLotNumID] = useState(null);

  const [tempUnit, setTempUnit] = useState("F");

  const handleTempUnitChange = (event) => {
    setTempUnit(event.target.value);
  };

  const inventoryChildSchema = yup.object().shape({
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
    resolver: yupResolver(inventoryChildSchema),
    defaultValues: {
      SKU_Number: "",
      Date_Received: new Date(),
      Unit_Price: 0,
    },
    mode: "onChange",
  });

  const skuNumber = watch("SKU_Number");
  const unitPrice = watch("Unit_Price");
  const dateReceived = watch("Date_Received");

  useEffect(() => {
    const calculateSubTotal = () => {
      setSubTotal((quantity || 0) * (unitPrice || 0));
    };

    calculateSubTotal();
  }, [quantity, unitPrice]);

  const handleModalClose = useCallback(() => {
    reset();
    setVendor(null);
    setSubTotal(0);
    // handleClose();
  }, [handleClose, reset]);

  const submitHandler = useCallback(() => {
    const handleError = (err) => {
      console.error(err);
      toast.error(err.response?.data?.errorMessage || "internal server error");
    };

    const handleSuccess = (message) => {
      toast.success(message);
      handleModalClose();
    };

    const inventoryChildPayload = {
      VendorID: vendor ? vendor.VendorID : null,
      Vendor: vendor,
      InventoryID: inventoryID,
      SKU_Number: formData ? formData.SKU_Number : "",
      Date_Received: formData ? formData.Date_Received : new Date(),
      Lot_NumID: lotNumID,
      Unit_Price: formData ? formData.Unit_Price : "",
      Product_Questions: productQuestions
        ? productQuestions.map((item) =>
            item.Question === "temp of product"
              ? {
                  ...item,
                  Answer: `${item.Answer}${tempUnit}`,
                }
              : item
          )
        : [],
      Returning_Reason: returningReason,
    };

    switch (confirmationType) {
      case "add":
        if (errorList.length > 0) {
          setOpenConfirmation(false);
          setOpenRejectConfirmation(true);
        } else {
          axios
            .post("/inventory-children", inventoryChildPayload)
            .then((res) => {
              onSubmit((prev) => [
                ...prev,
                { ...inventoryChildPayload, ...res.data.data },
              ]);
              handleSuccess("Inventory added Successfully");
              setOpenConfirmation(false);
              handleModalClose();
            })
            .catch(handleError);
        }
        break;

      case "update":
        if (errorList.length > 0) {
          setOpenConfirmation(false);
          setOpenRejectConfirmation(true);
        } else {
          axios
            .put(`/inventory-children/${id}`, inventoryChildPayload)
            .then((res) => {
              onSubmit((prev) =>
                prev.map((item) =>
                  item.Inventory_ChildID === id
                    ? {
                        ...item,
                        ...inventoryChildPayload,
                        ...res.data.data,
                      }
                    : item
                )
              );
              handleSuccess("Inventory updated Successfully");
              setOpenConfirmation(false);
              handleModalClose();
            })
            .catch(handleError);
        }
        break;

      case "delete":
        axios
          .delete(`/inventory-children/${id}`)
          .then((res) => {
            onSubmit((prev) =>
              prev.filter((item) => item.Inventory_ChildID !== id)
            );
            handleSuccess("Inventory Detail Deleted Successfully");
            setOpenConfirmation(false);
            handleModalClose();
          })
          .catch(handleError);
        break;

      case "cancel":
        setOpenConfirmation(false);
        // handleModalClose();
        resetFormData();
        break;

      case "newvendoralt":
        setOpenConfirmation(false);
        navigate("/vendor/manage-vendor-products/new", {
          state: {
            name: null,
            inventoryId: inventoryID,
          },
        });
        break;

      default:
        console.warn("Unknown button action:", btnValue);
    }
  }, [
    btnValue,
    confirmationType,
    errorList.length,
    formData,
    handleModalClose,
    id,
    inventoryID,
    lotNumID,
    navigate,
    onSubmit,
    productQuestions,
    returningReason,
    tempUnit,
    vendor,
  ]);

  const rejectedHandler = useCallback(() => {
    if (inventory) {
      console.log(vendor);
      console.log("🚀🚀🚀 Product Questions: ", productQuestions);

      axios
        .post("/rejected-inventories", {
          Name: inventory.Inventory_Name,
          Description: inventory.Inventory_Description,
          VendorID: vendor ? vendor.VendorID : null,
          SKU_Number: skuNumber,
          Inventory_TypeID: inventory.inventoryType
            ? inventory.inventoryType.Inventory_TypeID
            : null,
          Date_Received: dateReceived,
          Lot_NumID: lotNumID,
          Unit_Price: unitPrice,
          Image_Location: null,
          Product_Questions: productQuestions.map((item) =>
            item.Question === "temp of product"
              ? {
                  ...item,
                  Answer: `${item.Answer}${tempUnit}`,
                }
              : item
          ),
          Notes: rejectedReason,
          Receive_Notes: receiveReason,
        })
        .then((res) => {
          if (btnValue === "update") {
            axios.delete(`/inventory-children/${id}`);
          }
          toast.success("Rejected inventory Item Added!");
          navigate(-1);
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            err.response?.data?.errorMessage || "internal server error"
          );
        });
    }
  }, [
    inventory,
    vendor,
    skuNumber,
    dateReceived,
    lotNumID,
    unitPrice,
    productQuestions,
    rejectedReason,
    receiveReason,
    tempUnit,
    btnValue,
    navigate,
    id,
  ]);

  const formHandler = useCallback(
    (data) => {
      switch (confirmationType) {
        case "add":
          setFormData(data);
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

  const handleInputChange = (index, value) => {
    let tmp = [...productQuestions];
    tmp[index].Answer = value;
    setProductQuestions(tmp.sort((el1, el2) => el1.Arrange - el2.Arrange));
    setIsUpdated(true);
  };

  const handleCancel = useCallback(() => {
    if (isDirty || isUpdated || btnValue === "delete") {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      handleClose();
    }
  }, [btnValue, handleClose, isDirty, isUpdated]);

  const isDelete = btnValue === "delete";

  const fetchVendors = async (inputValue) => {
    try {
      const res = await axios.get(
        `/vendors/inventory?inventoryID=${inventoryID}`
      );
      if (res.status === 200) {
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

  const resetFormData = () => {
    reset({
      SKU_Number: "",
      Date_Received: new Date(),
      Unit_Price: 0,
    });
    setVendor(null);
    setSubTotal(0);
    setProductQuestions([]);
    setConfirmationType(btnValue.toLowerCase());
    setErrorList([]);
    setIsUpdated(false);
  };

  useEffect(() => {
    setConfirmationType(btnValue.toLowerCase());
  }, [btnValue]);

  useEffect(() => {
    if (id) {
      axios
        .get(`/inventory-children/${id}`)
        .then((res) => {
          let info = res.data.data;
          reset({
            SKU_Number: info.SKU_Number,
            Date_Received: new Date(info.Date_Received),
            Unit_Price: info.Unit_Price,
          });
          setVendor({
            ...info.Vendor,
            id: info.Vendor.VendorID,
            name: info.Vendor.Vendor_Name,
          });
          setLotNumID(info.Lot_NumID);
          setQuantity(info.Unit_Qty);
          setReturningReason(info.Returning_Reason);
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
        })
        .catch((err) => console.error(err));
    }
  }, [id, reset]);

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
              {isMobile && (
                <IconButton
                  onClick={handleModalClose}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
              <div className="flex flex-col">
                <h2
                  id="inventory-detail-modal-title"
                  className="text-xl font-semibold mb-2 text-BtnBg"
                >
                  Inventory Details
                </h2>
                <div className="border-b border-gray-300 mb-4"></div>
                <div className="grid grid-cols-3 gap-4 ">
                  <label className="text-gray-700 self-center">
                    Vendor Name<span className="text-red-700">*</span>
                  </label>
                  <SearchableField
                    fetchData={fetchVendors}
                    defaultValue={vendor && vendor.name ? vendor.name : vendor}
                    onfocus={fetchVendors}
                    onChange={(value) => {
                      setIsUpdated(true);
                      setVendor(value);
                      reset({
                        SKU_Number: value?.SKU_Number,
                        Unit_Price: value?.Unit_Price,
                      });
                      setProductQuestions(
                        value?.Product_Questions?.sort(
                          (el1, el2) => el1.Arrange - el2.Arrange
                        )
                      );
                    }}
                    onBlur={(value) => {
                      if (vendor && typeof vendor === "string") {
                        setConfirmationType("newvendoralt");
                        setOpenConfirmation(true);
                      }
                    }}
                    placeholder="Type to search vendor..."
                    className="col-span-2"
                    disabled={isDelete}
                    error={!vendor}
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
                        disabled={true}
                        error={!!errors.SKU_Number}
                      />
                    )}
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
                        error={!!errors.Date_Received}
                      />
                    )}
                  />

                  <label className="text-gray-700 self-center">
                    Lot Number<span className="text-red-700">*</span>
                  </label>
                  <TextInput
                    type="text"
                    className="col-span-2"
                    value={
                      lotNumID
                        ? `Lot-${String(lotNumID).padStart(8, "0")}`
                        : null
                    }
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
                        placeholder="$0"
                        disabled={isDelete}
                        error={!!errors.Unit_Price}
                      />
                    )}
                  />

                  <label className="text-gray-700 self-center">
                    Sub Total Price
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
                      productQuestions.map((question, index) =>
                        question.Question != "quality notes" &&
                        question.Question != "receive notes" ? (
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
                                .toUpperCase()}${question.Question.trim().slice(
                                1
                              )}`}
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
                                        ? `0.0`
                                        : question.Question === "quantity"
                                        ? container === "flat"
                                          ? "0.0"
                                          : "0.0"
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
                                        handleTempertureChange(
                                          question,
                                          e.target.value
                                        );
                                      }
                                    }}
                                    disabled={btnValue === "delete"}
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
                                      receive:
                                        "Receiving process unsuccessful!",
                                    };

                                    if (e.target.value === "false") {
                                      setErrorList([
                                        ...errorList.filter(
                                          (item) =>
                                            item.type !== question.Question
                                        ),
                                        {
                                          type: question.Question,
                                          msg: questions[question.Question],
                                        },
                                      ]);
                                    } else {
                                      setErrorList(
                                        errorList.filter(
                                          (item) =>
                                            item.type !== question.Question
                                        )
                                      );
                                    }
                                  }}
                                >
                                  <FormControlLabel
                                    value="true"
                                    control={<Radio />}
                                    label="True"
                                    disabled={btnValue === "delete"}
                                  />
                                  <FormControlLabel
                                    value="false"
                                    control={<Radio />}
                                    label="False"
                                    disabled={btnValue === "delete"}
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
                                  disabled={btnValue === "delete"}
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
                            {errorList.filter(
                              (item) => item.type === question.Question
                            ).length > 0 ? (
                              <p className="mt-2 text-red-600 col-span-2">
                                {
                                  errorList.find(
                                    (el) => el.type === question.Question
                                  ).msg
                                }
                              </p>
                            ) : (
                              <></>
                            )}
                          </Box>
                        ) : (question.Question === "quality notes" ||
                            question.Question === "receive notes") &&
                          errorList.length > 0 ? (
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
                              {`${question.Question.trim()
                                .charAt(0)
                                .toUpperCase()}${question.Question.trim().slice(
                                1
                              )}`}
                              <span className="text-red-700">*</span>
                            </div>
                            <div className="col-span-2 text-[#4B5563]">
                              <textarea
                                type="text"
                                required={true}
                                maxLength={256}
                                className="w-full rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] border border-[rgba(0,0,0,0.23)] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                                value={question.Answer || ""}
                                onChange={(e) => {
                                  handleInputChange(index, e.target.value);
                                  if (question.Question === "quality notes") {
                                    setRejectedReason(e.target.value);
                                  } else if (
                                    question.Question === "receive notes"
                                  ) {
                                    setReceiveReason(e.target.value);
                                  }
                                }}
                                disabled={btnValue === "delete"}
                              />
                              {question.Answer &&
                                question.Answer.length > 255 && (
                                  <p className="mt-2 text-red-600 col-span-2">
                                    {`${question.Question.charAt(
                                      0
                                    ).toUpperCase()}${question.Question.slice(
                                      1
                                    )} should be less than 255 characters`}
                                  </p>
                                )}
                            </div>
                          </Box>
                        ) : (
                          <></>
                        )
                      )
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
                    {/* {errorList.length > 0 && (
                      <>
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
                            quality notes
                            <span className="text-red-700">*</span>
                          </div>
                          <div className="col-span-2 text-[#4B5563]">
                            <textarea
                              type="text"
                              className="w-full rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] border border-[rgba(0,0,0,0.23)] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                              value={rejectedReason || ""}
                              onChange={(e) => {
                                setRejectedReason(e.target.value);
                              }}
                              disabled={btnValue === "delete"}
                            />
                          </div>
                        </Box>

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
                            receive notes
                            <span className="text-red-700">*</span>
                          </div>
                          <div className="col-span-2 text-[#4B5563]">
                            <textarea
                              type="text"
                              className="w-full rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] border border-[rgba(0,0,0,0.23)] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                              value={receiveReason || ""}
                              onChange={(e) => {
                                setReceiveReason(e.target.value);
                              }}
                              disabled={btnValue === "delete"}
                            />
                          </div>
                        </Box>
                      </>
                    )} */}
                    {returningReason && (
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
                          Return Reason
                        </div>
                        <div className="col-span-2 text-[#4B5563]">
                          <textarea
                            type="text"
                            className="w-full rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] border border-[rgba(0,0,0,0.23)] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                            value={returningReason || ""}
                            onChange={(e) => {
                              setIsUpdated(true);
                              setReturningReason(e.target.value);
                            }}
                            disabled={btnValue === "delete"}
                          />
                        </div>
                      </Box>
                    )}
                  </div>
                </div>
                <div className="col-span-3 flex justify-end mt-5">
                  <button
                    type="button"
                    className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36"
                    onClick={handleCancel}
                  >
                    {isDirty || isUpdated || btnValue === "delete"
                      ? "Cancel"
                      : "Go Back"}
                  </button>
                  <button
                    type="submit"
                    className={`py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize ${
                      btnValue === "delete"
                        ? "bg-red-500"
                        : btnValue === "add"
                        ? !isValid ||
                          !vendor ||
                          productQuestions.filter(
                            (item) =>
                              !item.Answer &&
                              item.Question !== "quality notes" &&
                              item.Question !== "receive notes"
                          ).length > 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-BtnBg"
                        : !isValid ||
                          !vendor ||
                          productQuestions.filter(
                            (item) =>
                              !item.Answer &&
                              item.Question !== "quality notes" &&
                              item.Question !== "receive notes"
                          ).length > 0 ||
                          (!isDirty && !isUpdated)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-BtnBg"
                    }`}
                    disabled={
                      btnValue !== "delete"
                        ? btnValue === "add"
                          ? !isValid ||
                            !vendor ||
                            productQuestions.filter(
                              (item) =>
                                !item.Answer &&
                                item.Question !== "quality notes" &&
                                item.Question !== "receive notes"
                            ).length > 0
                          : !isValid ||
                            !vendor ||
                            productQuestions.filter(
                              (item) =>
                                !item.Answer &&
                                item.Question !== "quality notes" &&
                                item.Question !== "receive notes"
                            ).length > 0 ||
                            (!isDirty && !isUpdated)
                        : false
                    }
                  >
                    {btnValue}
                  </button>
                </div>
              </div>
            </Box>
          </form>
        </div>
      </Modal>
      <ConfirmationModal
        type={confirmationType}
        open={openConfirmation}
        onClose={() => {
          console.log("👍👍👍👍", confirmationType);
          if (confirmationType === "newvendoralt") {
            setOpenConfirmation(false);
            setVendor(null);
          } else {
            setOpenConfirmation(false);
          }
        }}
        onSubmit={submitHandler}
        from="inventory"
      />
      <ConfirmationModal
        type="rejectedInvConfirmation"
        open={openRejectConfirmation}
        onClose={() => {
          if (confirmationType === "newvendoralt") {
            setOpenRejectConfirmation(false);
            setVendor(null);
          } else {
            setOpenRejectConfirmation(false);
          }
        }}
        onSubmit={rejectedHandler}
        from="inventory"
      />
    </>
  );
};

export default InventoryDetailModal;
