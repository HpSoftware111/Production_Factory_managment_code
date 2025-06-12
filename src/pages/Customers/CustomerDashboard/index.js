import React from "react";
import Dashboard from "../../../components/common/Layout/Dashboard";
import FourCardRow from "../../../components/common/Layout/FourCardRow";
import FourGraphs from "../../../components/common/Layout/FourGraphs";
import InfoCard from "../../../components/common/InfoCard/InfoCard";
import SimplePieChart from "../../../components/common/Charts/PieChart";
import LineBarChart from "../../../components/common/Charts/LineBarChart";
import ContentCard from "../../../components/common/ContentCard/ContentCard";
import HorizontalBarChart from "../../../components/common/Charts/HorizontalBarChart";
import peopleGroup from "../../../assets/images/peopleGroup.svg";
import peopleCheck from "../../../assets/images/peopleCheck.svg";
import minus from "../../../assets/images/minus.svg";
import customerAdded from "../../../assets/images/customerAdded.svg";
import { CustomTableChart } from "../../../components/common/Charts/CustomTableChart";
import CustomLineBarChart from "../../../components/common/Charts/CustomLineBarChart";

const pieChartData = {
  unitMeasure: "",
  data: [
    { name: "New Customer Orders", value: 35 },
    { name: "Returning Customer Orders", value: 65 },
    { name: "Wholesale Orders", value: 65 },
    { name: "OEM Orders", value: 65 },
  ],
};

const customerActivityHeaders = ["Customer", "Action", "Details", "Date"];

const customerActivityRows = [
  {
    customer: "ABC Corp",
    action: "Order Placed",
    details: "PO-2023-001",
    date: "2023-05-15",
  },
  {
    customer: "XYZ Industries",
    action: "Feedback",
    details: "4.5/5.0",
    date: "2023-05-14",
  },
  {
    customer: "123 Manufacturing",
    action: "Return",
    details: "RMA-2023-005",
    date: "2023-05-14",
  },
  {
    customer: "Global Foods",
    action: "Order Placed",
    details: "PO-2023-002",
    date: "2023-05-13",
  },
  {
    customer: "Fresh Produce Co",
    action: "Feedback",
    details: "5.0/5.0",
    date: "2023-05-13",
  },
  {
    customer: "Quality Meats Inc",
    action: "Order Placed",
    details: "PO-2023-003",
    date: "2023-05-13",
  },
  {
    customer: "Seafood Suppliers",
    action: "Return",
    details: "RMA-2023-006",
    date: "2023-05-12",
  },
  {
    customer: "Farm Fresh Ltd",
    action: "Feedback",
    details: "4.8/5.0",
    date: "2023-05-12",
  },
  {
    customer: "Restaurant Group",
    action: "Order Placed",
    details: "PO-2023-004",
    date: "2023-05-11",
  },
  {
    customer: "Grocery Chain Co",
    action: "Order Placed",
    details: "PO-2023-005",
    date: "2023-05-11",
  },
];
const generateWarehouseFulfillmentData = (
  startDate = new Date(2023, 0, 1),
  days = 180, // 6 months
  initialOrderCount = 100,
  initialFulfillmentTime = 2.5 // days
) => {
  const data = [];
  let orderCount = initialOrderCount;
  let fulfillmentTime = initialFulfillmentTime;

  // Create a trend direction that changes periodically
  let trendDirection = Math.random() > 0.5 ? 1 : -1;
  let trendDuration = 0;
  const maxTrendDuration = 14; // Change trend roughly every two weeks

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    // Change trend periodically
    trendDuration++;
    if (trendDuration >= maxTrendDuration) {
      trendDirection = Math.random() > 0.5 ? 1 : -1;
      trendDuration = 0;
    }

    // Add some realistic fluctuation for orders
    orderCount += (Math.random() - 0.5) * (initialOrderCount * 0.4);
    orderCount = Math.max(
      initialOrderCount * 0.7,
      Math.min(initialOrderCount * 1.3, orderCount)
    );

    // More dramatic fluctuation for fulfillment time
    const dailyChange = (Math.random() * 0.5 + 0.1) * trendDirection; // 0.1 to 0.6 days change
    fulfillmentTime += dailyChange;

    // Keep fulfillment time between 1 and 5 days
    fulfillmentTime = Math.max(1, Math.min(5, fulfillmentTime));

    // Add seasonal pattern
    const seasonalEffect = Math.sin((2 * Math.PI * i) / 30) * 0.5; // Monthly seasonal pattern
    let adjustedFulfillmentTime = fulfillmentTime + seasonalEffect;

    // Ensure adjusted time stays within reasonable bounds
    adjustedFulfillmentTime = Math.max(1, Math.min(5, adjustedFulfillmentTime));

    data.push({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      currentValue: Math.round(orderCount), // Orders processed (bars)
      forecastValue: Number(adjustedFulfillmentTime.toFixed(1)), // Fulfillment time in days (line)
    });
  }

  return {
    unitMeasure: "orders",
    data: data,
  };
};

const criticalInventoryData = [
  { name: "Raw Chicken", orders: 15 },
  { name: "Fresh Produce", orders: 25 },
  { name: "Packaging Materials", orders: 30 },
  { name: "Dairy Products", orders: 35 },
  { name: "Seasonings", orders: 40 },
  { name: "Cooking Oil", orders: 45 },
  { name: "Rice Products", orders: 48 },
  { name: "Frozen Fish", orders: 50 },
];

const CustomerDashboard = () => {
  return (
    <Dashboard>
      <FourCardRow>
        <InfoCard
          primaryText="Total Customers"
          secondaryText={"3,150"}
          icon={peopleGroup}
        />
        <InfoCard
          primaryText="New Customers YTD"
          secondaryText={"275"}
          icon={customerAdded}
        />
        <InfoCard
          primaryText="Customer Satisfaction"
          secondaryText={"4.2/5.0"}
          icon={peopleCheck}
        />
        <InfoCard
          primaryText="On-Time Delivery Rate"
          secondaryText={"94%"}
          icon={minus}
        />
      </FourCardRow>
      <FourGraphs>
        <ContentCard title="Customer Orders">
          <SimplePieChart data={pieChartData} />
        </ContentCard>
        <ContentCard
          title="Warehouse Order Fulfillment Health"
          showDateDropdown={false}
        >
          <CustomLineBarChart
            data={generateWarehouseFulfillmentData()}
            lineName={"Average Fulfillment Time (Days)"}
            barName={"Orders Processed"}
            showYLabel={true}
          />
        </ContentCard>
        <ContentCard title="Recent Customer Activity">
          <CustomTableChart
            headers={customerActivityHeaders}
            rows={customerActivityRows}
          />
        </ContentCard>
        <ContentCard
          title="Inventory Levels Impacting Order Fulfillment"
          showDateDropdown={false}
        >
          <HorizontalBarChart
            data={criticalInventoryData}
            label="%"
            dataKey="orders"
            maxValue={100}
            tickCount={5}
            threshold={30} // Items below 30% will be red
          />
        </ContentCard>
      </FourGraphs>
    </Dashboard>
  );
};

export default CustomerDashboard;
