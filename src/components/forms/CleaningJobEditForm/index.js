import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Field from "../../common/Field";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "../../../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../../modals/ConfirmationModal";

const CleaningJobEditForm = ({ id }) => {
  const navigate = useNavigate();

  const [selectedCleaning, setSelectedCleaning] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState("update");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [cleaningJob, setCleaningJob] = useState(null);
  const [openCleaningJobPrint, setOpenCleaningJobPrint] = useState(false);

  const cleaningJobSchema = yup.object().shape({
    Cleaning_Name: yup.string().required("Name is required"),
    Cleaning_Description: yup.string().required("Description is required"),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(cleaningJobSchema),
    defaultValues: {
      Cleaning_Name: "",
      Cleaning_Description: "",
    },
    mode: "onChange",
  });

  const formHandler = (data) => {
    setConfirmationType("update");
    setFormData(data);
    setOpenConfirmation(true);
  };

  const onSubmit = useCallback(() => {
    if (confirmationType === "update") {
      axios
        .put(`/cleaningJobs/${id}`, {
          ...formData,
        })
        .then((res) => {
          toast.success(`Cleaning Job Updated Successfully`);
          // navigate(-1);
          resetFormData();
        })
        .catch((err) => {
          console.error(err);
          toast.error(`Failed to Update Cleaning Job!`);
        });
    } else {
      resetFormData();
    }
  }, [confirmationType, formData, id, navigate]);

  const handleCancel = () => {
    if (isDirty || isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      navigate(-1);
    }
  };

  const resetFormData = () => {
    getCleaningJobByID(id);
    setOpenConfirmation(false);
    setIsUpdated(false);
  };

  const getCleaningJobByID = (id) => {
    axios
      .get(`/cleaningJobs/${id}`)
      .then((res) => {
        const info = res.data.data;
        reset({
          Cleaning_Name: info.Cleaning_Name,
          Cleaning_Description: info.Cleaning_Description,
        });
        setCleaningJob(info);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getCleaningJobByID(id);
  }, [id, reset]);

  return (
    <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-BtnBg">
          Cleaning Job Details
        </h2>
      </div>
      <div className="border-b-2 border-gray-200 mt-4 mb-6"></div>
      <form onSubmit={handleSubmit(formHandler)} className="space-y-6">
        <Field
          label="Cleaning Job Name"
          name="Cleaning_Name"
          placeholder="Enter Name"
          control={control}
          error={errors.Cleaning_Name}
          className="grid grid-cols-3 gap-4"
        />

        <Field
          label="Cleaning Job Description"
          name="Cleaning_Description"
          placeholder="Enter description"
          control={control}
          error={errors.Cleaning_Description}
          className="grid grid-cols-3 gap-4"
        />

        <div className="flex justify-between mt-6">
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
              className={`py-2 px-4 rounded-md text-white ${
                !(isUpdated || (isValid && isDirty))
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-BtnBg"
              }`}
              disabled={!(isUpdated || (isValid && isDirty))}
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
        from={"cleaning job"}
      />
    </div>
  );
};

export default CleaningJobEditForm;
