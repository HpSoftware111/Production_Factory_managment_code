import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import axios from "../../../api";
import DropdownMenu from "../DropdownMenu";
import AccessLevelModal from "../../modals/AccessLevelModal";
import { randomColor } from "../../../utils/randomColor";
import { toast } from "react-toastify";
import { getImagePath } from "../../../utils/imagePath";
import DynamicDropdownMenu from "../DynamicDropdownMenu";
import { SEARCH_INPUT_STYLE } from "../utils";

const TableComponent = forwardRef(
  (
    {
      tableHeaders,
      data = [],
      setData,
      Addtext,
      circleName,
      onEdit,
      onDelete,
      onPrint = null,
      onAvatarClick = null,
      primaryID = null,
      setPrimaryID = null,
      disable = false,
      onAddClick = null,
      onAddText = null,
      onSearch = null,
      searchPlaceholder = null,
      title = null,
    },
    ref
  ) => {
    const inputRef = useRef(null);
    const [passwordVisibility, setPasswordVisibility] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [clickedRowIndex, setClickedRowIndex] = useState(null);
    const [clickedRowPos, setClickedRowPos] = useState({ x: 0, y: 0 });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedContactID, setSelectedContactID] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    const togglePasswordVisibility = (index) => {
      let updated = passwordVisibility.map((visible, idx) =>
        idx === index ? !visible : visible
      );
      setPasswordVisibility(updated);
    };

    const handleModifyOpen = (index) => {
      setSelectedIndex(index);
    };

    const handleModifyClose = () => {
      setSelectedIndex(null);
    };

    const handleAvatarClick = (contactID) => {
      setSelectedContactID(contactID);
      setOpenDialog(true);
    };

    const handleDialogClose = () => {
      setOpenDialog(false);
      setSelectedContactID(null);
    };

    const handleConfirmPrimary = () => {
      if (setPrimaryID && selectedContactID) {
        setPrimaryID(selectedContactID);
        onAvatarClick(selectedContactID);
      }
      handleDialogClose();
    };

    useEffect(() => {
      if (data && data?.length > 0) {
        setPasswordVisibility(data.map(() => false));
      }
    }, [data]);

    const handleClear = () => {
      setSearchTerm("");
      onSearch("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    const handleChange = (event) => {
      setSearchTerm(event.target.value);
      onSearch(event.target.value);
    };

    useImperativeHandle(ref, () => ({
      handleClear,
    }));

    return (
      <>
        <div className="mb-6 mt-6 flex text-center justify-between items-center">
          {onAddText && (
            <button
              type="button"
              className="bg-BtnBg text-white rounded-xl py-2 px-7 min-h-12"
              onClick={onAddClick}
            >
              {onAddText}
            </button>
          )}
          {title && (
            <p className="flex-1 text-BtnBg font-bold text-2xl">{title}</p>
          )}
          {onSearch && (
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className={SEARCH_INPUT_STYLE}
                placeholder={searchPlaceholder || "Employee Search"}
                ref={inputRef}
                value={searchTerm}
                onChange={handleChange}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute inset-y-0 end-0 text-sm flex items-center justify-center p-3 text-white bg-BtnBg rounded-xl m-2"
                  onClick={handleClear}
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        <TableContainer
          component={Paper}
          className="max-w-full !overflow-y-visible no-scroller"
          sx={{
            boxShadow: "none",
            border: "none",
            backgroundColor: "transparent !important",
          }}
        >
          <Table
            className="max-w-full"
            sx={{ overflowX: "visible", boxShadow: "none" }}
          >
            <TableHead className="bg-primary">
              <TableRow>
                {tableHeaders.map((header, idx) => (
                  <React.Fragment key={`header-${idx}`}>
                    <TableCell
                      dangerouslySetInnerHTML={{ __html: header.label }}
                      sx={{
                        fontSize: "15px",
                        color: "#143664",
                        fontWeight: "bold",
                        lineHeight: "1.15rem",
                        borderRadius:
                          idx === 0
                            ? "20px 0 0 20px"
                            : idx === tableHeaders.length - 1
                            ? "0 20px 20px 0"
                            : "0",
                        borderWidth: 0,
                      }}
                    />
                    {idx !== tableHeaders.length - 1 && (
                      <th className="MuiCustomSeperator MuiTableCell-root MuiTableCell-head MuiTableCell-sizeMedium css-1ufn4ar-MuiTableCell-root">
                        <div
                          style={{
                            height: "0px",
                            width: "2px",
                            backgroundColor: "transparent",
                          }}
                        ></div>
                      </th>
                    )}
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="max-w-full">
              <tr className="h-5" />
              {data.map((row, rowIndex) => (
                <React.Fragment key={`body-row-${rowIndex}`}>
                  <TableRow
                    className="relative bg-white"
                    // className="relative bg-white cursor-pointer"
                    // Do we want the entire row to be clickable?
                    onClick={(e) => {
                      if (!disable) {
                        setClickedRowPos({
                          x: e.pageX,
                          y: e.pageY,
                        });

                        setClickedRowIndex(
                          rowIndex === clickedRowIndex ? null : rowIndex
                        );
                      }
                    }}
                  >
                    {tableHeaders.map((header, idx) => (
                      <React.Fragment key={`body-${rowIndex}-${idx}`}>
                        <TableCell
                          sx={{
                            width: header.id === "password" ? "150px" : "auto",
                            whiteSpace: "nowrap",
                            borderRadius:
                              idx === 0
                                ? "20px 0 0 20px"
                                : idx === tableHeaders.length - 1
                                ? "0 20px 20px 0"
                                : "0",
                            borderWidth: 0,
                          }}
                        >
                          {header.id === circleName ? (
                            onAvatarClick ? (
                              <div
                                className="flex items-center gap-3.5"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAvatarClick(row.ContactID);
                                }}
                              >
                                <Avatar
                                  src={getImagePath(row.Image_Location)}
                                  sx={{
                                    backgroundColor: randomColor(rowIndex),
                                    borderColor: "#00ff00",
                                    borderWidth:
                                      primaryID === row.ContactID ? 4 : 0,
                                  }}
                                >
                                  {row[header.id][0]}
                                </Avatar>
                                {row[header.id]}
                              </div>
                            ) : (
                              <div className="flex items-center gap-3.5">
                                <Avatar src={getImagePath(row.Image_Location)}>
                                  {row[header.id][0]}
                                </Avatar>
                                {row[header.id]}
                              </div>
                            )
                          ) : header.id === "Broker" ? (
                            row[header.id] ? (
                              row[header.id]
                            ) : (
                              <>
                                {Addtext === "Add Broker" ? (
                                  <div
                                    className="cursor-pointer w-fit bg-[#1479ff] bg-opacity-20 px-4 py-3 rounded-xl text-[#1479ff] font-semibold"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      navigate("/vendor/manage-vendors/edit", {
                                        // TODO why does the table component have vendor specific code?
                                        state: {
                                          id: row.VendorID,
                                          addBroker: true,
                                        },
                                      });
                                    }}
                                  >
                                    <span>{Addtext}</span>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className="bg-[#1479ff] bg-opacity-20 px-4 py-3 rounded-xl text-[#1479ff] font-semibold"
                                  >
                                    {Addtext}
                                  </button>
                                )}
                              </>
                            )
                          ) : header.id === "Access_Level" ? (
                            <button
                              type="button"
                              className="bg-[#1479ff] bg-opacity-20 px-4 py-3 min-w-48 rounded-xl text-[#1479ff] font-semibold"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleModifyOpen(rowIndex);
                              }}
                            >
                              {row[header.id] ? Addtext : "Add Access"}
                            </button>
                          ) : header.id === "Password" ? (
                            <div className="flex items-center justify-center min-w-full gap-2 text-[#4D5658]">
                              <span>
                                {passwordVisibility[rowIndex] ? (
                                  row[header.id]
                                ) : (
                                  <p className="font-semibold text-[20px] -mb-2.5">
                                    ************
                                  </p>
                                )}
                              </span>
                              <IconButton
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  togglePasswordVisibility(rowIndex);
                                }}
                                size="small"
                              >
                                {passwordVisibility[rowIndex] ? (
                                  <VisibilityOff fontSize="small" />
                                ) : (
                                  <Visibility fontSize="small" />
                                )}
                              </IconButton>
                            </div>
                          ) : header.id === "more" ? (
                            onPrint ? (
                              <DropdownMenu
                                closeOthers={() => setClickedRowIndex(null)}
                                onEdit={() => onEdit(row)}
                                onDelete={() => onDelete(row)}
                                onPrint={() => onPrint(row)}
                                last={rowIndex + 1 === data?.length}
                              />
                            ) : (
                              <DropdownMenu
                                closeOthers={() => setClickedRowIndex(null)}
                                onEdit={() => onEdit(row)}
                                onDelete={() => onDelete(row)}
                                last={rowIndex + 1 === data?.length}
                              />
                            )
                          ) : (
                            <p className="bg-white border-none outline-none max-w-80 overflow-hidden text-ellipsis">
                              {row[header.id]}
                            </p>
                          )}
                        </TableCell>
                        {idx !== tableHeaders.length - 1 && (
                          <th className="MuiCustomSeperator MuiTableCell-root MuiTableCell-head MuiTableCell-sizeMedium css-1ufn4ar-MuiTableCell-root">
                            <div
                              style={{
                                height: "18px",
                                width: "1px",
                                backgroundColor: "#888888",
                              }}
                            ></div>
                          </th>
                        )}
                      </React.Fragment>
                    ))}
                  </TableRow>
                  <tr className="h-5" />
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {clickedRowIndex !== null && (
          <div
            className="absolute"
            style={{
              left: clickedRowPos.x,
              top: clickedRowPos.y,
            }}
          >
            {onPrint ? (
              <DynamicDropdownMenu
                closeHandler={() => setClickedRowIndex(null)}
                onEdit={() => onEdit(data[clickedRowIndex])}
                onDelete={() => onDelete(data[clickedRowIndex])}
                onPrint={() => onPrint(data[clickedRowIndex])}
              />
            ) : (
              <DynamicDropdownMenu
                closeHandler={() => setClickedRowIndex(null)}
                onEdit={() => onEdit(data[clickedRowIndex])}
                onDelete={() => onDelete(data[clickedRowIndex])}
              />
            )}
          </div>
        )}
        {selectedIndex !== null && (
          <AccessLevelModal
            open={true}
            handleClose={handleModifyClose}
            selectedAccess={data[selectedIndex].Access_Level}
            setSelectedAccess={(info) => {
              if (data[selectedIndex].Access_Level) {
                axios
                  .put(
                    `/users/access-update/${data[selectedIndex].UserID}`,
                    info
                  )
                  .then((res) => {
                    setData((prevData) =>
                      prevData.map((item, idx) =>
                        idx === selectedIndex
                          ? {
                              ...item,
                              Access_Level: info,
                            }
                          : item
                      )
                    );
                    toast.success("Successfully modified new access level");
                  })
                  .catch((err) => {
                    console.error(err);
                    toast.error("Failed to modify new access level");
                  });
              } else {
                axios
                  .post(
                    `/users/access-create/${data[selectedIndex].UserID}`,
                    info
                  )
                  .then((res) => {
                    setData((prevData) =>
                      prevData.map((item, idx) =>
                        idx === selectedIndex
                          ? {
                              ...item,
                              Access_Level: info,
                            }
                          : item
                      )
                    );
                    toast.success("Successfully added new access level");
                  })
                  .catch((err) => {
                    console.error(err);
                    toast.error("Failed to add new access level");
                  });
              }
              setSelectedIndex(null);
            }}
            userName={data[selectedIndex].User_Name}
            imageLocation={data[selectedIndex].Image_Location}
          />
        )}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{"Set Primary Contact"}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "red", fontSize: "20px" }}>
              Do you want to set this contact as primary?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmPrimary} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

export default TableComponent;
