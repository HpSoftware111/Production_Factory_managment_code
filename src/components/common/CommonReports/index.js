import React, { useEffect, useRef, useState } from "react";

import axios from "../../../api";
import { SEARCH_INPUT_STYLE } from "../utils";
import PaginationComponent from "../Pagination";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import DropdownMenu from "../DropdownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import DynamicDropdownMenu from "../DynamicDropdownMenu";
import SystemReportModal from "../../modals/ReportModal/systemReportModal";

const useMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return { anchorEl, menuOpen, handleMenuClick, handleMenuClose };
};

const CommonReports = ({ group }) => {
  const inputRef = useRef(null);
  const [totalPage, setTotalPage] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(null);
  const [reports, setReports] = useState([]);
  const [groups, setGroups] = useState([]);
  //   const [group, setGroup] = useState(null);
  const [printers, setPrinters] = useState([]);
  //   const [printer, setPrinter] = useState(null);
  const [open, setOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [btnValue, setBtnValue] = useState("add");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [selectedPaperType, setSelectedPaperType] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState(group);

  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [clickedRowPos, setClickedRowPos] = useState({ x: 0, y: 0 });

  const menu1 = useMenu();
  const menu2 = useMenu();
  const menu3 = useMenu();

  const onClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setBtnValue("add");
    setClickedRowIndex(null);
    setSelectedRow(null);
    setOpen(true);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setBtnValue("update");
    setOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setBtnValue("delete");
    setOpen(true);
  };

  useEffect(() => {
    const calculateRowsPerPage = () => {
      const availableHeight = window.innerHeight - 371;
      const rowHeight = 72;
      const rowGap = 20;
      const rows = Math.floor(availableHeight / (rowHeight + rowGap)) - 1;
      setRowsPerPage(rows > 0 ? rows : 10);
    };

    calculateRowsPerPage();

    window.addEventListener("resize", calculateRowsPerPage);
    axios.get("/groups").then((res) => {
      setGroups(res.data.data);
    });
    axios.get("/printers").then((res) => {
      setPrinters(res.data.data);
    });

    return () => {
      window.removeEventListener("resize", calculateRowsPerPage);
    };
  }, []);

  useEffect(() => {
    if (rowsPerPage) {
      let queryString = `?page=${currentPage}&keyword=${searchTerm}&size=${rowsPerPage}`;
      selectedReportType &&
        (queryString = `${queryString}&report=${selectedReportType}`);
      selectedPaperType &&
        (queryString = `${queryString}&paper=${selectedPaperType}`);
      selectedGroupName &&
        (queryString = `${queryString}&group=${selectedGroupName}`);
      axios.get(`/reports${queryString}`).then((res) => {
        let data = res.data.data.data.rows;
        setReports(
          data.map((item) => ({
            ReportID: item.ReportID,
            Report_Name: item.Report_Name,
            Report_Description: item.Report_Description,
            Printer: item.Printer.Printer_Name,
            Report_Types: item.Report_Type,
            Paper_Type: item.Paper_Type,
            Group_Name: item.Group.Group_Name,
          }))
        );
        setTotalPage(res.data.data.totalPages);
      });
    }
  }, [
    currentPage,
    rowsPerPage,
    searchTerm,
    selectedReportType,
    selectedPaperType,
    selectedGroupName,
  ]);

  useEffect(() => {
    if (refreshFlag) {
      axios
        .get(
          `/reports?page=${currentPage}&keyword=${searchTerm}&size=${rowsPerPage}`
        )
        .then((res) => {
          let data = res.data.data.data.rows;
          setReports(
            data.map((item) => ({
              ReportID: item.ReportID,
              Report_Name: item.Report_Name,
              Report_Description: item.Report_Description,
              Printer: item.Printer.Printer_Name,
              Report_Types: item.Report_Type,
              Paper_Type: item.Paper_Type,
              Group_Name: item.Group.Group_Name,
            }))
          );
          setTotalPage(res.data.data.totalPages);
          setRefreshFlag(false);
        });
    }
  }, [refreshFlag]);

  return (
    <div className="py-5 main">
      <div className="px-5 py-3 flex justify-between flex-wrap gap-4 md:flex-nowrap">
        <button
          type="button"
          className="bg-BtnBg text-white rounded-xl py-2 px-7 min-h-12"
          onClick={handleClick}
        >
          Add New Report
        </button>

        <form className="rounded-xl">
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
              placeholder="Report Search"
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
        </form>
      </div>
      <div className="flex flex-col p-5 flex-1">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 5fr 2fr 2fr 2fr 3fr 1fr",
            bgcolor: "#E2E8F0",
            borderRadius: 2,
            py: 2,
            px: 3,
            mb: 2,
            color: "#143664",
            fontWeight: "bold",
          }}
        >
          <div className="flex items-center">
            Report
            <br />
            Name
          </div>
          <div className="flex items-center pl-4 border-l border-solid border-[#D1D5DB]">
            Report
            <br />
            Description
          </div>
          <div className="flex items-center pl-4 border-l border-solid border-[#D1D5DB]">
            Printer
          </div>
          <div className="flex items-center justify-between px-4 border-l border-solid border-[#D1D5DB]">
            {selectedReportType ? (
              selectedReportType
            ) : (
              <>
                Report
                <br />
                Types
              </>
            )}
            <Button
              id="report-types-button"
              aria-controls={menu1.menuOpen ? "report-types-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menu1.menuOpen ? "true" : undefined}
              onClick={menu1.handleMenuClick}
              size="small"
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </Button>
            <Menu
              id="report-types-menu"
              anchorEl={menu1.anchorEl}
              open={menu1.menuOpen}
              onClose={menu1.handleMenuClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem
                key={"clear_report_types"}
                onClick={() => {
                  setSelectedReportType(null);
                  menu1.handleMenuClose();
                  setCurrentPage(1);
                }}
              >
                All Report Types
              </MenuItem>
              {["System Report", "Client Report", "Custom Report"].map(
                (option) => (
                  <MenuItem
                    key={option}
                    onClick={() => {
                      setSelectedReportType(option);
                      menu1.handleMenuClose();
                      setCurrentPage(1);
                    }}
                  >
                    {option}
                  </MenuItem>
                )
              )}
            </Menu>
          </div>
          <div className="flex items-center justify-between px-4 border-l border-solid border-[#D1D5DB]">
            {selectedPaperType ? (
              selectedPaperType
            ) : (
              <>
                Paper
                <br />
                Types
              </>
            )}
            <Button
              id="paper-types-button"
              aria-controls={menu2.menuOpen ? "paper-types-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menu2.menuOpen ? "true" : undefined}
              onClick={menu2.handleMenuClick}
              size="small"
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </Button>
            <Menu
              id="paper-types-menu"
              anchorEl={menu2.anchorEl}
              open={menu2.menuOpen}
              onClose={menu2.handleMenuClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem
                key={"clear_paper_types"}
                onClick={() => {
                  setSelectedPaperType(null);
                  menu2.handleMenuClose();
                  setCurrentPage(1);
                }}
              >
                All Paper Types
              </MenuItem>
              {["4 x 6 T Label", "8.5 x 11 Sheet"].map((option) => (
                <MenuItem
                  key={option}
                  onClick={() => {
                    setSelectedPaperType(option);
                    menu2.handleMenuClose();
                    setCurrentPage(1);
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <div className="flex items-center pl-4 border-l border-solid border-[#D1D5DB]">
            Report Group
          </div>
          <div></div>
        </Box>
        {reports && reports.length > 0 ? (
          reports.map((report, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: "#FFF",
                borderRadius: 2,
                py: 2,
                px: 3,
                mb: 2,
                display: "grid",
                gridTemplateColumns: "2fr 5fr 2fr 2fr 2fr 3fr 1fr",
                alignItems: "center",
              }}
              onClick={(e) => {
                setClickedRowPos({
                  x: e.pageX,
                  y: e.pageY,
                });

                setClickedRowIndex(index === clickedRowIndex ? null : index);
              }}
            >
              <div className="text-[#4B5563]">{report.Report_Name}</div>
              <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] line-clamp-1 pl-4">
                {report.Report_Description}
              </div>
              <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                {report.Printer}
              </div>
              <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                {report.Report_Types}
              </div>
              <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                {report.Paper_Type}
              </div>
              <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] line-clamp-1 pl-4">
                {report.Group_Name}
              </div>
              <DropdownMenu
                closeOthers={() => setClickedRowIndex(null)}
                onEdit={() => handleEdit(report)}
                onDelete={() => handleDelete(report)}
                last={index + 1 === printers.length}
              />
            </Box>
          ))
        ) : (
          <Box
            sx={{
              bgcolor: "#F3F4F6",
              borderRadius: 2,
              py: 2,
              px: 3,
              mb: 3,
              display: "grid",
              gridTemplateColumns: "1fr 2fr 2fr 1fr auto",
              alignItems: "center",
              gap: 2,
              whiteSpace: "nowrap",
            }}
          >
            No Printers Added
          </Box>
        )}

        {clickedRowIndex !== null && (
          <div
            className="absolute"
            style={{
              left: clickedRowPos.x,
              top: clickedRowPos.y,
            }}
          >
            <DynamicDropdownMenu
              closeHandler={() => setClickedRowIndex(null)}
              onEdit={() => handleEdit(reports[clickedRowIndex])}
              onDelete={() => handleDelete(reports[clickedRowIndex])}
            />
          </div>
        )}
      </div>
      <PaginationComponent
        totalPage={totalPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {open && (
        <SystemReportModal
          open={open}
          handleClose={onClose}
          btnValue={btnValue}
          id={selectedRow?.ReportID}
          onSubmit={setRefreshFlag}
        />
      )}
    </div>
  );
};

export default CommonReports;
