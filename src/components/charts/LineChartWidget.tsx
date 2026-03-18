import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  title: string;
  data: { [key: string]: string | number }[];
  xKey: string;
  yKey: string;
  color?: string;
}

export default function LineChartWidget({ title, data, xKey, yKey, color = "hsl(217, 91%, 60%)" }: Props) {
  return (
    <div className="bg-card rounded-lg border card-shadow p-5 h-full">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
          <XAxis
            dataKey={xKey}
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
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, fill: color }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
