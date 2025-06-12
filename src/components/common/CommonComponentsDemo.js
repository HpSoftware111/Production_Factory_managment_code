// src/pages/CommonComponentsDemo.js

import React from "react";
import InfoCard from "../common/InfoCard/InfoCard";
import ContentCard from "./ContentCard/ContentCard";

import alertIcon from "../../assets/images/alertIcon.svg";
import warningIcon from "../../assets/images/warningIcon.svg";
import notificationIcon from "../../assets/images/notificationIcon.svg";
import SimplePieChart from "./Charts/PieChart";
import LineBarChart from "./Charts/LineBarChart";
import InventoryTableChart from "./Charts/InventoryTableChart";
import CustomBarChart from "./Charts/CustomBarChart";

const CommonComponentsDemo = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Common Components Demo</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">InfoCard</h2>
        // Default variant
        <InfoCard primaryText="Primary Text" secondaryText="Secondary Text" />
        // Only Primary text
        <InfoCard primaryText="Only Primary Text" />
        // White variant, drop shadow
        <InfoCard
          primaryText="Primary Text"
          secondaryText="Secondary Text"
          variant="outlined"
        />
        // Only Primary text, with green icon
        <InfoCard
          primaryText="Green Icon"
          iconColor="green"
          variant="outlined"
          icon={notificationIcon}
        />
        // Red icon
        <InfoCard
          primaryText="Red Icon"
          secondaryText="Alert Status"
          iconColor="red"
          variant="outlined"
          icon={alertIcon}
        />
        // With a number
        <InfoCard
          variant="outlined"
          primaryText="Warnings"
          secondaryText="Active Alerts"
          iconColor="yellow"
          number={3}
          icon={warningIcon}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Content Card</h2>
        // Base Card
        <ContentCard title="Empty Content Card" />
        // Content Card with child Pie Chart, max 4 slices supported, need to
        add more colors if we want more
        {/*<ContentCard title="Content card with Chart Component">*/}
        {/*  <SimplePieChart />*/}
        {/*</ContentCard>*/}
        // Content Card with the Chart Line Bar
        {/*<ContentCard*/}
        {/*  title="Content card with Chart Component"*/}
        {/*  showDateDropdown={true}*/}
        {/*>*/}
        {/*  <LineBarChart />*/}
        {/*</ContentCard>*/}
        {/*// Content Card with TableComponent*/}
        {/*<ContentCard title="Top Used Inventory" showDateDropdown={true}>*/}
        {/*  <InventoryTableChart />*/}
        {/*</ContentCard>*/}
        {/*// Content Card with Bar Chart*/}
        {/*<ContentCard title="Top Used Inventory" showDateDropdown={true}>*/}
        {/*  <CustomBarChart />*/}
        {/*</ContentCard>*/}
      </section>
    </div>
  );
};

export default CommonComponentsDemo;
