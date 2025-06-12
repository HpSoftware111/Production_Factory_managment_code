import React from "react";
import Dashboard from "../../../components/common/Layout/Dashboard";
import FourCardRow from "../../../components/common/Layout/FourCardRow";
import FourGraphs from "../../../components/common/Layout/FourGraphs";
import InfoCard from "../../../components/common/InfoCard/InfoCard";
import ContentCard from "../../../components/common/ContentCard/ContentCard";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import MultiBarLineChart from "../../../components/common/Charts/MultiBarLineChart";
import ReactSpeedometer from "react-d3-speedometer";
import personTree from "../../../assets/images/personTree.svg";
import lockedFile from "../../../assets/images/lockedFile.svg";
import systemConfig from "../../../assets/images/systemConfig.svg";
import auditLog from "../../../assets/images/auditLog.svg";
import CustomBarChart from "../../../components/common/Charts/CustomBarChart";
import HorizontalBarChart from "../../../components/common/Charts/HorizontalBarChart";
import { CustomTableChart } from "../../../components/common/Charts/CustomTableChart";
import SingleLineChart from "../../../components/common/Charts/SingleLineChart";
import SimplePieChart from "../../../components/common/Charts/PieChart";

const userActivityData = [
  { name: "Admin", activity: 5 },
  { name: "Manager", activity: 20 },
  { name: "Employee", activity: 50 },
];

const systemAlertsData = {
  headers: ["Type", "Status", "Issue", "Action", "Date"],
  rows: [
    {
      type: "Security",
      status: "Resolved",
      issue: "Login attempts",
      action: "IP blocked",
      date: "May 15",
    },
    {
      type: "Performance",
      status: "Active",
      issue: "High CPU",
      action: "Investigating",
      date: "May 15",
    },
    {
      type: "Storage",
      status: "Resolved",
      issue: "Low disk space",
      action: "Cleaned files",
      date: "May 14",
    },
    {
      type: "Network",
      status: "Active",
      issue: "Traffic spike",
      action: "Monitoring",
      date: "May 14",
    },
    {
      type: "Database",
      status: "Resolved",
      issue: "Slow queries",
      action: "Optimized",
      date: "May 13",
    },
    {
      type: "Security",
      status: "Resolved",
      issue: "Auth breach",
      action: "Acc locked",
      date: "May 13",
    },
    {
      type: "System",
      status: "Resolved",
      issue: "Updates due",
      action: "Installed",
      date: "May 12",
    },
    {
      type: "API",
      status: "Active",
      issue: "High latency",
      action: "Scaling up",
      date: "May 12",
    },
    {
      type: "Backup",
      status: "Resolved",
      issue: "Failed check",
      action: "Reconfigured",
      date: "May 11",
    },
    {
      type: "Memory",
      status: "Active",
      issue: "Memory leak",
      action: "Optimizing",
      date: "May 11",
    },
  ],
};

const generateLineChartData = (
  startDate = new Date(2023, 0, 1),
  months = 12,
  label = "Average Completion Time",
  initialValue = 43,
  fluctuationPercentage = 0.1
) => {
  const data = [];
  const endDate = new Date(2023, 4, 15); // May 15, 2023
  let currentDate = new Date(startDate);
  let currentValue = initialValue;
  while (currentDate <= endDate) {
    // Fluctuation based on percentage of initial value
    const maxFluctuation = initialValue * fluctuationPercentage;
    const fluctuation = Math.random() * maxFluctuation * 2 - maxFluctuation;
    currentValue = Math.max(
      initialValue * 0.7,
      Math.min(initialValue * 1.3, currentValue + fluctuation)
    );
    data.push({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1, // 1-12
      year: currentDate.getFullYear(),
      [label]: Number(currentValue.toFixed(1)),
    });
    // Move to next day
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }
  return {
    data: data,
    unitMeasure: " Updates",
  };
};

const generateRoleUpdatesData = (
  startDate = new Date(2023, 0, 1),
  days = 12,
  label = "Permission Updates"
) => {
  const data = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let currentValue = 15; // Starting with 15 updates

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + i);

    // Random fluctuation between -3 and +3
    const fluctuation = Math.floor(Math.random() * 7) - 3;
    currentValue = Math.max(5, Math.min(25, currentValue + fluctuation));

    data.push({
      month: monthNames[currentDate.getMonth()],
      [label]: Number(currentValue.toFixed(0)),
    });
  }

  return data;
};

const configChangesData = {
  unitMeasure: "",
  data: [
    { name: "Security", value: 35 },
    { name: "Network", value: 25 },
    { name: "Database", value: 20 },
    { name: "UI", value: 15 },
    { name: "API", value: 5 },
  ],
};

const ProductionDashboard = () => {
  return (
    <Dashboard>
      <FourCardRow>
        <InfoCard
          primaryText="Active Users"
          secondaryText="75 Users Online"
          icon={personTree}
        />
        <InfoCard
          primaryText="System Alerts"
          secondaryText="3 Active Alerts"
          icon={systemConfig}
        />
        <InfoCard
          primaryText="Permission Updates"
          secondaryText="12 Recent Updates"
          icon={lockedFile}
        />
        <InfoCard
          primaryText="Configuration Changes"
          secondaryText="5 Changes"
          icon={auditLog}
        />
      </FourCardRow>
      <FourGraphs>
        <ContentCard title="User Activity by Role">
          <HorizontalBarChart
            data={userActivityData}
            label="Users"
            dataKey="activity"
            maxValue={60}
            tickCount={5}
            useColorThresholds={false}
          />
        </ContentCard>
        <ContentCard title="System Alerts">
          <CustomTableChart
            headers={systemAlertsData.headers}
            rows={systemAlertsData.rows}
          />
        </ContentCard>
        <ContentCard title="Role Updates" showDateDropdown={true}>
          <SingleLineChart
            data={generateLineChartData(
              new Date(2023, 0, 1),
              12,
              "Role Updates",
              45,
              0.15
            )}
            label="Role Updates"
            yAxisUnit=""
            color="#2196F3"
            selectedDate="month" // or 'quarter' or 'year'
            aggregationMethod="total"
          />
        </ContentCard>

        <ContentCard title="Configuration Changes">
          <SimplePieChart data={configChangesData} />
        </ContentCard>
      </FourGraphs>
    </Dashboard>
  );
};

export default ProductionDashboard;
