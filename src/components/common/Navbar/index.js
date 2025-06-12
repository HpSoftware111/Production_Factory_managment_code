import React, { useState, useRef, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useClickAway } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import logo from "../../../assets/images/logo.png";
import Breadcrumb from "../BasicBreadcrumbs";

import { ACTIVE_STYLE, NAV_SUBMENU_STYLE, NOT_ACTIVE_STYLE } from "../utils";
import { logout } from "../../../redux/slices/authSlice";
import { getImagePath } from "../../../utils/imagePath";
import { navigationData } from "../../../utils/navigationData";

const UserProfile = React.memo(({ user, handleClick }) => (
  <div className="hidden md:flex items-center space-x-4 cursor-pointer">
    <div className="flex" onClick={handleClick}>
      {user && <p className="text-lg font-semibold">{user.Employee_Name}</p>}
      <span>
        <KeyboardArrowDownIcon />
      </span>
    </div>
    {user && (
      <img
        src={getImagePath(user.Image_Location)}
        alt="Profile"
        className="h-12 w-12 rounded-full"
      />
    )}
  </div>
));

const SubMenu = ({ menuItems }) => (
  <div className="absolute top-10 left-0 pt-2 z-50 invisible group-hover:visible">
    <ul className={NAV_SUBMENU_STYLE}>
      {menuItems.map(({ to, label }) => (
        <li key={to}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `block mx-4 ${
                isActive ? "text-blue-500" : "hover:text-[#b9b7b2]"
              }`
            }
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
);

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const popoverRef = useRef(null);

  const handleClick = useCallback(
    (event) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    },
    [anchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  useClickAway(popoverRef, handleClose);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <nav className="bg-secondary text-white pt-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <img src={logo} alt="Logo" className="h-8 w-72" />
          <p className="text-lg font-semibold">
            Texas Tripe Inventory Management System (IMS)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <UserProfile user={user} handleClick={handleClick} />
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-white focus:outline-none focus:text-white"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        ref={popoverRef}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#333333",
            color: "white",
          },
        }}
      >
        <List component="nav" aria-label="user options">
          <ListItem
            onClick={() => {
              dispatch(logout());
            }}
            sx={{
              "& .MuiListItemIcon-root": {
                color: "white",
              },
              "& .MuiListItemText-primary": {
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Popover>
      <Breadcrumb />
      <div className="hidden md:flex space-x-4 mt-2">
        {navigationData.navigation.map((nav, index) => (
          <div key={`nav-item-${index}`} className="relative group">
            <NavLink
              to={nav.to}
              className={({ isActive }) =>
                isActive ? ACTIVE_STYLE : NOT_ACTIVE_STYLE
              }
            >
              <img src={nav.icon} className="mr-2 h-5" alt={nav.label} />
              {nav.label}
            </NavLink>
            {nav.subMenu && <SubMenu menuItems={nav.subMenu} />}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
