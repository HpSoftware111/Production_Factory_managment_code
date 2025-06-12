import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../common/TextInput";
import FileUploader from "../../common/FileUploader";
import PhoneNumberInput from "../../common/PhoneNumberInput";
import SearchableField from "../../common/SearchableField";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { states } from "../../../utils/states";
import { Button } from "@mui/material";

const VendorForm = ({
  formType,
  setFormTypes,
  dataIds,
  setDataIds,
  contactFrom,
  setContactFrom,
  contacts,
  setContacts,
  showBrokerForm,
  setShowBrokerForm,
  contactFromRef = null,
  primaryID = null,
  setPrimaryID = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { name } = location.state;

  const [vendorName, setVendorName] = useState(null);
  const [imageLocation, setImageLocation] = useState(null);
  const [vendorContacts, setVendorContacts] = useState([]);

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState(formType);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);

  const [prevId, setPrevId] = useState(null);

  const vendorSchema = yup.object().shape({
    Addr_1: yup.string().required("Address 1 is required"),
    Addr_2: yup.string(),
    City: yup.string().required("City is required"),
    State: yup
      .string()
      .required("State is required")
      .max(2, "State code should be 2 characters"),
    Zip: yup
      .string()
      .required("Zip is required")
      .matches(/^\d{5}$/, "Zip should be 5 digits"),
    Main_Phone: yup.string().required("Main Phone is required"),
    Fax_Phone: yup.string(),
    Vendor_Email: yup
      .string()
      .email("Invalid email format")
      .required("Vendor Email is required"),
    Vendor_Webpage: yup.string(),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(vendorSchema),
    defaultValues: {
      Addr_1: "",
      Addr_2: "",
      City: "",
      State: "",
      Zip: "",
      Main_Phone: "",
      Fax_Phone: "",
      Vendor_Email: "",
      Vendor_Webpage: "",
    },
    mode: "onChange",
  });

  const handleCancel = useCallback(() => {
    if (isDirty || isUpdated || formType === "delete") {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      navigate("/vendor/manage-vendors");
    }
  }, [formType, isDirty, isUpdated, navigate]);

  const isDelete = formType === "delete";

  const getSearchableList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(`/vendors/names?keyword=${keyword}&size=10`);
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          id: item.VendorID,
          name: item.Vendor_Name,
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

  const onSubmit = useCallback(() => {
    const handleError = (err) => {
      console.error(err);
      toast.error(err.response?.data?.errorMessage || "internal server error");
    };

    const handleSuccess = (message) => {
      toast.success(message);
      navigate("/vendor/manage-vendors");
    };

    const vendorPayload = {
      ...formData,
      Vendor_Name: vendorName,
      Image_Location: imageLocation,
      BrokerID: dataIds.broker,
      ContactIDs:
        contacts && contacts.length > 0
          ? contacts.map((item) => item.ContactID)
          : [],
      Primary_Contact_ID: primaryID,
    };

    switch (confirmationType) {
      case "add":
        axios
          .post("/vendors", vendorPayload)
          .then((res) => {
            handleSuccess("Vendor has been added successfully!");
          })
          .catch(handleError);
        break;

      case "delete":
        dataIds &&
          axios
            .delete(`/vendors/${dataIds.vendor}`)
            .then((res) => {
              handleSuccess("Vendor has been deleted successfully!");
            })
            .catch(handleError);
        break;

      case "update":
        dataIds &&
          axios
            .put(`/vendors/${dataIds.vendor}`, vendorPayload)
            .then(() => {
              handleSuccess("Vendor has been updated successfully!");
            })
            .catch(handleError);
        break;

      case "cancel":
        // navigate("/vendor/manage-vendors");
        reset();
        setOpenConfirmation(false);
        setIsUpdated(false);
        break;

      default:
        console.warn("Unknown button action:", formType);
    }
  }, [
    confirmationType,
    contacts,
    dataIds,
    primaryID,
    formData,
    formType,
    imageLocation,
    navigate,
    vendorName,
  ]);

  const formHandler = useCallback(
    (data) => {
      switch (formType) {
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
    [formType]
  );

  const getButtonColor = (type, name, dirty, updated, valid) => {
    switch (type) {
      case "add":
        return !valid || !name ? "bg-gray-400 cursor-not-allowed" : "bg-BtnBg";
      case "update":
        return !valid || !name || (!dirty && !updated)
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-BtnBg";
      case "delete":
        return "bg-red-500";
      default:
        return "";
    }
  };

  const getButtonStatus = (type, name, dirty, updated, valid) => {
    switch (type) {
      case "add":
        return !valid || !name ? true : false;
      case "update":
        return !valid || !name || (!dirty && !updated) ? true : false;
      case "delete":
        return false;
      default:
        return false;
    }
  };

  /**
   * Sorts an array of contact objects, placing the contact with the specified primaryID at the beginning.
   *
   * @param {Array} contacts - The array of contact objects to be sorted.
   * @param {number|string} primaryID - The ID of the primary contact to be placed at the beginning of the array.
   * @returns {Array} The sorted array of contact objects, with the primary contact first if primaryID is provided.
   */
  const sortContacts = (contacts, primaryID) => {
    if (primaryID) {
      const sortedContacts = (contacts || []).sort((a, b) => {
        if (a.ContactID === primaryID) return -1;
        if (b.ContactID === primaryID) return 1;
        return 0;
      });
      return sortedContacts;
    } else {
      return contacts || [];
    }
  };

  useEffect(() => {
    name && setVendorName(name);
  }, [name]);

  useEffect(() => {
    if (dataIds && dataIds.vendor) {
      axios
        .get(`/vendors/${dataIds.vendor}`)
        .then((res) => {
          const data = res.data.data;

          reset({
            Addr_1: data?.Addr_1 || "",
            Addr_2: data?.Addr_2 || "",
            City: data?.City || "",
            State: data?.State || "",
            Zip: data?.Zip || "",
            Main_Phone: data?.Main_Phone || "",
            Fax_Phone: data?.Fax_Phone || "",
            Vendor_Email: data?.Vendor_Email || "",
            Vendor_Webpage: data?.Vendor_Webpage || "",
          });
          setVendorName(data?.Vendor_Name || "");
          setImageLocation(data?.Image_Location || "");
          setVendorContacts();
          setVendorContacts(
            sortContacts(data?.Contacts, data?.Primary_Contact_ID)
          );
          if (contactFrom === "vendor") {
            setContacts(sortContacts(data?.Contacts, data?.Primary_Contact_ID));
          }
          if (setPrimaryID) {
            setPrimaryID((prev) => {
              let tmp = { ...prev };
              tmp.vendor = data?.Primary_Contact_ID;
              return tmp;
            });
          }
          setIsUpdated(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [contactFrom, dataIds, reset, setContacts, setPrimaryID]);

  useEffect(() => {
    if (formType === "reset") {
      reset({
        Addr_1: "",
        Addr_2: "",
        City: "",
        State: "",
        Zip: "",
        Main_Phone: "",
        Fax_Phone: "",
        Vendor_Email: "",
        Vendor_Webpage: "",
      });
      setVendorName(null);
      setImageLocation(null);
      setVendorContacts([]);
      setContacts([]);
      if (setPrimaryID) {
        setPrimaryID((prev) => {
          let tmp = { ...prev };
          tmp.vendor = null;
          return tmp;
        });
      }
    }
  }, [formType, reset, setContacts, setPrimaryID]);

  useEffect(() => {
    if (prevId !== dataIds.broker) {
      setIsUpdated(true);
      setPrevId(dataIds.broker);
    }
  }, [dataIds.broker, prevId]);

  useEffect(() => {
    if (contactFrom === "vendor") {
      setVendorContacts(contacts);
      if (contacts.length !== vendorContacts.length) setIsUpdated(true);
    }
  }, [contactFrom, contacts, vendorContacts.length]);

  useEffect(() => {
    if (contactFromRef && contactFrom === "vendor")
      contactFromRef.current.textContent = vendorName ? ": " + vendorName : "";
  }, [contactFrom, contactFromRef, vendorName]);

  return (
    <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-2 text-BtnBg">Vendor</h2>
        <FileUploader
          bgColor="#A1DAB4"
          defaultValue={imageLocation}
          setter={(path) => {
            setIsUpdated(true);
            setImageLocation(path);
          }}
          disabled={isDelete}
        />
      </div>
      <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
      <form
        onSubmit={handleSubmit(formHandler)}
        className="grid grid-cols-3 gap-4"
      >
        <label className="text-gray-700 self-center">
          Vendor Name<span className="text-red-700">*</span>
        </label>
        <SearchableField
          fetchData={getSearchableList}
          defaultValue={vendorName}
          onChange={(value) => {
            if (typeof value === "string") {
              setIsUpdated(true);
              setVendorName(value);
            } else {
              setIsUpdated(true);
              setVendorName(value.name);
            }
          }}
          placeholder="Vendor Name"
          className="col-span-2"
          disabled={isDelete}
          error={!vendorName}
        />

        <label className="text-gray-700 self-center">Contacts</label>
        <div className="col-span-2">
          <Button
            variant="contained"
            color={contactFrom === "vendor" ? "success" : "primary"}
            className="add-new-item"
            onClick={() => {
              setContactFrom("vendor");
              setContacts(vendorContacts);
            }}
          >
            {contactFrom === "vendor"
              ? "selected"
              : `${vendorContacts.length} contacts`}
          </Button>
        </div>

        <label
          id={`label-${Math.round(Math.random() * 1000)}`}
          className="text-gray-700 self-center"
        >
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
              disabled={isDelete}
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
              disabled={isDelete}
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
                disabled={isDelete}
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
                disabled={isDelete}
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
                disabled={isDelete}
                error={!!errors.Zip}
              />
            )}
          />
        </div>

        <label className="text-gray-700 self-center">
          Main Phone<span className="text-red-700">*</span>
        </label>
        <Controller
          name="Main_Phone"
          control={control}
          render={({ field }) => (
            <PhoneNumberInput
              className="col-span-2"
              {...field}
              placeholder="Main Phone"
              disabled={isDelete}
              error={!!errors.Main_Phone}
            />
          )}
        />

        <label className="text-gray-700 self-center">Fax Phone</label>
        <Controller
          name="Fax_Phone"
          control={control}
          render={({ field }) => (
            <PhoneNumberInput
              className="col-span-2"
              {...field}
              placeholder="Fax Phone"
              disabled={isDelete}
            />
          )}
        />

        <label className="text-gray-700 self-center">
          Vendor Email<span className="text-red-700">*</span>
        </label>
        <Controller
          name="Vendor_Email"
          control={control}
          render={({ field }) => (
            <TextInput
              className="col-span-2"
              {...field}
              placeholder="Vendor Email"
              disabled={isDelete}
              error={!!errors.Vendor_Email}
            />
          )}
        />

        <label className="text-gray-700 self-center">Vendor Webpage</label>
        <Controller
          name="Vendor_Webpage"
          control={control}
          render={({ field }) => (
            <TextInput
              className="col-span-2"
              {...field}
              placeholder="Vendor Webpage"
              disabled={isDelete}
            />
          )}
        />

        <div className="col-span-3 flex justify-end mt-3">
          <button
            type="button"
            className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36"
            onClick={handleCancel}
          >
            {getButtonStatus(formType, vendorName, isDirty, isUpdated, isValid)
              ? "Go Back"
              : "Cancel"}
          </button>
          <button
            type="submit"
            className={`py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize ${getButtonColor(
              formType,
              vendorName,
              isDirty,
              isUpdated,
              isValid
            )}`}
            disabled={getButtonStatus(
              formType,
              vendorName,
              isDirty,
              isUpdated,
              isValid
            )}
          >
            {formType} Vendor
          </button>
        </div>
      </form>
      <ConfirmationModal
        type={confirmationType}
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onSubmit={onSubmit}
        from="vendor"
      />
    </div>
  );
};

export default VendorForm;
