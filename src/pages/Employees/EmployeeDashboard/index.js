import React from "react";
import Dashboard from "../../../components/common/Layout/Dashboard";
import FourCardRow from "../../../components/common/Layout/FourCardRow";
import FourGraphs from "../../../components/common/Layout/FourGraphs";
import InfoCard from "../../../components/common/InfoCard/InfoCard";
import SimplePieChart from "../../../components/common/Charts/PieChart";
import ContentCard from "../../../components/common/ContentCard/ContentCard";
import MultiLineChart from "../../../components/common/Charts/MultiLineChart";
import SimpleTable from "../../../components/common/Charts/SimpleTableChart";
import suitGroup from "../../../assets/images/suitGroup.svg";
import manInSuit from "../../../assets/images/manInSuit.svg";
import personLeave from "../../../assets/images/personLeave.svg";
import clockCheck from "../../../assets/images/clockCheck.svg";
import { CustomTableChart } from "../../../components/common/Charts/CustomTableChart";
import CustomBarChart from "../../../components/common/Charts/CustomBarChart";
import SingleLineChart from "../../../components/common/Charts/SingleLineChart";

const pieChartData = {
  unitMeasure: "Employees",
  data: [
    { name: "Exceptional", value: 15 },
    { name: "Exceeds Expectations", value: 30 },
    { name: "Meets Expectations", value: 40 },
    { name: "Needs Improvement", value: 15 },
  ],
};
const employeeActivityData = {
  headers: ["Employee", "Activity", "Department", "Date"],
  rows: [
    {
      employee: "Emma Thompson",
      activity: "New Hire",
      department: "Sales",
      date: "2023-05-15",
    },
    {
      employee: "Michael Chen",
      activity: "Promotion",
      department: "Engineering",
      date: "2023-05-14",
    },
    {
      employee: "Sarah Johnson",
      activity: "Departure",
      department: "Marketing",
      date: "2023-05-14",
    },
    {
      employee: "William Nguyen",
      activity: "New Hire",
      department: "HR",
      date: "2023-05-13",
    },
    {
      employee: "David Rodriguez",
      activity: "Promotion",
      department: "Operations",
      date: "2023-05-13",
    },
    {
      employee: "Lisa Parker",
      activity: "New Hire",
      department: "Finance",
      date: "2023-05-12",
    },
    {
      employee: "James Wilson",
      activity: "Departure",
      department: "Sales",
      date: "2023-05-12",
    },
    {
      employee: "Anna Kim",
      activity: "Promotion",
      department: "Product",
      date: "2023-05-11",
    },
    {
      employee: "Robert Taylor",
      activity: "New Hire",
      department: "Engineering",
      date: "2023-05-11",
    },
    {
      employee: "Maria Garcia",
      activity: "Departure",
      department: "HR",
      date: "2023-05-10",
    },
  ],
};

const generateCustomBarChartData = (
  startDate = new Date(2023, 0, 1),
  days = 135,
  labels = {
    metric1: "Upcoming",
    metric2: "Started",
    metric3: "Completed",
    metric4: "Adjusted",
  }
) => {
  const data = [];

  let value1 = 80;
  let value2 = 90;
  let value3 = 40;
  let value4 = 60;

  const fluctuation = () => Math.floor(Math.random() * 10) - 5;

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    value1 = Math.max(40, Math.min(120, value1 + fluctuation()));
    value2 = Math.max(50, Math.min(130, value2 + fluctuation()));
    value3 = Math.max(20, Math.min(80, value3 + fluctuation()));
    value4 = Math.max(30, Math.min(100, value4 + fluctuation()));

    data.push({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      [labels.metric1]: value1,
      [labels.metric2]: value2,
      [labels.metric3]: value3,
      [labels.metric4]: value4,
    });
  }

  return {
    unitMeasure: " Trainings",
    data: data,
  };
};

const generateLineChartData = (
  startDate = new Date(2023, 0, 1),
  months = 12,
  label = "Average Completion Time",
  initialValue = 43,
  fluctuationPercentage = 0.1 // 10% fluctuation by default
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
    unitMeasure: "%", // For this specific case, we're returning percentage
  };
};

const ProductionDashboard = () => {
  return (
    <Dashboard>
      <FourCardRow>
        <InfoCard
          primaryText="Total Employees"
          secondaryText={"100 Employees"}
          icon={suitGroup}
        />
        <InfoCard
          primaryText="Employees on Leave"
          secondaryText={"10 Employees"}
          icon={personLeave}
        />
        <InfoCard
          primaryText="Recent hires, last 30 days"
          secondaryText={"8 Employees"}
          icon={manInSuit}
        />
        <InfoCard
          primaryText="Employee turnover Rate"
          secondaryText={"4.5%"}
          icon={clockCheck}
        />
      </FourCardRow>
      <FourGraphs>
        <ContentCard title="Employees Performance">
          <SimplePieChart data={pieChartData} />
        </ContentCard>
        <ContentCard title="Recent Employee Activities">
          <CustomTableChart
            headers={employeeActivityData.headers}
            rows={employeeActivityData.rows}
          />
        </ContentCard>
        <ContentCard title="Training Completion Rate" showDateDropdown={true}>
          <CustomBarChart
            data={generateCustomBarChartData(new Date(2023, 0, 1), 135, {
              metric1: "Safety Training",
              metric2: "Professional Dev",
              metric3: "Compliance",
              metric4: "Technical Skills",
            })}
          />
        </ContentCard>
        <ContentCard title="Employee Turnover" showDateDropdown={true}>
          <SingleLineChart
            data={generateLineChartData(
              new Date(2023, 0, 1),
              12,
              "Turnover Rate",
              4.5, // Starting at 4.5% turnover
              0.2 // 20% fluctuation to keep rates between ~3.6% and ~5.4%
            )}
            label="Turnover Rate"
            color="#2196f3"
            selectedDate="month" // Add this if you want to specify the initial view
          />
        </ContentCard>
      </FourGraphs>
    </Dashboard>
  );
};

export default ProductionDashboard;
