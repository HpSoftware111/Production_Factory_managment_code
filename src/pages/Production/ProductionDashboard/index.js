import React from "react";
import Dashboard from "../../../components/common/Layout/Dashboard";
import FourCardRow from "../../../components/common/Layout/FourCardRow";
import FourGraphs from "../../../components/common/Layout/FourGraphs";
import InfoCard from "../../../components/common/InfoCard/InfoCard";
import SimplePieChart from "../../../components/common/Charts/PieChart";
import LineBarChart from "../../../components/common/Charts/LineBarChart";
import CustomBarChart from "../../../components/common/Charts/CustomBarChart";
import ContentCard from "../../../components/common/ContentCard/ContentCard";
import settingsGear from "../../../assets/images/settingsGear.svg";
import cooler from "../../../assets/images/cooler.svg";
import gearTurning from "../../../assets/images/gearTurning.svg";
import calendarSoon from "../../../assets/images/calendarSoon.svg";
import SingleLineChart from "../../../components/common/Charts/SingleLineChart";
import { generateMultiBarChartData } from "../../../components/common/Charts/ChartUtils";
import { CustomTableChartFive } from "../../../components/common/Charts/CustomTableChartFive";

const generateLineBarChartData = () => {
  const data = [];
  const startDate = new Date(2023, 0, 1); // January 1, 2023
  const numberOfDays = 180; // 6 months of data

  let currentValue = 2500;
  let forecastValue = 3000;

  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    data.push({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      currentValue: i < 135 ? currentValue : null, // Last 45 days are forecast only
      forecastValue: forecastValue,
    });

    currentValue += Math.floor(Math.random() * 100) + 50;
    forecastValue += Math.floor(Math.random() * 100) + 50;
  }

  return {
    unitMeasure: "Jobs",
    data: data,
  };
};

const generateCustomBarChartData = (
  startDate = new Date(2023, 0, 1),
  days = 135,
  labels = {
    metric1: "Upcoming",
    metric2: "Started",
    metric3: "Completed",
  }
) => {
  const data = [];

  let value1 = 80;
  let value2 = 90;
  let value3 = 40;

  const fluctuation = () => Math.floor(Math.random() * 10) - 5;

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    value1 = Math.max(40, Math.min(120, value1 + fluctuation()));
    value2 = Math.max(50, Math.min(130, value2 + fluctuation()));
    value3 = Math.max(20, Math.min(80, value3 + fluctuation()));

    data.push({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      [labels.metric1]: value1,
      [labels.metric2]: value2,
      [labels.metric3]: value3,
    });
  }

  return {
    unitMeasure: " Jobs",
    data: data,
  };
};

const delayedJobsData = {
  headers: ["#", "Job Name", "Days Late", "Reason for Delay", "Current Status"],
  rows: [
    {
      number: "1",
      jobName: "Batch #2023-0415",
      daysLate: "3",
      reason: "Equipment Malfunction (Mixer)",
      status: "In Progress",
    },
    {
      number: "2",
      jobName: "Batch #2023-0413",
      daysLate: "2",
      reason: "Raw Material Shortage",
      status: "On Hold",
    },
    {
      number: "3",
      jobName: "Batch #2023-0410",
      daysLate: "1",
      reason: "Unexpected Maintenance (Extructer)",
      status: "Resumed",
    },
    {
      number: "4",
      jobName: "Batch #2023-0408",
      daysLate: "4",
      reason: "Quality Control Issues",
      status: "Under Review",
    },
    {
      number: "5",
      jobName: "Batch #2023-0405",
      daysLate: "2",
      reason: "Staff Shortage",
      status: "In Progress",
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
    unitMeasure: "hrs",
  };
};

const ProductionDashboard = () => {
  return (
    <Dashboard>
      <FourCardRow>
        <InfoCard
          primaryText="Queued Production"
          secondaryText={"150 Jobs"}
          icon={settingsGear}
        />
        <InfoCard
          primaryText="Completed Production (YTD)"
          secondaryText={"3,500 Jobs"}
          icon={cooler}
        />
        <InfoCard
          primaryText="Delayed Production (YTD)"
          secondaryText={"28 Jobs"}
          icon={gearTurning}
        />
        <InfoCard
          primaryText="Average Production Time"
          secondaryText={"43 Hours"}
          icon={calendarSoon}
        />
      </FourCardRow>
      <FourGraphs>
        <ContentCard title="Production Stage Timing" showDateDropdown={true}>
          <CustomBarChart
            aggregationMethod={"average"}
            data={generateMultiBarChartData(
              " Hours",
              {
                label: "Production cooler",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 65,
                max: 85,
              },
              {
                label: "Turntable",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 50,
                max: 75,
              },
              {
                label: "Extructer",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 40,
                max: 60,
              },
              {
                label: "Conveyor",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 70,
                max: 90,
              },
              {
                label: "Grinder",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 45,
                max: 70,
              },
              {
                label: "Mixer",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 55,
                max: 80,
              }
            )}
          />
        </ContentCard>
        <ContentCard title="Production Delays" showDateDropdown={false}>
          <CustomTableChartFive
            headers={delayedJobsData.headers}
            rows={delayedJobsData.rows}
          />
        </ContentCard>
        <ContentCard
          title="Monthly Production Efficiency"
          showDateDropdown={true}
        >
          <CustomBarChart
            aggregationMethod={"average"}
            data={generateMultiBarChartData(
              " %",
              {
                label: "On Time",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 70,
                max: 95,
              },
              {
                label: "Delayed",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 5,
                max: 25,
              },
              {
                label: "Offline",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 0,
                max: 10,
              }
            )}
          />
        </ContentCard>
        <ContentCard title="Production Time" showDateDropdown={true}>
          <SingleLineChart
            data={generateLineChartData(
              new Date(2023, 0, 1),
              12,
              "Average Completion Time",
              43, // 43 hours initial value
              0.1 // 10% fluctuation
            )}
            label="Average Completion Time"
            color="#2196f3"
            selectedDate="month"
          />
        </ContentCard>
      </FourGraphs>
    </Dashboard>
  );
};

export default ProductionDashboard;
