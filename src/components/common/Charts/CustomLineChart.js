import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {useTheme} from "@mui/material/styles";
import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";


const formatValue = (unitMeasure, value) => {
  switch(unitMeasure.toUpperCase()) {
    case 'USD':
      return `$${value.toLocaleString()}`;
    case 'PCT':
      return `${value}%`;
    case 'LBS':
      return `${value.toLocaleString()}lbs`;
    default:
      return `${value.toLocaleString()}${unitMeasure}`;
  }
};

// Helper function to get the month name from the month number
const getMonthName = (monthNumber) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return monthNames[monthNumber - 1];
};

function getDataLabels(chartData) {
  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return [];
  }

  const excludedFields = ['day', 'month', 'year'];
  const dataLabels = Object.keys(chartData.data[0]).filter(
    (field) => !excludedFields.includes(field)
  );

  return dataLabels;
}

const createDailyData = (data, dataLabels) => {

  return data.map(item => {
    const dataItem = {
      name: `${getMonthName(item.month)} ${item.day}`
    };

    dataLabels.forEach(label => {
      dataItem[label] = item[label];
    });

    return dataItem;
  });
};

const createYearlyGraphData = (data, labels, aggregationMethod = 'average') => {
  // Get unique months from the data
  const uniqueMonths = [...new Set(data.map(entry => entry.month))];

  // Sort the months
  uniqueMonths.sort((a, b) => a - b);

  // Create an array of month names based on the unique months in the data
  const monthNames = uniqueMonths.map(monthNumber => getMonthName(monthNumber));

  // Group by month
  const monthlyData = monthNames.map((name, index) => {
    const monthNumber = uniqueMonths[index];
    // Get all entries for this month
    const monthEntries = data.filter(entry => entry.month === monthNumber);

    const result = { name };

    // Calculate average or total for each label
    labels.forEach(label => {
      const validEntries = monthEntries.filter(entry => entry[label] != null);
      if (validEntries.length > 0) {
        const sum = validEntries.reduce((acc, entry) => acc + entry[label], 0);
        if (aggregationMethod === 'average') {
          result[label] = Math.round(sum / validEntries.length);
        } else if (aggregationMethod === 'total') {
          result[label] = sum;
        }
      } else {
        result[label] = null;
      }
    });

    return result;
  });

  return monthlyData;
};
const createMonthlyGraphData = (data, month = 'May') => {
  return data.filter(item => item.name.startsWith(month));
};

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

const CustomLineChart = ({ data, selectedDate, aggregationMethod }) => {
  const theme = useTheme();
  const [currentGraphData, setCurrentGraphData] = useState([]);
  const [currentGraphWidth, setCurrentGraphWidth] = useState([]);

  const dataLabels = getDataLabels(data)

  const graphData = createDailyData(data.data, dataLabels)
  const yearlyGraphData = createYearlyGraphData(data.data, dataLabels, aggregationMethod)
  const monthlyGraphData = createMonthlyGraphData(graphData)
  const quarterlyGraphData = createQuarterlyGraphData(yearlyGraphData, 'May')

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

  const valueFormatter = (value) => formatValue(data.unitMeasure, value);

  // Calculate the width based on the number of data points
  useEffect(() => {
    if (currentGraphData.length <= 0) {
      return
    }
    const columns = Object.keys(currentGraphData[0]).length - 1; // Subtract 1 to exclude the 'name' property
    const rows = currentGraphData.length;
    const baseWidth = 30; // width per data point
    const width = columns * rows * baseWidth;
    setCurrentGraphWidth(width);
  }, [currentGraphData]);

  return (
    <Box sx={{ minWidth: '100%', height: '320px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={currentGraphData} margin={{ left: 15, top: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500, fontSize: '14px', fill: '#272727' }}
            tickMargin={10}  // Add space between tick and axis label

          />
          <YAxis
            tickFormatter={valueFormatter}
            tick={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500, fontSize: '14px', fill: '#272727' }}
          />
          <Tooltip formatter={valueFormatter} />
          <Legend
            align={"left"}
            verticalAlign={"bottom"}
            layout={"horizontal"}
            iconType={"circle"}
            wrapperStyle={{ paddingLeft: '20px' }}
          />
          {dataLabels.map((label, index) => (
            <Line
              key={label}
              type="monotone"
              dataKey={label}
              stroke={theme.palette[['primary', 'tertiary', 'secondary', 'quinary', 'senary', 'septenary', 'quaternary'][index]].main}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CustomLineChart;