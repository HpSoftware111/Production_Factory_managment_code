import React from "react";
import { Field } from "formik";
import { Switch, Grid, Typography, Box } from "@mui/material";
import { styled } from '@mui/material/styles';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 48,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(22px)',
      color: '#fff', // White thumb when activated
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.tertiary.main, // Using tertiary color (#1479FF)
        opacity: 1,
        border: 0,
        '&:before': {
          content: "''",
          position: 'absolute',
          width: 16,
          height: 16,
          left: 4,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
            '#fff', // White checkmark
          )}" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        },
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.grey[400],
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const CustomSwitchField = ({ label, ...props }) => {
  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={8}>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}
        >
          {label}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Field name={props.name}>
            {({ field, form }) => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 48 // Match switch width
                }}
              >
                <CustomSwitch
                  disableRipple
                  checked={Boolean(field.value)}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.checked);
                  }}
                  value={field.value}
                />
                <Typography
                  variant="caption"
                >
                  {field.value ? "On" : "Off"}
                </Typography>
              </Box>
            )}
          </Field>
        </Box>
      </Grid>
    </Grid>
  );
};
export default CustomSwitchField;