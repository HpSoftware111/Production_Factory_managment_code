import React, { useState, useEffect, useRef } from "react";

import TableComponent from "../../../components/common/TableComponent";
import PaginationComponent from "../../../components/common/Pagination";
import CustomWideLayout from "../../../components/common/Layout/CustomWideLayout";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { toast } from "react-toastify";
import axios from "../../../api";
import CleaningJobEditForm from "../../../components/forms/CleaningJobEditForm";

const CleaningSchedules = () => {
  const tableHeaders = [
    { id: "Procedure", label: "Procedure" },
    { id: "Cleaning_Description", label: "Cleaning Description" },
    { id: "Equipment_Name", label: "Equipment Name" },
    { id: "Date", label: "Date" },
    { id: "Time", label: "Time" },
    { id: "Employee", label: "Employee" },
    { id: "more", label: "" },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const childRef = useRef();

  const [schedules, setSchedules] = useState([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openConfirmation, setOpenConfirmation] = useState(true);
  const { id } = location.state || {};

  // Add New Schedule
  const handleAddSchedule = () => {
    // Go to Add Schedule Page
    navigate("/production/cleaning-schedule/new", {
      state: { cleaningJobID: id },
    });
  };

  useEffect(() => {
    const calculateRowsPerPage = () => {
      const availableHeight = window.innerHeight / 2 - 371;
      const rowHeight = 72;
      const rowGap = 20;
      const rows = Math.floor(availableHeight / (rowHeight + rowGap)) - 1;
      setRowsPerPage(rows > 0 ? rows : 5);
    };

    calculateRowsPerPage();

    window.addEventListener("resize", calculateRowsPerPage);

    return () => {
      window.removeEventListener("resize", calculateRowsPerPage);
    };
  }, []);

  const getCleaningSchedules = () => {
    if (rowsPerPage) {
      let url = `/cleaningSchedules?page=${currentPage}&keyword=${searchTerm}&size=${rowsPerPage}`;
      if (id) {
        url = `${url}&Cleaning_JobID=${id}`;
      }
      axios.get(url).then((res) => {
        let data = res.data.data.data;
        data = data.map((item) => {
          // for (let i = 0; i < item.Equipments.length; i++) {
          return {
            ...item,
            Procedure: item.Procedure,
            Cleaning_Description: item.Description,
            Equipment_Name: item.Cleaning_Job.Equipment.Name || "",
            Date: item.nextCleaningDate || "Expired",
            Time: item.nextCleaningTime
              ? item.nextCleaningTime.slice(0, 5) // Show only hours and minutes
              : "Expired",
            Employee: item.Employee.First_Name + " " + item.Employee.Last_Name,
          };
          // }
        });
        setSchedules(data);
        setTotalPage(res.data.data.totalPages);
      });
    }
  };

  const refreshChild = () => {
    getCleaningSchedules();
  };

  const handleScheduleEdit = (row) => {
    navigate("/production/cleaning-schedule/edit", {
      state: { id: row["CleaningID"] },
    });
  };

  const handleScheduleDelete = (row) => {
    console.log("🚀🚀🚀Delete:", row);
    setOpenConfirmation(true);
    setSelectedChildIndex(row["CleaningID"]);
  };

  const deleteHandler = () => {
    try {
      const url = `/cleaningSchedules/${selectedChildIndex}`;
      const message = "Cleaning Schedule Deleted Successfully";

      axios.delete(url).then(() => {
        toast.success(message);
        setOpenConfirmation(false);
        setSelectedChildIndex(null);
        refreshChild();
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job. Please try again.");
    }
  };

  useEffect(() => {
    refreshChild();
  }, [currentPage, rowsPerPage, searchTerm]);

  const handleSearch = async (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };
  return (
    <>
      {id && (
        <div className="p-6">
          <CleaningJobEditForm id={id} />
          <div className="h-5" />
        </div>
      )}
      <CustomWideLayout>
        <TableComponent
          tableHeaders={tableHeaders}
          data={schedules}
          // setData={setSchedules}
          onEdit={handleScheduleEdit}
          onDelete={handleScheduleDelete}
          onAddText="Add Cleaning Schedule"
          onAddClick={handleAddSchedule}
          title="Cleaning Schedules"
          searchPlaceholder="Search Cleaning Schedule"
          onSearch={handleSearch}
          ref={childRef}
        />
      </CustomWideLayout>
      <PaginationComponent
        currentPage={currentPage}
        totalPage={totalPage}
        setCurrentPage={setCurrentPage}
      />

      {openConfirmation && selectedChildIndex && (
        <ConfirmationModal
          type={"delete"}
          open={openConfirmation}
          onClose={() => {
            setOpenConfirmation(false);
            setSelectedChildIndex(null);
          }}
          onSubmit={deleteHandler}
          from={"cleaning schedule"}
        />
      )}
    </>
  );
};

export default CleaningSchedules;
