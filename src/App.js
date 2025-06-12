import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import AppRoutes from "./routes";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  typography: {
    fontFamily: '"Raleway", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Raleway", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
      fontSize: "1.2rem", // 20px
    },
    body1: {
      fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: ".8rem", // 20px
    },
    label1: {
      fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: "1.05rem", // 20px
    },
    label2: {
      fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: "1.55rem", // 28px
    },
    label3: {
      fontFamily: '"Raleway", "Helvetica", "Arial", sans-serif',
      fontWeight: 800,
      fontSize: "14px", // 28px
      lineHeight: "12px",
      // height:'3px',
      // marginBottom:'20px'
    },
  },
  palette: {
    primary: {
      main: "#143664",
      secondary: "#CCD7E4",
      tertiary: "#4D5658",
      quaternary: "#888888",
      quinary: "#E3E7E0"
    },
    secondary: {
      main: "#2DBECB",
    },
    tertiary: {
      main: "#1479FF",
    },
    quaternary: {
      main: "#ED7D31",
      secondary: "#FFB9B9"
    },
    quinary: {
      main: "#BA499B",
    },
    senary: {
      main: "#F6C244",
      secondary: "#FFDD88"
    },
    septenary: {
      main: "#53A451",
      secondary: "#00B612",
      tertiary: "#CFF0B6"
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
