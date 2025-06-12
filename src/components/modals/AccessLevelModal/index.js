import React, { useState } from "react";
import {
  Modal,
  Box,
  useMediaQuery,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { getImagePath } from "../../../utils/imagePath";

const initialAccessState = {
  Inventory: [],
  Production: [],
  Orders: [],
  Employees: [],
  Vendors: [],
  Reports: [],
  Settings: [],
  Dashboards: [],
};

const AccessLevelModal = ({
  open,
  handleClose,
  selectedAccess = initialAccessState,
  setSelectedAccess,
  userName,
  imageLocation,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentList, setCurrentList] = useState(selectedAccess);

  const accessHierarchy = {
    Read: [],
    Modify: ["Read"],
    Delete: ["Read", "Modify"],
    Admin: ["Read", "Modify", "Delete"],
  };

  const getDependents = (action) => {
    switch (action) {
      case "Admin":
        return ["Delete", "Modify", "Read"];
      case "Delete":
        return ["Modify", "Read"];
      case "Modify":
        return ["Read"];
      default:
        return [];
    }
  };

  const getParent = (action) => {
    switch (action) {
      case "Read":
        return ["Modify", "Delete", "Admin"];
      case "Modify":
        return ["Delete", "Admin"];
      case "Delete":
        return ["Admin"];
      default:
        return [];
    }
  };

  const handleCheckboxChange = (accessType, action) => {
    setCurrentList((prev) => {
      const currentAccess = new Set(prev[accessType]);

      if (currentAccess.has(action)) {
        currentAccess.delete(action);
        getDependents(action).forEach((dependent) =>
          currentAccess.delete(dependent)
        );
      } else {
        currentAccess.add(action);
        accessHierarchy[action].forEach((dependent) =>
          currentAccess.add(dependent)
        );
      }

      const parentsToRemove = getParent(action).filter(
        (parent) =>
          !accessHierarchy[parent].every((dep) => currentAccess.has(dep))
      );
      parentsToRemove.forEach((parent) => currentAccess.delete(parent));

      return {
        ...prev,
        [accessType]: Array.from(currentAccess),
      };
    });
  };

  const tableHeaders = [
    { id: "Access_level", label: "Access Level" },
    { id: "read", label: "Read" },
    { id: "modify", label: "Modify" },
    { id: "delete", label: "Delete" },
    { id: "admin", label: "Admin" },
  ];

  const data = [
    {
      Access_level: "Inventory",
      options: ["Read", "Modify", "Delete", "Admin"],
    },
    {
      Access_level: "Production",
      options: ["Read", "Modify", "Delete", "Admin"],
    },
    { Access_level: "Orders", options: ["Read", "Modify", "Delete", "Admin"] },
    {
      Access_level: "Employees",
      options: ["Read", "Modify", "Delete", "Admin"],
    },
    { Access_level: "Vendors", options: ["Read", "Modify", "Delete", "Admin"] },
    { Access_level: "Reports", options: ["Read", "Modify", "Delete", "Admin"] },
    {
      Access_level: "Settings",
      options: ["Read", "Modify", "Delete", "Admin"],
    },
    {
      Access_level: "Dashboards",
      options: ["Read", "Modify", "Delete", "Admin"],
    },
  ];

  const isUpdateButtonDisabled = Object.values(currentList).every(
    (accessArray) => accessArray.length === 0
  );

  const handleCancel = () => {
    handleClose();
  };

  const handleupdate = () => {
    setSelectedAccess(currentList);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="access-levels-modal-title"
    >
      <div
        className="bg-white w-11/12 md:max-w-3xl"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
        }}
      >
        <div className="small_scroller p-5 md:py-6 md:px-10 max-h-[90vh] overflow-y-auto">
          <Box>
            {isMobile && (
              <IconButton
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
            <div className="flex flex-col">
              <h2
                id="access-levels-modal-title"
                className="text-xl font-semibold mb-2 text-BtnBg"
              >
                User Level Access
              </h2>
              <div className="border-b border-gray-300 mb-4"></div>
              <div className="flex justify-between items-start">
                <button
                  type="button"
                  className="py-2 px-8 lg:px-12 bg-[#BDBDBD] text-white rounded-xl w-fit mb-5"
                >
                  Add New Access
                </button>

                <div className="flex items-center space-x-2">
                  <div className="flex">
                    <p className="text-sm">{userName}</p>
                  </div>
                  <Avatar
                    src={getImagePath(imageLocation)}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                </div>
              </div>

              <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", border: "none" }}
                className="no-scroller"
              >
                <Table sx={{ boxShadow: "none", border: "none" }}>
                  <TableHead className="bg-primary">
                    <TableRow>
                      {tableHeaders.map((header) => (
                        <TableCell
                          key={header.id}
                          dangerouslySetInnerHTML={{ __html: header.label }}
                          sx={{
                            fontSize: "15px",
                            color: "#143664",
                            fontWeight: "bold",
                            lineHeight: "1.15rem",
                          }}
                        />
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <React.Fragment key={`body-${index}`}>
                        {index === 0 && <tr className="h-5 w-full" />}
                        <TableRow key={index} className="bg-[#F5F5F5]">
                          <TableCell>{row.Access_level}</TableCell>
                          {row.options.map((option, idx) => (
                            <TableCell key={`cell-${idx}`}>
                              <label className="custom-checkbox">
                                <input
                                  type="checkbox"
                                  name={row.Access_level}
                                  value={option}
                                  checked={currentList[
                                    row.Access_level
                                  ].includes(option)}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      row.Access_level,
                                      option
                                    )
                                  }
                                />
                                <span className="checkmark"></span>
                              </label>
                            </TableCell>
                          ))}
                        </TableRow>
                        <tr className="h-5 w-full" />
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="col-span-3 flex justify-end mt-5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="py-2 px-8 bg-BtnBg min-w-48 text-center text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleupdate}
                  className={`py-2 px-8 ml-3 rounded-xl min-w-48 ${
                    isUpdateButtonDisabled
                      ? "bg-gray-400 text-gray-300 cursor-not-allowed"
                      : "bg-BtnBg text-white"
                  }`}
                  disabled={isUpdateButtonDisabled}
                >
                  Update
                </button>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </Modal>
  );
};

export default AccessLevelModal;
