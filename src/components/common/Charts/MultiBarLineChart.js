import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const formatValue = (unitMeasure, value) => {
  switch (unitMeasure.toUpperCase()) {
    case "USD":
      return `$${value.toLocaleString()}`;
    case "PCT":
      return `${value}%`;
    case "LBS":
      return `${value.toLocaleString()}lbs`;
    default:
      return `${value.toLocaleString()}${unitMeasure}`;
  }
};

// Helper function to get the month name from the month number
const getMonthName = (monthNumber) => {
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
  return monthNames[monthNumber - 1];
};

function getDataLabels(chartData) {
  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return [];
  }

  const excludedFields = ["day", "month", "year"];
  const dataLabels = Object.keys(chartData.data[0]).filter(
    (field) => !excludedFields.includes(field)
  );

  return dataLabels;
}

const createDailyData = (data, dataLabels) => {
  return data.map((item) => {
    const dataItem = {
      name: `${getMonthName(item.month)} ${item.day}`,
    };

    dataLabels.forEach((label) => {
      dataItem[label] = item[label];
    });

    return dataItem;
  });
};

const createYearlyGraphData = (data, labels) => {
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

  const monthlyData = data.reduce((acc, entry) => {
    const { month } = entry;
    const monthIndex = month - 1;

    if (!acc[monthIndex]) {
      acc[monthIndex] = {
        name: monthNames[monthIndex],
        count: 0,
      };
      labels.forEach((label) => {
        acc[monthIndex][label] = 0;
      });
    }

    labels.forEach((label) => {
      acc[monthIndex][label] += entry[label];
    });
    acc[monthIndex].count++;

    return acc;
  }, []);

  return monthlyData.map((entry) => {
    const result = {
      name: entry.name,
    };
    labels.forEach((label) => {
      result[label] = Math.round(entry[label] / entry.count);
    });
    return result;
  });
};
const createMonthlyGraphData = (data, month = "May") => {
  return data.filter((item) => item.name.startsWith(month));
};

const createQuarterlyGraphData = (data, date) => {
  const quarters = {
    q1: ["Jan", "Feb", "Mar"],
    q2: ["Apr", "May", "Jun"],
    q3: ["Jul", "Aug", "Sep"],
    q4: ["Oct", "Nov", "Dec"],
  };

  const getQuarter = (month) => {
    return Object.keys(quarters).find((quarter) =>
      quarters[quarter].includes(month)
    );
  };

  const currentQuarter = getQuarter(date);

  return data.filter((item) => {
    const itemQuarter = getQuarter(item.name);
    return itemQuarter === currentQuarter;
  });
};

const MultiBarLineChart = ({ data, selectedDate }) => {
  const theme = useTheme();
  const [currentGraphData, setCurrentGraphData] = useState([]);
  const [currentGraphWidth, setCurrentGraphWidth] = useState([]);

  const dataLabels = getDataLabels(data);
  console.log(dataLabels);

  const graphData = createDailyData(data.data, dataLabels);
  const yearlyGraphData = createYearlyGraphData(data.data, dataLabels);
  const monthlyGraphData = createMonthlyGraphData(graphData);
  const quarterlyGraphData = createQuarterlyGraphData(yearlyGraphData, "May");

  useEffect(() => {
    switch (selectedDate) {
      case "year":
        setCurrentGraphData(yearlyGraphData);
        return;
      case "quarter":
        setCurrentGraphData(quarterlyGraphData);
        return;
      case "month":
        setCurrentGraphData(monthlyGraphData);
        return;
      default:
        return;
    }
  }, [selectedDate]);

  const valueFormatter = (value) => formatValue(data.unitMeasure, value);

  // Calculate the width based on the number of data points
  useEffect(() => {
    if (currentGraphData.length <= 0) {
      return;
    }
    const columns = Object.keys(currentGraphData[0]).length - 1; // Subtract 1 to exclude the 'name' property
    const rows = currentGraphData.length;
    const baseWidth = 30; // width per data point
    const width = columns * rows * baseWidth;
    setCurrentGraphWidth(width);
  }, [currentGraphData]);

  return (
    <Box sx={{ width: currentGraphWidth, minWidth: "100%", height: "325px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={currentGraphData} barGap={0} margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              fill: "#272727",
            }}
          />
          <YAxis
            tickFormatter={valueFormatter}
            tick={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              fill: "#272727",
            }}
          />
          <Tooltip formatter={valueFormatter} />
          <Legend
            align={"left"}
            verticalAlign={"bottom"}
            layout={"horizontal"}
            iconType={"circle"}
            wrapperStyle={{ paddingLeft: "20px" }}
          />
          {dataLabels.map((label, index) => (
            <Bar
              key={label}
              dataKey={label}
              fill={
                theme.palette[
                  ["primary", "tertiary", "secondary", "quinary"][index]
                ].main
              }
              barSize={20}
              radius={5}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MultiBarLineChart;
