// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Tabs,
//   Tab,
//   Typography,
//   Select,
//   MenuItem,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";
// import { format, parseISO } from "date-fns";
// import { styled } from "@mui/system";
// import TextField from "@mui/material/TextField";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
//
// const SchedulerContainer = styled(Box)(({ theme }) => ({
//   backgroundColor: "#F4F4F4",
//   padding: theme.spacing(0, 2, 2, 2), // Remove top padding
//   borderRadius: theme.spacing(1),
// }));
//
// const StyledTabs = styled(Tabs)(({ theme }) => ({
//   borderBottom: `1px solid ${theme.palette.primary.secondary}`,
//   "& .MuiTabs-indicator": {
//     backgroundColor: theme.palette.tertiary.main,
//   },
// }));
//
// const StyledTab = styled(Tab)(({ theme }) => ({
//   ...theme.typography.body1,
//   fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
//   fontWeight: 500,
//   textTransform: "none",
//   color: "#000000",
//   "&.Mui-selected": {
//     color: "#FFFFFF",
//     backgroundColor: theme.palette.tertiary.main,
//   },
// }));
//
// const StyledTextField = styled(TextField)(({ theme }) => ({
//   "& .MuiInputBase-input": {
//     textAlign: "center",
//     width: "30px",
//     padding: theme.spacing(1),
//   },
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       borderRadius: theme.spacing(1),
//     },
//   },
// }));
//
// const TextWrapper = styled(Typography)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   gap: theme.spacing(1),
//   justifyContent: "flex-start",
// }));
//
// const ContentContainer = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2, 0, 0, 0), // Add top padding to content
// }));
//
// const RecurringScheduler = ({
//   scheduleType = "one-time", // Default to "one-time"
//   scheduleValues = {}, // Default to an empty object
//   onScheduleChange,
// }) => {
//   const [currentScheduleType, setCurrentScheduleType] = useState(scheduleType);
//   const [DayOfMonth, setDayOfMonth] = useState(
//     scheduleValues.DayOfMonth || null
//   );
//   const [TimeOfDay, setTimeOfDay] = useState(
//     scheduleValues.TimeOfDay || "14:00"
//   );
//   const [RepeatInterval, setIntervalValue] = useState(
//     scheduleValues.RepeatInterval || 1
//   );
//   const [DayOfWeek, setDayOfWeek] = useState(
//     scheduleValues.DayOfWeek ? scheduleValues.DayOfWeek.split(",") : ["Monday"]
//   );
//   const [Month, setMonth] = useState(scheduleValues.Month || null);
//   const [dateTime, setDateTime] = useState(
//     scheduleValues.dateTime || new Date().toISOString().slice(0, 16)
//   );
//
//   // Effect to sync internal state with prop values when props change
//   useEffect(() => {
//     setCurrentScheduleType(scheduleType);
//     setDayOfMonth(scheduleValues.DayOfMonth || 1);
//     setTimeOfDay(scheduleValues.TimeOfDay || "14:00");
//     setIntervalValue(scheduleValues.RepeatInterval || 1);
//     setDayOfWeek(
//       scheduleValues.DayOfWeek
//         ? scheduleValues.DayOfWeek.split(",")
//         : ["Monday"]
//     );
//     setMonth(scheduleValues.Month || 1);
//     setDateTime(
//       scheduleValues
//         ? `${scheduleValues.StartDate}T${scheduleValues.TimeOfDay}`
//         : new Date().toISOString().slice(0, 16)
//     );
//   }, [scheduleType, scheduleValues]);
//
//   const notifyChange = (updatedValues) => {
//     if (onScheduleChange) {
//       const data = getDataByScheduleType({
//         ScheduleType: currentScheduleType,
//         DayOfMonth,
//         TimeOfDay,
//         RepeatInterval,
//         DayOfWeek,
//         Month,
//         dateTime,
//         ...updatedValues,
//       });
//       onScheduleChange(data);
//     }
//   };
//
//   const getDataByScheduleType = (data) => {
//     switch (data.ScheduleType) {
//       case "one-time":
//         const parsedDate = parseISO(data.dateTime);
//
//         const date = format(parsedDate, "yyyy-MM-dd");
//         const time = format(parsedDate, "HH:mm");
//         setTimeOfDay(time);
//         return {
//           ScheduleType: "one-time",
//           StartDate: date,
//           StartTime: time,
//           TimeOfDay: time,
//         };
//       case "hourly":
//         return {
//           ScheduleType: "hourly",
//           StartDate: format(new Date(), "yyyy-MM-dd"),
//           StartTime: data.TimeOfDay,
//           RepeatInterval: RepeatInterval,
//         };
//       case "daily":
//         return {
//           ScheduleType: "daily",
//           StartDate: format(new Date(), "yyyy-MM-dd"),
//           StartTime: data.TimeOfDay,
//           TimeOfDay: data.TimeOfDay,
//           RepeatInterval: data.RepeatInterval,
//         };
//       case "weekly":
//         return {
//           ScheduleType: "weekly",
//           StartDate: format(new Date(), "yyyy-MM-dd"),
//           StartTime: data.TimeOfDay,
//           TimeOfDay: data.TimeOfDay,
//           DayOfWeek: data.DayOfWeek.join(","),
//           RepeatInterval: data.RepeatInterval,
//         };
//       case "monthly":
//         return {
//           ScheduleType: "monthly",
//           StartDate: format(new Date(), "yyyy-MM-dd"),
//           StartTime: data.TimeOfDay,
//           TimeOfDay: data.TimeOfDay,
//           DayOfMonth: data.DayOfMonth,
//           RepeatInterval: data.RepeatInterval,
//         };
//       case "yearly":
//         return {
//           ScheduleType: "yearly",
//           StartDate: format(new Date(), "yyyy-MM-dd"),
//           StartTime: data.TimeOfDay,
//           DayOfMonth: data.DayOfMonth,
//           TimeOfDay: data.TtimeOfDay,
//           Month: data.MonthOfYear,
//           RepeatInterval: data.RepeatInterval,
//         };
//       default:
//         return {};
//     }
//   };
//
//   const handleScheduleTypeChange = (type) => {
//     setCurrentScheduleType(type);
//     notifyChange({ ScheduleType: type });
//   };
//
//   const handleNumberInput = (e, setter) => {
//     console.log(e.target.name);
//     const value = e.target.value;
//     if (/^\d*$/.test(value)) {
//       setter(value);
//       notifyChange({ [e.target.name]: value });
//     }
//   };
//
//   const getContent = () => {
//     switch (currentScheduleType) {
//       case "hourly":
//         return (
//           <TextWrapper>
//             Every
//             <Select
//               value={RepeatInterval}
//               onChange={(e) => {
//                 const interval = e.target.value;
//                 setIntervalValue(interval);
//                 notifyChange({ RepeatInterval: interval });
//               }}
//               size="small"
//             >
//               {Array.from({ length: 23 }, (_, i) => i + 1).map((val) => (
//                 <MenuItem key={val} value={val}>
//                   {val}
//                 </MenuItem>
//               ))}
//             </Select>
//             hour(s)
//           </TextWrapper>
//         );
//       case "daily":
//         return (
//           <TextWrapper>
//             Every
//             <Select
//               value={RepeatInterval}
//               onChange={(e) => {
//                 const interval = e.target.value;
//                 setIntervalValue(interval);
//                 notifyChange({ RepeatInterval: interval });
//               }}
//               size="small"
//             >
//               {Array.from({ length: 30 }, (_, i) => i + 1).map((val) => (
//                 <MenuItem key={val} value={val}>
//                   {val}
//                 </MenuItem>
//               ))}
//             </Select>
//             day(s) at
//             <StyledTextField
//               value={TimeOfDay}
//               onChange={(e) => {
//                 setTimeOfDay(e.target.value);
//                 notifyChange({ TimeOfDay: e.target.value });
//               }}
//               variant="outlined"
//               size="small"
//               inputProps={{
//                 type: "time",
//                 style: { width: "125px" },
//               }}
//             />
//           </TextWrapper>
//         );
//       case "weekly":
//         return (
//           <Box>
//             <TextWrapper>
//               Every
//               <Select
//                 value={RepeatInterval}
//                 onChange={(e) => {
//                   const interval = e.target.value;
//                   setIntervalValue(interval);
//                   notifyChange({ RepeatInterval: interval });
//                 }}
//                 size="small"
//               >
//                 {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
//                   <MenuItem key={val} value={val}>
//                     {val}
//                   </MenuItem>
//                 ))}
//               </Select>
//               week(s) at
//               <StyledTextField
//                 value={TimeOfDay}
//                 onChange={(e) => {
//                   setTimeOfDay(e.target.value);
//                   notifyChange({ TimeOfDay: e.target.value });
//                 }}
//                 variant="outlined"
//                 size="small"
//                 inputProps={{
//                   type: "time",
//                   style: { width: "125px" },
//                 }}
//               />
//             </TextWrapper>
//             <Box sx={{ mt: 2 }}>
//               {[
//                 "Monday",
//                 "Tuesday",
//                 "Wednesday",
//                 "Thursday",
//                 "Friday",
//                 "Saturday",
//                 "Sunday",
//               ].map((day, index) => (
//                 <FormControlLabel
//                   key={day}
//                   control={
//                     <Checkbox
//                       checked={DayOfWeek.includes(day)}
//                       onChange={(e) => {
//                         const newDays = e.target.checked
//                           ? [...DayOfWeek, day]
//                           : DayOfWeek.filter((d) => d !== day);
//
//                         console.log("😊😊😊checked:", newDays);
//                         setDayOfWeek(newDays);
//                         notifyChange({ DayOfWeek: newDays });
//                       }}
//                     />
//                   }
//                   label={day.substring(0, 3)}
//                 />
//               ))}
//             </Box>
//           </Box>
//         );
//       case "monthly":
//         return (
//           <TextWrapper>
//             Every
//             <Select
//               value={RepeatInterval}
//               onChange={(e) => {
//                 const interval = e.target.value;
//                 setIntervalValue(interval);
//                 notifyChange({ RepeatInterval: interval });
//               }}
//               size="small"
//             >
//               {Array.from({ length: 11 }, (_, i) => i + 1).map((val) => (
//                 <MenuItem key={val} value={val}>
//                   {val}
//                 </MenuItem>
//               ))}
//             </Select>
//             month(s) on day
//             <Select
//               value={DayOfMonth}
//               onChange={(e) => {
//                 const day = e.target.value;
//                 setDayOfMonth(day);
//                 notifyChange({ DayOfMonth: day });
//               }}
//               size="small"
//             >
//               {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
//                 <MenuItem key={day} value={day}>
//                   {day}
//                 </MenuItem>
//               ))}
//             </Select>
//             at
//             <StyledTextField
//               value={TimeOfDay}
//               onChange={(e) => {
//                 setTimeOfDay(e.target.value);
//                 notifyChange({ TimeOfDay: e.target.value });
//               }}
//               variant="outlined"
//               size="small"
//               inputProps={{
//                 type: "time",
//                 style: { width: "125px" },
//               }}
//             />
//           </TextWrapper>
//         );
//       case "yearly":
//         return (
//           <TextWrapper>
//             Every
//             <Select
//               value={RepeatInterval}
//               onChange={(e) => {
//                 const interval = e.target.value;
//                 setIntervalValue(interval);
//                 notifyChange({ RepeatInterval: interval });
//               }}
//               size="small"
//             >
//               {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
//                 <MenuItem key={val} value={val}>
//                   {val}
//                 </MenuItem>
//               ))}
//             </Select>
//             Year(s) On day
//             <Select
//               value={DayOfMonth}
//               onChange={(e) => {
//                 const day = e.target.value;
//                 setDayOfMonth(day);
//                 notifyChange({ DayOfMonth: day });
//               }}
//               size="small"
//             >
//               {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
//                 <MenuItem key={day} value={day}>
//                   {day}
//                 </MenuItem>
//               ))}
//             </Select>
//             of month
//             <Select
//               value={Month}
//               onChange={(e) => {
//                 setMonth(e.target.value);
//                 notifyChange({ Month: e.target.value });
//               }}
//               size="small"
//             >
//               {[
//                 "Jan",
//                 "Feb",
//                 "Mar",
//                 "Apr",
//                 "May",
//                 "Jun",
//                 "Jul",
//                 "Aug",
//                 "Sep",
//                 "Oct",
//                 "Nov",
//                 "Dec",
//               ].map((m, index) => (
//                 <MenuItem key={m} value={index + 1}>
//                   {m}
//                 </MenuItem>
//               ))}
//             </Select>
//             at
//             <StyledTextField
//               value={TimeOfDay}
//               onChange={(e) => {
//                 setTimeOfDay(e.target.value);
//                 notifyChange({ TimeOfDay: e.target.value });
//               }}
//               variant="outlined"
//               size="small"
//               inputProps={{
//                 type: "time",
//                 style: { width: "125px" },
//               }}
//             />
//           </TextWrapper>
//         );
//       default:
//         return null;
//     }
//   };
//
//   return (
//     <SchedulerContainer>
//       <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={currentScheduleType === "one-time"}
//               onChange={() => handleScheduleTypeChange("one-time")}
//             />
//           }
//           label="One-Time"
//         />
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={currentScheduleType !== "one-time"}
//               onChange={() => handleScheduleTypeChange("daily")} // Default to daily for recurring
//             />
//           }
//           label="Recurring"
//         />
//       </Box>
//       {currentScheduleType === "one-time" ? (
//         <TextField
//           label="Select Date and Time"
//           type="datetime-local"
//           value={dateTime}
//           onChange={(e) => {
//             setDateTime(e.target.value);
//             notifyChange({ dateTime: e.target.value });
//           }}
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//       ) : (
//         <>
//           <StyledTabs
//             value={currentScheduleType}
//             onChange={(e, value) => handleScheduleTypeChange(value)}
//             variant="fullWidth"
//           >
//             <StyledTab label="Hourly" value="hourly" />
//             <StyledTab label="Daily" value="daily" />
//             <StyledTab label="Weekly" value="weekly" />
//             <StyledTab label="Monthly" value="monthly" />
//             <StyledTab label="Yearly" value="yearly" />
//           </StyledTabs>
//           <ContentContainer>{getContent()}</ContentContainer>
//         </>
//       )}
//     </SchedulerContainer>
//   );
// };
//
// export default RecurringScheduler;
