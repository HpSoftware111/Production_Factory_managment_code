import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../../../api";
import TableComponent from "../../../../components/common/TableComponent";
import PaginationComponent from "../../../../components/common/Pagination";
import { SEARCH_INPUT_STYLE } from "../../../../components/common/utils";

import { breakLabelText } from "../../../../utils/breakLabelText";

const AlertSettings = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [Employees, setEmployees] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(null);

  const handleClick = () => {
    navigate("/settings/users/new");
  };

  const handleEdit = (row) => {
    console.log(row["EmployeeID"]);
    navigate("/settings/notification-settings/alertSettings/edit", {
      state: { id: row["EmployeeID"] },
    });
  };

  const handleDelete = (row) => {
    navigate("/settings/notification-settings/alertSettings/delete", {
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
    { id: "Employee_Name", label: breakLabelText("Employee Name") },
    { id: "Title", label: "Title" },
    { id: "Email_Address", label: breakLabelText("Email Address") },
    { id: "Phone_1", label: breakLabelText("Phone Number") },

    // { id: "User_Name", label: breakLabelText("Users Name") },
    // { id: "Password", label: "Password" },
    // { id: "Access_Level", label: breakLabelText("Access Level") },
    // { id: "more", label: "" },
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
          `/notifications?page=${currentPage}&keyword=${searchTerm}&size=${rowsPerPage}&Notification_Type=Alert` // Add Notification_Type to the query
        )
        .then((res) => {
          console.log("res:", res);
          let data = res.data.data.data;
          console.log(data);
          data = data
            .map((item) => {
              const notification = item.NotificationLists?.[0] || {};
              const employee = notification?.Employee || {};
              console.log("employee:", employee);
              // const employee =
              //   notification && notification.Employee
              //     ? notification.Employee
              //     : null;
              return {
                UserID: item.NotificationsID,
                // User_Name: item.User_Name,
                EmployeeID: employee?.EmployeeID,
                Phone_1: employee?.Phone_1 || "",
                Title: item.Notification_Name || "", // Assuming Title is part of the Notification or Notification_List
                Employee_Name:
                  `${employee?.First_Name} ${employee?.Last_Name}` || "",
                Email_Address: employee?.Email || "", // Ensure Email_Address is present in Employee
                Image_Location: employee?.Image_Location || "",
              };
            })
            .filter((item) => item.EmployeeID != null);
          setEmployees(data);
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
          Add Contact
        </button>
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            Alert Settings
          </h2>
        </div>
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
          data={Employees}
          setData={Employees}
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

export default AlertSettings;
