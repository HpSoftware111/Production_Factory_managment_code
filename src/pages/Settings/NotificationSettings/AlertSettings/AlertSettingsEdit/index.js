import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import axios from "../../../../../api";
import TextInput from "../../../../../components/common/TextInput";
import FileUploader from "../../../../../components/common/FileUploader";
import PasswordInput from "../../../../../components/common/PasswordInput";
import PhoneNumberInput from "../../../../../components/common/PhoneNumberInput";
import ConfirmationModal from "../../../../../components/modals/ConfirmationModal";
import { states } from "../../../../../utils/states";

const AlertEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [ssn, setSSN] = useState(null);
  const [imageLocation, setImageLocation] = useState(null);

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState("update");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);

  const formHandler = (data) => {
    setConfirmationType("update");
    setFormData(data);
    setOpenConfirmation(true);
  };

  const { id } = location.state || {};

  const employeeSchema = Yup.object().shape({
    First_Name: Yup.string().required("First Name is required"),
    Last_Name: Yup.string().required("Last Name is required"),
    Addr_1: Yup.string().required("Address 1 is required"),
    City: Yup.string().required("City is required"),
    State: Yup.string().required("State is required"),
    Zip: Yup.string()
      .required("Zip code is required")
      .matches(/^\d{5}$/, "Must be exactly 5 digits"),
    Phone_1: Yup.string().required("Main Phone is required"),
    Title: Yup.string().required("Title is required"),
    Email: Yup.string().required("Email is required"),
    Job_Description: Yup.string().required("Job Description is required"),
    DOB: Yup.date()
      .required("Date of Birth is required")
      .typeError("Invalid date"),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      First_Name: "",
      Last_Name: "",
      Addr_1: "",
      Addr_2: "",
      City: "",
      State: "",
      Zip: "",
      Email: "",
      Phone_1: "",
      Phone_2: "",
      Title: "",
      Job_Description: "",
      DOB: new Date(),
    },
  });

  const isValidSSN = (ssn) => {
    const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
    return ssnPattern.test(ssn);
  };

  const formatSSN = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(
      5,
      9
    )}`;
  };

  const handleSSNChange = (value) => {
    const formattedValue = formatSSN(value);
    if (ssn !== formattedValue) {
      setIsUpdated(true);
      setSSN(formattedValue);
    }
  };

  const handleImageChange = (path) => {
    if (imageLocation !== path) {
      setIsUpdated(true);
      setImageLocation(path);
    }
  };

  const onSubmit = useCallback(() => {
    if (confirmationType === "update") {
      axios
        .put(`/employees/${id}`, {
          ...formData,
          SSN: ssn,
          Image_Location: imageLocation,
        })
        .then((res) => {
          toast.success(`Employee updated successfully!`);
          navigate("/settings/notification-settings/alertSettings/");
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            err.response?.data?.errorMessage || "internal server error"
          );
        });
    } else {
      navigate("/settings/notification-settings/alertSettings/");
    }
  }, [confirmationType, id, formData, ssn, imageLocation, navigate]);

  const handleCancel = () => {
    if (isDirty || isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      navigate("/settings/notification-settings/alertSettings/");
    }
  };

  useEffect(() => {
    if (id && reset) {
      console.log("id:", id);
      axios
        .get(`/employees/${id}`)
        .then((res) => {
          const data = res.data.data;
          setSSN(data.SSN);
          console.log("11111111", data);

          setImageLocation(data.Image_Location);
          reset({
            First_Name: data.First_Name,
            Last_Name: data.Last_Name,
            Addr_1: data.Addr_1,
            Addr_2: data.Addr_2,
            City: data.City,
            State: data.State,
            Zip: data.Zip,
            Email: data.Email,
            Phone_1: data.Phone_1,
            Phone_2: data.Phone_2,
            Title: data.Title,
            Job_Description: data.Job_Description,
            DOB: data.DOB,
          });
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
            Employee Details
          </h2>
          <FileUploader
            bgColor="#B79F61"
            defaultValue={imageLocation}
            setter={handleImageChange}
          />
        </div>
        <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
        <form
          onSubmit={handleSubmit(formHandler)}
          className="grid grid-cols-3 gap-4"
        >
          <label className="text-gray-700 self-center">
            First Name<span className="text-red-700">*</span>
          </label>
          <Controller
            name="First_Name"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="First Name"
                error={!!errors.First_Name}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            Last Name<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Last_Name"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="Last Name"
                error={!!errors.Last_Name}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            Address 1<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Addr_1"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="Address 1"
                error={!!errors.Addr_1}
              />
            )}
          />

          <label className="text-gray-700 self-center">Address 2</label>
          <Controller
            name="Addr_2"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="Address 2"
              />
            )}
          />

          <label className="text-gray-700 self-center">
            City State Zip<span className="text-red-700">*</span>
          </label>
          <div className="col-span-2 flex gap-4 sm:flex-nowrap flex-wrap">
            <Controller
              name="City"
              control={control}
              render={({ field }) => (
                <TextInput
                  className="w-[50%] grow"
                  {...field}
                  placeholder="City"
                  error={!!errors.City}
                />
              )}
            />
            <Controller
              name="State"
              control={control}
              render={({ field }) => (
                <select
                  className={`w-[25%] grow uppercase rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg ${
                    !!errors.State ? "bg-red-50 focus:!ring-red-200" : ""
                  }`}
                  {...field}
                >
                  {states.map((state) => (
                    <option key={state} value={state === "State" ? "" : state}>
                      {state}
                    </option>
                  ))}
                </select>
              )}
            />
            <Controller
              name="Zip"
              control={control}
              render={({ field }) => (
                <TextInput
                  className="w-[25%] grow"
                  {...field}
                  placeholder="Zip"
                  type="number"
                  error={!!errors.Zip}
                  maxLength={5}
                />
              )}
            />
          </div>

          <label className="text-gray-700 self-center">
            Main Phone<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Phone_1"
            control={control}
            render={({ field }) => (
              <PhoneNumberInput
                {...field}
                placeholder="Main Phone"
                error={!!errors.Phone_1}
              />
            )}
          />

          <label className="text-gray-700 self-center">Secondary Phone</label>
          <Controller
            name="Phone_2"
            control={control}
            render={({ field }) => (
              <PhoneNumberInput {...field} placeholder="Secondary Phone" />
            )}
          />

          <label className="text-gray-700 self-center">
            Email<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Email"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="Email"
                error={!!errors.Email}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            Title<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Title"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="Title"
                error={!!errors.Title}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            Job Description<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Job_Description"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="Job Description"
                error={!!errors.Job_Description}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            SSN<span className="text-red-700">*</span>
          </label>
          <PasswordInput
            className="col-span-2"
            placeholder="XXX-XX-XXXX"
            value={ssn}
            onChange={(value) => handleSSNChange(value)}
            error={!ssn || !isValidSSN(ssn)}
          />

          <label className="text-gray-700 self-center">
            Date of Birth<span className="text-red-700">*</span>
          </label>
          <Controller
            name="DOB"
            control={control}
            render={({ field }) => (
              <TextInput
                type="date"
                className="col-span-2"
                {...field}
                error={!!errors.DOB}
              />
            )}
          />

          <div className="col-span-3 flex justify-end mt-3">
            <button
              type="button"
              className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36"
              onClick={handleCancel}
            >
              {!isValid || !isValidSSN(ssn) || (!isDirty && !isUpdated)
                ? "Go Back"
                : "Cancel"}
            </button>
            <button
              type="submit"
              className={`py-2 px-6 md:px-16 ml-7  text-center text-white rounded-xl min-w-36 capitalize ${
                !isValid || !isValidSSN(ssn) || (!isDirty && !isUpdated)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-BtnBg"
              }`}
              disabled={
                !isValid || !isValidSSN(ssn) || (!isDirty && !isUpdated)
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
      </div>
    </div>
  );
};

export default AlertEdit;
