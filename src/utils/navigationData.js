import CustomerIcon from "../assets/images/customerIcon.svg";
import DashboardIcon from "../assets/images/dashboardIcon.svg";
import InventoryIcon from "../assets/images/inventoryIcon.svg";
import ProductionIcon from "../assets/images/productionIcon.svg";
import OrderIcon from "../assets/images/orderIcon.svg";
import EmployeeIcon from "../assets/images/employeeIcon.svg";
import VendorIcon from "../assets/images/vendorIcon.svg";
import ReportIcon from "../assets/images/ReportIcon.svg";
import SettingIcon from "../assets/images/settingIcon.svg";

export const navigationData = {
  navigation: [
    {
      label: "Dashboard",
      to: "/",
      icon: DashboardIcon,
    },
    {
      label: "Vendors",
      to: "/vendor/vendor-dashboard",
      icon: VendorIcon,
      subMenu: [
        { to: "/vendor/vendor-dashboard", label: "Vendor Dashboard" },
        { to: "/vendor/manage-vendors", label: "Manage Vendors" },
        { to: "/vendor/manage-vendor-products", label: "Vendor Products" },
        { to: "/vendor/vendor-performance", label: "Vendor Performance" },
        { to: "/vendor/purchase-orders", label: "Purchase Orders" },
        { to: "/vendor/vendor-contracts", label: "Vendor Contracts" },
        { to: "/vendor/vendor-communications", label: "Vendor Communications" },
        { to: "/vendor/reports-analytics", label: "Reports and Analytics" },
        { to: "/vendor/product-links", label: "Product Links" },
      ],
    },
    {
      label: "Inventory",
      to: "/inventory/inventory-dashboard",
      icon: InventoryIcon,
      subMenu: [
        { to: "/inventory/inventory-dashboard", label: "Inventory Dashboard" },
        { to: "/inventory/manage-inventories", label: "Manage Inventory" },
        {
          to: "/inventory/manage-rejected-inventories",
          label: "Manage Rejected Inventory",
        },
        { to: "/inventory/inventory-reports", label: "Inventory Reports" },
        { to: "/inventory/stock-levels", label: "Stock Levels" },
        { to: "/inventory/inventory-audit", label: "Inventory Audit" },
        { to: "/inventory/supplier-info", label: "Supplier Info" },
      ],
    },
    {
      label: "Production",
      to: "/production/production-dashboard",
      icon: ProductionIcon,
      subMenu: [
        {
          to: "/production/production-dashboard",
          label: "Production Dashboard",
        },
        {
          to: "/production/manage-production-jobs",
          label: "Manage Production Jobs",
        },
        { to: "/production/production-planning", label: "Production Planning" },
        {
          to: "/production/equipment",
          label: "Equipment Management",
        },
        {
          to: "/production/inventory-for-production",
          label: "Inventory for Production",
        },
        { to: "/production/product-assembly", label: "Product Assembly" },
        { to: "/production/quality-control", label: "Quality Control" },
        { to: "/production/production-reports", label: "Production Reports" },
        { to: "/production/safety-compliance", label: "Safety and Compliance" },
        { to: "/production/production-settings", label: "Production Settings" },
      ],
    },
    {
      label: "Customers",
      to: "/customer/customer-dashboard",
      icon: CustomerIcon,
      subMenu: [
        {
          to: "/customer/customer-dashboard",
          label: "Customer Dashboard",
        },
        {
          to: "/customer/manage-customers",
          label: "Manage Customers",
        },
        {
          to: "/customer/customer-orders",
          label: "Customer Orders",
        },
        {
          to: "/customer/delivery-schedules",
          label: "Delivery Schedules",
        },
        {
          to: "/customer/customer-returns",
          label: "Customer Returns",
        },
        {
          to: "/customer/loyalty-programs",
          label: "Loyalty Programs",
        },
        {
          to: "/customer/contracts-management",
          label: "Contracts Management",
        },
        {
          to: "/customer/customer-reports",
          label: "Customer Reports",
        },
        {
          to: "/customer/customer-analytics",
          label: "Customer Analytics",
        },
      ],
    },
    {
      label: "Orders",
      to: "/orders/order-dashboard",
      icon: OrderIcon,
      subMenu: [
        { to: "/orders/order-dashboard", label: "Order Dashboard" },
        { to: "/orders/manage-orders", label: "Manage Orders" },
        { to: "/orders/shipping-management", label: "Shipping Management" },
        { to: "/orders/order-fulfillment", label: "Order Fulfillment" },
        { to: "/orders/returns-management", label: "Returns Management" },
        { to: "/orders/order-reports", label: "Order Reports" },
        { to: "/orders/payment-tracking", label: "Payment Tracking" },
        {
          to: "/orders/policies-documents",
          label: "HR Policies and Documents",
        },
      ],
    },
    {
      label: "Employees",
      to: "/employees/employee-dashboard",
      icon: EmployeeIcon,
      subMenu: [
        { to: "/employees/employee-dashboard", label: "Employee Dashboard" },
        { to: "/employees/manage-employees", label: "Manage Employees" },
        { to: "/employees/roles-permissions", label: "Roles and Permissions" },
        {
          to: "/employees/attendance-tracking",
          label: "Attendance and Time Tracking",
        },
        { to: "/employees/performance-reviews", label: "Performance Reviews" },
        {
          to: "/employees/training-development",
          label: "Training and Development",
        },
        { to: "/employees/employee-reports", label: "Employee Reports" },
        {
          to: "/employees/hr-policies-documents",
          label: "HR Policies and Documents",
        },
      ],
    },
    {
      label: "Reports",
      to: "/reports/reports-dashboard",
      icon: ReportIcon,
      subMenu: [
        { to: "/reports/reports-dashboard", label: "Reports Dashboard" },
        { to: "/reports/inventory-reports", label: "Inventory Reports" },
        {
          to: "/reports/sales-orders-reports",
          label: "Sales and Orders Reports",
        },
        { to: "/reports/employee-reports", label: "Employee Reports" },
        { to: "/reports/vendor-reports", label: "Vendor Reports" },
        { to: "/reports/financial-reports", label: "Financial Reports" },
        { to: "/reports/customer-reports", label: "Customer Reports" },
        {
          to: "/reports/maintenance-operations-reports",
          label: "Maintenance and Operations Reports",
        },
        {
          to: "/reports/compliance-audit-reports",
          label: "Compliance and Audit Reports",
        },
        {
          to: "/reports/custom-report-builder",
          label: "Custom Report Builder",
        },
      ],
    },
    {
      label: "Settings",
      to: "/settings/settings-dashboard",
      icon: SettingIcon,
      subMenu: [
        { to: "/settings/settings-dashboard", label: "Settings Dashboard" },
        { to: "/settings/users", label: "Manage Users" },
        { to: "/settings/roles-permissions", label: "Roles and Permissions" },
        { to: "/settings/security-settings", label: "Security Settings" },
        { to: "/settings/data-management", label: "Data Management" },
        { to: "/settings/system-configration", label: "System Configuration" },
        {
          to: "/settings/notification-settings",
          label: "Notification Settings",
        },
        { to: "/settings/audit-logs", label: "Audit Logs" },
        { to: "/settings/api-management", label: "API Management" },
        {
          to: "/settings/customization-options",
          label: "Customization Options",
        },
        { to: "/settings/help-support", label: "Help and Support" },
      ],
    },
  ],
};
