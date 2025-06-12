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
import AccessLevelModal from "../../../components/modals/AccessLevelModal";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { getImagePath } from "../../../utils/imagePath";

const UserEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [username, setUsername] = useState(null);
  const [openModifyModal, setOpenModifyModal] = useState(false);
  const [accessLevels, setAccessLevels] = useState(null);

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

  const userSchema = Yup.object().shape({
    Password: Yup.string().required("Password is required"),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      Password: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(() => {
    if (confirmationType === "update") {
      axios
        .put(`/users/${id}`, {
          ...formData,
          User_Name: username.name ? username.name : username,
          EmployeeID: employee ? employee.id : null,
          accessLevels: accessLevels,
        })
        .then((res) => {
          toast.success(`Employee updated successfully!`);
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
  }, [
    accessLevels,
    confirmationType,
    employee,
    formData,
    id,
    navigate,
    username,
  ]);

  const handleCancel = () => {
    if (isDirty || isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      navigate(-1);
    }
  };

  const getSearchableEmployeeList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(`/employees/name?keyword=${keyword}&size=5`);
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          id: item.EmployeeID,
          name: `${item.First_Name} ${item.Last_Name}`,
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

  const employeeChangeHandler = useCallback(
    (value) => {
      if (employee !== value) {
        setEmployee(value);
        setIsUpdated(true);
      }
    },
    [employee]
  );

  const getSearchableUserList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(`/users/name?keyword=${keyword}&size=5`);
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          id: item.UserID,
          name: item.User_Name,
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

  const userChangeHandler = useCallback(
    (value) => {
      if (username !== value) {
        setUsername(value);
        setIsUpdated(true);
      }
    },
    [username]
  );

  const handleModifyAccessOpen = () => {
    setOpenModifyModal(true);
  };

  const handleModifyAccessClose = () => {
    setOpenModifyModal(false);
  };

  useEffect(() => {
    if (id > 0) {
      axios
        .get(`/users/${id}`)
        .then((res) => {
          const data = res.data.data;
          reset({
            Password: data.Password,
          });
          setEmployee({
            name: data.Employee_Name,
            Image_Location: data.Image_Location,
          });
          setUsername(data.User_Name);
          data.Access_Level
            ? setAccessLevels(data.Access_Level)
            : setAccessLevels({
                Inventory: [],
                Production: [],
                Orders: [],
                Employees: [],
                Vendors: [],
                Reports: [],
                Settings: [],
              });
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
            fetchData={getSearchableEmployeeList}
            defaultValue={employee}
            onChange={employeeChangeHandler}
            placeholder="Employee Name"
            className="col-span-2"
            error={!employee}
            disabled={true}
          />

          <label className="text-gray-700 self-center">
            Username<span className="text-red-700">*</span>
          </label>
          <SearchableField
            fetchData={getSearchableUserList}
            defaultValue={username}
            onChange={userChangeHandler}
            placeholder="User Name"
            className="col-span-2"
            error={!username}
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
                placeholder="Password"
                {...field}
                error={!!errors.Password}
              />
            )}
          />

          <label className="text-gray-700 self-center">Access Level</label>
          <button
            type="button"
            className={`col-span-1 py-2 px-4 min-w-48 ${
              !isValid || !employee || !username
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#1479ff] bg-opacity-20 text-[#1479ff]"
            } rounded-xl font-bold`}
            onClick={handleModifyAccessOpen}
            disabled={!isValid || !employee || !username}
          >
            Modify Access
          </button>
          <div className="col-span-3 flex justify-end mt-3">
            <button
              type="button"
              className="py-2 px-6 md:px-16 bg-BtnBg text-white rounded-xl min-w-36"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize ${
                !isValid || !employee || !username || (!isDirty && !isUpdated)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-BtnBg"
              }`}
              disabled={
                !isValid || !employee || !username || (!isDirty && !isUpdated)
              }
            >
              Update
            </button>
          </div>
        </form>
        {accessLevels && (
          <AccessLevelModal
            open={openModifyModal}
            handleClose={handleModifyAccessClose}
            selectedAccess={accessLevels}
            setSelectedAccess={setAccessLevels}
            userName={employee ? employee.name : ""}
            imageLocation={employee ? employee.Image_Location : null}
          />
        )}
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

export default UserEdit;
