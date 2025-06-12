import { useNavigate } from 'react-router-dom';

import CustomWideLayout from "../../../components/common/Layout/CustomWideLayout";
import CustomTable from "../../../components/common/CustomTable";
import {usePaginatedData} from "../../../hooks";
import {cleaningJobsService, equipmentService} from "../../../services";
import exclamationIcon from "../../../assets/images/exclamationIcon.svg";
import skipIcon from "../../../assets/images/skipIcon.svg";
import checkIcon from "../../../assets/images/checkIcon.svg";

const ManageProductionJobs = () => {
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
      day: 'Monday',
      isToday: true,
      'Production1Name': 'test data',
      'Production1Name-status': 'done',
      'Production2Name': 'test data',
      'Production2Name-status': 'done',
      'Production3Name': '-',
      'Production3Name-status': '',
      'Production4Name': 'test data',
      'Production4Name-status': 'warning',
      'Production5Name': '-',
      'Production5Name-status': '',
      'Production6Name': 'test data',
      'Production6Name-status': 'success',
      'Production7Name': '-',
      'Production7Name-status': '',
    },
    {
      day: 'Tuesday',
      isToday: false,
      'Production1Name': 'test data',
      'Production1Name-status': 'neutral',
      'Production2Name': 'test data',
      'Production2Name-status': 'neutral',
      'Production3Name': '-',
      'Production3Name-status': '',
      'Production4Name': 'test data',
      'Production4Name-status': 'neutral',
      'Production5Name': '-',
      'Production5Name-status': '',
      'Production6Name': 'test data',
      'Production6Name-status': 'neutral',
      'Production7Name': '-',
      'Production7Name-status': '',
    },
    {
      day: 'Wednesday',
      isToday: false,
      'Production1Name': 'test data',
      'Production1Name-status': 'neutral',
      'Production2Name': '-',
      'Production2Name-status': '',
      'Production3Name': 'test data',
      'Production3Name-status': 'neutral',
      'Production4Name': '-',
      'Production4Name-status': '',
      'Production5Name': 'test data',
      'Production5Name-status': 'neutral',
      'Production6Name': '-',
      'Production6Name-status': '',
      'Production7Name': 'test data',
      'Production7Name-status': 'neutral',
    },
    {
      day: 'Thursday',
      isToday: false,
      'Production1Name': '-',
      'Production1Name-status': '',
      'Production2Name': 'test data',
      'Production2Name-status': 'neutral',
      'Production3Name': '-',
      'Production3Name-status': '',
      'Production4Name': 'test data',
      'Production4Name-status': 'neutral',
      'Production5Name': '-',
      'Production5Name-status': '',
      'Production6Name': 'test data',
      'Production6Name-status': 'neutral',
      'Production7Name': '-',
      'Production7Name-status': '',
    },
    {
      day: 'Friday',
      isToday: false,
      'Production1Name': 'test data',
      'Production1Name-status': 'neutral',
      'Production2Name': '-',
      'Production2Name-status': '',
      'Production3Name': 'test data',
      'Production3Name-status': 'neutral',
      'Production4Name': '-',
      'Production4Name-status': '',
      'Production5Name': 'test data',
      'Production5Name-status': 'neutral',
      'Production6Name': '-',
      'Production6Name-status': '',
      'Production7Name': 'test data',
      'Production7Name-status': 'neutral',
    },
    {
      day: 'Saturday',
      isToday: false,
      'Production1Name': 'test data',
      'Production1Name-status': 'neutral',
      'Production2Name': 'test data',
      'Production2Name-status': 'neutral',
      'Production3Name': 'test data',
      'Production3Name-status': 'neutral',
      'Production4Name': '-',
      'Production4Name-status': '',
      'Production5Name': '-',
      'Production5Name-status': '',
      'Production6Name': '-',
      'Production6Name-status': '',
      'Production7Name': 'test data',
      'Production7Name-status': 'neutral',
    }
  ];
  console.log(equipmentData)

  const handleEdit = (row) => {
    navigate(`/production/equipment/equipment-management/${row.EquipmentID}`);
  };
  const handleSkip = async (row) => {
    try {
      await equipmentService.delete(row.EquipmentID);
      navigate(0);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };
  const handleComplete = (row) => {
    console.log("handling the edit")
  }

  const handleAdd = (row) => {
    navigate("/production/manage-production-jobs/production-job");
  }

  const dataConfig = [
    {
      key: 'day',
      header: 'Day',
      visible: true,
    },
    {
      key: 'Production1Name',
      header: 'Production 1',
      visible: true,
    },
    {
      key: 'Production2Name',
      header: 'Production 2',
      visible: true,
    },
    {
      key: 'Production3Name',
      header: 'Production 3',
      visible: true,
    },
    {
      key: 'Production4Name',
      header: 'Production 4',
      visible: true,
    },
    {
      key: 'Production5Name',
      header: 'Production 5',
      visible: true,
    },
    {
      key: 'Production6Name',
      header: 'Production 6',
      visible: true,
    },
    {
      key: 'Production7Name',
      header: 'Production 7',
      visible: true,
    },
  ];

  return (
    <>
      <CustomWideLayout>

        <CustomTable
          useSpecialRendering={true}

          titleText={"1st Week of 01/2024 - should be data from api call?"}

          data={flattenedData}
          dataConfig={dataConfig}

          // onEdit={handleEdit}
          // onDelete={handleDelete}
          menuItems={[
            {
              icon: exclamationIcon,
              label: 'Edit',
              handler: handleEdit,
            },
            {
              icon: skipIcon,
              label: 'Skip',
              handler: handleSkip,
            },
            {
              icon: checkIcon,
              label: 'Complete',
              handler: handleComplete,
            },
          ]}
          onAddText="Current Production Running"
          onAddClick={handleAdd}

          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}

          searchText={"Search Date"}
          onSearch={handleSearch}

          showPagination={false}
        />

      </CustomWideLayout>
    </>
  );
};

export default ManageProductionJobs;