import ProductionDashboard from "../pages/Reports/ReportDashboard";

import Equipment from "../pages/Production/Equipment";

import EquipmentManagement from "../pages/Production/Equipment/EquipmentManagement";
import EquipmentManagementEdit from "../pages/Production/Equipment/EquipmentManagement/Edit";

import CleaningJobs from "../pages/Production/Equipment/CleaningJobs"
import CleaningJobsEdit from "../pages/Production/Equipment/CleaningJobs/Edit"
import CleaningProcedure from "../pages/Production/Equipment/CleaningProcedure"

import MaintenanceJobs from "../pages/Production/Equipment/MaintenanceJobs";
import MaintenanceJobsEdit from "../pages/Production/Equipment/MaintenanceJobs/Edit";

import ProductAssembly from "../pages/Production/ProductAssembly";

import RecipeManagement from "../pages/Production/ProductAssembly/RecipeManagement";

import ProductionLine from "../pages/Production/ProductAssembly/ProductionLine";
import MaintenanceProcedure from "../pages/Production/Equipment/MaintenanceProcedure";

import ManageProductionJobs from "../pages/Production/ManageProductionJobs";
import ProductionJob from "../pages/Production/ManageProductionJobs/productionJob";



// import ProductionLine from "../pages/Production/ProductAssembly/ProductionLine";
// import RecipeManagementEdit from "../pages/Production/ProductAssembly/RecipeManagement/RecipeManagementEdit";
// import ProductionLineEdit from "../pages/Production/ProductAssembly/ProductionLine/ProductionLineEdit";

export const ProductionRoutes = [
  {
    path: "/production/production-dashboard",
    element: <ProductionDashboard/>,
    private: true,
  },

  /*====================================================================================================================
                                              MANAGE PRODUCTION JOBS
  ====================================================================================================================*/
  {
    path: "/production/manage-production-jobs",
    element: <ManageProductionJobs/>,
    private: true,
  },
  {
    path: "/production/manage-production-jobs/production-job",
    element: <ProductionJob/>,
    private: true,
  },

  /*====================================================================================================================
                                               EQUIPMENT MANAGEMENT
  ====================================================================================================================*/
  {
    path: "/production/equipment",
    element: <Equipment/>,
    private: true,
  },
  // Equipment Management
  {
    path: "/production/equipment/equipment-management",
    element: <EquipmentManagement/>,
    private: true,
  },
  {
    path: "/production/equipment/equipment-management/:equipmentID",
    element: <EquipmentManagementEdit/>,
    private: true,
  },
  {
    path: "/production/equipment/equipment-management/new",
    element: <EquipmentManagementEdit/>,
    private: true,
  },
  // Cleaning Jobs
  {
    path: "/production/equipment/cleaning-schedules",
    element: <CleaningJobs/>,
    private: true,
  },
  {
    path: "/production/equipment/cleaning-schedules/:cleaningJobID",
    element: <CleaningJobsEdit/>,
    private: true,
  },
  {
    path: "/production/equipment/cleaning-schedules/new",
    element: <CleaningJobsEdit/>,
    private: true,
  },
  {
    path: "/production/equipment/cleaning-schedules/:cleaningJobID/cleaning-procedure/:cleaningProcedureID",
    element: <CleaningProcedure/>,
    private: true,
  },
  {
    path: "/production/equipment/cleaning-schedules/:cleaningJobID/cleaning-procedure/new",
    element: <CleaningProcedure/>,
    private: true,
  },
  // Maintenance Jobs
  {
    path: "/production/equipment/maintenance-schedules",
    element: <MaintenanceJobs/>,
    private: true,
  },
  {
    path: "/production/equipment/maintenance-schedules/:maintenanceJobID",
    element: <MaintenanceJobsEdit/>,
    private: true,
  },
  {
    path: "/production/equipment/maintenance-schedules/new",
    element: <MaintenanceJobsEdit/>,
    private: true,
  },
  {
    path: "/production/equipment/maintenance-schedules/:maintenanceJobID/maintenance-procedure/:maintenanceProcedureID",
    element: <MaintenanceProcedure/>,
    private: true,
  },
  {
    path: "/production/equipment/maintenance-schedules/:maintenanceJobID/maintenance-procedure/new",
    element: <MaintenanceProcedure/>,
    private: true,
  },
  // Product Assembly
  {
    path: "/production/product-assembly",
    element: <ProductAssembly/>,
    private: true,
  },
  // Recipe Management
  {
    path: "/production/product-assembly/recipe-management",
    element: <RecipeManagement/>,
    private: true,
  },

  /*
  PRODUCTION LINE
  */
  {
    path: "/production/product-assembly/production-line",
    element: <ProductionLine/>,
    private: true,
  },

];