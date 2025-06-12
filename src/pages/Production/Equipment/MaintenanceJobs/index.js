import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";

import CustomWideLayout from "../../../../components/common/Layout/CustomWideLayout";
import CustomTable from "../../../../components/common/CustomTable";
import {usePaginatedData} from "../../../../hooks";
import {cleaningJobsService, maintenanceJobsService} from "../../../../services";

const MaintenanceJobs = () => {
  const navigate = useNavigate()

  const {
    data: data,
    loading,
    error,
    totalItems,
    currentPage,
    totalPages,
    changePage,
    handleSearch,
    testSearch
  } = usePaginatedData(maintenanceJobsService.getAll);

  // Handlers
  const handleEdit = (row) => {
    navigate(`/production/equipment/maintenance-schedules/${row.Maintenance_JobID}`);
  };

  const handleDelete = async (row) => {
    try {
      await maintenanceJobsService.delete(row.Maintenance_JobID);
      navigate(0);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleAdd = (row) => {
    navigate(`/production/equipment/maintenance-schedules/new`);
  }

  const dataConfig = [
    {
      key: 'Maintenance_JobID',
      header: 'ID',
      visible: true,
    },
    {
      key: 'Maint_Name',
      header: 'Maintenance Name',
      visible: true,
    },
    {
      key: 'Maint_Description',
      header: 'Maintenance Description',
      visible: true,
    },
    {
      key: 'Equipment_Name',
      header: 'Equipment Name',
      visible: true,
    },
    {
      key: 'Next_procedure_date',
      header: 'Next Cleaning Date',
      visible: true,
    },
    {
      key: 'Next_procedure_time',
      header: 'Next Cleaning Time',
      visible: true,
    },
    {
      key: 'Next_procedure_employee-First_Name',
      header: 'Employee',
      visible: true,
    },
  ];

  return (
    <>
      <CustomWideLayout>
        <CustomTable
          titleText={"Maintenance Schedules"}

          data={data}
          dataConfig={dataConfig}

          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddText="Add New Maintenance Schedule"
          onAddClick={handleAdd}

          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}

          searchText={"Search Maintenance Schedules"}
          onSearch={handleSearch}
        />
      </CustomWideLayout>
    </>
  );
};

export default MaintenanceJobs;