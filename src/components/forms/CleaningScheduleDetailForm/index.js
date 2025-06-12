// import React, { useCallback, useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import Field from "../../common/Field";
// import SearchableField from "../../common/SearchableField";
// import ConfirmationModal from "../../modals/ConfirmationModal";
// import RecurringScheduler from "../../common/RecurringScheduler";
// import { useNavigate } from "react-router-dom";
// import axios from "../../../api";
// import * as Yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import AsyncMultiSelect from "../../common/AsyncMultiSelect";
// import { set } from "date-fns";
// import { Switch } from "@mui/material";
//
// const CleaningScheduleDetailForm = ({
//   id,
//   cleaningJobID,
//   btnValue = "add",
//   //  onSubmit
// }) => {
//   const navigate = useNavigate();
//
//   const equipmentSchema = Yup.object().shape({
//     Procedure: Yup.string().required("Procedure is required"),
//     Description: Yup.string().required("Description is required"),
//     Notify: Yup.number().integer(),
//     // Cleaning_JobID: Yup.number().integer().required("Cleaning Job is required"),
//     // EmployeeID: Yup.number().integer().required("Employee is required"),
//   });
//
//   const {
//     handleSubmit,
//     control,
//     reset,
//     setValue,
//     formState: { errors, isDirty, isValid },
//   } = useForm({
//     resolver: yupResolver(equipmentSchema),
//     defaultValues: {
//       Procedure: "",
//       Description: "",
//       Notify: 0,
//       // Cleaning_JobID: null,
//       // EmployeeID: null,
//     },
//     mode: "onChange",
//   });
//
//   const [equipments, setEquipments] = useState([]);
//   const [selectedEquipment, setSelectedEquipment] = useState(null);
//
//   // const [cleaningJobs, setCleaningJobs] = useState([]);
//   const [selectedCleaningJob, setSelectedCleaningJob] = useState(null);
//
//   // const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//
//   // Default Scheduler Data
//   const defaultScheduler = {
//     ScheduleType: "one-time",
//     StartDate: new Date().toISOString().split("T")[0],
//     StartTime: new Date().toLocaleTimeString("en-US", { hour12: false }),
//     TimeOfDay: new Date().toLocaleTimeString("en-US", { hour12: false }),
//   };
//   const [schedulerData, setSchedulerData] = useState(defaultScheduler);
//
//   const [formData, setFormData] = useState(null);
//   const [isUpdated, setIsUpdated] = useState(false);
//   const [openConfirmation, setOpenConfirmation] = useState(false);
//   const [confirmationType, setConfirmationType] = useState("");
//
//   const getCleaningScheduleById = (id) => {
//     axios
//       .get(`/cleaningSchedules/${id}`)
//       .then((res) => {
//         const info = res.data.data;
//         console.log("🚀🚀🚀Cleaning Schedule Info:", info);
//         reset({
//           Procedure: info.Procedure,
//           Description: info.Description,
//           Notify: info.Schedule_Table.Notify ? 1 : 0,
//         });
//
//         setSelectedCleaningJob({
//           id: info.Cleaning_Job.Cleaning_JobID,
//           name: info.Cleaning_Job.Cleaning_Name,
//           EquipmentID: info.Cleaning_Job.EquipmentID,
//         });
//
//         setSchedulerData(info.Schedule_Table);
//         setSelectedEmployee({
//           id: info.Employee.EmployeeID,
//           name: `${info.Employee.First_Name} ${info.Employee.Last_Name}`,
//           Image_Location: info.Employee.Image_Location,
//         });
//       })
//       .catch((err) => console.error(err));
//   };
//
//   const fetchEquipments = async (searchTerm = "") => {
//     try {
//       const res = await axios.get(
//         `/equipments?all=true&params=EquipmentID,Name&keyword=${searchTerm}`
//       );
//       if (res.status === 200) {
//         const list = res.data.data.data;
//         const data = list.map((item) => ({
//           id: item.EquipmentID,
//           name: item.Name,
//         }));
//
//         if (selectedCleaningJob) {
//           const eq = data.find(
//             (item) => item.id === selectedCleaningJob.EquipmentID
//           );
//           setSelectedEquipment(eq ? eq : null);
//         }
//
//         return data;
//       } else {
//         // setEquipments([]);
//         return [];
//       }
//     } catch (error) {
//       console.error("Error fetching equipments:", error);
//       // setEquipments([]);
//       return [];
//     }
//   };
//
//   const fetchCleaningJobs = async (searchTerm = "") => {
//     console.log("🚀🚀🚀 cleaningJobID:", cleaningJobID);
//     try {
//       const url = `/cleaningJobs?all=true&params=Cleaning_JobID,Cleaning_Name,EquipmentID&keyword=${searchTerm}${selectedEquipment ? `&EquipmentID=${selectedEquipment.id}` : ""
//         }`;
//       const res = await axios.get(url);
//       if (res.status === 200) {
//         const data = res.data.data.data.map((item) => ({
//           id: item.Cleaning_JobID,
//           name: item.Cleaning_Name,
//           EquipmentID: item.EquipmentID,
//         }));
//         if (cleaningJobID) {
//           const selectedJob =
//             data.find((job) => job.id === cleaningJobID) || null;
//           console.log("🚀🚀🚀 selectedJob:", selectedJob);
//           setSelectedCleaningJob(selectedJob ? selectedJob : null);
//         }
//         // setCleaningJobs(data);
//         return data;
//       } else {
//         // setCleaningJobs([]);
//         return [];
//       }
//     } catch (error) {
//       console.error("Error fetching cleaning jobs:", error);
//       // setCleaningJobs([]);
//       return [];
//     }
//   };
//   const fetchEmployees = async (searchTerm = "") => {
//     try {
//       const res = await axios.get(
//         `/employees?all=true&params=Image_Location,EmployeeID,First_Name,Last_Name&keyword=${searchTerm}`
//       );
//       if (res.status === 200) {
//         const data = res.data.data.data.map((item) => ({
//           id: item.EmployeeID,
//           name: `${item.First_Name} ${item.Last_Name}`,
//           Image_Location: item.Image_Location,
//         }));
//         // setEmployees(data);
//         return data;
//       } else {
//         // setEmployees([]);
//         return [];
//       }
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//       // setEmployees([]);
//       return [];
//     }
//   };
//
//   const handleScheduleChange = (newSchedule) => {
//     console.log("🚀🚀🚀 newSchedule:", (new Date()).getDay());
//
//     setIsUpdated(true);
//     setSchedulerData(newSchedule);
//   };
//
//   const handleCancel = () => {
//     if (isDirty || isUpdated) {
//       setConfirmationType("cancel");
//       setOpenConfirmation(true);
//     } else {
//       navigate(-1);
//     }
//   };
//
//   const onSubmit = useCallback(() => {
//     console.log("🚀🚀🚀 formData:", confirmationType, formData, schedulerData);
//     const mergedData = {
//       ...formData,
//       ...schedulerData,
//       Cleaning_JobID: selectedCleaningJob.id,
//       EmployeeID: selectedEmployee.id,
//       Notify: formData.Notify ? 1 : 0,
//     };
//     if (confirmationType === "add") {
//       axios
//         .post(`/cleaningSchedules`, mergedData)
//         .then((res) => {
//           toast.success(`Cleaning Schedule Added Successfully`);
//           navigate(-1);
//         })
//         .catch((err) => {
//           console.error(err);
//           toast.error(`Failed to Add Cleaning Schedule!`);
//         });
//     } else if (confirmationType === "update") {
//       axios
//         .put(`/cleaningSchedules/${id}`, mergedData)
//         .then((res) => {
//           toast.success(`Cleaning Schedule Updated Successfully`);
//           navigate(-1);
//         })
//         .catch((err) => {
//           console.error(err);
//           toast.error(`Failed to Update Cleaning Schedule!`);
//         });
//     } else {
//       resetFormData();
//     }
//   }, [
//     confirmationType,
//     formData,
//     //  id,
//     navigate,
//   ]);
//
//   const resetFormData = () => {
//     if (!cleaningJobID) {
//       setSelectedEquipment(null);
//       setSelectedCleaningJob(null);
//       if (!id) {
//         setSelectedEmployee(null);
//       }
//     }
//
//     setSchedulerData(defaultScheduler);
//     reset();
//
//     setOpenConfirmation(false);
//     setIsUpdated(false);
//   };
//
//   const formHandler = (data) => {
//     setConfirmationType(btnValue);
//     setFormData(data);
//     setOpenConfirmation(true);
//   };
//
//   const getCancelButtonStatus = () => {
//     let updated = false;
//     switch (btnValue) {
//       case "add":
//         updated = isDirty || isUpdated;
//         break;
//       case "update":
//         updated = isDirty || isUpdated;
//         break;
//
//       default:
//         break;
//     }
//     return updated;
//   };
//
//   const getSubmitButtonStatus = () => {
//     let updated = false;
//     console.log(
//       "🚀🚀🚀 isDirty:",
//       isDirty,
//       isValid,
//       selectedEquipment,
//       selectedCleaningJob,
//       selectedEmployee
//     );
//     switch (btnValue) {
//       case "add":
//         updated =
//           isDirty &&
//           isValid &&
//           selectedEquipment &&
//           selectedCleaningJob &&
//           selectedEmployee;
//         break;
//       case "update":
//         updated =
//           isUpdated &&
//           isValid &&
//           //   selectedEquipment &&
//           selectedCleaningJob &&
//           selectedEmployee;
//         break;
//
//       default:
//         break;
//     }
//     return updated;
//   };
//
//   useEffect(() => {
//     fetchCleaningJobs();
//   }, []);
//
//   useEffect(() => {
//     if (cleaningJobID || id) {
//       fetchEquipments();
//     }
//   }, [selectedCleaningJob]);
//
//   useEffect(() => {
//     if (id) {
//       getCleaningScheduleById(id);
//     }
//   }, [id, reset]);
//
//   useEffect(() => {
//     if (selectedEquipment && !id && !cleaningJobID) {
//       fetchCleaningJobs();
//     }
//   }, [selectedEquipment]);
//   return (
//     <div className="px-4 mt-6 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-3xl">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-semibold text-BtnBg capitalize">
//           {btnValue} Cleaning Schedule
//         </h2>
//       </div>
//       <div className="border-b-2 border-gray-200 mt-4 mb-6"></div>
//       <form onSubmit={handleSubmit(formHandler)} className="space-y-6">
//         <Field
//           label="Procedure"
//           name="Procedure"
//           placeholder="Enter Procedure"
//           control={control}
//           error={errors.Procedure}
//           className="grid grid-cols-3 gap-4"
//         />
//         <Field
//           label="Description"
//           name="Description"
//           placeholder="Enter Description"
//           control={control}
//           error={errors.Description}
//           className="grid grid-cols-3 gap-4"
//         />
//
//         {/* Equipment Select */}
//
//         <div className="grid grid-cols-3 gap-4">
//           <label className="text-gray-700 self-center">
//             Equipment
//             <span className="text-red-700">*</span>
//           </label>
//
//           {cleaningJobID || id ? (
//             <SearchableField
//               fetchData={fetchEquipments}
//               defaultValue={selectedEquipment}
//               onChange={(value) => {
//                 if (typeof value === "string") {
//                   setIsUpdated(false);
//                   setSelectedEquipment(null);
//                 } else {
//                   setIsUpdated(true);
//                   setSelectedEquipment(value);
//                 }
//               }}
//               displayField="name"
//               placeholder="Type to search equipment..."
//               className="col-span-2"
//               error={!selectedEquipment}
//               disabled={true}
//             />
//           ) : (
//             <AsyncMultiSelect
//               className="col-span-2"
//               multiple={false}
//               fetchOptions={fetchEquipments}
//               displayField="name"
//               defaultValue={selectedEquipment}
//               buttonLabel="off"
//               placeholder="Type to search equipment..."
//               disabled={false}
//               onSelect={(value) => {
//                 setIsUpdated(true);
//                 setSelectedEquipment(value);
//               }}
//               error={!selectedEquipment}
//             />
//           )}
//         </div>
//
//         {/* Clean Job Select */}
//         <div className="grid grid-cols-3 gap-4">
//           <label className="text-gray-700 self-center">
//             Cleaning Job
//             <span className="text-red-700">*</span>
//           </label>
//
//           {cleaningJobID || id ? (
//             <SearchableField
//               fetchData={fetchCleaningJobs}
//               defaultValue={selectedCleaningJob}
//               onChange={(value) => {
//                 if (typeof value === "string") {
//                   setIsUpdated(false);
//                   setSelectedCleaningJob(null);
//                 } else {
//                   setIsUpdated(true);
//                   setSelectedCleaningJob(value);
//                 }
//               }}
//               displayField="name"
//               placeholder="Type to search cleaning job..."
//               className="col-span-2"
//               error={!selectedCleaningJob}
//               disabled={true}
//             />
//           ) : (
//             <AsyncMultiSelect
//               className="col-span-2"
//               multiple={false}
//               fetchOptions={fetchCleaningJobs}
//               displayField="name"
//               defaultValue={selectedEmployee}
//               buttonLabel="off"
//               placeholder="Type to search cleaning job..."
//               disabled={false}
//               onSelect={(value) => {
//                 setIsUpdated(true);
//                 setSelectedCleaningJob(value);
//               }}
//               error={!selectedCleaningJob}
//             />
//           )}
//         </div>
//
//         {/* Employee Select */}
//         <div className="grid grid-cols-3 gap-4">
//           <label className="text-gray-700 self-center">
//             Employee
//             <span className="text-red-700">*</span>
//           </label>
//
//           <AsyncMultiSelect
//             className="col-span-2"
//             multiple={false}
//             fetchOptions={fetchEmployees}
//             displayField="name"
//             defaultValue={selectedEmployee}
//             buttonLabel="off"
//             placeholder="Type to search employee..."
//             disabled={false}
//             onSelect={(value) => {
//               setIsUpdated(true);
//               setSelectedEmployee(value);
//             }}
//             error={!selectedEmployee}
//           />
//         </div>
//
//         {/* Notify Automatically Toggle */}
//         <Controller
//           name="Notify"
//           control={control}
//           render={({ field }) => (
//             <div className="grid grid-cols-3 gap-4">
//               <label className="text-gray-700 self-center">
//                 Set up selection to notify automatically
//               </label>
//               <div className="col-span-1 flex items-center">
//                 <Switch
//                   checked={field.value}
//                   onChange={(e) => {
//                     setIsUpdated(true);
//                     // field.onChange(e.target.checked ? 1 : 0);
//                     setValue("Notify", e.target.checked ? 1 : 0); // Assuming `id` is the key
//                   }}
//                   inputProps={{ "aria-label": "Notify" }}
//                 />
//               </div>
//             </div>
//           )}
//         />
//
//         <RecurringScheduler
//           scheduleType={schedulerData.ScheduleType}
//           scheduleValues={schedulerData}
//           onScheduleChange={handleScheduleChange}
//         />
//
//         <div className="flex justify-between mt-6">
//           <div className="flex space-x-4">
//             <button
//               type="button"
//               className="py-2 px-4 bg-BtnBg text-white rounded-md "
//               onClick={handleCancel}
//             >
//               {getCancelButtonStatus() ? "Cancel" : "Go Back"}
//             </button>
//             <button
//               type="submit"
//               className={`py-2 px-4 rounded-md text-white capitalize ${!getSubmitButtonStatus()
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-BtnBg"
//                 }`}
//               disabled={!getSubmitButtonStatus()}
//             >
//               {btnValue}
//             </button>
//           </div>
//         </div>
//
//         <ConfirmationModal
//           type={confirmationType}
//           open={openConfirmation}
//           onClose={() => setOpenConfirmation(false)}
//           onSubmit={onSubmit}
//           from="cleaning schedule"
//         />
//       </form>
//     </div>
//   );
// };
//
// export default CleaningScheduleDetailForm;
