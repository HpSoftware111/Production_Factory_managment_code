import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal, Box, Select, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../common/TextInput";
import ConfirmationModal from "../ConfirmationModal";

const SystemReportModal = ({ open, handleClose, btnValue, id, onSubmit }) => {
  const SYSTEM_REPORT_NAMES = ["Received Inventory", "Rejected Inventory"];

  const SYSTEM_REPORT_DESCS = [
    "Print the label for Received Inventory",
    "Print the label for Rejected Inventory",
  ];

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState(
    btnValue.toLowerCase()
  );
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);
  const [reportType, setReportType] = useState("System Report");
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(null);
  const [printerName, setPrinterName] = useState([]);
  const [printers, setPrinters] = useState([]);
  const [printer, setPrinter] = useState(null);
  const [paperType, setPaperType] = useState("8.5 x 11 Sheet");

  const [reportName, setReportName] = useState(SYSTEM_REPORT_NAMES[0]);
  const [reportDescription, setReportDescription] = useState(
    SYSTEM_REPORT_DESCS[0]
  );
  const reportSchema = yup.object().shape({
    Report_Name: yup.string().required("Name is required"),
    Report_Description: yup.string().required("Description is required"),
    Paper_Type: yup.string().required("Paper type is required"),
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(reportSchema),
    defaultValues: {
      Report_Name: btnValue || "",
      Report_Description: btnValue == "add" ? SYSTEM_REPORT_DESCS[0] : "",
      Report_Type: btnValue == "add" ? "System Report" : "",
      Paper_Type: "8.5 x 11 Sheet",
    },
    mode: "onChange",
  });

  const handleModalClose = useCallback(() => {
    reset();
    setGroup(null);
    setPrinter(null);
    setReportType(null);
    handleClose();
  }, [handleClose, reset]);

  const resetData = () => {
    console.log("🚀🚀🚀", id);
    if (id) {
      getReportByID(id);
    } else {
      // reset();
      setPrinter(null);
      // setReportType(null);
      setPaperType(null);
    }
    setIsUpdated(false);
    setConfirmationType(btnValue.toLowerCase());
  };

  const submitHandler = useCallback(() => {
    const handleError = (err) => {
      console.error(err);
      toast.error(err.response?.data?.errorMessage || "internal server error");
    };

    const handleSuccess = (message) => {
      toast.success(message);
      handleModalClose();
    };

    const reportPayload = {
      Report_Name: formData ? formData.Report_Name : "",
      Report_Description: formData ? formData.Report_Description : "",
      Report_Type: reportType,
      Paper_Type: paperType || "8.5 x 11 Sheet",
      PrinterID: printer ? printer : null,
      GroupID: group ? group : null,
    };

    switch (confirmationType) {
      case "add":
        axios
          .post("/reports", reportPayload)
          .then((res) => {
            handleSuccess("Report added Successfully");
            setOpenConfirmation(false);
            onSubmit(true);
            handleModalClose();
          })
          .catch(handleError);
        break;
      case "update":
        axios.put(`/reports/${id}`, reportPayload).then((res) => {
          handleSuccess("Report updated Successfully");
          setOpenConfirmation(false);
          onSubmit(true);
          handleModalClose();
        });
        break;
      case "delete":
        axios.delete(`/reports/${id}`).then((res) => {
          handleSuccess("Report Deleted Successfully");
          setOpenConfirmation(false);
          onSubmit(true);
          handleModalClose();
        });
        break;
      case "cancel":
        setOpenConfirmation(false);
        // handleModalClose();
        resetData();
        break;
      default:
        console.warn("Unknown button action:", btnValue);
    }
  }, [
    btnValue,
    confirmationType,
    formData,
    group,
    handleModalClose,
    id,
    onSubmit,
    paperType,
    printer,
    reportType,
  ]);

  const formHandler = useCallback(
    (data) => {
      switch (confirmationType) {
        case "add":
          setFormData({
            ...data,
            Report_Name: reportName,
            Report_Description:
              SYSTEM_REPORT_DESCS[SYSTEM_REPORT_NAMES.indexOf(reportName)],
          });
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
    [confirmationType]
  );

  const handleCancel = useCallback(() => {
    if (isDirty || isUpdated || btnValue === "delete") {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      handleModalClose();
      // handleClose();
    }
  }, [btnValue, handleClose, isDirty, isUpdated]);

  const isDelete = btnValue === "delete";

  useEffect(() => {
    setConfirmationType(btnValue.toLowerCase());
  }, [btnValue]);

  useEffect(() => {
    axios.get("/groups").then((res) => {
      setGroups(res.data.data);
      if (btnValue === "add") {
        const inventoryGroup = res.data.data.find(
          (group) => group.Group_Name === "Inventory Reports"
        );
        if (inventoryGroup) {
          setGroup(inventoryGroup.GroupID);
        }
      }
    });
    axios.get("/printers").then((res) => {
      setPrinters(res.data.data);
    });
  }, []);

  const getReportByID = (id) => {
    if (id) {
      axios
        .get(`/reports/${id}`)
        .then((res) => {
          let info = res.data.data;
          reset({
            Report_Name: info.Report_Name,
            Report_Description: info.Report_Description,
            Paper_Type: info.Paper_Type,
          });
          setReportType(info.Report_Type);
          setGroup(info.Group.GroupID);
          setPrinter(info.Printer.PrinterID);
          setPaperType(info.Paper_Type);
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    getReportByID(id);
  }, [id, reset]);

  //
  const handleUpdateReportName = (e) => {
    const selectedReportName = e.target.value;
    setReportName(selectedReportName);
    setReportDescription(
      SYSTEM_REPORT_DESCS[SYSTEM_REPORT_NAMES.indexOf(selectedReportName)]
    );
    setIsUpdated(true);
    setFormData({
      Report_Name: selectedReportName,
      Report_Description:
        SYSTEM_REPORT_DESCS[SYSTEM_REPORT_NAMES.indexOf(selectedReportName)],
    });
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="inventory-detail-modal-title"
      >
        <div className="bg-white w-11/12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl max-w-[700px] overflow-y-auto">
          <form
            onSubmit={handleSubmit(formHandler)}
            className="small_scroller p-5 md:py-6 md:px-10 max-h-[90vh] overflow-y-auto"
          >
            <Box>
              <div className="flex flex-col">
                <h2
                  id="inventory-detail-modal-title"
                  className="text-xl font-semibold mb-2 text-BtnBg"
                >
                  {btnValue.charAt(0).toUpperCase() + btnValue.slice(1)} Report
                </h2>
                <div className="border-b border-gray-300 mb-4"></div>
              </div>
              <div className="grid grid-cols-3 gap-4 ">
                <label className="text-gray-700 self-center">
                  Report Name<span className="text-red-700">*</span>
                </label>
                {btnValue === "add" ? (
                  <Select
                    labelId="type-selector-label"
                    id="type-selector"
                    className="bg-[#f4f4f4] col-span-2"
                    value={reportName}
                    onChange={handleUpdateReportName}
                    disabled={false}
                    placeholder="Select Type"
                    size="small"
                  >
                    {SYSTEM_REPORT_NAMES.map((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Controller
                    name="Report_Name"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        type="text"
                        className="col-span-2"
                        {...field}
                        disabled={true}
                        error={!!errors.Report_Name}
                      />
                    )}
                  />
                )}

                <label className="text-gray-700 self-center">
                  Report Description<span className="text-red-700">*</span>
                </label>
                {btnValue === "add" ? (
                  <TextInput
                    type="text"
                    className="col-span-2"
                    value={reportDescription}
                    disabled={true}
                  />
                ) : (
                  <Controller
                    name="Report_Description"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        type="text"
                        className="col-span-2"
                        {...field}
                        disabled={true}
                        error={!!errors.Report_Description}
                      />
                    )}
                  />
                )}

                <label className="text-gray-700 self-center">
                  Report Type<span className="text-red-700">*</span>
                </label>
                <Select
                  labelId="type-selector-label"
                  id="type-selector"
                  className="bg-[#f4f4f4] col-span-2"
                  value={reportType}
                  onChange={(e) => {
                    setIsUpdated(true);
                    setReportType(e.target.value);
                  }}
                  disabled={true}
                  placeholder="Select Type"
                  size="small"
                >
                  <MenuItem value="System Report">System Report</MenuItem>
                  <MenuItem value="Client Report">Client Report</MenuItem>
                  <MenuItem value="Custom Report">Custom Report</MenuItem>
                </Select>

                {printers && printers.length > 0 && (
                  <>
                    <label className="text-gray-700 self-center">
                      Printer<span className="text-red-700">*</span>
                    </label>
                    <Select
                      labelId="printer-selector-label"
                      id="printer-selector"
                      className="bg-[#f4f4f4] col-span-2"
                      value={printer}
                      onChange={(e) => {
                        setIsUpdated(true);
                        setPrinter(e.target.value);
                      }}
                      disabled={isDelete}
                      placeholder="Select Printer"
                      size="small"
                    >
                      {printers.map((item) => (
                        <MenuItem value={item.PrinterID}>
                          {item.Printer_Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}

                <label className="text-gray-700 self-center">
                  Group<span className="text-red-700">*</span>
                </label>
                <Select
                  labelId="group-selector-label"
                  id="group-selector"
                  className="bg-[#f4f4f4] col-span-2"
                  value={group}
                  onChange={(e) => {
                    setIsUpdated(true);
                    setGroup(e.target.value);
                  }}
                  disabled={true}
                  placeholder="Select Group"
                  size="small"
                >
                  {groups.map((item) => (
                    <MenuItem value={item.GroupID}>{item.Group_Name}</MenuItem>
                  ))}
                </Select>

                <>
                  <label className="text-gray-700 self-center">
                    Paper Type<span className="text-red-700">*</span>
                  </label>

                  <Select
                    // labelId="type-selector-label"
                    id="type-selector"
                    className="bg-[#f4f4f4] col-span-2"
                    value={paperType}
                    onChange={(e) => {
                      setIsUpdated(true);
                      setPaperType(e.target.value);
                    }}
                    disabled={isDelete}
                    placeholder="Select Paper Type"
                    size="small"
                  >
                    <MenuItem value="8.5 x 11 Sheet">8.5 x 11 Sheet</MenuItem>
                    <MenuItem value="4 x 6 T Label">4 x 6 T Label</MenuItem>
                  </Select>
                </>
              </div>
              <div className="col-span-3 flex justify-end mt-5">
                <button
                  type="button"
                  className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36"
                  onClick={handleCancel}
                >
                  {(
                    btnValue !== "delete"
                      ? btnValue === "add"
                        ? !isValid || !group || !printer
                        : !isValid ||
                          !group ||
                          !printer ||
                          (!isDirty && !isUpdated)
                      : false
                  )
                    ? "Go Back"
                    : "Cancel"}
                </button>
                <button
                  type="submit"
                  className={`py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize ${
                    btnValue === "delete"
                      ? "bg-red-500"
                      : btnValue === "add"
                      ? !isValid || !group || !printer || !paperType
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-BtnBg"
                      : !isValid ||
                        !group ||
                        !printer ||
                        (!isDirty && !isUpdated)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-BtnBg"
                  }`}
                  disabled={
                    btnValue !== "delete"
                      ? btnValue === "add"
                        ? !isValid || !group || !printer || !paperType
                        : !isValid ||
                          !group ||
                          !printer ||
                          (!isDirty && !isUpdated)
                      : false
                  }
                >
                  {btnValue}
                </button>
              </div>
            </Box>
          </form>
        </div>
      </Modal>
      <ConfirmationModal
        type={confirmationType}
        open={openConfirmation}
        onClose={() => {
          setOpenConfirmation(false);
        }}
        onSubmit={submitHandler}
        from="inventory"
      />
    </>
  );
};

export default SystemReportModal;
