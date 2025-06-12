import React, {useEffect, useState} from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {Box} from '@mui/material';
import {useTheme} from "@mui/material/styles";


const CustomLineBarChart = ({data: {unitMeasure, data}, selectedDate, lineName, barName, showYLabel = false}) => {
  const theme = useTheme();

  const COLORS = [
    theme.palette.tertiary.main,
    theme.palette.quaternary.main,
  ];

  const [currentGraphData, setCurrentGraphData] = useState([]);

  const formatValue = (value) => {
    switch (unitMeasure.toUpperCase()) {
      case 'USD':
        return `$${value.toLocaleString()}`;
      case 'PCT':
        return `${value}%`;
      case 'LBS':
        return `${value.toLocaleString()}\xa0lbs`; // Non-breaking space is what this weird char is
      default:
        return `${value.toLocaleString()} ${unitMeasure}`;
    }
  };

  const createDailyData = (data) => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return (
      data.map(item => {
        const monthIndex = parseInt(item.month) - 1;
        const monthName = monthNames[monthIndex];
        const day = item.day;

        return ({
          name: `${monthName} ${day}`,
          currentValue: item.currentValue,
          forecastValue: item.forecastValue
        });
      })
    )
  }

  const createYearlyGraphData = (data) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyData = data.reduce((acc, entry) => {
      const { month, currentValue, forecastValue } = entry;
      const monthIndex = month - 1;

      if (!acc[monthIndex]) {
        acc[monthIndex] = {
          name: monthNames[monthIndex],
          currentValue: 0,
          forecastValue: 0,
          count: 0,
        };
      }

      acc[monthIndex].currentValue += currentValue;
      acc[monthIndex].forecastValue += forecastValue;
      acc[monthIndex].count++;

      return acc;
    }, []);

    return monthlyData.map((entry) => ({
      name: entry.name,
      currentValue: Math.round(entry.currentValue / entry.count),
      forecastValue: Math.round(entry.forecastValue / entry.count),
    }));
  }

  const createMonthlyGraphData = (data, date) => {
    // Convert the date string to lowercase for case-insensitive comparison
    const month = date.toLowerCase();

    // Extract the first three characters of each data point's name
    // and compare it with the provided month
    return data.filter(item => item.name.slice(0, 3).toLowerCase() === month);
  }

  const createQuarterlyGraphData = (data, date) => {
    const quarters = {
      q1: ['Jan', 'Feb', 'Mar'],
      q2: ['Apr', 'May', 'Jun'],
      q3: ['Jul', 'Aug', 'Sep'],
      q4: ['Oct', 'Nov', 'Dec']
    };

    const getQuarter = (month) => {
      return Object.keys(quarters).find(quarter => quarters[quarter].includes(month));
    };

    const currentQuarter = getQuarter(date);

    return data.filter(item => {
      const itemQuarter = getQuarter(item.name);
      return itemQuarter === currentQuarter;
    });
  };

  const graphData = createDailyData(data)
  // console.log(graphData)

  const yearlyGraphData = createYearlyGraphData(data)
  // console.log(yearlyGraphData)

  const monthlyGraphData = createMonthlyGraphData(graphData, "may")
  // console.log(monthlyGraphData)

  const quarterlyGraphData = createQuarterlyGraphData(yearlyGraphData, "May")
  // console.log(quarterlyGraphData)

  const formatBarValue = (value) => {
    switch (unitMeasure.toUpperCase()) {
      case 'USD':
        return `$${value.toLocaleString()}`;
      case 'PCT':
        return `${value}%`;
      case 'LBS':
        return `${value.toLocaleString()}\xa0lbs`;
      default:
        return `${value.toLocaleString()} ${unitMeasure}`;
    }
  };

  const formatLineValue = (value) => {
    return `${value} days`;
  };

  useEffect(() => {

    switch (selectedDate) {
      case 'year':
        setCurrentGraphData(yearlyGraphData);
        return
      case 'quarter':
        setCurrentGraphData(quarterlyGraphData);
        return
      case 'month':
        setCurrentGraphData(monthlyGraphData);
        return
      default:
        return;
    }

  }, [selectedDate]);

  return (
    <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={currentGraphData} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey="name"
            tick={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              fill: '#272727'
            }}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={formatBarValue}
            tick={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              fill: '#272727',
            }}
          />
          {showYLabel && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={formatLineValue}
              tick={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                fill: '#272727',
              }}
            />
          )}
          <Tooltip
            formatter={(value, name) => {
              if (name === barName) {
                return formatBarValue(value);
              }
              return formatLineValue(value);
            }}
          />
          <Legend/>
          <Bar
            yAxisId="left"
            dataKey="currentValue"
            barSize={20}
            fill={COLORS[0]}
            name={barName}
            radius={5}
          />
          <Line
            yAxisId={showYLabel ? "right" : "left"}
            type="linear"
            dataKey="forecastValue"
            stroke={COLORS[1]}
            strokeWidth={2}
            dot={{r: 3, fill: COLORS[1]}}
            name={lineName}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CustomLineBarChart;