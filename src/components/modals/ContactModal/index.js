import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Modal, Box, useMediaQuery, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import axios from "../../../api";
import TextInput from "../../common/TextInput";
import FileUploader from "../../common/FileUploader";
import PhoneNumberInput from "../../common/PhoneNumberInput";
import ConfirmationModal from "../../modals/ConfirmationModal";
import SearchableField from "../../common/SearchableField";
import { states } from "../../../utils/states";

const ContactModal = ({
  open,
  handleClose,
  formType,
  dataIds,
  setDataIds,
  contacts = [],
  setContacts,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [firstname, setFirstName] = useState(null);
  const [lastname, setLastName] = useState(null);
  const [imageLocation, setImageLocation] = useState(null);

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState(formType);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openDuplicationDlg, setOpenDuplicationDlg] = useState(false);
  const [formData, setFormData] = useState(null);

  const [dupId, setDupId] = useState(null);

  const contactSchema = Yup.object().shape({
    Addr_1: Yup.string().required("Address 1 is required"),
    Addr_2: Yup.string(),
    City: Yup.string().required("City is required"),
    State: Yup.string().required("State is required"),
    Zip: Yup.string()
      .required("Zip code is required")
      .matches(/^\d{5}$/, "Must be exactly 5 digits"),
    Main_Phone: Yup.string().required("Main Phone is required"),
    Mobile_Number: Yup.string(),
    Fax_Phone: Yup.string(),
    Email: Yup.string().required("Title is required"),
    Title: Yup.string().required("Title is required"),
    Responsibility: Yup.string().required("Job Description is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      Addr_1: "",
      Addr_2: "",
      City: "",
      State: "",
      Zip: "",
      Main_Phone: "",
      Mobile_Number: "",
      Fax_Phone: "",
      Email: "",
      Title: "",
      Responsibility: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(() => {
    const handleError = (err) => {
      console.error(err);
      toast.error(err.response?.data?.errorMessage || "internal server error");
    };

    const handleSuccess = (message) => {
      toast.success(message);
    };

    const contactPayload = {
      ...formData,
      First_Name: firstname && firstname.name ? firstname.name : firstname,
      Last_Name: lastname && lastname.name ? lastname.name : lastname,
      Image_Location: imageLocation,
    };

    switch (confirmationType) {
      case "add":
        if (dataIds.contact) {
          axios
            .put(`/contacts/${dataIds.contact}`, contactPayload)
            .then((res) => {
              setContacts((prevData) => [
                ...prevData.filter(
                  (item) => item.ContactID !== dataIds.contact
                ),
                res.data.data,
              ]);
              reset();
              setImageLocation(null);
              setFirstName(null);
              setLastName(null);
              setDataIds((prevData) => ({
                ...prevData,
                contact: null,
              }));
              setDupId(null);
              handleClose();
              setOpenConfirmation(false);
              handleSuccess("Contact updated successfully!");
            })
            .catch(handleError);
        } else {
          axios
            .post("/contacts", contactPayload)
            .then((res) => {
              reset();
              setImageLocation(null);
              setFirstName(null);
              setLastName(null);
              setDataIds((prevData) => ({
                ...prevData,
                contact: null,
              }));
              setDupId(null);
              handleClose();
              setOpenConfirmation(false);
              setContacts((prevData) => [...prevData, res.data.data]);
              handleSuccess("Contact added successfully!");
            })
            .catch(handleError);
        }
        break;

      case "delete":
        dataIds.contact &&
          axios
            .delete(`/contacts/${dataIds.contact}`)
            .then(() => {
              reset();
              setImageLocation(null);
              setFirstName(null);
              setLastName(null);
              setDataIds((prevData) => ({
                ...prevData,
                contact: null,
              }));
              setDupId(null);
              handleClose();
              setOpenConfirmation(false);
              setContacts((prevData) =>
                prevData.filter((item) => item.ContactID !== dataIds.contact)
              );
              handleSuccess("Contact deleted successfully!");
            })
            .catch(handleError);
        break;

      case "update":
        dataIds.contact &&
          axios
            .put(`/contacts/${dataIds.contact}`, contactPayload)
            .then((res) => {
              reset();
              setImageLocation(null);
              setFirstName(null);
              setLastName(null);
              setDataIds((prevData) => ({
                ...prevData,
                contact: null,
              }));
              setDupId(null);
              handleClose();
              setOpenConfirmation(false);
              setContacts((prevData) =>
                prevData.map((item) =>
                  item.ContactID === dataIds.contact
                    ? { ...res.data.data }
                    : item
                )
              );
              handleSuccess("Contact updated successfully!");
            })
            .catch(handleError);
        break;

      case "cancel":
        reset();
        setImageLocation(null);
        setFirstName(null);
        setLastName(null);
        setDataIds((prevData) => ({
          ...prevData,
          contact: null,
        }));
        setDupId(null);
        handleClose();
        setOpenConfirmation(false);
        break;

      default:
        console.warn("Unknown button action:", formType);
    }
  }, [
    formType,
    confirmationType,
    dataIds,
    firstname,
    formData,
    handleClose,
    imageLocation,
    lastname,
    reset,
    setContacts,
    setDataIds,
  ]);

  const formHandler = useCallback(
    (data) => {
      if (formType === "add") {
        setFormData(data);
        setConfirmationType(
          dataIds.contact &&
            contacts.find((item) => item.ContactID === dataIds.contact)
            ? "update"
            : "add"
        );
        setOpenConfirmation(true);
      } else if (formType === "update") {
        setFormData(data);
        setConfirmationType("update");
        setOpenConfirmation(true);
      } else {
        setConfirmationType("delete");
        setOpenConfirmation(true);
      }
    },
    [contacts, dataIds.contact, formType]
  );

  const getButtonColor = useCallback(() => {
    switch (formType) {
      case "add":
        if (
          dataIds.contact &&
          contacts.find((item) => item.ContactID === dataIds.contact)
        ) {
          return !isValid || !firstname || !lastname || (!isDirty && !isUpdated)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-BtnBg";
        } else {
          return !isValid || !firstname || !lastname
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-BtnBg";
        }
      case "update":
        return !isValid || !firstname || !lastname || (!isDirty && !isUpdated)
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-BtnBg";
      case "delete":
        return "bg-red-500";
      default:
        return "";
    }
  }, [
    contacts,
    dataIds.contact,
    firstname,
    formType,
    isDirty,
    isUpdated,
    isValid,
    lastname,
  ]);

  const getButtonStatus = useCallback(
    (type, name, dirty, updated, valid) => {
      switch (formType) {
        case "add":
          if (
            dataIds.contact &&
            contacts.find((item) => item.ContactID === dataIds.contact)
          ) {
            return (
              !isValid || !firstname || !lastname || (!isDirty && !isUpdated)
            );
          } else {
            return !isValid || !firstname || !lastname;
          }
        case "update":
          return (
            !isValid || !firstname || !lastname || (!isDirty && !isUpdated)
          );
        case "delete":
          return false;
        default:
          return false;
      }
    },
    [
      contacts,
      dataIds.contact,
      firstname,
      formType,
      isDirty,
      isUpdated,
      isValid,
      lastname,
    ]
  );

  const handleCancel = useCallback(() => {
    if (isDirty || isUpdated || formType === "delete") {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      reset();
      setImageLocation(null);
      setFirstName(null);
      setLastName(null);
      setDataIds((prevData) => ({
        ...prevData,
        contact: null,
      }));
      setDupId(null);
      handleClose();
    }
  }, [formType, handleClose, isDirty, isUpdated, reset, setDataIds]);

  const isDelete = formType === "Delete";

  const getSearchableFirstNameList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(
        `/contacts/firstname?keyword=${keyword}&size=5`
      );
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          id: item.ContactID,
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
        `/contacts/lastname?keyword=${keyword}&size=5`
      );
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          id: item.ContactID,
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
    formType !== "delete" &&
      firstname &&
      lastname &&
      axios
        .get(
          `/contacts/checkdup?firstname=${
            firstname && firstname.name ? firstname.name : firstname
          }&lastname=${lastname && lastname.name ? lastname.name : lastname}`
        )
        .then((res) => {
          if (res.data.code === 302) {
            setOpenDuplicationDlg(true);
            setConfirmationType("duplication");
            setDupId(res.data.data.id);
          }
        })
        .catch((err) => {
          console.error(err);
        });
  }, [firstname, formType, lastname]);

  useEffect(() => {
    if (dataIds && dataIds.contact) {
      axios
        .get(`/contacts/${dataIds.contact}`)
        .then((res) => {
          const { First_Name, Last_Name, Image_Location, ...data } =
            res.data.data;

          reset(data);
          setFirstName(First_Name);
          setLastName(Last_Name);
          setImageLocation(Image_Location);
          setIsUpdated(false);
        })
        .catch((err) => console.error(err));
    }
  }, [dataIds, reset]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="contact-modal-title"
      >
        <div className="bg-white w-11/12 md:max-w-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl max-w-[600px] overflow-y-auto">
          <div className="small_scroller p-5 md:py-6 md:px-10 max-h-[90vh] overflow-y-auto">
            <Box>
              {isMobile && (
                <IconButton
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
              <form onSubmit={handleSubmit(formHandler)}>
                <div className="w-full">
                  <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
                      Contacts
                    </h2>
                    <FileUploader
                      bgColor="#B79F61"
                      defaultValue={imageLocation}
                      setter={(path) => {
                        setIsUpdated(true);
                        setImageLocation(path);
                      }}
                      disabled={isDelete}
                    />
                  </div>
                  <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
                  <div className="grid grid-cols-3 gap-4">
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
                      disabled={formType !== "add"}
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
                      disabled={formType !== "add"}
                    />

                    <label className="text-gray-700 self-center">
                      Address 1<span className="text-red-700">*</span>
                    </label>
                    <Controller
                      name="Addr_1"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="col-span-2"
                          placeholder="Address 1"
                          disabled={isDelete}
                          error={!!errors.Addr_1}
                        />
                      )}
                    />

                    <label className="text-gray-700 self-center">
                      Address 2
                    </label>
                    <Controller
                      name="Addr_2"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="col-span-2"
                          placeholder="Address 2"
                          disabled={isDelete}
                        />
                      )}
                    />

                    <label className="text-gray-700 self-center">
                      City<span className="text-red-700">*</span>
                    </label>
                    <Controller
                      name="City"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="col-span-2"
                          placeholder="City"
                          disabled={isDelete}
                          error={!!errors.City}
                        />
                      )}
                    />

                    <label className="text-gray-700 self-center">
                      State<span className="text-red-700">*</span>
                    </label>
                    <Controller
                      name="State"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`col-span-2 grow uppercase rounded-lg py-2 px-4 bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg ${
                            !!errors.State
                              ? "bg-red-50 focus:!ring-red-200"
                              : ""
                          }`}
                          disabled={isDelete}
                        >
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      )}
                    />

                    <label className="text-gray-700 self-center">
                      ZIP<span className="text-red-700">*</span>
                    </label>
                    <Controller
                      name="Zip"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="col-span-2"
                          placeholder="Zip"
                          type="number"
                          maxLength={5}
                          disabled={isDelete}
                          error={!!errors.Zip}
                        />
                      )}
                    />

                    <label className="text-gray-700 self-center">
                      Main Phone<span className="text-red-700">*</span>
                    </label>
                    <Controller
                      name="Main_Phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneNumberInput
                          {...field}
                          disabled={isDelete}
                          error={!!errors.Main_Phone}
                        />
                      )}
                    />

                    <label className="text-gray-700 self-center">
                      Secondary Phone
                    </label>
                    <Controller
                      name="Mobile_Number"
                      control={control}
                      render={({ field }) => (
                        <PhoneNumberInput
                          {...field}
                          placeholder="Secondary Phone"
                          disabled={isDelete}
                        />
                      )}
                    />

                    <label className="text-gray-700 self-center">
                      Fax Phone
                    </label>
                    <Controller
                      name="Fax_Phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneNumberInput
                          {...field}
                          placeholder="Fax Phone"
                          disabled={isDelete}
                        />
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
                          {...field}
                          className="col-span-2"
                          placeholder="Email"
                          disabled={isDelete}
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
                          {...field}
                          className="col-span-2"
                          placeholder="Title"
                          disabled={isDelete}
                          error={!!errors.Title}
                        />
                      )}
                    />

                    <label className="text-gray-700 self-center">
                      Responsibility<span className="text-red-700">*</span>
                    </label>
                    <Controller
                      name="Responsibility"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="col-span-2"
                          placeholder="Responsibility"
                          disabled={isDelete}
                          error={!!errors.Responsibility}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-span-3 flex justify-end mt-4">
                  <button
                    type="button"
                    className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36"
                    onClick={handleCancel}
                  >
                    {getButtonStatus() ? "Go Back" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className={`py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize ${getButtonColor()}`}
                    disabled={getButtonStatus()}
                  >
                    {formType === "add"
                      ? dataIds.contact &&
                        contacts.find(
                          (item) => item.ContactID === dataIds.contact
                        )
                        ? "Update"
                        : "Add"
                      : formType}{" "}
                    Contact
                  </button>
                </div>
              </form>
            </Box>
          </div>
        </div>
      </Modal>
      {confirmationType === "duplication" ? (
        <ConfirmationModal
          type={confirmationType}
          open={openDuplicationDlg}
          onClose={() => {
            reset();
            setImageLocation(null);
            setFirstName(null);
            setLastName(null);
            setOpenDuplicationDlg(false);
            setDataIds((prevData) => ({
              ...prevData,
              contact: null,
            }));
            setDupId(null);
          }}
          onSubmit={() => {
            setConfirmationType("update");
            setDataIds((prevData) => ({
              ...prevData,
              contact: dupId,
            }));
            setOpenDuplicationDlg(false);
            setDupId(null);
          }}
        />
      ) : (
        <ConfirmationModal
          type={confirmationType}
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onSubmit={onSubmit}
          from="contact"
        />
      )}
    </>
  );
};

export default ContactModal;
