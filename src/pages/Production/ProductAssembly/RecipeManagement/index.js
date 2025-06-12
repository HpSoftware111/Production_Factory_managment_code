import React, { useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";

import CustomWideLayout from "../../../../components/common/Layout/CustomWideLayout";
import CustomTable from "../../../../components/common/CustomTable";

const RecipeManagement = () => {
  const navigate = useNavigate()

  // Generate 50 items of sample data
  const generateSampleData = () => {
    const data = [];
    const statuses = ['Active', 'Maintenance', 'Inactive', 'Repair'];

    for (let i = 1; i <= 200; i++) {
      data.push({
        Equipment_Name: `Equipment ${i}`,
        Equipment_BarCode: `EQ-${String(i).padStart(3, '0')}`,
        Model_Number: `MDL-${2023 + (i % 5)}-${String.fromCharCode(65 + (i % 26))}${i}`,
        Next_Cleaning_Date: new Date(2024, 1 + (i % 12), 1 + (i % 28)).toISOString().split('T')[0],
        Next_Maintenance_Date: new Date(2024, 2 + (i % 12), 1 + (i % 28)).toISOString().split('T')[0],
        Operational_Status: statuses[i % statuses.length]
      });
    }
    return data;
  };

  const [equipmentData, setEquipmentData] = useState(generateSampleData());

  // Handlers
  const handleEdit = (row) => {
    console.log("Edit:", row);
    navigate("/production/product-assembly/recipe-management/edit", {
      state: { id: row.InventoryID },
    });
  };

  const handleDelete = (row) => {
    console.log("Delete:", row);
  };

  const handleAdd = (row) => {
    navigate(`/production/equipment/cleaning-schedules/new`);
  }

  return (
    <>
      <CustomWideLayout>
        <CustomTable
          data={equipmentData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddText="Add New Equipment"
          onAddClick={() => {}}
          searchText={"Search Equipment"}
        />
      </CustomWideLayout>
    </>
  );
};

export default RecipeManagement;