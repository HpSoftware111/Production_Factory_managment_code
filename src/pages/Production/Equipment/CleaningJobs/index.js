import { useNavigate } from 'react-router-dom';

import CustomWideLayout from "../../../../components/common/Layout/CustomWideLayout";
import CustomTable from "../../../../components/common/CustomTable";
import {usePaginatedData} from "../../../../hooks";
import {cleaningJobsService} from "../../../../services";

/**
 * Now we enter the first component that is just a table, unlike deeper components which also contain a form. This is
 * done in 3 main pieces. First there a hook for dealing with how to make API calls given changes in the UI. Then we
 * have a config object, and then the table itself. Ill note more about these in the component themselves.
 */
const CleaningJobs = () => {
  const navigate = useNavigate()

  /**
   * Here is the hook. I probably should document the hook itself at some point, but for now well have to make do with
   * these notes.
   *
   * 1. Firstly, what it does is make the API call. It does this given a service layer function. A service layer
   * function. What is a service layer function? I'ts a function contained within the service/ directory. Each file is a
   * 1 : 1 mapping of the postman API calls that the node team is managing.
   *
   * 2. The hook then gives us a few states, like data, and some functions that we need to use so that the hook knows
   * how to paginate, or filter data based on a search field.
   *
   * 3. Currently, we don't use all fields as we don't do a loading state, but it's there in case we want to.
   */
  const {
    data: cleaningData,
    loading,
    error,
    totalItems,
    currentPage,
    totalPages,
    changePage,
    handleSearch,
    testSearch
  } = usePaginatedData(cleaningJobsService.getAll);
  console.log(cleaningData)

  const newData = {
    ...cleaningData,
    Employee: 'fdsa'
  }
  console.log(newData)

  /**
   * Row contains data about that row item, when editing we want to route to an edit page with that ID.
   * @param row
   */
  const handleEdit = (row) => {
    navigate(`/production/equipment/cleaning-schedules/${row.Cleaning_JobID}`);
  };


  /**
   * Same as before, except now we are deleting, and then refreshing the page. If we wanted to get fancier, we could
   * find ways to refresh just the table.
   * @param row
   */
  const handleDelete = async (row) => {
    try {
      await cleaningJobsService.delete(row.Cleaning_JobID);
      navigate(0);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }

  /**
   * Now instead of editing - we want to add. If you check the routes data you will find that we are routing to the
   * same component. The component itself will know if you are editing or adding depending on if the parameter is found.
   * This way, we don't need to manage a separate form field for adding or editing.
   * @param row
   */
  const handleAdd = (row) => {
    navigate(`/production/equipment/cleaning-schedules/new`);
  }

  /**
   * The data config maps the data retrieved from the hook, and gives the table labels for the column headers. We can
   * also hide certain fields that we don't want the table to show, but still know about. This way, we can hide ID
   * columns, but still know about it for when we want to edit a row in which case it needs to know what the ID is.
   */
  const dataConfig = [
    {
      key: 'Cleaning_JobID',
      header: 'ID',
      visible: true,
    },
    {
      key: 'Cleaning_Name',
      header: 'Cleaning Name',
      visible: true,
    },
    {
      key: 'Cleaning_Description',
      header: 'Cleaning Description',
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


  /**
   * We pass pretty much all states/functions from the hook into the table.
   */
  return (
    <>
      <CustomWideLayout>
        <CustomTable
          titleText={"Cleaning Schedules"}

          data={cleaningData}
          dataConfig={dataConfig}

          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddText="Add New Cleaning Schedule"
          onAddClick={handleAdd}

          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}

          searchText={"Search Cleaning Schedules"}
          onSearch={handleSearch}
        />
      </CustomWideLayout>
    </>
  );
};

export default CleaningJobs;