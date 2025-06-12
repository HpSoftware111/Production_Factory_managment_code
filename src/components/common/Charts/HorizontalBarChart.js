import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "@mui/material/styles";

const defaultData = [
  { name: "Joe", orders: 7 },
  { name: "John Macy", orders: 5 },
  { name: "Greg", orders: 8 },
  { name: "Stacy", orders: 4 },
  { name: "Kyle", orders: 6 },
];

export default function HorizontalBarChart({
  data = defaultData,
  label = "Orders",
  dataKey = "orders",
  maxValue = 10,
  tickCount = 10,
  height = 350,
  redThreshold = 25, // percentage for red zone
  yellowThreshold = 45, // percentage for yellow zone
  useColorThresholds = true, // New prop to control color thresholds
}) {
  const theme = useTheme();

  const valueFormatter = (value) => `${value} ${label}`;

  const ticks = Array.from({ length: tickCount }, (_, i) =>
    Math.round((i + 1) * (maxValue / tickCount))
  );

  const getBarColor = (value) => {
    if (!useColorThresholds) {
      return theme.palette.primary.main; // Default color when not using thresholds
    }

    const percentage = (value / maxValue) * 100;

    if (percentage <= redThreshold) {
      return "#ff4d4d"; // Red for critical levels
    } else if (percentage <= yellowThreshold) {
      return theme.palette.senary.main; // Yellow for warning levels
    }
    return theme.palette.septenary.main; // Green for good levels
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 30,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={[0, maxValue]}
          ticks={ticks}
          tickFormatter={valueFormatter}
          label={{ value: label, position: "bottom" }}
          tick={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
            fontSize: "14px",
            fill: "#272727",
          }}
        />
        <YAxis
          dataKey="name"
          type="category"
          interval={0}
          tick={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
            fontSize: "14px",
            fill: "#272727",
          }}
        />
        <Tooltip />
        <Bar dataKey={dataKey} radius={[0, 5, 5, 0]} barSize={20}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry[dataKey])} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
