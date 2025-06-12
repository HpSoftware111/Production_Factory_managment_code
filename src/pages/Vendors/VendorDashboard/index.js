import React from "react";
import Dashboard from "../../../components/common/Layout/Dashboard";
import FourCardRow from "../../../components/common/Layout/FourCardRow";
import FourGraphs from "../../../components/common/Layout/FourGraphs";
import InfoCard from "../../../components/common/InfoCard/InfoCard";
import SimplePieChart from "../../../components/common/Charts/PieChart";
import LineBarChart from "../../../components/common/Charts/LineBarChart";
import ContentCard from "../../../components/common/ContentCard/ContentCard";
import SimpleTable from "../../../components/common/Charts/SimpleTableChart";
import groupMoney from "../../../assets/images/groupMoney.svg";
import contract from "../../../assets/images/contract.svg";
import clock from "../../../assets/images/clock.svg";
import orderPending from "../../../assets/images/orderPending.svg";
import CustomBarChart from "../../../components/common/Charts/CustomBarChart";
import { generateMultiBarChartData } from "../../../components/common/Charts/ChartUtils";
import { CustomTableChart } from "../../../components/common/Charts/CustomTableChart";
import { CustomTableChartFive } from "../../../components/common/Charts/CustomTableChartFive";

const pieChartData = {
  unitMeasure: "USD",
  data: [
    { name: "Vendor 1", value: 80000 },
    { name: "Vendor 2", value: 60000 },
    { name: "Vendor 3", value: 50000 },
    { name: "Vendor 4", value: 50000 },
    { name: "Remaining Vendors ", value: 50000 },
  ],
};

const topVendorsData = {
  headers: [
    "Vendor",
    "On-Time Delivery",
    "Order Accuracy",
    "Product Quality",
    "Cost Efficiency",
    "Lead Time",
  ],
  rows: [
    {
      vendor: "Vendor 1",
      ontime: "95%",
      accuracy: "92%",
      quality: "4.8/5",
      efficiency: "4.7/5",
      lead: "2 Days",
    },
    {
      vendor: "Vendor 2",
      ontime: "88%",
      accuracy: "85%",
      quality: "4.5/5",
      efficiency: "4.2/5",
      lead: "3 Days",
    },
    {
      vendor: "Vendor 3",
      ontime: "92%",
      accuracy: "89%",
      quality: "4.6/5",
      efficiency: "4.4/5",
      lead: "2.5 Days",
    },
    {
      vendor: "Vendor 4",
      ontime: "85%",
      accuracy: "87%",
      quality: "4.3/5",
      efficiency: "4.6/5",
      lead: "4 Days",
    },
    {
      vendor: "Vendor 5",
      ontime: "90%",
      accuracy: "91%",
      quality: "4.7/5",
      efficiency: "4.3/5",
      lead: "3 Days",
    },
  ],
};

const recentOrdersData = {
  headers: ["#", "Order Name", "Days Late", "Reason"],
  rows: [
    {
      number: "1",
      orderName: "Order #127",
      daysLate: "2",
      reason: "Product Not Arrived",
    },
    {
      number: "2",
      orderName: "Order #122",
      daysLate: "1",
      reason: "Product Not Pulled From Freezer",
    },
    {
      number: "3",
      orderName: "Order #118",
      daysLate: "2",
      reason: "Client Changed Order",
    },
    {
      number: "4",
      orderName: "Order #113",
      daysLate: "2",
      reason: "Product Not Arrived",
    },
    {
      number: "5",
      orderName: "Order #108",
      daysLate: "2",
      reason: "Client Changed Order",
    },
  ],
};

const ProductionDashboard = () => {
  return (
    <Dashboard>
      <FourCardRow>
        <InfoCard
          primaryText="Active Vendors"
          secondaryText={"25 Vendors"}
          icon={groupMoney}
        />
        <InfoCard
          primaryText="On-Time Delivery Rate"
          secondaryText={"90%"}
          icon={contract}
        />
        <InfoCard
          primaryText="Vendor Orders (YTD)"
          secondaryText={"5 Orders"}
          icon={clock}
        />
        <InfoCard
          primaryText="Average Delivery Time"
          secondaryText={"25 Hours"}
          icon={orderPending}
        />
      </FourCardRow>
      <FourGraphs>
        <ContentCard title="Top Vendor Spend Breakdown">
          <SimplePieChart data={pieChartData} />
        </ContentCard>
        <ContentCard title="Top Vendors" showDateDropdown={false}>
          <CustomTableChartFive
            headers={topVendorsData.headers}
            rows={topVendorsData.rows}
          />
        </ContentCard>
        <ContentCard title="Vendor Orders" showDateDropdown={true}>
          <CustomBarChart
            aggregationMethod={"total"}
            data={generateMultiBarChartData(
              " Orders",
              {
                label: "Vendor 1",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 700,
                max: 800,
              },
              {
                label: "Vendor 2",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 500,
                max: 900,
              },
              {
                label: "Vendor 3",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 200,
                max: 600,
              },
              {
                label: "Vendor 4",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 4, 15),
                min: 900,
                max: 1100,
              }
            )}
          />
        </ContentCard>
        <ContentCard title="Vendor Order Delays" showDateDropdown={false}>
          <CustomTableChartFive
            headers={recentOrdersData.headers}
            rows={recentOrdersData.rows}
          />
        </ContentCard>
      </FourGraphs>
    </Dashboard>
  );
};

export default ProductionDashboard;
