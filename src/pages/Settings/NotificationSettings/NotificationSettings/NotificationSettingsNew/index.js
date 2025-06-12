import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import axios from "../../../../../../../api";
import TextInput from "../../../../../components/common/TextInput";
import FileUploader from "../../../../../components/common/FileUploader";
import PasswordInput from "../../../../../components/common/PasswordInput";
import PhoneNumberInput from "../../../../../components/common/PhoneNumberInput";
import SearchableField from "../../../../../components/common/SearchableField";
import ConfirmationModal from "../../../../../components/modals/ConfirmationModal";
import { states } from "../../../../../utils/states";

const EmployeeNew = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { name } = location.state;

  const [ssn, setSSN] = useState(null);
  const [firstname, setFirstName] = useState(null);
  const [lastname, setLastName] = useState(null);
  const [imageLocation, setImageLocation] = useState(null);

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState("update");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openDuplicationDlg, setOpenDuplicationDlg] = useState(false);

  const [id, setId] = useState(null);

  const employeeSchema = Yup.object().shape({
    Addr_1: Yup.string().required("Address 1 is required"),
    Addr_2: Yup.string(),
    City: Yup.string().required("City is required"),
    State: Yup.string().required("State is required"),
    Zip: Yup.string()
      .required("Zip code is required")
      .matches(/^\d{5}$/, "Must be exactly 5 digits"),
    Phone_1: Yup.string().required("Main Phone is required"),
    Phone_2: Yup.string(),
    Title: Yup.string().required("Title is required"),
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

  const handleChange = (field, value) => {
    const formattedValue = field === "ssn" ? formatSSN(value) : value;
    setSSN(formattedValue);
  };

  const onSubmit = useCallback(
    (data) => {
      axios
        .post("/employees", {
          ...data,
          First_Name: firstname,
          Last_Name: lastname,
          SSN: ssn,
          Image_Location: imageLocation,
        })
        .then((res) => {
          toast.success(`Employee added successfully!`);
          navigate("/employees/manage-employees");
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            err.response?.data?.errorMessage || "internal server error"
          );
        });
    },
    [firstname, lastname, ssn, imageLocation, navigate]
  );

  const handleCancel = () => {
    if (isDirty || isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      navigate("/employees/manage-employees");
    }
  };

  const getSearchableFirstNameList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(
        `/employees/firstname?keyword=${keyword}&size=5`
      );
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          id: item.EmployeeID,
          name: item.First_Name,
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

  const getSearchableLastNameList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(
        `/employees/lastname?keyword=${keyword}&size=5`
      );
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          id: item.EmployeeID,
          name: item.Last_Name,
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

  useEffect(() => {
    firstname &&
      lastname &&
      axios
        .get(
          `/employees/checkdup?firstname=${
            firstname && firstname.name ? firstname.name : firstname
          }&lastname=${lastname && lastname.name ? lastname.name : lastname}`
        )
        .then((res) => {
          if (res.data.code === 302) {
            setOpenDuplicationDlg(true);
            setConfirmationType("duplication");
            setId(res.data.data.id);
          }
        })
        .catch((err) => {
          console.error(err);
        });
  }, [firstname, lastname]);

  useEffect(() => {
    if (name) {
      setFirstName(name.split(" ")[0]);
      setLastName(name.split(" ")[1] ? name.split(" ")[1] : "");
    }
  }, [name, reset]);

  return (
    <div className="p-5">
      <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            Employee Details
          </h2>
          <FileUploader
            bgColor="#B79F61"
            setter={(path) => {
              setIsUpdated(true);
              setImageLocation(path);
            }}
          />
        </div>
        <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
        <form
          className="grid grid-cols-3 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="text-gray-700 self-center">
            First Name<span className="text-red-700">*</span>
          </label>
          <SearchableField
            fetchData={getSearchableFirstNameList}
            defaultValue={firstname}
            onChange={(value) => {
              setIsUpdated(true);
              setFirstName(value);
            }}
            placeholder="First Name"
            className="col-span-2"
            error={!firstname}
          />

          <label className="text-gray-700 self-center">
            Last Name<span className="text-red-700">*</span>
          </label>
          <SearchableField
            fetchData={getSearchableLastNameList}
            defaultValue={lastname}
            onChange={(value) => {
              setIsUpdated(true);
              setLastName(value);
            }}
            placeholder="Last Name"
            className="col-span-2"
            error={!lastname}
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
                  className={`rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg ${
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
            onChange={(value) => handleChange("ssn", value)}
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
              {!isValid || !isValidSSN(ssn) ? "Go Back" : "Cancel"}
            </button>
            <button
              type="submit"
              className={`py-2 px-6 md:px-16 ml-7 text-center text-white rounded-xl min-w-36 capitalize ${
                !isValid || !isValidSSN(ssn)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-BtnBg"
              }`}
              disabled={!isValid || !isValidSSN(ssn)}
            >
              Add
            </button>
          </div>
        </form>
        <ConfirmationModal
          type={confirmationType}
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onSubmit={() => navigate("/employees/manage-employees")}
          from="employee"
        />
        {confirmationType === "duplication" && (
          <ConfirmationModal
            type={confirmationType}
            open={openDuplicationDlg}
            onClose={() => {
              reset();
              setSSN(null);
              setImageLocation(null);
              setFirstName(null);
              setLastName(null);
              setOpenDuplicationDlg(false);
            }}
            onSubmit={() =>
              navigate("/employees/manage-employees/edit", {
                state: { id },
              })
            }
            from="employee"
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeNew;
