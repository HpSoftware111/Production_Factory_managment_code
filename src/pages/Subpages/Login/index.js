import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { login } from "../../../redux/slices/authSlice";
import logo from "../../../assets/images/logo.png";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const { isAuthenticated } = useSelector((state) => {
    return state.auth;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    dispatch(login(data))
      .unwrap()
      .then((res) => {
        if (res.code === 200) {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Login failed:", err);
      });
  };

  return isAuthenticated ? (
    <Navigate to="/" />
  ) : (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="h-12 w-auto mx-auto" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              fullWidth
              autoComplete="username"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          </div>

          <div>
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              autoComplete="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
