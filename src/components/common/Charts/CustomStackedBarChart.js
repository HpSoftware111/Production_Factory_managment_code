import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';

// Helper functions remain the same
const isShipmentDay = () => Math.random() > 0.6;
const generateShipmentValue = () => {
  const hasShipment = Math.random() > 0.3;
  return hasShipment ? Math.floor(Math.random() * 100) + 20 : 0;
};

const generateDates = () => {
  const dates = [];
  const startDate = new Date('2023-04-01');  // Changed to April 1
  const endDate = new Date('2023-12-31');

  for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    dates.push(new Date(currentDate));
  }
  return dates;
};

// Generate mock data
const mockData = generateDates().map(date => {
  const hasShipmentsToday = isShipmentDay();
  return {
    date: date,
    formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Eggs: hasShipmentsToday ? generateShipmentValue() : 0,
    Meat: hasShipmentsToday ? generateShipmentValue() : 0,
    Chicken: hasShipmentsToday ? generateShipmentValue() : 0,
    Corn: hasShipmentsToday ? generateShipmentValue() : 0,
    Salmon: hasShipmentsToday ? generateShipmentValue() : 0,
  };
});

// Function to create monthly data
const createMonthlyData = (data) => {
  const startDate = new Date('2023-05-15');
  const currentMonth = startDate.getMonth();
  const currentYear = startDate.getFullYear();

  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= lastDayOfMonth;
  });
};

const createYearlyData = (data) => {
  const monthTotals = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Initialize month totals
  monthNames.forEach(month => {
    monthTotals[month] = {
      month: month,
      Eggs: 0,
      Meat: 0,
      Chicken: 0,
      Corn: 0,
      Salmon: 0
    };
  });

  // Sum up the values for each month
  data.forEach(item => {
    const month = item.date.toLocaleDateString('en-US', { month: 'short' });
    monthTotals[month].Eggs += item.Eggs;
    monthTotals[month].Meat += item.Meat;
    monthTotals[month].Chicken += item.Chicken;
    monthTotals[month].Corn += item.Corn;
    monthTotals[month].Salmon += item.Salmon;
  });

  // Filter out months before the start date (May)
  const startMonth = new Date('2023-05-15').getMonth(); // May is month 4 (0-indexed)
  return Object.values(monthTotals).filter((_, index) => index >= startMonth);
};

// Helper function to determine the quarter
const getQuarter = (date) => {
  const month = date.getMonth();
  return Math.floor((month + 3) / 3);
};

// Function to create quarterly data
const createQuarterlyData = (data) => {
  const startDate = new Date('2023-05-15');
  const currentQuarter = getQuarter(startDate);

  const quarterMonths = {
    2: ['Apr', 'May', 'Jun'],  // Q2
    3: ['Jul', 'Aug', 'Sep'],  // Q3
    4: ['Oct', 'Nov', 'Dec']   // Q4
  };

  const currentQuarterMonths = quarterMonths[currentQuarter];

  const quarterlyTotals = currentQuarterMonths.reduce((acc, month) => {
    acc[month] = {
      month: month,
      Eggs: 0,
      Meat: 0,
      Chicken: 0,
      Corn: 0,
      Salmon: 0
    };
    return acc;
  }, {});

  // Sum up the data for each month in the quarter
  data.forEach(item => {
    const month = new Date(item.date).toLocaleDateString('en-US', { month: 'short' });
    if (currentQuarterMonths.includes(month)) {
      quarterlyTotals[month].Eggs += item.Eggs;
      quarterlyTotals[month].Meat += item.Meat;
      quarterlyTotals[month].Chicken += item.Chicken;
      quarterlyTotals[month].Corn += item.Corn;
      quarterlyTotals[month].Salmon += item.Salmon;
    }
  });

  return Object.values(quarterlyTotals);
};

const IngredientChart = ({ selectedDate }) => {
  const [currentGraphData, setCurrentGraphData] = useState([]);
  const theme = useTheme()

  useEffect(() => {
    switch (selectedDate) {
      case 'month':
        setCurrentGraphData(createMonthlyData(mockData));
        break;
      case 'quarter':
        setCurrentGraphData(createQuarterlyData(mockData));
        break;
      case 'year':
        setCurrentGraphData(createYearlyData(mockData));
        break;
      default:
        setCurrentGraphData(mockData);
    }
  }, [selectedDate]);

  return (
    <Box sx={{ width: '100%', height: '325px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={currentGraphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={
              selectedDate === 'year' ? 'month' :
                selectedDate === 'quarter' ? 'month' :
                  'formattedDate'
            }
            interval={selectedDate === 'month' ? 6 : 0}
          />
          <YAxis
            label={{
              value: '1 Flat or 1 LB',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip />
          <Legend
            align="left"
            wrapperStyle={{ paddingLeft: '50px' }}
          />
          <Bar dataKey="Eggs" stackId="a" fill={theme.palette.primary.main} />
          <Bar dataKey="Meat" stackId="a" fill={theme.palette.secondary.main} />
          <Bar dataKey="Chicken" stackId="a" fill={theme.palette.tertiary.main} />
          <Bar dataKey="Corn" stackId="a" fill={theme.palette.quaternary.main} />
          <Bar dataKey="Salmon" stackId="a" fill={theme.palette.quinary.main} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IngredientChart;