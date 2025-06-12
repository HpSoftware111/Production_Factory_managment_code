import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {Box} from "@mui/material";
import React, {useEffect, useState} from "react";
const getMonthName = (monthNumber) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return monthNames[monthNumber - 1];
};
const createDailyData = (rawData, label) => {
  if (!rawData || !rawData.data) return [];
  return rawData.data.map(item => ({
    name: `${getMonthName(item.month)} ${item.day}`,
    [label]: item[label]
  }));
};
const createYearlyData = (rawData, label, aggregationMethod = 'average') => {
  if (!rawData || !rawData.data) return [];
  const monthlyData = rawData.data.reduce((acc, entry) => {
    const monthIndex = entry.month - 1;
    if (!acc[monthIndex]) {
      acc[monthIndex] = {
        name: getMonthName(entry.month),
        [label]: 0,
        count: 0
      };
    }
    acc[monthIndex][label] += entry[label];
    acc[monthIndex].count++;
    return acc;
  }, []);
  return monthlyData.map((entry) => ({
    name: entry.name,
    [label]: aggregationMethod === 'average'
      ? Math.round((entry[label] / entry.count) * 10) / 10
      : entry[label]
  }));
};
const createMonthlyData = (dailyData, month = 'May') => {
  return dailyData.filter(item => item.name.startsWith(month));
};
const createQuarterlyData = (yearlyData, currentMonth = 'May') => {
  const quarters = {
    q1: ['Jan', 'Feb', 'Mar'],
    q2: ['Apr', 'May', 'Jun'],
    q3: ['Jul', 'Aug', 'Sep'],
    q4: ['Oct', 'Nov', 'Dec']
  };
  const getQuarter = (month) => {
    return Object.keys(quarters).find(quarter => quarters[quarter].includes(month));
  };
  const currentQuarter = getQuarter(currentMonth);
  return yearlyData.filter(item => {
    const itemQuarter = getQuarter(item.name);
    return itemQuarter === currentQuarter;
  });
};
export default function SingleLineChart({
                                          data,
                                          label = 'Average Completion Time',
                                          yAxisUnit = '', // This can be removed since we'll use data.unitMeasure
                                          color = '#2196f3',
                                          selectedDate = 'month',
                                          aggregationMethod = 'average'
                                        }) {
  const [currentGraphData, setCurrentGraphData] = useState([]);
  useEffect(() => {
    const dailyData = createDailyData(data, label);
    const yearlyData = createYearlyData(data, label, aggregationMethod);
    switch (selectedDate) {
      case 'year':
        setCurrentGraphData(yearlyData);
        break;
      case 'quarter':
        setCurrentGraphData(createQuarterlyData(yearlyData));
        break;
      case 'month':
        setCurrentGraphData(createMonthlyData(dailyData));
        break;
      default:
        setCurrentGraphData(dailyData);
    }
  }, [selectedDate, data, label, aggregationMethod]);
  // Calculate min and max for Y axis
  const values = currentGraphData.map(item => item[label]) || [];
  let minValue = values.length ? Math.floor(Math.min(...values)) : 0;
  let maxValue = values.length ? Math.ceil(Math.max(...values)) : 100;

  // If the unit is percentage, cap the maximum at 100
  if (data.unitMeasure === '%') {
    maxValue = Math.min(100, maxValue);
    minValue = Math.max(0, minValue); // Also ensure minimum is not below 0
  }

  // Generate reasonable ticks
  const range = maxValue - minValue;
  const tickCount = 6;
  const tickSize = Math.ceil(range / (tickCount - 1));
  const ticks = Array.from({length: tickCount}, (_, i) => minValue + (i * tickSize));
  return (
    <Box sx={{ width: '100%', height: '340px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={currentGraphData}
          margin={{
            top: 15,
            right: 5,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey="name"
            dy={10}
            tick={{fontSize: 12}}
          />
          <YAxis
            domain={[minValue, maxValue]}
            tickFormatter={(value) => `${value} ${data.unitMeasure}`}
            tick={{fontSize: 12}}
          />
          <Tooltip formatter={(value) => `${value}${yAxisUnit}`}/>
          <Legend
            align="left"          // Add this

            verticalAlign="bottom"
            height={24}
            wrapperStyle={{
              paddingTop: "10px",
              paddingLeft: "32px",  // Add this
              fontSize: "12px"
            }}
          />
          <Line
            type="linear"
            dataKey={label}
            stroke={color}
            name={label}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}