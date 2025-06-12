import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", high: 85, average: 60, low: 35 },
  { month: "Feb", high: 88, average: 63, low: 38 },
  { month: "Mar", high: 82, average: 58, low: 32 },
  { month: "Apr", high: 90, average: 65, low: 40 },
  { month: "May", high: 85, average: 60, low: 35 },
  { month: "Jun", high: 92, average: 68, low: 42 },
  { month: "Jul", high: 88, average: 62, low: 38 },
  { month: "Aug", high: 86, average: 61, low: 36 },
  { month: "Sep", high: 89, average: 64, low: 39 },
  { month: "Oct", high: 84, average: 59, low: 34 },
  { month: "Nov", high: 87, average: 62, low: 37 },
  { month: "Dec", high: 91, average: 66, low: 41 },
];

export default function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis
          tickFormatter={(value) => `${value}%`}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="linear"
          dataKey="high"
          stroke="#ff9800"
          name="High Performance"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="linear"
          dataKey="average"
          stroke="#2196f3"
          name="Average Performance"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="linear"
          dataKey="low"
          stroke="#9c27b0"
          name="Low Performance"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
