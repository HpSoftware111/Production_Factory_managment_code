import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import NotificationSettingsasd from "../NotificationSettings/NotificationSettings";

const SystemConfiguration = () => {
  const navigate = useNavigate();
  const [isNotificationSettingsOpen, setNotificationSettingsOpen] =
    useState(false);
  const handleClick_Notification = () => {
    setNotificationSettingsOpen(true);
    navigate("/settings/notification-settings/notificationSettings");
  };
  const handleClick_Alert = () => {
    setNotificationSettingsOpen(true);
    navigate("/settings/notification-settings/alertSettings");
  };
  const handleClick_Warning = () => {
    setNotificationSettingsOpen(true);
    navigate("/settings/notification-settings/warningSettings");
  };

  return (
    <div className="p-5">
      <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            Notification Settings
          </h2>
        </div>
        <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            className="row-span-2 py-2 px-4 bg-BtnBg text-white rounded-lg max-w-48"
            onClick={handleClick_Notification}
          >
            Notification Settings
          </button>

          <button
            type="button"
            className="row-span-2 py-2 px-4 bg-BtnBg text-white rounded-lg max-w-48"
            onClick={handleClick_Warning}
          >
            Warning Settings
          </button>

          <button
            type="button"
            className="row-span-2 py-2 px-4 bg-BtnBg text-white rounded-lg max-w-48"
            onClick={handleClick_Alert}
          >
            Alerts Settings
          </button>
        </div>
      </div>

      {isNotificationSettingsOpen && <NotificationSettingsasd />}
    </div>
  );
};

export default SystemConfiguration;
