import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../api";
import TableComponent from "../../components/common/TableComponent";
import PaginationComponent from "../../components/common/Pagination";
import { SEARCH_INPUT_STYLE } from "../../components/common/utils";

import { breakLabelText } from "../../utils/breakLabelText";

const Users = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(null);

  const handleClick = () => {
    navigate("/settings/users/new");
  };

  const handleEdit = (row) => {
    navigate("/settings/users/edit", {
      state: { id: row["UserID"] },
    });
  };

  const handleDelete = (row) => {
    navigate("/settings/users/delete", {
      state: { id: row["UserID"] },
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
    { id: "User_Name", label: breakLabelText("Users Name") },
    { id: "Phone_1", label: breakLabelText("Phone Number") },
    { id: "Title", label: "Title" },
    { id: "Employee_Name", label: breakLabelText("Employee Name") },
    { id: "Password", label: "Password" },
    { id: "Access_Level", label: breakLabelText("Access Level") },
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
          `/users?page=${currentPage}&keyword=${searchTerm}&size=${rowsPerPage}`
        )
        .then((res) => {
          let data = res.data.data.data;
          data = data.map((item) => {
            return {
              UserID: item.UserID,
              User_Name: item.User_Name,
              Phone_1: item.Phone_1,
              Title: item.Title,
              Employee_Name: item.Employee_Name,
              Password: item.Password,
              Access_Level: item.Access_Level,
              Image_Location: item.Image_Location,
            };
          });
          setUsers(data);
          setTotalPage(res.data.data.totalPages);
        }).catch((error) => {
          console.log(error)
        })
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
          Add New User
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
              placeholder="User Search"
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
          data={users}
          setData={setUsers}
          Addtext={"Modify Access"}
          circleName="User_Name"
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

export default Users;
