import React from "react";
import Dashboard from "../../../components/common/Layout/Dashboard";
import FourCardRow from "../../../components/common/Layout/FourCardRow";
import FourGraphs from "../../../components/common/Layout/FourGraphs";
import InfoCard from "../../../components/common/InfoCard/InfoCard";
import SimplePieChart from "../../../components/common/Charts/PieChart";
import LineBarChart from "../../../components/common/Charts/LineBarChart";
import CustomBarChart from "../../../components/common/Charts/CustomBarChart";
import ContentCard from "../../../components/common/ContentCard/ContentCard";
import SimpleTable from "../../../components/common/Charts/SimpleTableChart";
import { Box, Card, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import reports from "../../../assets/images/reports.svg";
import documentCheckbox from "../../../assets/images/documentCheckbox.svg";
import personReport from "../../../assets/images/personReport.svg";
import clock from "../../../assets/images/clock.svg";
import { CustomTableChart } from "../../../components/common/Charts/CustomTableChart";
import SingleLineChart from "../../../components/common/Charts/SingleLineChart";
import HorizontalBarChart from "../../../components/common/Charts/HorizontalBarChart";
import { generateMultiBarChartData } from "../../../components/common/Charts/ChartUtils";
import CustomLineChart from "../../../components/common/Charts/CustomLineChart";

const pieChartData = {
  unitMeasure: "",
  data: [
    { name: "Financial Reports", value: 35 },
    { name: "Inventory Reports", value: 25 },
    { name: "Production Reports", value: 20 },
    { name: "Customer Reports", value: 20 },
  ],
};

const recentReportsData = {
  headers: ["Report Name", "Type", "Status", "Date"],
  rows: [
    {
      reportName: "Q2 Financial Summary",
      type: "Financial",
      status: "Completed",
      date: "2023-05-15",
    },
    {
      reportName: "Monthly Inventory",
      type: "Inventory",
      status: "Pending",
      date: "2023-05-15",
    },
    {
      reportName: "Production Efficiency",
      type: "Production",
      status: "In Progress",
      date: "2023-05-14",
    },
    {
      reportName: "Customer Satisfaction",
      type: "Customer",
      status: "Completed",
      date: "2023-05-14",
    },
    {
      reportName: "Weekly Sales",
      type: "Financial",
      status: "Completed",
      date: "2023-05-13",
    },
    {
      reportName: "Stock Level Alert",
      type: "Inventory",
      status: "Pending",
      date: "2023-05-13",
    },
    {
      reportName: "Employee Performance",
      type: "HR",
      status: "In Progress",
      date: "2023-05-12",
    },
    {
      reportName: "Supplier Analysis",
      type: "Production",
      status: "Completed",
      date: "2023-05-12",
    },
    {
      reportName: "Cash Flow Report",
      type: "Financial",
      status: "Pending",
      date: "2023-05-11",
    },
    {
      reportName: "Quality Control",
      type: "Production",
      status: "Completed",
      date: "2023-05-11",
    },
  ],
};

const pendingReportsData = [
  { name: "Financial Report", completionDays: 5 },
  { name: "Inventory Audit", completionDays: 3 },
  { name: "Customer Satisfaction Survey", completionDays: 7 },
  { name: "Supply Chain Analysis", completionDays: 10 },
  { name: "Employee Performance Review", completionDays: 4 },
];

const ProductionDashboard = () => {
  return (
    <Dashboard>
      <FourCardRow>
        <InfoCard
          primaryText="Reports Generated (YTD)"
          secondaryText={"150 Reports"}
          icon={reports}
        />
        <InfoCard
          primaryText="Pending Reports"
          secondaryText={"25 Reports"}
          icon={documentCheckbox}
        />
        <InfoCard
          primaryText="Customer Report Requests"
          secondaryText={"35 Reports"}
          icon={personReport}
        />
        <InfoCard
          primaryText="Avg. Completion Time"
          secondaryText={"2.5 Days"}
          icon={clock}
        />
      </FourCardRow>
      <FourGraphs>
        <ContentCard title="Report Types">
          <SimplePieChart data={pieChartData} />
        </ContentCard>
        <ContentCard title="Recent Reports">
          <CustomTableChart
            headers={recentReportsData.headers}
            rows={recentReportsData.rows}
          />
        </ContentCard>
        <ContentCard title="Reports Generated" showDateDropdown={true}>
          <CustomLineChart
            aggregationMethod={"total"}
            data={generateMultiBarChartData(
              " Reports",
              {
                label: "Vendor",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 65,
                max: 85,
              },
              {
                label: "Inventory",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 50,
                max: 75,
              },
              {
                label: "Production",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 40,
                max: 60,
              },
              {
                label: "Customer",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 70,
                max: 90,
              },
              {
                label: "Order",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 45,
                max: 70,
              },
              {
                label: "Employee",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 55,
                max: 80,
              }
            )}
          />
        </ContentCard>
        <ContentCard title="Pending Reports">
          <HorizontalBarChart
            data={pendingReportsData}
            label="Days"
            dataKey="completionDays"
            maxValue={14} // Set based on your maximum expected completion time
            tickCount={5}
            useColorThresholds={false}
          />
        </ContentCard>
      </FourGraphs>
    </Dashboard>
  );
};

export default ProductionDashboard;
