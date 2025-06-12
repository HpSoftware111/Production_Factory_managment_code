import React, { Fragment, useEffect, useState } from "react";
import Dashboard from "../../components/common/Layout/Dashboard";
import FourCardRow from "../../components/common/Layout/FourCardRow";
import FourGraphs from "../../components/common/Layout/FourGraphs";
import InfoCard from "../../components/common/InfoCard/InfoCard";
import SimplePieChart from "../../components/common/Charts/PieChart";
import LineBarChart from "../../components/common/Charts/LineBarChart";
import CustomBarChart from "../../components/common/Charts/CustomBarChart";
import ContentCard from "../../components/common/ContentCard/ContentCard";
import notificationIcon from "../../assets/images/notificationIcon.svg";
import alertIcon from "../../assets/images/alertIcon.svg";
import warningIcon from "../../assets/images/warningIcon.svg";
import {
  generateLineBarChartData,
  generateMultiBarChartData,
} from "../../components/common/Charts/ChartUtils";

import lowStock from "../../assets/images/lowStock.svg";
import clock from "../../assets/images/clock.svg";
import suitcase from "../../assets/images/suitcase.svg";
import outOfStock from "../../assets/images/outOfStock.svg";

import { Box, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import NotificationModal from "../../components/modals/NotificationModal";

import { NotifyTypes } from "../../components/common/utils";
import axios from "../../api";
import { API_ROUTES } from "../../api/routes";

const pieChartData = {
  unitMeasure: "USD",
  data: [
    {
      name: "Raw Inventory",
      tooltip:
        "Raw Inventory refers to the essential unprocessed materials and basic components stored and utilized in the initial stages of production processes.",
      value: 30000,
    },
    {
      name: "In Production",
      tooltip:
        "In Production refers to items currently being processed or assembled in manufacturing stages, actively transforming raw inventory into finished products.",
      value: 50000,
    },
    {
      name: "Finished Products",
      tooltip:
        "Finished Products are items that have completed the manufacturing process and are ready for sale or distribution to consumers.",
      value: 30000,
    },
  ],
};

const pieChartData2 = {
  unitMeasure: "Reviews",
  data: [
    { name: "Awesome", value: 60 },
    { name: "Good", value: 30 },
    { name: "Ok", value: 15 },
    { name: "Bad", value: 5 },
  ],
};

const HomeDashboard = () => {
  const [notificationType, setNotifyTypes] = useState(null);

  const handleNotificationClick = (type, data) => {
    if (data.length > 0) {
      setNotifyTypes(type);
      setSelectedNotifications(data);
    }
  };

  const handleNotificationClose = () => {
    setNotifyTypes(null);
    setSelectedNotifications([]);
  };

  // Notifications Data
  const [notifications, setNotifications] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Fetch notification data here
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(API_ROUTES.GET_ALL_NOTIFICATIONS);
        if (response.status === 200) {
          // const data = await response.json();
          const data = response.data.data;

          const filteredNotifications = data.filter(
            (notification) =>
              notification.Notification_Type === NotifyTypes.NOTIFICATION
          );
          const filteredWarnings = data.filter(
            (warning) => warning.Notification_Type === NotifyTypes.WARNING
          );
          const filteredAlerts = data.filter(
            (alert) => alert.Notification_Type === NotifyTypes.ALERTS
          );

          console.log(
            "👍👍👍 Notification Data: ",
            filteredNotifications,
            filteredAlerts,
            filteredWarnings
          );

          setNotifications(filteredNotifications);
          setWarnings(filteredWarnings);
          setAlerts(filteredAlerts);
        } else {
          setNotifications([]);
          setWarnings([]);
          setAlerts([]);
        }
      } catch (error) {
        console.error("Error fetching notification data:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleUpdate = (updatedData) => {
    if (notificationType) {
      switch (notificationType) {
        case NotifyTypes.NOTIFICATION:
          setNotifications((prev) => {
            const data1 = prev.map((item) =>
              item.NotificationsID === updatedData?.NotificationsID
                ? updatedData
                : item
            );
            return data1.filter((item) => !item.Notification_Resolution);
          });
          break;
        case NotifyTypes.WARNING:
          setWarnings((prev) => {
            const data1 = prev.map((item) =>
              item.NotificationsID === updatedData?.NotificationsID
                ? updatedData
                : item
            );
            return data1.filter((item) => !item.Notification_Resolution);
          });
          break;
        case NotifyTypes.ALERTS:
          setAlerts((prev) => {
            const data1 = prev.map((item) =>
              item.NotificationsID === updatedData?.NotificationsID
                ? updatedData
                : item
            );
            return data1.filter((item) => !item.Notification_Resolution);
          });
          break;
        default:
          break;
      }
    }
  };

  return (
    <Fragment>
      <Dashboard>
        <Typography variant="h1" sx={{ color: "primary.main" }} pb={2}>
          Global Notification Summary
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <InfoCard
              variant="outlined"
              primaryText="Notifications"
              iconColor="green"
              number={notifications.length}
              icon={notificationIcon}
              onClick={() =>
                handleNotificationClick(NotifyTypes.NOTIFICATION, notifications)
              }
            />
          </Grid>
          <Grid item xs={4}>
            <InfoCard
              variant="outlined"
              primaryText="Warnings"
              iconColor="yellow"
              number={warnings.length}
              icon={warningIcon}
              onClick={() =>
                handleNotificationClick(NotifyTypes.WARNING, warnings)
              }
            />
          </Grid>
          <Grid item xs={4}>
            <InfoCard
              variant="outlined"
              primaryText="Alerts"
              iconColor="red"
              number={alerts.length}
              icon={alertIcon}
              onClick={() =>
                handleNotificationClick(NotifyTypes.ALERTS, alerts)
              }
            />
          </Grid>
        </Grid>

        {!!notificationType && (
          <NotificationModal
            onClose={handleNotificationClose}
            type={notificationType}
            data={selectedNotifications}
            onChangeData={handleUpdate}
            open={!!notificationType}
          />
        )}
      </Dashboard>

      <Dashboard>
        <FourCardRow>
          <InfoCard
            primaryText="Total Revenue (YTD)"
            secondaryText="$10,000"
            icon={lowStock}
          />
          <InfoCard
            primaryText="Total Expense (YTD)"
            secondaryText="$7,000"
            icon={outOfStock}
          />
          <InfoCard
            primaryText="Net Profit (YTD)"
            secondaryText="$3,000"
            icon={suitcase}
          />
          <InfoCard
            primaryText="Orders Fulfilled (YTD)"
            secondaryText="27"
            icon={clock}
          />
        </FourCardRow>
        <FourGraphs>
          <ContentCard title="Revenue vs Expenses" showDateDropdown={true}>
            <LineBarChart
              data={generateLineBarChartData()}
              lineName={"Revenue"}
              barName={"Expenses"}
            />
          </ContentCard>
          <ContentCard title="Inventory Health" showDateDropdown={false}>
            <SimplePieChart data={pieChartData} />
          </ContentCard>
          <ContentCard title="Production Efficiency" showDateDropdown={true}>
            <CustomBarChart
              aggregationMethod={"average"}
              data={generateMultiBarChartData(
                "%",
                {
                  label: "OnTime",
                  startDate: new Date(2023, 0, 1),
                  endDate: new Date(2023, 4, 15),
                  min: 70, // Minimum 70%
                  max: 80, // Maximum 100%
                },
                {
                  label: "Delayed",
                  startDate: new Date(2023, 0, 1),
                  endDate: new Date(2023, 4, 15),
                  min: 0, // Minimum 0%
                  max: 30, // Maximum 30%
                },
                {
                  label: "Returned",
                  startDate: new Date(2023, 0, 1),
                  endDate: new Date(2023, 4, 15),
                  min: 0,
                  max: 20,
                },
                {
                  label: "Rejected",
                  startDate: new Date(2023, 0, 1),
                  endDate: new Date(2023, 4, 15),
                  min: 0,
                  max: 15,
                }
              )}
            />
          </ContentCard>
          <ContentCard title="Customer Satisfaction" showDateDropdown={false}>
            <SimplePieChart data={pieChartData2} showStars={true} />
          </ContentCard>
        </FourGraphs>
      </Dashboard>
    </Fragment>
  );
};

export default HomeDashboard;
