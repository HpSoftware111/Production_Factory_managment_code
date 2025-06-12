import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => {
    return state.auth;
  });

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
