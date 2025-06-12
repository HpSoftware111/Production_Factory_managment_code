import { useNavigate } from 'react-router-dom';

import CustomWideLayout from "../../../../components/common/Layout/CustomWideLayout";
import CustomTable from "../../../../components/common/CustomTable";
import {usePaginatedData} from "../../../../hooks";
import {cleaningJobsService, equipmentService} from "../../../../services";

const EquipmentManagement = () => {
  const navigate = useNavigate()

  const {
    data: equipmentData,
    loading,
    error,
    totalItems,
    currentPage,
    totalPages,
    changePage,
    handleSearch,
    testSearch
  } = usePaginatedData(equipmentService.getAll);

  const handleEdit = (row) => {
    navigate(`/production/equipment/equipment-management/${row.EquipmentID}`);
  };
  const handleDelete = async (row) => {
    try {
      await equipmentService.delete(row.EquipmentID);
      navigate(0);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleAdd = (row) => {
    navigate(`/production/equipment/equipment-management/new`);
  }

  const dataConfig = [
    {
      key: 'EquipmentID',
      header: 'Equipment ID',
      visible: true,
    },
    {
      key: 'Name',
      header: 'Equipment Name',
      visible: true,
    },
    {
      key: 'Equipment_BarCode',
      header: 'Equipment Barcode',
      visible: true,
    },
    {
      key: 'Model_Number',
      header: 'Model Number',
      visible: true,
    },
    {
      key: 'Next_Cleaning_Date',
      header: 'Next Cleaning Date',
      visible: true,
    },
    {
      key: 'Next_Maintenance_Date',
      header: 'Next Maintenance Date',
      visible: true,
    },
    {
      key: 'Operational_Status',
      header: 'Operational Status',
      visible: true,
    },
    {
      key: 'InventoryID',
      header: 'ID',
      visible: false, // This will be hidden but data is still available
    },
  ];

  return (
    <>
      <CustomWideLayout>

        <CustomTable
          data={equipmentData}
          dataConfig={dataConfig}

          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddText="Add New Equipment"
          onAddClick={handleAdd}

          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}

          searchText={"Search Equipment"}
          onSearch={handleSearch}
        />

      </CustomWideLayout>
    </>
  );
};

export default EquipmentManagement;