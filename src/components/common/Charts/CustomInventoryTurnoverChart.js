import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// Generate dates
const generateDates = () => {
  const dates = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2023-05-15');

  for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    dates.push(new Date(currentDate));
  }
  return dates;
};

// Generate mock data
const mockData = generateDates().map(date => {
  // Only generate data for dates up to May 15, 2023
  if (date > new Date('2023-05-15')) return null;

  const cogs = Math.floor(Math.random() * 5000) + 2000; // Random COGS between 2000 and 7000
  const avgInventory = Math.floor(Math.random() * 2000) + 500; // Random avg inventory between 500 and 2500

  return {
    date: date,
    formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    month: date.getMonth() + 1,
    cogs: cogs,
    avgInventory: avgInventory,
    turnoverRatio: cogs / avgInventory
  };
}).filter(item => item !== null); // Remove null entries

// Create monthly data
const createMonthlyData = (data) => {
  const startDate = new Date('2023-05-01');
  const endDate = new Date('2023-05-15');

  const filteredData = data.filter(item =>
    item.date >= startDate && item.date <= endDate
  );

  return filteredData;
};

// Create quarterly data
const createQuarterlyData = (data) => {
  const startDate = new Date('2023-04-01'); // Start of Q2
  const endDate = new Date('2023-05-15');

  const filteredData = data.filter(item =>
    item.date >= startDate && item.date <= endDate
  );

  const monthTotals = {
    'Apr': { name: 'Apr', cogs: 0, avgInventory: 0, cogsCount: 0, inventoryCount: 0 },
    'May': { name: 'May', cogs: 0, avgInventory: 0, cogsCount: 0, inventoryCount: 0 }
  };

  filteredData.forEach(item => {
    const month = item.date.toLocaleDateString('en-US', { month: 'short' });
    monthTotals[month].cogs += item.cogs;
    monthTotals[month].avgInventory += item.avgInventory;
    monthTotals[month].cogsCount++;
    monthTotals[month].inventoryCount++;
  });

  return Object.values(monthTotals).map(month => ({
    ...month,
    cogs: month.cogsCount > 0 ? Math.round(month.cogs / month.cogsCount) : 0,
    avgInventory: month.inventoryCount > 0 ? Math.round(month.avgInventory / month.inventoryCount) : 0,
    turnoverRatio: month.cogsCount > 0 && month.inventoryCount > 0
      ? (month.cogs / month.cogsCount) / (month.avgInventory / month.inventoryCount)
      : 0
  }));
};
// Create yearly data

const createYearlyData = (data) => {
  const monthTotals = {};
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

  // Initialize month totals
  monthOrder.forEach(month => {
    monthTotals[month] = {
      name: month,
      cogs: 0,
      avgInventory: 0,
      cogsCount: 0,
      inventoryCount: 0
    };
  });

  // Aggregate data
  data.forEach(item => {
    const month = item.date.toLocaleDateString('en-US', { month: 'short' });
    if (monthOrder.includes(month)) {
      monthTotals[month].cogs += item.cogs;
      monthTotals[month].avgInventory += item.avgInventory;
      monthTotals[month].cogsCount++;
      monthTotals[month].inventoryCount++;
    }
  });

  // Calculate averages and return only the months we want
  return monthOrder.map(month => {
    const monthData = monthTotals[month];
    const avgCogs = monthData.cogsCount > 0
      ? Math.round(monthData.cogs / monthData.cogsCount)
      : 0;
    const avgInventory = monthData.inventoryCount > 0
      ? Math.round(monthData.avgInventory / monthData.inventoryCount)
      : 0;

    return {
      name: month,
      cogs: avgCogs,
      avgInventory: avgInventory,
      turnoverRatio: avgInventory > 0 ? avgCogs / avgInventory : 0
    };
  });
};
const InventoryTurnoverChart = ({ selectedDate }) => {
  const theme = useTheme();
  const [currentGraphData, setCurrentGraphData] = useState([]);

  useEffect(() => {
    switch (selectedDate) {
      case 'month':

        setCurrentGraphData(createMonthlyData(mockData));
        break;
      case 'quarter':
        setCurrentGraphData(createQuarterlyData(mockData));
        break;
      case 'year':
        const yearlyData = createYearlyData(mockData)
        console.log("yearly data", yearlyData)
        setCurrentGraphData(createYearlyData(mockData));
        break;
      default:
        setCurrentGraphData(mockData);
    }
  }, [selectedDate]);

  return (
    <Box sx={{ width: '100%', height: '320px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={currentGraphData}
          // margin={{ top: 20,  bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={selectedDate === 'year' ? 'name' :
              selectedDate === 'quarter' ? 'name' :
                'formattedDate'}
            interval={selectedDate === 'month' ? 2 : 0}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            label={{
              value: 'Cost of Goods Sold ($)',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
              dx: 10
            }}
            width={70}
          />
          <YAxis
            yAxisId="left2"
            orientation="left"
            xAxisId={1}
            label={{
              value: 'Inventory Turnover Ratio (%)',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
            width={50}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: 'Average Inventory ($)',
              angle: -90,
              position: 'insideRight',
              style: { textAnchor: 'middle' },
              dx: -5
            }}
          />
          <Tooltip />
          <Legend />

          <Bar
            yAxisId="left"
            dataKey="cogs"
            fill={theme.palette.primary.main}
            name="Cost of Goods Sold"
          />

          <Area
            yAxisId="left2"
            type="monotone"
            dataKey="turnoverRatio"
            fill={theme.palette.secondary.main}
            stroke={theme.palette.secondary.dark}
            fillOpacity={0.3}
            name="Inventory Turnover Ratio"
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgInventory"
            stroke={theme.palette.error.main}
            name="Average Inventory"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default InventoryTurnoverChart;