import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

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

const createDailyData = (data) => {
  return data.map((item) => ({
    name: `${getMonthName(item.month)} ${item.day}`,
    bread: item.bread,
    eggs: item.eggs,
    pork: item.pork,
    beef: item.beef,
  }));
};

const createMonthlyGraphData = (data, month = "May") => {
  return data.filter((item) => item.name.startsWith(month));
};

const createYearlyGraphData = (data) => {
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
    const { month, bread, eggs, pork, beef } = entry;
    const monthIndex = month - 1;

    if (!acc[monthIndex]) {
      acc[monthIndex] = {
        name: monthNames[monthIndex],
        bread: 0,
        eggs: 0,
        pork: 0,
        beef: 0,
        count: 0,
      };
    }

    acc[monthIndex].bread += bread;
    acc[monthIndex].eggs += eggs;
    acc[monthIndex].pork += pork;
    acc[monthIndex].beef += beef;
    acc[monthIndex].count++;

    return acc;
  }, []);

  return monthlyData.map((entry) => ({
    name: entry.name,
    bread: Math.round(entry.bread / entry.count),
    eggs: Math.round(entry.eggs / entry.count),
    pork: Math.round(entry.pork / entry.count),
    beef: Math.round(entry.beef / entry.count),
  }));
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

const InventoryTableChart = ({ data, selectedDate }) => {
  const theme = useTheme();

  const [currentGraphData, setCurrentGraphData] = useState([]);

  const graphData = createDailyData(data.data);
  const monthlyGraphData = createMonthlyGraphData(graphData);
  const yearlyGraphData = createYearlyGraphData(data.data);
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

  const getUnitMeasure = (product) => {
    const unitMeasure = data.unitMeasure.find((item) => item[product]);
    return unitMeasure ? unitMeasure[product] : "";
  };

  return (
    <Table sx={{ height: "100%" }} aria-label="inventory table">
      <TableBody>
        {["bread", "eggs", "pork", "beef"].map((product, index) => (
          <TableRow key={index}>
            <TableCell
              component="th"
              scope="row"
              sx={{
                backgroundColor: theme.palette.primary.secondary,
                color: theme.palette.primary.primary,
                borderRadius: index === 0 ? "20px 20px 0 0" : "none",
                border: "none",
              }}
            >
              {product}:
            </TableCell>
            <TableCell sx={{ padding: 0, border: "none", paddingLeft: "16px" }}>
              <Table
                sx={{
                  backgroundColor: "white",
                  borderRadius: index === 0 ? "20px 20px 0 0" : "none",
                }}
              >
                <TableRow>
                  {currentGraphData.map((data, dataIndex) => (
                    <TableCell
                      key={dataIndex}
                      align="right"
                      sx={{
                        flex: 1,
                        border: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {data[product]} {getUnitMeasure(product)}
                    </TableCell>
                  ))}
                </TableRow>
              </Table>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableRow>
        <TableCell
          sx={{
            backgroundColor: theme.palette.primary.secondary,
            borderRadius: "0 0 20px 20px",
            border: "none",
          }}
        />
        <TableCell sx={{ padding: 0, border: "none", paddingLeft: "16px" }}>
          <Table
            sx={{ backgroundColor: "white", borderRadius: "0 0 20px 20px" }}
          >
            <TableRow>
              {currentGraphData.map((data, index) => (
                <TableCell
                  key={index}
                  align="right"
                  sx={{
                    flex: 1,
                    border: "none",
                  }}
                >
                  <Typography variant={"label1"}>{data.name}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </Table>
        </TableCell>
      </TableRow>
    </Table>
  );
};

export default InventoryTableChart;
