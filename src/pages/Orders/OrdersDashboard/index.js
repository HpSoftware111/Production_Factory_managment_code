import React from "react";
import Dashboard from "../../../components/common/Layout/Dashboard";
import FourCardRow from "../../../components/common/Layout/FourCardRow";
import FourGraphs from "../../../components/common/Layout/FourGraphs";
import InfoCard from "../../../components/common/InfoCard/InfoCard";
import SimplePieChart from "../../../components/common/Charts/PieChart";
import LineBarChart from "../../../components/common/Charts/LineBarChart";
import ContentCard from "../../../components/common/ContentCard/ContentCard";
import SimpleTable from "../../../components/common/Charts/SimpleTableChart";
import HorizontalBarChart from "../../../components/common/Charts/HorizontalBarChart";
import checkbox from "../../../assets/images/documentCheckbox.svg";
import clock from "../../../assets/images/clock.svg";
import checkmark from "../../../assets/images/checkmark.svg";
import cancel from "../../../assets/images/cancel.svg";
import { CustomTableChart } from "../../../components/common/Charts/CustomTableChart";
import SingleLineChart from "../../../components/common/Charts/SingleLineChart";
import CustomBarChart from "../../../components/common/Charts/CustomBarChart";
import { generateMultiBarChartData } from "../../../components/common/Charts/ChartUtils";
import CustomLineChart from "../../../components/common/Charts/CustomLineChart";

const pieChartData = {
  unitMeasure: "",
  data: [
    { name: "Pending", value: 25 },
    { name: "Completed", value: 110 },
    { name: "Cancelled", value: 15 },
  ],
};

const recentOrdersDataNew = {
  headers: ["Order ID", "Customer", "Status", "Date"],
  rows: [
    {
      orderId: "ORD-127",
      customer: "ABC Corp",
      status: "Completed",
      date: "2023-05-15",
    },
    {
      orderId: "ORD-126",
      customer: "XYZ Ltd",
      status: "Pending",
      date: "2023-05-15",
    },
    {
      orderId: "ORD-125",
      customer: "123 Inc",
      status: "Processing",
      date: "2023-05-14",
    },
    {
      orderId: "ORD-124",
      customer: "Best Foods",
      status: "Canceled",
      date: "2023-05-14",
    },
    {
      orderId: "ORD-123",
      customer: "Fresh Goods",
      status: "Completed",
      date: "2023-05-13",
    },
    {
      orderId: "ORD-122",
      customer: "Quick Mart",
      status: "Pending",
      date: "2023-05-13",
    },
    {
      orderId: "ORD-121",
      customer: "Food Chain",
      status: "Completed",
      date: "2023-05-12",
    },
    {
      orderId: "ORD-120",
      customer: "Store Corp",
      status: "Canceled",
      date: "2023-05-12",
    },
    {
      orderId: "ORD-119",
      customer: "Market Inc",
      status: "Processing",
      date: "2023-05-11",
    },
    {
      orderId: "ORD-118",
      customer: "Shop Plus",
      status: "Pending",
      date: "2023-05-11",
    },
  ],
};

const generateLineChartData = (
  startDate = new Date(2023, 0, 1),
  months = 12,
  label = "Fulfillment Rate",
  initialValue = 92,
  fluctuationPercentage = 0.03
) => {
  const data = [];
  const endDate = new Date(2023, 4, 15); // May 15, 2023
  let currentDate = new Date(startDate);
  let currentValue = initialValue;

  while (currentDate <= endDate) {
    const maxFluctuation = initialValue * fluctuationPercentage;
    const fluctuation = Math.random() * maxFluctuation * 2 - maxFluctuation;
    currentValue = Math.max(85, Math.min(98, currentValue + fluctuation));

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
    unitMeasure: "%",
  };
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
    unitMeasure: " Orders",
    data: data,
  };
};

const orderFulfillmentData = generateMultiBarChartData(
  " Orders",
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
);
// console.log(orderFulfillmentData);
const OrdersDashboard = () => {
  return (
    <Dashboard>
      <FourCardRow>
        <InfoCard
          primaryText="Orders Processed (YTD)"
          secondaryText="3,150 Orders"
          icon={checkbox}
        />
        <InfoCard
          primaryText="Pending Orders"
          secondaryText="285 Orders"
          icon={clock}
        />
        <InfoCard
          primaryText="Canceled Orders"
          secondaryText="95 Orders"
          icon={cancel}
        />
        <InfoCard
          primaryText="Average Fulfillment Time"
          secondaryText="2.5 Days"
          icon={clock}
        />
      </FourCardRow>
      <FourGraphs>
        <ContentCard title="Order Status by Category">
          <SimplePieChart data={pieChartData} />
        </ContentCard>
        <ContentCard title="Recent Orders" showDateDropdown={false}>
          <CustomTableChart
            headers={recentOrdersDataNew.headers}
            rows={recentOrdersDataNew.rows}
          />
        </ContentCard>
        <ContentCard title="Order Fulfillment Trends" showDateDropdown={true}>
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
        <ContentCard title="Order Cancellations" showDateDropdown={true}>
          <CustomBarChart
            data={generateCustomBarChartData(new Date(2023, 0, 1), 135, {
              metric1: "Customer Related",
              metric2: "Stock Issues",
              metric3: "Payment Issues",
              metric4: "Delivery Issues",
            })}
          />
        </ContentCard>
      </FourGraphs>
    </Dashboard>
  );
};

export default OrdersDashboard;
