import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  title: string;
  data: { name: string; [key: string]: string | number }[];
  dataKey: string;
  color?: string;
}

export default function BarChartWidget({ title, data, dataKey, color = "hsl(217, 91%, 60%)" }: Props) {
  return (
    <div className="bg-card rounded-lg border card-shadow p-5 h-full">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(220, 13%, 91%)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(220, 13%, 91%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
