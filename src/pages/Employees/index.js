import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../api";
import TableComponent from "../../components/common/TableComponent";
import PaginationComponent from "../../components/common/Pagination";
import { SEARCH_INPUT_STYLE } from "../../components/common/utils";

import { breakLabelText } from "../../utils/breakLabelText";

const Employees = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(null);

  const handleClick = () => {
    navigate("/employees/manage-employees/new", {
      state: {
        name: null,
      },
    });
  };

  const handleEdit = (row) => {
    navigate("/employees/manage-employees/edit", {
      state: { id: row["EmployeeID"] },
    });
  };

  const handleDelete = (row) => {
    navigate("/employees/manage-employees/delete", {
      state: { id: row["EmployeeID"] },
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
    { id: "Employee_Name", label: "Name" },
    { id: "Phone_1", label: breakLabelText("Phone Number 1") },
    { id: "Phone_2", label: breakLabelText("Phone Number 2") },
    { id: "Email", label: breakLabelText("Email") },
    { id: "Address", label: "Address" },
    { id: "Title", label: breakLabelText("Job Title") },
    { id: "Job_Description", label: breakLabelText("Job Description") },
    { id: "DOB", label: "DOB" },
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
          `/employees?page=${currentPage}&keyword=${searchTerm}&size=${rowsPerPage}`
        )
        .then((res) => {
          let data = res.data.data.data;
          data = data.map((item) => {
            return {
              EmployeeID: item.EmployeeID,
              Employee_Name: item.First_Name + " " + item.Last_Name,
              Phone_1: item.Phone_1,
              Phone_2: item.Phone_2,
              Email: item.Email,
              Address: `${item.Addr_1}, ${item.Addr_2}, ${item.City}, ${item.State} ${item.Zip}`,
              Title: item.Title,
              Job_Description: item.Job_Description,
              Image_Location: item.Image_Location,
              DOB: new Date(item.DOB).toISOString().split("T")[0],
            };
          });
          setEmployees(data);
          setTotalPage(res.data.data.totalPages);
        })
        .catch((error) => {
          if (error.response) {
            // Server responded with a status code outside 2xx
            console.error('Response Error:', error.response.status, error.response.data);
          } else if (error.request) {
            // Request was made, but no response received
            console.error('No Response:', error.request);
          } else {
            // Something else caused the error
            console.error('Axios Error:', error.message);
          }
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
          Add New Employee
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
              placeholder="Employee Search"
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
          data={employees}
          circleName="Employee_Name"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <PaginationComponent
        totalPage={totalPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Employees;
