import React, {useState, useEffect} from 'react';
import {Typography, Grid, Box} from '@mui/material';

import * as Yup from "yup";
import {Form, Formik} from "formik";
import ContentCard from "../../../../../components/common/ContentCard/ContentCard";
import CustomButton from "../../../../../components/common/CustomButton";
import CustomWideLayout from "../../../../../components/common/Layout/CustomWideLayout";
import CustomTextField from '../../../../../components/common/CustomFormFields/CustomTextField';
import CustomTable from "../../../../../components/common/CustomTable";

import {useParams} from "react-router-dom";
import { useLocation } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {usePaginatedData} from "../../../../../hooks";
import {cleaningProceduresService} from "../../../../../services/cleaningProcedures";
import {cleaningJobsService, equipmentService} from "../../../../../services";

import {CancelModal, ContinueModal} from "../../../../../components/common/CustomModals";
import CustomApiDropdown from "../../../../../components/common/CustomFormFields/CustomApiDropdown";

/**
 * We've now entered a component that combines both form and table functionality. This is a pattern we'll see repeated
 * in other nested components where we're managing a parent entity (Cleaning Job) and its children (Cleaning Procedures).
 *
 * The structure of this component follows a few key patterns:
 *
 * 1. TABLE - just like before, we are fetching data, and managing the table just like we did previously. All the same
 *    functions, and the same hook. The only difference now is that this time we are fetching a bit differently, because
 *    we want to fetch for specific procedures based on this cleaningJobID
 *
 * 2. FORM: We're using Formik for form state management and Yup for validation. This combination allows us to
 *    easily manage form state, validation, and submission. Nothing really out of the ordinary here.
 *
 * 3. Conditional Rendering for Edit vs. New:
 *    - We determine if we're creating a new entry or editing an existing one based on the presence of cleaningJobID
 *    - This affects both the initial data fetching and the submit handler (POST vs PUT)
 *
 * 4. PAGE STRUCTURE:
 *    - You may not notice it now, but essentially all cruds follow this order to make it easy to navigate from one
 *    crud to another
 *
 *    initialData
 *    validation Schema
 *
 *    the component
 *       - STATES
 *       - FORM STUFF
 *       - TABLE STUFF
 *       - RETURN
 *
 *    in that order. Let's look through it more closely now.
 */

/**
 * Initial data, here we put down what the form should look like
 */
const initialData = {
  id: '',
  name: '',
  description: '',
  equipmentID: '',
  equipment: '',
}

/**
 * Yup validation stuff, nothing special.
 */
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  equipmentID: Yup.string().required('Equipment name is required'),
});

const CleaningJobsEdit = () => {
  /**
   * State for holding the data of the form. This is what is given to the formik form. Currently, we don't use isLoading,
   * but we could implement a loading icon if wanted.
   */
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(initialData)

  /**
   * Not all components need location, just the ones that need a "prefill" feature because you arrived to that form via
   * another form and so you may want to have some fields prefilled.
   */
  const location = useLocation();

  /**
   * Here is how we know if you arrived to the component from a "ADD" button, or an "EDIT" button. If there is no ID in
   * the url, then it's assumed you are new. CAREFUL - isNew can be undefined, or null depending on if the route data
   * contains a /new route or not. This can cause a tricky bug. In other words cleaningJobID will be null if there are
   * no routes that define this parameter, for example like this
   * path: "/production/equipment/maintenance-schedules/:maintenanceJobID/maintenance-procedure/:maintenanceProcedureID",
   * And this will throw a compilation error.             This part needed so that isNew does not error ^^^^^^
   */
  const {cleaningJobID} = useParams();
  const isNew = !cleaningJobID;
  const navigate = useNavigate()

  /**
   * States for handling the modals
   */
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);

  /**
   * the component
   *       - STATES
   *       - FORM STUFF  <-- We are here now in the form related stuff
   *       - TABLE STUFF
   *       - RETURN
   *
   * The first thing we are going to try to do is load data for the form. We can load the form in 3 different ways.
   */
  useEffect(() => {
    if (isNew) {
      const { equipmentID } = location.state || {};
      /**
       * Cases 1: If there is an equipmentID based on the location, meaning a component sent us here, then we get that.
       * So in this particular case, in the equipments page, you can add a schedule. And in that partiular "Add Schedule"
       * button we not only get navigated to this component, but it also sends over the Equipment ID as part of the state.
       * So we use that state here to prefill part of the form and then use the spread operator for the remainder.
       */
      if (equipmentID) setFormData({...initialData, equipmentID: equipmentID})
      /**
       * Case 2: If that equipmentID was NOT found, then we just return setting no data at all.
       */
      return
    }
    /**
     * Case 3: If we are not new, so a cleaningJobID was found - then we load the data.
     */
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await cleaningJobsService.getById(cleaningJobID);
        const data = response.data
        // We then set the data accordingly, I copy and paste from the initial data to reduce chances of a bug. We also
        // need to console log the data, or use postman to know what fields to get
        setFormData({
          id: data.Cleaning_JobID,
          name: data.Cleaning_Name,
          description: data.Cleaning_Description,
          equipmentID: data['Equipment-EquipmentID'],
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cleaningJobID]);

  /**
   * Here we handle the POSTing of the form data. I use postman here as well to determine how the body needs to look
   * like.
   */
  const handlePost = async (values) => {
    console.log(values)
    try {
      const body = {
        "EquipmentID": values.equipmentID,
        "Cleaning_Name": values.name,
        "Cleaning_Description": values.description
      };
      const response = await cleaningJobsService.post(body);
      const newId = response.data.Cleaning_JobID;
      navigate(`/production/equipment/cleaning-schedules/${newId}`);
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  /**
   * Same as the post, except not we PUT.
   */
  const handlePut = async (values) => {
    try {
      const body = {
        "EquipmentID": values.equipmentID,
        "Cleaning_Name": values.name,
        "Cleaning_Description": values.description
      };
      await cleaningJobsService.put(cleaningJobID, body);
      navigate(0)
    } catch (error) {
      console.error('Failed to create:', error);
    }
  }

  /**
   * Here we handle the cancel button for the popup modal
   */
  const handleCancel = (dirty) => {
    if (dirty) {
      setShowCancelModal(true)
    } else {
      navigate(-1)
    }
  }

  /**
   * Here we handle the submit button. Depending on if isNew is true or not we wither post or put.
   */
  const handleSubmit = async (values) => {
    console.log("handling submit", values)
    try {
      if (isNew) {
        await handlePost(values);
      } else {
        await handlePut(values);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  /**
   * the component
   *       - STATES
   *       - FORM STUFF
   *       - TABLE STUFF   <-- We are here now in the Table related stuff
   *       - RETURN
   *
   * The only thing new here is that we are now using a different service call by passing the ID and the parameters.
   * That's because we want to do a getByID call not a getAll call, so it looks different.
   */
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
  } = usePaginatedData(
    (params) => cleaningProceduresService.getByCleaningJobId(cleaningJobID, params)
  );

  /**
   * Here we handle an edit of one of the rows by taking you to a procedure page - which is different than schedules
   * in one fundamental way. Procedures CANNOT exist without an ID. This has some nuances that changes it from a
   * schedule component. More on that in the procedures page.
   */
  const handleEdit = (row) => {
    navigate(`/production/equipment/cleaning-schedules/${cleaningJobID}/cleaning-procedure/${row.CleaningID}/`, {
      state: { equipmentID: formData.equipmentID },
    });
  };

  /**
   * Here we handle a deletion, nothing crazy here.
   */
  const handleDelete = (row) => {
    cleaningProceduresService.delete(row.CleaningID)
    navigate(0)
  };

  /**
   * Same as before, we navigate to procedures under the /new route, which our routes data is aware of.
   */
  const handleAdd = () => {
    navigate(`/production/equipment/cleaning-schedules/${cleaningJobID}/cleaning-procedure/new`, {
      state: { equipmentID: formData.equipmentID },
    });
  }

  /**
   * Another dataConfig just like before
   */
  const dataConfig = [
    {
      key: 'Cleaning_JobID',
      header: 'Cleaning Job ID',
      visible: true,
    },
    {
      key: 'CleaningID',
      header: 'Cleaning Procedure ID',
      visible: true,
    },
    {
      key: 'Procedure',
      header: 'Procedure Name',
      visible: true,
    },
    {
      key: 'Description',
      header: 'Procedure Description',
      visible: true,
    },
    {
      key: 'Employee-First_Name',
      header: 'Employee',
      visible: true,
    },
  ];

  /**
   * Here from a high level view, it's the minimal serioes of MUI components needed to replicate what we see in figma
   * which is
   *
   * Custom Layout
   *    Grid - contains the form
   *    Box - contains the table
   *
   * Then if we go a bit deeper into the grid it goes
   *
   *    Grid <- keeps the card horizontally spaced
   *      Grid <- keeps the card vertically spaced
   *        ContentCard <- Our commmon component
   *          Formik <- The formik stuff, enableReinitialize is the only special thing which rerenders if formData changes
   *            Form
   *              Grid <- Here is the only place where edits should occur, by adding or removing fields
   *              Box  <- Fills in the space between the form fields and the buttons below
   *              Grid <- The cancel submit buttons that call the functions seen earlier.
   *
   * Now let's get into the fields.
   */

  return (
    <CustomWideLayout>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{marginTop: 4}}>
          <ContentCard
            whiteBackground={true}
            title={"Cleaning Schedule"}
          >
            <Formik
              initialValues={formData}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({isSubmitting, isValid, dirty, submitForm}) => (
                <Form style={{display: 'flex', flexDirection: 'column', height: '100%', minHeight: '350px'}}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {/* The only custom work that should happen is the
                          1. Addition of
                          2. Removal of
                          3. Edition of
                          These custom form fields. Ideally, we should ONLY be using custom 'something' fields. These
                          fields provide the styling from the figma file. Some do something a bit fancier
                      */}
                      <CustomTextField
                        name="name"
                        label="Name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        name="description"
                        label="Description"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      {/*
                         Such as this form field here, and API dropdown which uses the same service layer as before.
                         The name and label are formik related.
                         The fetch is the service layer function,
                         The value key is the unique ID key value from the API call response
                         The label key is the key value from the API call response that we want to show in the dropdown
                         The showIdInLabel is if we want to show the value of the valueKey in the dropdown, mostly for
                         debugging
                      */}
                      <CustomApiDropdown
                        name={"equipmentID"}
                        label={"Equipment Name"}
                        fetchOptions={equipmentService.getAll}
                        valueKey={"EquipmentID"}
                        labelKey={"Name"}
                        showIdInLabel={true}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{flexGrow: 1}}/> {/* This empty Box will push the buttons down */}

                  {/* These sets of buttons should not need to be edited. They should be able to be copy and pasted
                  and used as is most of the time, I could be wrong though. They handle the popup, and the changing of
                  the buttons text depending on if the form is dirty, and if we are creating or updating a form */}
                  <Grid item xs={12}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>

                      <CustomButton
                        boldText
                        sx={{ mr: 2 }}
                        onClick={() => handleCancel(dirty)}  // Pass dirty to handleCancel
                      >
                        {dirty ? 'Cancel' : 'Go Back'}
                      </CustomButton>

                      <CustomButton
                        boldText
                        onClick={() => setShowContinueModal(true)}
                        disabled={isSubmitting || !dirty || (isNew && !isValid)}
                      >
                        {isNew ? 'Create' : 'Update'}
                      </CustomButton>
                    </Box>

                    <CancelModal
                      open={showCancelModal}
                      onClose={() => setShowCancelModal(false)}
                      onConfirm={() => {
                        setShowCancelModal(false);
                        navigate(-1)
                      }}
                    />

                    <ContinueModal
                      open={showContinueModal}
                      onClose={() => setShowContinueModal(false)}
                      onConfirm={() => {
                        setShowContinueModal(false);
                        submitForm();
                      }}
                    />
                  </Grid>

                </Form>
              )}
            </Formik>
          </ContentCard>
        </Grid>
      </Grid>


      <Box position="relative">
        {/* The only thing new here I think is the addition of isNew, if true this renders the table without the
         pagination fields and the button to become grey. Now onto Cleaning Procedures. */}
        <CustomTable
          titleText={"Cleaning Procedures"}
          isNew={isNew}

          data={data}
          dataConfig={dataConfig}

          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddText="Add New Cleaning Procedure"
          onAddClick={handleAdd}

          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}

          searchText={"Search Cleaning Procedures"}
          onSearch={handleSearch}
        />

      </Box>

    </CustomWideLayout>
  );
};

export default CleaningJobsEdit;