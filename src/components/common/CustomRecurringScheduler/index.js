import React, {Fragment, useEffect, useState} from 'react';
import {Box, Tabs, Tab, Typography, Select, MenuItem, FormControlLabel, Checkbox, Grid} from '@mui/material';
import { styled } from '@mui/system';
import { format, addDays } from 'date-fns';
import TextField from "@mui/material/TextField";
import {useField, useFormikContext} from "formik";
import CustomSwitchField from "../CustomFormFields/CustomSwitchField";
import {CustomCheckboxField} from "../CustomFormFields";
const SchedulerContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#F4F4F4',
  padding: theme.spacing(0, 2, 2, 2), // Remove top padding
  marginTop: 2,
  borderRadius: theme.spacing(1),
}));
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.primary.secondary}`,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.tertiary.main,
  },
}));
const StyledTab = styled(Tab)(({ theme }) => ({
  ...theme.typography.body1,
  fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
  fontWeight: 500,
  textTransform: 'none',
  color: '#000000',
  '&.Mui-selected': {
    color: '#FFFFFF',
    backgroundColor: theme.palette.tertiary.main,
  },
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    textAlign: 'center',
    width: '30px',
    padding: theme.spacing(1),
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: theme.spacing(1),
    },
  },
}));
const TextWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  justifyContent: 'flex-start',
}));
const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0, 0, 0), // Add top padding to content
}));
const RecurringScheduler = ({ name, ...props }) => {
  const { values, setFieldValue } = useFormikContext();
  const schedule = values[name] || {};

  // console.log("The custom recurring scheduler", values)

  const handleTabChange = (event, newValue) => {
    const scheduleTypes = ['hourly', 'daily', 'weekly', 'monthly', 'yearly'];
    setFieldValue(`${name}.scheduleType`, scheduleTypes[newValue]);
  };
  const handleIntervalChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue) && newValue.length <= 2) {
      setFieldValue(`${name}.interval`, newValue);
    }
  };
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setFieldValue(`${name}.timeOfDay`, newTime);
  };
  const handleSelectedDaysChange = (day) => {
    const currentDays = schedule.dayOfWeek || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    setFieldValue(`${name}.dayOfWeek`, updatedDays);
  };

  const handleDayOfMonthChange = (e) => {
    const newValue = e.target.value;
    // Allow empty string for clearing the field
    if (newValue === '') {
      setFieldValue(`${name}.dayOfMonth`, '');
      return;
    }

    // Allow any number between 1-31
    if (/^\d+$/.test(newValue)) {
      const numValue = parseInt(newValue);
      if (numValue >= 1 && numValue <= 31) {
        setFieldValue(`${name}.dayOfMonth`, numValue);
      }
    }
  };

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setFieldValue(`${name}.month`, newMonth);
  };


  const getContent = () => {
    switch (schedule.scheduleType) {
      case 'hourly':
        return (
          <TextWrapper>
            Every
            <StyledTextField
              value={schedule.interval}
              onChange={(e) => handleIntervalChange(e, setInterval)}
              variant="outlined"
              size="small"
            />
            hour(s)
          </TextWrapper>
        );
      case 'daily':
        return (
          <TextWrapper>
            Every
            <StyledTextField
              value={schedule.interval}
              onChange={(e) => handleIntervalChange(e, setInterval)}
              variant="outlined"
              size="small"
            />
            day(s) at
            <StyledTextField
              value={schedule.timeOfDay}
              onChange={handleTimeChange}
              variant="outlined"
              size="small"
              inputProps={{
                type: 'time',
                style: { width: '125px' },
              }}
            />
          </TextWrapper>
        );
      case 'weekly':
        return (
          <Box>
            <TextWrapper>
              Every
              <StyledTextField
                value={schedule.interval}
                onChange={(e) => handleIntervalChange(e, setInterval)}
                variant="outlined"
                size="small"
              />
              week(s) at
              <StyledTextField
                value={schedule.timeOfDay}
                onChange={handleTimeChange}
                variant="outlined"
                size="small"
                inputProps={{
                  type: 'time',
                  style: { width: '125px' },
                }}
              />
            </TextWrapper>
            <Box sx={{ mt: 2 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      checked={schedule.dayOfWeek.includes(index + 1)}
                      onChange={() => handleSelectedDaysChange(index + 1)}
                    />
                  }
                  label={day}
                />
              ))}
            </Box>
          </Box>
        );
      case 'monthly':
        return (
          <TextWrapper>
            Every
            <StyledTextField
              value={schedule.interval}
              onChange={(e) => handleIntervalChange(e, setInterval)}
              variant="outlined"
              size="small"
            />
            month(s) on day
            <StyledTextField
              value={schedule.dayOfMonth}
              onChange={handleDayOfMonthChange}
              variant="outlined"
              size="small"
            />
            at
            <StyledTextField
              value={schedule.timeOfDay}
              onChange={handleTimeChange}
              variant="outlined"
              size="small"
              inputProps={{
                type: 'time',
                style: { width: '125px' },
              }}
            />
          </TextWrapper>
        );
      case 'yearly':
        return (
          <TextWrapper>
            On day
            <StyledTextField
              value={schedule.dayOfMonth}
              onChange={handleDayOfMonthChange}
              variant="outlined"
              size="small"
            />
            of month
            <Select
              value={schedule.month}
              onChange={handleMonthChange}
              size="small"
            >
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                .map((m, index) => (
                  <MenuItem key={m} value={index + 1}>{m}</MenuItem>
                ))}
            </Select>
            at
            <StyledTextField
              value={schedule.timeOfDay}
              onChange={(e) => handleTimeChange(e.target.value)}
              variant="outlined"
              size="small"
              inputProps={{
                type: 'time',
                style: { width: '125px' },
              }}
            />
          </TextWrapper>
        );
    }
  };
  const getDescription = () => {
    switch (schedule.scheduleType) {
      case 'hourly':
        return `Runs every ${schedule.interval} hour(s)`;
      case 'daily':
        return `Runs every ${schedule.interval} day(s) at ${schedule.timeOfDay}`;
      case 'weekly':
        const days = schedule.dayOfWeek
          .sort((a, b) => a - b)
          .map(d => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d-1])
          .join(', ');
        return `Runs every ${schedule.interval} week(s) on ${days} at ${schedule.timeOfDay}`;
      case 'monthly':
        return `Runs every ${schedule.interval} month(s) on day ${schedule.dayOfMonth} at ${schedule.timeOfDay}`;
      case 'yearly':
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October', 'November', 'December'][schedule.month-1];
        return `Runs yearly on day ${schedule.dayOfMonth} of ${monthName} at ${schedule.timeOfDay}`;
    }
  };
  return (
    <Fragment>
      <Grid item xs={12}>
        <CustomSwitchField
          name={`${name}.notify`}  // This will make it part of the schedule object
          label="Setup selection to notify automatically"
        />
      </Grid>

      <Grid item xs={12} >
        <CustomCheckboxField
          name={`${name}.recurring`}  // This will make it part of the schedule object
          label="Recurring"
        />
      </Grid>

      <SchedulerContainer>
        <StyledTabs value={['hourly','daily','weekly','monthly','yearly'].indexOf(schedule.scheduleType)} onChange={handleTabChange} variant={"fullWidth"}>
          <StyledTab label="Hourly" />
          <StyledTab label="Daily" />
          <StyledTab label="Weekly" />
          <StyledTab label="Monthly" />
          <StyledTab label="Yearly" />
        </StyledTabs>
        <ContentContainer>
          {getContent()}
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            {getDescription()}
          </Typography>
        </ContentContainer>
      </SchedulerContainer>
    </Fragment>
  );
};
export default RecurringScheduler;