import React from 'react';
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

const CustomButton = (
  {
    children,
    boldText = false,
    to,
    variant = "contained",
    onClick,
    sx = {},
    ...props  // This allows passing any additional props
  }
) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (to) {
      navigate(to);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      variant={variant}
      color="primary"
      sx={{
        color: variant === 'contained' ? 'white' : 'primary.main',
        fontWeight: boldText ? 'bold' : 'normal',
        borderRadius: '10px',
        textTransform: 'none',
        minWidth: '140px',
        ...sx  // This allows overriding or adding additional styles
      }}
      onClick={handleClick}
      {...props} // This spreads any additional props
    >
      {children}
    </Button>
  )
}

export default CustomButton
