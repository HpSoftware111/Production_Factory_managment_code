import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/common/Navbar";
import PrivateRoute from "../components/common/PrivateRoute";
import { refreshToken } from "../redux/slices/authSlice";
import { routesData } from "./routesData";

const AppRoutes = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoginPage = location.pathname === "/login";
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(refreshToken());
    }
  }, [dispatch, token]);

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Routes>
        {routesData.map((item, index) => (
          <Route
            key={`navbar-item-${index}`}
            path={item.path}
            element={
              item.private ? (
                <PrivateRoute>{item.element}</PrivateRoute>
              ) : (
                item.element
              )
            }
          />
        ))}
      </Routes>
    </>
  );
};

export default AppRoutes;
