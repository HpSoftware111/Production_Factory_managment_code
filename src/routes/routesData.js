// Subpages for authentication and settings
import ComingSoon from "../pages/Subpages/ComingSoon";
import Login from "../pages/Subpages/Login";
import SystemConfiguration from "../pages/Subpages/SystemConfiguration";

// Employees CRUD Pages
import Employees from "../pages/Employees";
import EmployeeNew from "../pages/Employees/EmployeeNew";
import EmployeeEdit from "../pages/Employees/EmployeeEdit";
import EmployeeDelete from "../pages/Employees/EmployeeDelete";
// Other Pages
import EmployeeDashboard from "../pages/Employees/EmployeeDashboard";

// Users CRUD Pages
import Users from "../pages/Users";
import UserNew from "../pages/Users/UserNew";
import UserEdit from "../pages/Users/UserEdit";
import UserDelete from "../pages/Users/UserDelete";

// Vendors CRUD Pages
import Vendors from "../pages/Vendors";
import VendorNew from "../pages/Vendors/VendorNew";
import VendorEdit from "../pages/Vendors/VendorEdit";
import VendorDelete from "../pages/Vendors/VendorDelete";

// Vendor Products CRUD Pages
import VendorProducts from "../pages/VendorProducts";
import VendorProductsNew from "../pages/VendorProducts/VendorProductsNew";
import VendorProductsEdit from "../pages/VendorProducts/VendorProductsEdit";
import VendorProductsDelete from "../pages/VendorProducts/VendorProductsDelete";
// Other Pages
import VendorDashboard from "../pages/Vendors/VendorDashboard";

// Inventories CRUD Pages
import Inventories from "../pages/Inventories";
import InventoriesNew from "../pages/Inventories/InventoriesNew";
import InventoriesEdit from "../pages/Inventories/InventoriesEdit";
import InventoriesDelete from "../pages/Inventories/InventoriesDelete";
// Other Pages
import InventoryDashboard from "../pages/Inventories/InventoriesDashboard";

// Inventory Reports Page
import InventoryReports from "../pages/Reports/InventoryReports";

// Rejected Inventories CRUD Pages
import RejectedInventories from "../pages/RejectedInventories";
import RejectedInventoriesNew from "../pages/RejectedInventories/RejectedInventoriesNew";
import RejectedInventoriesEdit from "../pages/RejectedInventories/RejectedInventoriesEdit";
import RejectedInventoriesDelete from "../pages/RejectedInventories/RejectedInventoriesDelete";

// Production CRUD Pages
// Other Pages
import ProductionDashboard from "../pages/Production/ProductionDashboard";

// Orders CRUD Pages
// Other Pages
import OrdersDashboard from "../pages/Orders/OrdersDashboard";

// Customers CRUD Pages
// Other Pages
import CustomerDashboard from "../pages/Customers/CustomerDashboard";

// Reports CRUD Pages
// import Reports from "../pages/Reports";
import ReportsDashboard from "../pages/Reports/ReportDashboard";

// Settings Pages
import SettingDashboard from "../pages/Settings/SettingDashboard";

//Notification Settings Page
import NotificationSettings from "../pages/Settings/NotificationSettings";
import NotificationSettingTemp from "../pages/Settings/NotificationSettings/NotificationSettings";
import AlertSettingTemp from "../pages/Settings/NotificationSettings/AlertSettings";
import WarningSettingTemp from "../pages/Settings/NotificationSettings/WarningSettings";

import NotificationSettingsEdit from "../pages/Settings/NotificationSettings/NotificationSettings/NotificationSettingsEdit";
import AlertSettingsEdit from "../pages/Settings/NotificationSettings/AlertSettings/AlertSettingsEdit";
import WarningSettingsEdit from "../pages/Settings/NotificationSettings/WarningSettings/WarningSettingsEdit";

import NotificationSettingsDelete from "../pages/Settings/NotificationSettings/NotificationSettings/NotificationSettingsDelete";
import AlertSettingsDelete from "../pages/Settings/NotificationSettings/AlertSettings/AlertSettingsDelete";
import WarningSettingsDelete from "../pages/Settings/NotificationSettings/WarningSettings/WarningSettingsDelete";

// A Demo page of the UI components to serve as utility page, not included in routes
import CommonComponentsDemo from "../components/common/CommonComponentsDemo";
import HomeDashboard from "../pages/HomeDashboard";

// import EquipmentEdit from "../pages/Production/EquipmentEdit";
// import CleaningSchedules from "../pages/Production/CleaningSchedules";
// import CleaningScheduleNew from "../pages/Production/CleaningScheduleNew";

import { ProductionRoutes } from "./productionRoutes";

export const routesData = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <ComingSoon />,
    private: true,
  },
  {
    path: "/",
    element: <HomeDashboard />,
    private: true,
  },
  {
    path: "/",
    element: <HomeDashboard />,
    private: true,
  },
  ...ProductionRoutes,
  {
    path: "/vendor/manage-vendors",
    element: <Vendors />,
    private: true,
  },
  {
    path: "/vendor/manage-vendors/new",
    element: <VendorNew />,
    private: true,
  },
  {
    path: "/vendor/manage-vendors/edit",
    element: <VendorEdit />,
    private: true,
  },
  {
    path: "/vendor/manage-vendors/delete",
    element: <VendorDelete />,
    private: true,
  },
  {
    path: "/vendor/manage-vendor-products",
    element: <VendorProducts />,
    private: true,
  },
  {
    path: "/vendor/manage-vendor-products/new",
    element: <VendorProductsNew />,
    private: true,
  },
  {
    path: "/vendor/manage-vendor-products/edit",
    element: <VendorProductsEdit />,
    private: true,
  },
  {
    path: "/vendor/manage-vendor-products/delete",
    element: <VendorProductsDelete />,
    private: true,
  },
  {
    path: "/vendor/vendor-dashboard",
    element: <VendorDashboard />,
    private: true,
  },
  {
    path: "/vendor/vendor-dashboard",
    element: <VendorDashboard />,
    private: true,
  },
  {
    path: "/settings/users",
    element: <Users />,
    private: true,
  },
  {
    path: "/settings/users/new",
    element: <UserNew />,
    private: true,
  },
  {
    path: "/settings/users/edit",
    element: <UserEdit />,
    private: true,
  },
  {
    path: "/settings/users/delete",
    element: <UserDelete />,
    private: true,
  },
  {
    path: "/settings/system-configration",
    element: <SystemConfiguration />,
    private: true,
  },
  {
    path: "/settings/settings-dashboard",
    element: <SettingDashboard />,
    private: true,
  },
  {
    path: "/settings/notification-settings",
    element: <NotificationSettings />,
    private: true,
  },
  {
    path: "/settings/notification-settings/notificationSettings",
    element: <NotificationSettingTemp />,
    private: true,
  },
  {
    path: "/settings/notification-settings/alertSettings",
    element: <AlertSettingTemp />,
    private: true,
  },
  {
    path: "/settings/notification-settings/warningSettings",
    element: <WarningSettingTemp />,
    private: true,
  },
  {
    path: "/settings/notification-settings/notificationSettings/edit",
    element: <NotificationSettingsEdit />,
    private: true,
  },
  {
    path: "/settings/notification-settings/alertSettings/edit",
    element: <AlertSettingsEdit />,
    private: true,
  },
  {
    path: "/settings/notification-settings/warningSettings/edit",
    element: <WarningSettingsEdit />,
    private: true,
  },
  {
    path: "/settings/notification-settings/notificationSettings/delete",
    element: <NotificationSettingsDelete />,
    private: true,
  },
  {
    path: "/settings/notification-settings/alertSettings/delete",
    element: <AlertSettingsDelete />,
    private: true,
  },
  {
    path: "/settings/notification-settings/warningSettings/delete",
    element: <WarningSettingsDelete />,
    private: true,
  },
  {
    path: "/employees/manage-employees",
    element: <Employees />,
    private: true,
  },
  {
    path: "/employees/manage-employees/new",
    element: <EmployeeNew />,
    private: true,
  },
  {
    path: "/employees/manage-employees/edit",
    element: <EmployeeEdit />,
    private: true,
  },
  {
    path: "/employees/manage-employees/delete",
    element: <EmployeeDelete />,
    private: true,
  },
  {
    path: "/employees/employee-dashboard",
    element: <EmployeeDashboard />,
    private: true,
  },
  {
    path: "/employees/employee-dashboard",
    element: <EmployeeDashboard />,
    private: true,
  },
  {
    path: "/inventory/manage-inventories",
    element: <Inventories />,
    private: true,
  },
  {
    path: "/inventory/manage-inventories/new",
    element: <InventoriesNew />,
    private: true,
  },
  {
    path: "/inventory/manage-inventories/edit",
    element: <InventoriesEdit />,
    private: true,
  },
  {
    path: "/inventory/manage-inventories/delete",
    element: <InventoriesDelete />,
    private: true,
  },
  {
    path: "/inventory/manage-rejected-inventories",
    element: <RejectedInventories />,
    private: true,
  },
  {
    path: "/inventory/manage-rejected-inventories/new",
    element: <RejectedInventoriesNew />,
    private: true,
  },
  {
    path: "/inventory/manage-rejected-inventories/edit",
    element: <RejectedInventoriesEdit />,
    private: true,
  },
  {
    path: "/inventory/manage-rejected-inventories/delete",
    element: <RejectedInventoriesDelete />,
    private: true,
  },
  {
    path: "/inventory/inventory-dashboard",
    element: <InventoryDashboard />,
    private: true,
  },
  {
    path: "/inventory/inventory-reports",
    element: <InventoryReports />,
    private: true,
  },
  {
    path: "/production/production-dashboard",
    element: <ProductionDashboard />,
    private: true,
  },
  // {
  //   path: "/production/equipment-management/edit",
  //   element: <EquipmentEdit />,
  //   private: true,
  // },

  ///
  // {
  //   path: "/production/quality-control",
  //   element: <QualityControl />,
  //   private: true,
  // },
  // {
  //   path: "/production/equipment-management",
  //   element: <EquipmentManagement />,
  //   private: true,
  // },
  // {
  //   path: "/production/equipment-management/edit",
  //   element: <EquipmentEdit />,
  //   private: true,
  // },

  // {
  //   path: "/production/cleaning-job/edit",
  //   element: <CleaningSchedules />,
  //   private: true,
  // },
  // {
  //   path: "/production/cleaning-schedule",
  //   element: <CleaningSchedules />,
  //   private: true,
  // },
  // {
  //   path: "/production/cleaning-schedule/new",
  //   element: <CleaningScheduleNew />,
  //   private: true,
  // },
  // {
  //   path: "/production/cleaning-schedule/edit",
  //   element: <CleaningScheduleNew />,
  //   private: true,
  // },

  // {
  //   path: "/production/cleaning-job/edit",
  //   element: <CleaningSchedules />,
  //   private: true,
  // },
  // {
  //   path: "/production/cleaning-schedule",
  //   element: <CleaningSchedules />,
  //   private: true,
  // },
  // {
  //   path: "/production/cleaning-schedule/new",
  //   element: <CleaningScheduleNew />,
  //   private: true,
  // },
  // {
  //   path: "/production/cleaning-schedule/edit",
  //   element: <CleaningScheduleNew />,
  //   private: true,
  // },

  // {
  //   path: "/production/cleaning-job/edit",
  //   element: <CleaningSchedules />,
  //   private: true,
  // },
  // {
  //   path: "/production/cleaning-schedule",
  //   element: <CleaningSchedules />,
  //   private: true,
  // },
  // {
  //   path: "/production/cleaning-schedule/new",
  //   element: <CleaningScheduleNew />,
  //   private: true,
  // },
  // {
  //   path: "/production/cleaning-schedule/edit",
  //   element: <CleaningScheduleNew />,
  //   private: true,
  // },

  {
    path: "/orders/order-dashboard",
    element: <OrdersDashboard />,
    private: true,
  },
  {
    path: "/customer/customer-dashboard",
    element: <CustomerDashboard />,
    private: true,
  },
  {
    path: "/reports/inventory-reports",
    element: <InventoryReports />,
    private: true,
  },

  {
    path: "/reports/reports-dashboard",
    element: <ReportsDashboard />,
    private: true,
  },
  {
    path: "/common-components-demo",
    element: <CommonComponentsDemo />,
    private: true,
  },
  {
    path: "/inventory/inventory-dashboard",
    element: <InventoryDashboard />,
    private: true,
  },

  {
    path: "/orders/order-dashboard",
    element: <OrdersDashboard />,
    private: true,
  },
  {
    path: "/customer/customer-dashboard",
    element: <CustomerDashboard />,
    private: true,
  },
  {
    path: "/reports/reports-dashboard",
    element: <ReportsDashboard />,
    private: true,
  },
  {
    path: "/common-components-demo",
    element: <CommonComponentsDemo />,
    private: true,
  },
];
