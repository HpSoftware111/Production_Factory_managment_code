import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../api";
import TableComponent from "../../../components/common/TableComponent";
import { breakLabelText } from "../../../utils/breakLabelText";
import EquipmentEditForm from "../../../components/forms/EquipmentEditForm";
import CustomWideLayout from "../../../components/common/Layout/CustomWideLayout";
import PaginationComponent from "../../../components/common/Pagination";
import CleanManitJobNewModal from "../../../components/modals/CleanManitJobNewModal";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";

const EquipmentEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const childRef = useRef();

  const [cleaningJobs, setCleaningJobs] = useState([]);
  const [totalCleaningJobs, setTotalCleaningJobs] = useState(0);
  const [maintJobs, setMaintJobs] = useState([]);
  const [totalMaintJobs, setTotalMaintJobs] = useState(0);
  const [isCleaningChild, setIsCleaningChild] = useState(true);
  const [openCleaningJobNew, setOpenCleaningJobNew] = useState(false);
  const [cleaningJobModalBtnValue, setCleaningJobModalBtnValue] =
    useState("add");
  const [selectedChildIndex, setSelectedChildIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(true);
  const { id } = location.state || {};

  const cleaningTableHeaders = [
    { id: "Cleaning_Name", label: breakLabelText("Cleaning Name") },
    { id: "Cleaning_Description", label: breakLabelText("Description") },
    { id: "more", label: "" },
  ];

  const maintTableHeaders = [
    { id: "Maint_Name", label: breakLabelText("Maintenance Name") },
    { id: "Maint_Description", label: breakLabelText("Description") },
    { id: "more", label: "" },
  ];

  const getCleaningJobs = () => {
    axios
      .get(
        `/cleaningJobs?page=${currentPage}&keyword=${searchTerm}&size=${rowsPerPage}&EquipmentID=${id}`
      )
      .then((res) => {
        let data = res.data.data.data;
        setCleaningJobs(data);
        setTotalPage(res.data.data.totalPages);
        setTotalCleaningJobs(res.data.data.totalAmount);
      })
      .catch((err) => console.error(err));
  };

  const getMaintJobs = () => {
    axios
      .get(
        `/maintenanceJobs?page=${currentPage}&keyword=${searchTerm}&size=${rowsPerPage}&EquipmentID=${id}`
      )
      .then((res) => {
        let data = res.data.data.data;
        setMaintJobs(data);
        setTotalPage(res.data.data.totalPages);
        setTotalMaintJobs(res.data.data.totalAmount);
      })
      .catch((err) => console.error(err));
  };

  const handleJobChildEdit = (row) => {
    if (isCleaningChild) {
      navigate("/production/cleaning-job/edit", {
        state: { id: row["Cleaning_JobID"] },
      });
    } else {
      navigate("/production/maintenance-job/edit", {
        state: { id: row["Maintenance_JobID"] },
      });
    }
  };

  const handleJobChildDelete = (row) => {
    setOpenConfirmation(true);
    setSelectedChildIndex(
      isCleaningChild ? row["Cleaning_JobID"] : row["Maintenance_JobID"]
    );
  };

  const deleteHandler = () => {
    try {
      const url = isCleaningChild
        ? `/cleaningJobs/${selectedChildIndex}`
        : `/maintenanceJobs/${selectedChildIndex}`;
      const message = isCleaningChild
        ? "Cleaning Job Deleted Successfully"
        : "Maintenance Job Deleted Successfully";

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

  const handleAddSchedule = () => {
    setOpenCleaningJobNew(true);
  };

  const refreshChild = (isBoth = false) => {
    if (isBoth) {
      getCleaningJobs();
      getMaintJobs();
    } else {
      if (isCleaningChild) {
        getCleaningJobs();
      } else {
        getMaintJobs();
      }
    }
  };

  const handleSearch = async (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  useEffect(() => {
    refreshChild(true);
  }, []);

  useEffect(() => {
    refreshChild();
  }, [currentPage, rowsPerPage, searchTerm, id, isCleaningChild]);

  useEffect(() => {
    if (childRef.current) {
      childRef.current.handleClear();
    }
  }, [isCleaningChild]);

  return (
    <>
      <div className="p-6">
        <EquipmentEditForm
          id={id}
          totalCleaningJobs={totalCleaningJobs}
          totalMaintJobs={totalMaintJobs}
          onChildSelect={setIsCleaningChild}
        />
        <div className="h-5" />
      </div>
      <CustomWideLayout>
        {isCleaningChild ? (
          <TableComponent
            tableHeaders={cleaningTableHeaders}
            data={cleaningJobs}
            onEdit={handleJobChildEdit}
            onDelete={handleJobChildDelete}
            onAddText="Add Cleaning Job"
            onAddClick={handleAddSchedule}
            title="Cleaning Jobs"
            searchPlaceholder="Search Cleaning Job"
            onSearch={handleSearch}
            ref={childRef}
          />
        ) : (
          <TableComponent
            tableHeaders={maintTableHeaders}
            data={maintJobs}
            onEdit={handleJobChildEdit}
            onDelete={handleJobChildDelete}
            onAddText="Add Maintenance Job"
            onAddClick={handleAddSchedule}
            title="Maintenance Jobs"
            searchPlaceholder="Search Maintenance Job"
            onSearch={handleSearch}
            ref={childRef}
          />
        )}
      </CustomWideLayout>
      <PaginationComponent
        currentPage={currentPage}
        totalPage={totalPage}
        setCurrentPage={setCurrentPage}
      />
      {openCleaningJobNew && (
        <CleanManitJobNewModal
          open={true}
          handleClose={() => setOpenCleaningJobNew(false)}
          btnValue={cleaningJobModalBtnValue}
          id={id}
          isCleaningOrMaint={isCleaningChild}
          onSubmit={isCleaningChild ? getCleaningJobs : getMaintJobs}
        />
      )}
      {openConfirmation && selectedChildIndex && (
        <ConfirmationModal
          type={"delete"}
          open={openConfirmation}
          onClose={() => {
            setOpenConfirmation(false);
            setSelectedChildIndex(null);
          }}
          onSubmit={deleteHandler}
          from={isCleaningChild ? "cleaning job" : "maintenance job"}
        />
      )}
    </>
  );
};

export default EquipmentEdit;
