import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../api";
import TableComponent from "../../components/common/TableComponent";
import PaginationComponent from "../../components/common/Pagination";
import { SEARCH_INPUT_STYLE } from "../../components/common/utils";

import { breakLabelText } from "../../utils/breakLabelText";
import InventoryPrintModal from "../../components/modals/InventoryPrintModal";

const RejectedInventories = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectedInventories, setRejectedInventories] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(null);

  const [openInventoryPrint, setOpenInventoryPrint] = useState(false);
  const [selectedPrintItem, setSelectedPrintItem] = useState(null);

  const capitalize = (str) => {
    if (typeof str !== "string" || str.length === 0) {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleClick = () => { navigate("/inventory/manage-rejected-inventories/new") }
  const handleEdit = (row) => {
    navigate(`/inventory/manage-rejected-inventories/enew`, {
      state: { id: row["InventoryID"] },
    });
  };

  const handleDelete = (row) => {
    navigate(`/inventory/manage-rejected-inventories/delete`, {
      state: { id: row["InventoryID"] },
    });
  };

  const handlePrint = (row) => {
    setSelectedPrintItem({
      ...row,
      Child_Qty: row.Unit_Qty,
      Type: "REJECTED",
    });
    setOpenInventoryPrint(true);
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
    { id: "SKU_Number", label: breakLabelText("SKU Number") },
    // { id: "Unit_Measure", label: breakLabelText("Units of Measure") },
    { id: "Unit_Qty", label: "Quantity" },
    { id: "Unit_Price", label: breakLabelText("Unit Price") },
    { id: "TotalPrice", label: breakLabelText("Total Price") },
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
          `/rejected-inventories?page=${currentPage}&keyword=${searchTerm}&size=${rowsPerPage}`
        )
        .then((res) => {
          let data = res.data.data.data;
          data = data.map((item) => {
            return {
              InventoryID: item.InventoryID,
              Name: item.Name,
              Description: item.Description,
              SKU_Number: `${item.SKU_Number}-R${item.IncreaseSuffix}`,
              Unit_Measure: capitalize(item.Unit_Measure),
              Unit_Qty: item.Unit_Qty,
              Unit_Price: `$${item.Unit_Price ? item.Unit_Price.toFixed(2) : 0
                }`,
              TotalPrice: `$${(
                (item.Unit_Qty || 0) * (item.Unit_Price || 0)
              ).toFixed(2)}`,
              Image_Location: item.Image_Location,
              Date_Received: item.Date_Received,
              Vendor_Name: item.Vendor_Name,
              Lot_NumID: item.Lot_NumID,
              Inventory_Type: item.Inventory_Type,
              Storage_Method: item.Storage_Method,
            };
          });
          setRejectedInventories(data);
          setTotalPage(res.data.data.totalPages);
        });
    }
  }, [currentPage, rowsPerPage, searchTerm]);

  return (
    <div className="py-5 main">
      <div className="px-5 py-3 flex justify-end flex-wrap gap-4 md:flex-nowrap">
        {/* <button
          type="button"
          className="bg-BtnBg text-white rounded-xl py-2 px-7 min-h-12"
          onClick={handleClick}
        >
          Add Rejected Inventory
        </button> */}

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
              placeholder="Rejected Inventory Search"
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
          data={rejectedInventories}
          Addtext={"Add Broker"}
          circleName="Name"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPrint={handlePrint}
        />
      </div>
      <PaginationComponent
        totalPage={totalPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      {openInventoryPrint && selectedPrintItem && (
        <InventoryPrintModal
          open={openInventoryPrint}
          onClose={() => setOpenInventoryPrint(false)}
          item={selectedPrintItem}
        />
      )}
    </div>
  );
};

export default RejectedInventories;
