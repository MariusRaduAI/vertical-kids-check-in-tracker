
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AgeGroupData {
  name: string;
  P1?: number;
  P2?: number;
  total: number;
}

interface AttendanceByAgeChartProps {
  data: AgeGroupData[];
  period: string;
}

const AttendanceByAgeChart: React.FC<AttendanceByAgeChartProps> = ({ data, period }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prezență pe Grupe de Vârstă</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                tickFormatter={(value) => {
                  switch(value) {
                    case "0-1": return "0-1 ani";
                    case "1-2": return "1-2 ani";
                    case "2-3": return "2-3 ani";
                    case "4-6": return "4-6 ani";
                    case "7-12": return "7-12 ani";
                    default: return value;
                  }
                }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, name === "P1" ? "Program 1" : name === "P2" ? "Program 2" : "Total"]}
                labelFormatter={(label) => {
                  switch(label) {
                    case "0-1": return "0-1 ani";
                    case "1-2": return "1-2 ani";
                    case "2-3": return "2-3 ani";
                    case "4-6": return "4-6 ani";
                    case "7-12": return "7-12 ani";
                    default: return label;
                  }
                }}
              />
              <Legend />
              {period === "current" ? (
                <>
                  <Bar dataKey="P1" name="Program 1" fill="#6b5ecc" />
                  <Bar dataKey="P2" name="Program 2" fill="#4a9af5" />
                </>
              ) : (
                <Bar dataKey="total" name="Total Prezențe" fill="#6b5ecc" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceByAgeChart;
