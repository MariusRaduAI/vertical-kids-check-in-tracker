
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

interface AttendanceData {
  date?: string;
  month?: string;
  P1: number;
  P2: number;
  total: number;
}

interface AttendanceTrendsChartProps {
  data: AttendanceData[];
  period: string;
  title: string;
  description?: string;
  chartType?: "bar" | "line";
}

const AttendanceTrendsChart: React.FC<AttendanceTrendsChartProps> = ({ 
  data, 
  period, 
  title, 
  description,
  chartType = "bar" 
}) => {
  // Determine which key to use for the X-axis (date or month)
  const xAxisKey = data[0]?.month ? "month" : "date";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="P1" name="Program 1" fill="#6b5ecc" />
              <Bar dataKey="P2" name="Program 2" fill="#4a9af5" />
              <Bar dataKey="total" name="Total" fill="#5fd4ac" />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" name="Total" stroke="#5fd4ac" strokeWidth={2} />
              <Line type="monotone" dataKey="P1" name="Program 1" stroke="#6b5ecc" />
              <Line type="monotone" dataKey="P2" name="Program 2" stroke="#4a9af5" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AttendanceTrendsChart;
