import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../common/TextInput";
import FileUploader from "../../common/FileUploader";
import PhoneNumberInput from "../../common/PhoneNumberInput";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { states } from "../../../utils/states";
import SearchableField from "../../common/SearchableField";
import { Button } from "@mui/material";

const BrokerForm = ({
  formType,
  setFormTypes,
  dataIds,
  setDataIds,
  contactFrom,
  setContactFrom,
  contacts,
  setContacts,
  setShowBrokerForm,
  contactFromRef = null,
  primaryID = null,
  setPrimaryID = null,
}) => {
  const [brokerName, setBrokerName] = useState(null);
  const [imageLocation, setImageLocation] = useState(null);
  const [brokerContacts, setBrokerContacts] = useState([]);

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState(formType);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);

  const brokerSchema = yup.object().shape({
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
    Broker_Email: yup
      .string()
      .email("Invalid email format")
      .required("Broker Email is required"),
    Broker_Webpage: yup.string(),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(brokerSchema),
    defaultValues: {
      Addr_1: "",
      Addr_2: "",
      City: "",
      State: "",
      Zip: "",
      Main_Phone: "",
      Fax_Phone: "",
      Broker_Email: "",
      Broker_Webpage: "",
    },
    mode: "onChange",
  });

  const handleCancel = useCallback(() => {
    if (isDirty || isUpdated || formType === "delete") {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      setShowBrokerForm(false);
    }
  }, [formType, isDirty, isUpdated, setShowBrokerForm]);

  const handleRemove = () => {
    setConfirmationType("delete");
    setOpenConfirmation(true);
  };

  const isDelete = formType === "delete";

  const getSearchableList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(`/brokers?keyword=${keyword}&size=10`);
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          ...item,
          id: item.BrokerID,
          name: item.Broker_Name,
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
    };

    const brokerPayload = {
      ...formData,
      Broker_Name: brokerName,
      Image_Location: imageLocation,
      ContactIDs:
        contacts && contacts.length > 0
          ? contacts.map((item) => item.ContactID)
          : [],
      Primary_Contact_ID: primaryID,
    };

    switch (confirmationType) {
      case "add":
        axios
          .post("/brokers", brokerPayload)
          .then((res) => {
            handleSuccess("Broker has been added successfully!");
            setOpenConfirmation(false);
            setFormTypes((prevData) => ({
              ...prevData,
              broker: "update",
            }));
            setDataIds((prevData) => ({
              ...prevData,
              broker: res.data.data.BrokerID,
            }));
            setIsUpdated(false);
          })
          .catch(handleError);
        break;

      case "delete":
        setOpenConfirmation(false);
        setDataIds((prevData) => ({
          ...prevData,
          broker: null,
        }));
        setShowBrokerForm(false);
        break;

      case "update":
        dataIds &&
          axios
            .put(`/brokers/${dataIds.broker}`, brokerPayload)
            .then((res) => {
              handleSuccess("Broker has been updated successfully!");
              setOpenConfirmation(false);
              setFormTypes((prevData) => ({
                ...prevData,
                broker: "update",
              }));
              setDataIds((prevData) => ({
                ...prevData,
                broker: null,
              }));
              reset({
                ...brokerPayload,
              });
              setIsUpdated(false);
            })
            .catch(handleError);
        break;

      case "cancel":
        setOpenConfirmation(false);
        setShowBrokerForm(false);
        setDataIds((prevData) => ({
          ...prevData,
          broker: null,
        }));
        break;

      default:
        console.warn("Unknown button action:", formType);
    }
  }, [
    formData,
    brokerName,
    imageLocation,
    primaryID,
    contacts,
    confirmationType,
    setDataIds,
    setShowBrokerForm,
    dataIds,
    formType,
    setFormTypes,
    reset,
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

  const getButtonColor = useCallback(() => {
    switch (formType) {
      case "add":
        return !isValid || !brokerName
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-BtnBg";
      case "update":
        return !isValid || !brokerName || (!isDirty && !isUpdated)
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-BtnBg";
      case "delete":
        return "bg-red-500";
      default:
        return "";
    }
  }, [brokerName, formType, isDirty, isUpdated, isValid]);

  const getButtonStatus = useCallback(() => {
    switch (formType) {
      case "add":
        return !isValid || !brokerName;
      case "update":
        return !isValid || !brokerName || (!isDirty && !isUpdated);
      case "delete":
        return false;
      default:
        return false;
    }
  }, [brokerName, formType, isDirty, isUpdated, isValid]);

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
    if (dataIds && dataIds.broker) {
      axios
        .get(`/brokers/${dataIds.broker}`)
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
            Broker_Email: data?.Broker_Email || "",
            Broker_Webpage: data?.Broker_Webpage || "",
          });
          setBrokerName(data?.Broker_Name || "");
          setImageLocation(data?.Image_Location || "");
          setBrokerContacts(
            sortContacts(data?.Contacts || [], data?.Primary_Contact_ID)
          );
          if (contactFrom === "broker") {
            setContacts(
              sortContacts(data?.Contacts || [], data?.Primary_Contact_ID)
            );
          }
          if (setPrimaryID) {
            setPrimaryID((prev) => {
              let tmp = { ...prev };
              tmp.broker = data?.Primary_Contact_ID;
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
    if (contactFrom === "broker") {
      setBrokerContacts(contacts);
      if (contacts.length !== brokerContacts.length) setIsUpdated(true);
    }
  }, [brokerContacts.length, contactFrom, contacts]);

  useEffect(() => {
    if (contactFromRef && contactFrom === "broker")
      contactFromRef.current.textContent = brokerName ? ": " + brokerName : "";
  }, [contactFrom, contactFromRef, brokerName]);

  return (
    <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-2 text-BtnBg">Broker</h2>
        <FileUploader
          bgColor="#41B6C4"
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
          Broker Name<span className="text-red-700">*</span>
        </label>
        <SearchableField
          fetchData={getSearchableList}
          defaultValue={brokerName}
          onChange={(value) => {
            if (typeof value === "string") {
              setIsUpdated(true);
              setBrokerName(value);
              setFormTypes((prevData) => ({
                ...prevData,
                broker: "add",
              }));
              setDataIds((prevData) => ({
                ...prevData,
                broker: null,
              }));
            } else {
              setIsUpdated(false);
              setBrokerName(value.name);
              setFormTypes((prevData) => ({
                ...prevData,
                broker: "update",
              }));
              setDataIds((prevData) => ({
                ...prevData,
                broker: value.id,
              }));
            }
          }}
          placeholder="Broker Name"
          className="col-span-2"
          error={!brokerName}
        />

        <label className="text-gray-700 self-center">Contacts</label>
        <div className="col-span-2">
          <Button
            variant="contained"
            color={contactFrom === "broker" ? "success" : "primary"}
            className="add-new-item"
            onClick={() => {
              setContactFrom("broker");
              setContacts(brokerContacts);
            }}
          >
            {contactFrom === "broker"
              ? "selected"
              : `${brokerContacts.length} contacts`}
          </Button>
        </div>

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
              error={errors.Main_Phone}
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
          Broker Email<span className="text-red-700">*</span>
        </label>
        <Controller
          name="Broker_Email"
          control={control}
          render={({ field }) => (
            <TextInput
              className="col-span-2"
              {...field}
              placeholder="Broker Email"
              disabled={isDelete}
              error={errors.Broker_Email}
            />
          )}
        />

        <label className="text-gray-700 self-center">Broker Webpage</label>
        <Controller
          name="Broker_Webpage"
          control={control}
          render={({ field }) => (
            <TextInput
              className="col-span-2"
              {...field}
              placeholder="Broker Webpage"
              disabled={isDelete}
            />
          )}
        />
        <div className="col-span-3 flex justify-end mt-3">
          {formType === "add" && (
            <button
              type="button"
              className="py-2 px-6 md:px-16 bg-BtnBg text-center  text-white rounded-xl min-w-36"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
          {formType === "update" && (
            <button
              type="button"
              className="py-2 px-6 md:px-16 bg-red-500 text-white rounded-xl min-w-36"
              onClick={handleRemove}
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            className={`py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize ${getButtonColor()}`}
            disabled={getButtonStatus()}
          >
            {formType} Broker
          </button>
        </div>
      </form>
      <ConfirmationModal
        type={confirmationType}
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onSubmit={onSubmit}
        from="broker"
      />
    </div>
  );
};

export default BrokerForm;
