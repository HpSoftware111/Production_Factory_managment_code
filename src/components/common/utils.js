export const SEARCH_INPUT_STYLE =
  "placeholder:text-[#272727] md:w-80 min-h-12 ps-10 px-3 text-sm text-[#272727] border-none active:border-none rounded-[14px] search-input outline-[#CCD7E4] bg-white";

export const ACTIVE_STYLE =
  "flex items-center p-2.5 border-b-[3px] border-b-blue-500 transition-all";

export const NOT_ACTIVE_STYLE =
  "flex items-center p-2.5 border-b-[3px] hover:border-b-blue-500 border-transparent";

export const DROPDOWN_MENU_ITEM_STYLE =
  "flex justify-center items-center  text-base md:text-lg gap-2 text-[#143664] font-medium hover:text-opacity-85";

export const DROPDOWN_MENU_ICON_STYLE =
  "bg-[#1479ff] flex justify-center items-center  text-white size-8 rounded-xl";

export const NAV_SUBMENU_STYLE =
  "space-y-2 py-3 bg-secondary text-white shadow-lg rounded-lg w-44";

// Notification Types
export const NotifyTypes = {
  NOTIFICATION: "Notification",
  WARNING: "Warning",
  ALERTS: "Alert",
};

// Notification Priority
export const NotifyPriority = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

// Report Group
export const REPORT_GROUP = {
  INVENTORY: "Inventory Reports",
  SALES_ORDERS: "Sales and Orders Reports",
  EMPLOYEE: "Employee Reports",
  VENDOR: "Vendor Reports",
  FINANCIAL: "Financial Reports",
  CUSTOMER: "Customer Reports",
  MAINTENANCE: "Maintenance and Operations Reports",
  AUDIT: "Compliance and Audit Reports",
};

// Equipment Operation Status
export const EQUIPMENT_OPERATIONS = [
  "Operational",
  "Under Maintenance",
  "Out of Service",
];
