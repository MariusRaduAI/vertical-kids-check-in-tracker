
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

const COLORS = ["#4a9af5", "#ff9f7f", "#64d887", "#a288e3", "#ffbb78"];

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membri vs Guests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} copii`, ""]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
