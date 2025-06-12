import React, { useState, useEffect, useCallback, useRef } from "react";
import { Container, Typography, Paper, Grid, Box, Button } from "@mui/material";
import ContentCard from "../../../components/common/ContentCard/ContentCard";
import Dashboard from "../../../components/common/Layout/Dashboard";
import CustomButton from "../../../components/common/CustomButton";
import Stack from "@mui/material/Stack";
import CustomWideLayout from "../../../components/common/Layout/CustomWideLayout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  StyledSelect,
  StyledTextField,
} from "../../../components/common/CustomFormFields";
import CustomTable from "../../../components/common/CustomTable";
import Field from "../../../components/common/Field";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import axios from "../../../api";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AsyncMultiSelect from "../../../components/common/AsyncMultiSelect";
import SearchableField from "../../../components/common/SearchableField";
import CleaningScheduleDetailForm from "../../../components/forms/CleaningScheduleDetailForm";
import PaginationComponent from "../../../components/common/Pagination";
import TableComponent from "../../../components/common/TableComponent";
import { toast } from "react-toastify";
import CleaningMaterialDetailModal from "../../../components/modals/CleaningMaterialDetailModal";

const validationSchema = Yup.object({
  Procedure: Yup.string().required("Name is required"),
  Description: Yup.string().required("Description is required"),
});

const CleaningScheduleNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const childRef = useRef();
  const { id, cleaningJobID } = location.state || {}; // Cleaning Job ID

  console.log("🚀🚀🚀Cleaning Schedule ID :", id);

  const tableHeaders = [
    { id: "Inventory_Name", label: "Inventory Name" },
    { id: "Inventory_Description", label: "Inventory Description" },
    { id: "Inventory_Type", label: "Inventory Type" },
    { id: "Unit_Of_Measure", label: "Unit Of Measure" },
    { id: "Qty_Used", label: "Quantity Used" },
    { id: "Unit_Price", label: "Unit Price" },
    { id: "more", label: "" },
  ];

  const [suplies, setSuplies] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openMaterialDetail, setOpenMaterialDetail] = useState(false);
  const [btnValue, setBtnValue] = useState("add");

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

  const getCleaningMaterials = () => {
    if (rowsPerPage && id) {
      let url = `/cleaningMaterials?page=${currentPage}&keyword=${searchTerm}&size=${rowsPerPage}&CleaningID=${id}`;
      axios.get(url).then((res) => {
        let data = res.data.data.data;
        data = data.map((item) => {
          // for (let i = 0; i < item.Equipments.length; i++) {
          return {
            ...item,
            Inventory_ID: item.InventoryID,
            Inventory_Name: item.Inventory.Inventory_Name,
            Inventory_Description: item.Inventory.Inventory_Description,
            Inventory_Type: item.Inventory.Inventory_Type.Inventory_Type,
            Unit_Of_Measure: item.Unit_Of_Measure,
            Qty_Used: item.Qty_Used,
            Unit_Price: `$${item.Unit_Price}`,
          };
          // }
        });
        setSuplies(data);
        setTotalPage(res.data.data.totalPages);
      });
    }
  };

  const refreshChild = () => {
    getCleaningMaterials();
  };
  // Add New Schedule
  const handleAddMaterial = () => {
    setBtnValue("add");
    setOpenMaterialDetail(true);
  };
  const handleMaterialEdit = (row) => {
    console.log("🚀🚀🚀Edit:", row);
    setBtnValue("update");
    setSelectedChild(row);
    setOpenMaterialDetail(true);
  };

  const handleMaterialDelete = (row) => {
    console.log("🚀🚀🚀Delete:", row);
    setOpenConfirmation(true);
    setSelectedChild(row);
  };

  const deleteHandler = () => {
    try {
      const url = `/cleaningMaterials/${selectedChild.Cleaning_MaterialsID}`;
      const message = "Cleaning Supply Deleted Successfully";

      axios.delete(url).then(() => {
        toast.success(message);
        setOpenConfirmation(false);
        setSelectedChild(null);
        refreshChild();
      });
    } catch (error) {
      console.error("Error deleting cleaning supply:", error);
      toast.error("Failed to delete cleaning supply. Please try again.");
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
    <CustomWideLayout>
      <CleaningScheduleDetailForm
        id={id}
        cleaningJobID={cleaningJobID}
        onSubmit={() => {}}
        btnValue={id ? "update" : "add"}
      />

      {id && (
        <>
          <TableComponent
            tableHeaders={tableHeaders}
            data={suplies}
            // setData={setSchedules}
            onEdit={handleMaterialEdit}
            onDelete={handleMaterialDelete}
            onAddText="Add Cleaning Supplies"
            onAddClick={handleAddMaterial}
            title="Cleaning Supplies"
            searchPlaceholder="Search Cleaning Supplies"
            onSearch={handleSearch}
            ref={childRef}
          />
          {/* </CustomWideLayout> */}
          <PaginationComponent
            currentPage={currentPage}
            totalPage={totalPage}
            setCurrentPage={setCurrentPage}
          />

          {openMaterialDetail && (
            <CleaningMaterialDetailModal
              open={openMaterialDetail}
              handleClose={() => {
                setSelectedChild(null);
                setOpenMaterialDetail(false);
              }}
              btnValue={btnValue}
              data={selectedChild}
              cleaningID={id}
              onSubmit={refreshChild}
            />
          )}

          {openConfirmation && selectedChild && (
            <ConfirmationModal
              type={"delete"}
              open={openConfirmation}
              onClose={() => {
                setOpenConfirmation(false);
                setSelectedChild(null);
              }}
              onSubmit={deleteHandler}
              from={"cleaning supply"}
            />
          )}
        </>
      )}
    </CustomWideLayout>
  );
};

export default CleaningScheduleNew;
