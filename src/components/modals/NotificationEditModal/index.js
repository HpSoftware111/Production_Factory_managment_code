import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Modal, Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../../api";
import ConfirmationModal from "../ConfirmationModal";
import TextInput from "../../common/TextInput";
import { NotifyPriority } from "../../common/utils";
import { API_ROUTES } from "../../../api/routes";

const NotificationEditModal = ({
  open,
  fieldData,
  handleClose,
  btnName,
  setData,
}) => {
  const [confirmationType, setConfirmationType] = useState(btnName);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);

  const dataQuestionSchema = yup.object().shape({
    Notification_Name: yup.string().required("Notes is required"),
    Notification_Description: yup.string().required("Notes is required"),
    Notification_Priority: yup.number().required("Priority is required"),
    Notification_Notes: yup
      .string()
      .max(255, "Notes cannot exceed 255 characters"),
  });

  const { control, handleSubmit, reset, formState: { errors, isDirty, isValid }, } = useForm({
    resolver: yupResolver(dataQuestionSchema),
    defaultValues: {
      // Notification_Notes: fieldData?.Notification_Notes || "",
    },
    mode: "onChange",
  });

  const handleError = (err) => {
    console.error("😜😜😜 ERRROR", err);
    toast.error(err.response?.data?.errorMessage || "Internal server error");
  };

  const handleUpdateWithResolution = useCallback(
    (resolution) => {
      const updateData = {
        Notification_Notes: formData.Notification_Notes || "",
        Notification_Priority: formData.Notification_Priority,
        Notification_Resolution: resolution,
      };
      axios
        .put(
          `${API_ROUTES.UPDATE_NOTIFICATION}/${fieldData?.NotificationsID}`,
          updateData
        )
        .then((res) => {
          setData(res.data.data);
          toast.success("Notification Updated Successfully");
          reset();
          handleClose();
          setOpenConfirmation(false);
        })
        .catch(handleError);
    },
    [fieldData, formData, handleClose, reset, setData]
  );

  const onSubmit = useCallback(() => {
    const contactPayload = { ...formData };

    switch (confirmationType) {
      case "update":
        const updateData = {
          Notification_Notes: contactPayload.Notification_Notes || "",
          Notification_Priority: contactPayload.Notification_Priority,
        };
        axios
          .put(
            `${API_ROUTES.UPDATE_NOTIFICATION}/${fieldData?.NotificationsID}`,
            updateData
          )
          .then((res) => {
            setData(res.data.data);
            toast.success("Notification Updated Successfully");
            reset();
            handleClose();
            setOpenConfirmation(false);
          })
          .catch(handleError);
        break;

      case "delete":
        axios
          .delete(`/printers/${fieldData?.NotificationID}`)
          .then(() => {
            setData((prev) =>
              prev.filter(
                (item) => item.NotificationID !== fieldData?.NotificationID
              )
            );
            toast.success("Notification Deleted Successfully");
            reset();
            handleClose();
            setOpenConfirmation(false);
          })
          .catch(handleError);
        break;

      case "resolved":
        handleUpdateWithResolution("resolved");
        break;

      case "viewed":
        handleUpdateWithResolution("viewed");
        break;

      case "completed":
        handleUpdateWithResolution("completed");
        break;

      case "noticed":
        handleUpdateWithResolution("noticed");
        break;

      case "cancel":
        reset();
        // setFormData(null);
        // handleClose();
        setIsUpdated(false);
        setConfirmationType(btnName);
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
    handleUpdateWithResolution,
    reset,
    setData,
  ]);

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
      } else if (btnName === "resolved") {
        setConfirmationType("resolved");
        setFormData(data);
        setOpenConfirmation(true);
      } else if (btnName === "completed") {
        setConfirmationType("completed");
        setFormData(data);
        setOpenConfirmation(true);
      } else if (btnName === "noticed") {
        setConfirmationType("noticed");
        setFormData(data);
        setOpenConfirmation(true);
      } else if (btnName === "viewed") {
        setConfirmationType("viewed");
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
    if (isDirty || btnName === "delete") {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      handleClose();
    }
  }, [isDirty, btnName, handleClose]);

  const getButtonClassName = useCallback(() => {
    if (btnName === "delete") {
      return "py-2 px-6 md:px-16 bg-red-600 text-white rounded-xl min-w-36 cursor-pointer capitalize";
    }
    if (btnName === "add") {
      return `py-2 px-6 md:px-16 text-white ${!isValid ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-BtnBg"
        } rounded-xl min-w-36 capitalize`;
    }
    if (btnName === "update") {
      return `py-2 px-6 md:px-16 text-white ${!isValid || (!isDirty && !isUpdated)
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-BtnBg"
        } rounded-xl min-w-36 capitalize`;
    }

    return `py-2 px-6 md:px-16 text-white ${!isValid || (!isDirty && !isUpdated)
        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
        : "bg-BtnBg"
      } rounded-xl min-w-36 capitalize`;
  }, [btnName, isValid, isDirty, isUpdated]);

  const getButtonStatus = useCallback(() => {
    switch (btnName) {
      case "add":
        return !isValid;
      case "update":
        return !isValid || (!isDirty && !isUpdated);

      default:
        return !isValid || (!isDirty && !isUpdated);
    }
  }, [btnName, isValid, isDirty, isUpdated]);

  useEffect(() => {
    if (fieldData || reset) {
      console.log("🚀🚀🚀 Field Data:", fieldData);
      reset({
        Notification_Name: fieldData.Notification_Name,
        Notification_Description: fieldData.Notification_Description,
        Notification_Priority: fieldData.Notification_Priority || 0,
        Notification_Notes: fieldData.Notification_Notes || "",
        Notification_Resolution: fieldData.Notification_Resolution,
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
                {btnName} Notification
              </h2>
              <div className="border-b border-gray-300 mb-4"></div>

              <div className="grid grid-cols-3 gap-4 ">
                {btnName === "add" && (
                  <>
                    <label className="text-gray-700 self-center">
                      Title<span className="text-red-700">*</span>
                    </label>
                    <Controller
                      name="Notification_Name"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          className="col-span-2 !mb-4 bg-[#f4f4f4]"
                          {...field}
                          placeholder="Notification Name"
                          disabled={btnName === "delete"}
                          error={!!errors.Notification_Name}
                        />
                      )}
                    />
                    <label className="text-gray-700 self-center">
                      Description
                      <span className="text-red-700">*</span>
                    </label>
                    <Controller
                      name="Notification_Description"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          className="col-span-2 !mb-4 bg-[#f4f4f4]"
                          {...field}
                          placeholder="Description"
                          disabled={btnName === "delete"}
                          error={!!errors.Notification_Description}
                        />
                      )}
                    />
                  </>
                )}

                <label className="text-gray-700 self-center">
                  Notes<span className="text-red-700">*</span>
                </label>
                <div className="col-span-2">
                  <Controller
                    name="Notification_Notes"
                    control={control}
                    render={({ field }) => (
                      <>
                        <textarea
                          rows={2}
                          className="rounded-lg border p-3 w-full !mb-1 bg-[#f4f4f4]"
                          {...field}
                          placeholder="Please note here...."
                          disabled={btnName === "delete"}
                          onChange={(e) => {
                            field.onChange(e);
                            setIsUpdated(true);
                          }}
                        />
                        {errors.Notification_Notes && (
                          <p className="text-red-700 text-sm">
                            {errors.Notification_Notes.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
                {btnName === "update" && (
                  <>
                    <label className="text-gray-700 self-center">
                      Priority<span className="text-red-700">*</span>
                    </label>
                    <Controller
                      name="Notification_Priority"
                      control={control}
                      render={({ field }) => (
                        <select
                          className={`w-full grow capitalize rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg ${!!errors.Notification_Priority
                              ? "bg-red-50 focus:!ring-red-200"
                              : ""
                            }`}
                          {...field}
                          disabled={btnName === "delete"}
                          onChange={(e) => {
                            console.log(e.target.value);
                            field.onChange(e);
                            setIsUpdated(true);
                          }}
                        // defaultValue={2}
                        >
                          {Object.entries(NotifyPriority).map(
                            ([keyName, value], index) => (
                              <option key={value} value={value}>
                                {value + 1}. {keyName}
                              </option>
                            )
                          )}
                        </select>
                      )}
                    />
                  </>
                )}

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

          <ConfirmationModal
            open={openConfirmation}
            type={confirmationType}
            onClose={() => setOpenConfirmation(false)}
            onSubmit={onSubmit}
            from="Notification"
          />
        </form>
      </div>
    </Modal>
  );
};

export default NotificationEditModal;
