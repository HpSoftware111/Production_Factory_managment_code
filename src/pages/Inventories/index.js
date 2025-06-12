import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Button, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

import axios from "../../api";
import TableComponent from "../../components/common/TableComponent";
import PaginationComponent from "../../components/common/Pagination";
import { SEARCH_INPUT_STYLE } from "../../components/common/utils";

import { breakLabelText } from "../../utils/breakLabelText";

const Inventories = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(null);

  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleEdit = (row) => {
    navigate("/inventory/manage-inventories/edit", {
      state: { id: row.InventoryID },
    });
  };

  const handleDelete = (row) => {
    navigate("/inventory/manage-inventories/delete", {
      state: { id: row.InventoryID },
    });
  };

  const handleClear = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const tableHeaders = [
    { id: "Name", label: breakLabelText("Inventory Name") },
    {
      id: "Description",
      label: breakLabelText("Inventory Description"),
    },
    { id: "Storage_Method", label: breakLabelText("Storage Method") },
    { id: "Unit_Qty", label: breakLabelText("Quantity") },
    { id: "Unit_Price", label: breakLabelText("Average Cost") },
    { id: "Total_Price", label: breakLabelText("Total Price") },
    { id: "more", label: "" },
  ];

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

    return () => {
      window.removeEventListener("resize", calculateRowsPerPage);
    };
  }, []);

  useEffect(() => {
    if (rowsPerPage) {
      axios
        .get(
          `/inventories?page=${currentPage}&keyword=${searchTerm}&size=${rowsPerPage}`
        )
        .then((res) => {
          let data = res.data.data.data;
          setInventoryItems(data);
          setTotalPage(res.data.data.totalPages);
        });
    }
  }, [currentPage, rowsPerPage, searchTerm]);

  return (
    <div className="py-5 main">
      <div className="px-5 py-3 flex justify-between flex-wrap gap-4 md:flex-nowrap">
        <button
          type="button"
          className="bg-BtnBg text-white rounded-xl py-2 px-7 min-h-12"
          onClick={handleClick}
        >
          Add New Inventory
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
              placeholder="Inventory Search"
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
      <div className="flex p-5 flex-1">
        <TableComponent
          tableHeaders={tableHeaders}
          data={inventoryItems}
          circleName="Name"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <PaginationComponent
        totalPage={totalPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Modal open={open} onClose={onClose}>
        <Box
          className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold mb-2 text-BtnBg">
              Confirm Addition
            </h2>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </div>
          <p>
            New inventory cannot be added without first creating a Vendor
            Product. Click to add a new Vendor Product.
          </p>
          <div className="flex justify-end space-x-4 mt-3">
            <Button
              variant="contained"
              onClick={() =>
                navigate("/vendor/manage-vendor-products/new", {
                  state: {
                    name: null,
                  },
                })
              }
              className="!bg-BtnBg"
              sx={{ textTransform: "capitalize" }}
            >
              Add New Vendor Product
            </Button>
            <Button
              variant="text"
              onClick={onClose}
              className="text-gray-500"
              sx={{ textTransform: "capitalize" }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Inventories;
