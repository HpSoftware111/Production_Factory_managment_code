import React from 'react';
import {useField} from 'formik';
import {TextField, MenuItem, Grid, Typography, CircularProgress} from '@mui/material';
import {useTheme} from "@mui/material/styles";
import useApiDropdown from '../../../hooks/useApiDropdown'; // We'll create this next


const CustomApiDropdown = (
  {
    label,
    fetchOptions,  // Changed from apiUrl to fetchOptions to match what we're passing
    valueKey = 'id',
    labelKey = 'name',
    showIdInLabel = false,
    ...props
  }
) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  const theme = useTheme();

  const {options, isLoading, error} = useApiDropdown(fetchOptions, valueKey, labelKey, showIdInLabel);

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={4}>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item xs={8}>
        <TextField
          {...field}
          {...props}
          select
          fullWidth
          helperText={errorText || error}
          error={!!errorText || !!error}
          disabled={isLoading || props?.disabled}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#F3F4F6',
              borderRadius: '0.75rem',
              fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
              fontWeight: 400,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#E5E7EB',
              },
              '&:hover fieldset': {
                borderColor: '#D1D5DB',
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
            '& .MuiInputBase-input': {
              color: '#4D5658',
              fontSize: '0.8rem',
            },
            '& .MuiFormHelperText-root': {
              fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
              fontSize: '0.7rem',
            },
          }}
        >
          {isLoading ? (
            <MenuItem disabled>
              <CircularProgress size={20}/>
            </MenuItem>
          ) : (
            options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))
          )}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default CustomApiDropdown;