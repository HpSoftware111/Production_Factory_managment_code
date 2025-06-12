import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Modal,
  Box,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import ConfirmationModal from "../../modals/ConfirmationModal";

const CrudModal = ({
  open,
  fieldData,
  handleClose,
  btnName,
  setProductQuestions,
}) => {
  const [type, setType] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState(btnName);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);

  const productQuestionSchema = yup.object().shape({
    Question: yup.string().required("Question is required"),
    // Value: yup.string(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(productQuestionSchema),
    defaultValues: {
      Question: fieldData?.Question || "",
      Value: fieldData?.Value || "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(() => {
    const contactPayload = {
      ...formData,
      Type: type,
    };

    const handleError = (err) => {
      console.error(err);
      toast.error(err.response?.data?.errorMessage || "internal server error");
    };

    switch (confirmationType) {
      case "add":
        axios
          .post("/product-questions", contactPayload)
          .then((res) => {
            setProductQuestions((prev) => [...prev, res.data.data]);
            toast.success("Product Question Added Successfully");
            reset();
            handleClose();
            setOpenConfirmation(false);
          })
          .catch(handleError);
        break;

      case "update":
        axios
          .put(`/product-questions/${fieldData?.ProductQID}`, contactPayload)
          .then((res) => {
            setProductQuestions((prev) =>
              prev.map((item) =>
                item.ProductQID === fieldData?.ProductQID ? res.data.data : item
              )
            );
            toast.success("Product Question Updated Successfully");
            reset();
            handleClose();
            setOpenConfirmation(false);
          })
          .catch(handleError);
        break;

      case "delete":
        axios
          .delete(`/product-questions/${fieldData?.ProductQID}`)
          .then((res) => {
            setProductQuestions((prev) => {
              return prev.filter(
                (item) => item.ProductQID !== fieldData?.ProductQID
              );
            });
            toast.success("Product Question Deleted Successfully");
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
    setProductQuestions,
    type,
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
    if (isDirty || isUpdated || btnName === "delete") {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      handleClose();
    }
  }, [btnName, handleClose, isDirty, isUpdated]);

  const getButtonClassName = useCallback(() => {
    if (btnName === "delete") {
      return "py-2 px-6 md:px-16 bg-red-600 text-white rounded-xl min-w-36 cursor-pointer capitalize bg-red-400";
    }
    if (btnName === "add") {
      return `py-2 px-6 md:px-16 text-white ${
        !isValid || !type
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-BtnBg"
      } rounded-xl min-w-36 capitalize`;
    }
    if (btnName === "update") {
      return `py-2 px-6 md:px-16 text-white ${
        !isValid || !type || (!isDirty && !isUpdated)
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-BtnBg"
      } rounded-xl min-w-36 capitalize`;
    }
    return "py-2 px-6 md:px-16 bg-BtnBg text-white rounded-xl min-w-36 capitalize";
  }, [btnName, isDirty, isUpdated, isValid, type]);

  const getButtonStatus = useCallback(() => {
    switch (btnName) {
      case "add":
        return !isValid || !type;
      case "update":
        return !isValid || !type || (!isDirty && !isUpdated);
      default:
        return false;
    }
  }, [btnName, isDirty, isUpdated, isValid, type]);

  const isDelete = btnName === "delete";

  useEffect(() => {
    if (fieldData) {
      reset({
        Question: fieldData.Question,
        Value: fieldData.Value,
      });
      setType(fieldData.Type);
    }
  }, [fieldData, reset]);

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
                {btnName} Question
              </h2>
              <div className="border-b border-gray-300 mb-4"></div>
              <TextField
                id="Question"
                className="col-span-2 !mb-4 bg-[#f4f4f4]"
                label="Question"
                variant="outlined"
                placeholder="Question"
                {...register("Question")}
                error={!!errors.Question}
                helperText={errors.Question?.message}
                size="small"
                disabled={isDelete}
              />

              <TextField
                id="Value"
                className="col-span-2 !mb-4 bg-[#f4f4f4]"
                label="Value"
                variant="outlined"
                placeholder="Value"
                {...register("Value")}
                error={!!errors.Value}
                helperText={errors.Value?.message}
                size="small"
                disabled={isDelete}
              />
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="type-selector-label">Type</InputLabel>
                <Select
                  labelId="type-selector-label"
                  id="type-selector"
                  className="bg-[#f4f4f4]"
                  value={type}
                  onChange={(e) => {
                    setIsUpdated(true);
                    setType(e.target.value);
                  }}
                  label="Type"
                  disabled={isDelete}
                  placeholder="Select Type"
                >
                  <MenuItem value="float">float</MenuItem>
                  <MenuItem value="boolean">boolean</MenuItem>
                  <MenuItem value="list">list</MenuItem>
                </Select>
              </FormControl>
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
          from="question"
        />
      </div>
    </Modal>
  );
};

export default CrudModal;
