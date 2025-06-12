import { useNavigate } from 'react-router-dom';

import CustomWideLayout from "../../../components/common/Layout/CustomWideLayout";
import CustomTable from "../../../components/common/CustomTable";
import {usePaginatedData} from "../../../hooks";
import {cleaningJobsService, equipmentService} from "../../../services";
import { useTheme } from "@mui/material/styles";


const ProductionJob = () => {
  const theme = useTheme()
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

  const flattenedData = [
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'done',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'done',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'done',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'late',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'on-time',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'on-time',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'on-time',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'on-time',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'on-time',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'cancelled',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'on-time',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'on-time',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'on-time',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'on-time',
    },
    {
      productionStep: 'test',
      recipeName: 'testing',
      employeeName: 'testing',
      expectedQty: 'testing',
      actualQty: 'testing',
      time: 'testing',
      Type: 'testing',
      status: 'on-time',
    },
  ];



  console.log(equipmentData)

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
    navigate("/production/manage-production-jobs/production-line");
  }

  const dataConfig = [
    {
      key: 'productionStep',
      header: 'Day',
      visible: true,
    },
    {
      key: 'recipeName',
      header: 'Production 1',
      visible: true,
    },
    {
      key: 'status',
      header: 'Production 2',
      visible: true,
    },
  ];

  const renderConfig = {
    rowColorConfig: {
      key: 'status',
      colorMap: {
        done: theme.palette.primary.quinary,     // light green
        late: theme.palette.senary.secondary,     // light red
        'on-time': theme.palette.septenary.tertiary, // light orange
        cancelled: theme.palette.quaternary.secondary  // light grey
      }
    }
  };

  return (
    <>
      <CustomWideLayout>

        <CustomTable
          useSpecialRendering={true}
          renderConfig={renderConfig}

          titleText={"Production Line Name"}

          data={flattenedData}
          dataConfig={dataConfig}

          onEdit={handleEdit}
          onDelete={handleDelete}
          // onAddText="Current Production Running"
          onAddClick={handleAdd}

          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}

          // searchText={"Search Date"}
          showSearch={false}
          onSearch={handleSearch}

          showPagination={true}
        />

      </CustomWideLayout>
    </>
  );
};

export default ProductionJob;