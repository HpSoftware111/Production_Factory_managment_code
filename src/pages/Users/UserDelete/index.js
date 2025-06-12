import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Avatar from "@mui/material/Avatar";

import axios from "../../../api";
import PasswordInput from "../../../components/common/PasswordInput";
import SearchableField from "../../../components/common/SearchableField";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { getImagePath } from "../../../utils/imagePath";

const UserDelete = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [username, setUsername] = useState(null);

  const [confirmationType, setConfirmationType] = useState("delete");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const formHandler = () => {
    setConfirmationType("delete");
    setOpenConfirmation(true);
  };

  const { id } = location.state || {};

  const userSchema = Yup.object().shape({
    Password: Yup.string().required("Password is required"),
  });

  const { handleSubmit, control, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(userSchema),
    defaultValues: {
      Password: "",
    },
  });

  const onSubmit = useCallback(() => {
    if (confirmationType === "delete") {
      axios
        .delete(`/users/${id}`)
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
    if (id > 0) {
      axios
        .get(`/users/${id}`)
        .then((res) => {
          const data = res.data.data;
          reset({
            User_Name: data.User_Name,
            Password: data.Password,
          });
          setEmployee({
            name: data.Employee_Name,
            Image_Location: data.Image_Location,
          });
          setUsername(data.User_Name);
        })
        .catch((err) => console.error(err));
    }
  }, [id, reset]);

  return (
    <div className="p-5">
      <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            User Details
          </h2>
          <Avatar
            src={employee ? getImagePath(employee.Image_Location) : ""}
            sx={{ backgroundColor: "#41B6C4", cursor: "pointer" }}
          >
            {employee
              ? employee.name
                ? employee.name.charAt(0)
                : employee.charAt(0)
              : "?"}
          </Avatar>
        </div>
        <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
        <form
          onSubmit={handleSubmit(formHandler)}
          className="grid grid-cols-3 gap-4"
        >
          <label className="text-gray-700 self-center">
            Employee Name<span className="text-red-700">*</span>
          </label>
          <SearchableField
            defaultValue={employee}
            className="col-span-2"
            disabled={true}
          />

          <label className="text-gray-700 self-center">
            Username<span className="text-red-700">*</span>
          </label>
          <SearchableField
            defaultValue={username}
            placeholder="User Name"
            className="col-span-2"
          />

          <label className="text-gray-700 self-center">
            Password<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                className="col-span-2"
                {...field}
                disabled={true}
              />
            )}
          />

          <label className="text-gray-700 self-center">Access Level</label>
          <button
            type="button"
            className="col-span-1 py-2 px-4 min-w-48 bg-gray-400 cursor-not-allowed text-white rounded-xl font-bold"
            disabled={true}
          >
            Modify Access
          </button>
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

export default UserDelete;
