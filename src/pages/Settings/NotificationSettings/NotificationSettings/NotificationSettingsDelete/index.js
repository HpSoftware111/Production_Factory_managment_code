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

const NotificationDelete = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [ssn, setSSN] = useState(null);
  const [imageLocation, setImageLocation] = useState(null);

  const [confirmationType, setConfirmationType] = useState("delete");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const formHandler = () => {
    setConfirmationType("delete");
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
    Job_Description: Yup.string().required("Job Description is required"),
    DOB: Yup.date()
      .required("Date of Birth is required")
      .typeError("Invalid date"),
  });

  const { handleSubmit, control, reset } = useForm({
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
      Phone_1: "",
      Phone_2: "",
      Title: "",
      Job_Description: "",
      DOB: new Date(),
    },
  });

  const onSubmit = useCallback(() => {
    if (confirmationType === "delete") {
      axios
        .delete(`/employees/${id}`)
        .then((res) => {
          toast.success(`Employee deleted successfully!`);
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

  useEffect(() => {
    if (id && reset) {
      axios
        .get(`/employees/${id}`)
        .then((res) => {
          const data = res.data.data;
          setSSN(data.SSN);
          setImageLocation(data.Image_Location);
          reset({
            First_Name: data.First_Name,
            Last_Name: data.Last_Name,
            Addr_1: data.Addr_1,
            Addr_2: data.Addr_2,
            City: data.City,
            State: data.State,
            Zip: data.Zip,
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
            setter={setImageLocation}
            disabled={true}
          />
        </div>
        <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
        <form
          className="grid grid-cols-3 gap-4"
          onSubmit={handleSubmit(formHandler)}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                  disabled={true}
                />
              )}
            />
            <Controller
              name="State"
              control={control}
              render={({ field }) => (
                <select
                  className="w-[25%] grow uppercase rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg"
                  {...field}
                  disabled={true}
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
                  maxLength={5}
                  disabled={true}
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
                disabled={true}
              />
            )}
          />

          <label className="text-gray-700 self-center">Secondary Phone</label>
          <Controller
            name="Phone_2"
            control={control}
            render={({ field }) => (
              <PhoneNumberInput
                {...field}
                placeholder="Secondary Phone"
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
            disabled={true}
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
                disabled={true}
              />
            )}
          />

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
              className="py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize bg-red-500"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
      <ConfirmationModal
        type={confirmationType}
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default NotificationDelete;
