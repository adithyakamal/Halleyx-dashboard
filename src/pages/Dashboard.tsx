import { useEffect, useMemo, useState, type DragEvent } from "react";
import { getOrders } from "@/store/orderStore";
import {
  DateFilter,
  filterOrdersByDate,
  getProductDistribution,
  getStatusDistribution,
  getRevenueOverTime,
  getRevenueByProduct,
  getOrdersByCreator,
} from "@/lib/chartHelpers";
import BarChartWidget from "@/components/charts/BarChartWidget";
import LineChartWidget from "@/components/charts/LineChartWidget";
import PieChartWidget from "@/components/charts/PieChartWidget";
import AreaChartWidget from "@/components/charts/AreaChartWidget";
import UserInfoWidget from "@/components/charts/UserInfoWidget";
import { DollarSign, ShoppingCart, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const DATE_FILTERS: { label: string; value: DateFilter }[] = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" },
];

type WidgetId =
  | "revenueTime"
  | "revenueByProduct"
  | "statusDist"
  | "productDist"
  | "ordersByCreator"
  | "userInfo";

const DASHBOARD_LAYOUT_KEY = "dashboard_layout";
const DEFAULT_WIDGET_ORDER: WidgetId[] = [
  "userInfo",
  "revenueTime",
  "revenueByProduct",
  "statusDist",
  "productDist",
  "ordersByCreator",
];

function getSavedWidgetOrder(): WidgetId[] {
  try {
    const raw = localStorage.getItem(DASHBOARD_LAYOUT_KEY);
    if (!raw) return DEFAULT_WIDGET_ORDER;
    const parsed = JSON.parse(raw) as WidgetId[];
    if (!Array.isArray(parsed)) return DEFAULT_WIDGET_ORDER;
    return parsed;
  } catch {
    return DEFAULT_WIDGET_ORDER;
  }
}

export default function Dashboard() {
  const allOrders = useMemo(() => getOrders(), []);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(getSavedWidgetOrder);
  const [draggedWidget, setDraggedWidget] = useState<WidgetId | null>(null);
  const [dragOverWidget, setDragOverWidget] = useState<WidgetId | null>(null);

  const orders = useMemo(
    () => filterOrdersByDate(allOrders, dateFilter),
    [allOrders, dateFilter]
  );

  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "Pending").length;
  const completed = orders.filter((o) => o.status === "Completed").length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const kpis = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "bg-info/10 text-info",
    },
    {
      label: "Avg Order Value",
      value: `$${avgOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-success/10 text-success",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle,
      color: "bg-success/10 text-success",
    },
  ];

  const productDist = useMemo(() => getProductDistribution(orders), [orders]);
  const statusDist = useMemo(() => getStatusDistribution(orders), [orders]);
  const revenueTime = useMemo(() => getRevenueOverTime(orders), [orders]);
  const revenueByProduct = useMemo(() => getRevenueByProduct(orders), [orders]);
  const ordersByCreator = useMemo(() => getOrdersByCreator(orders), [orders]);

  // Persist layout changes to localStorage
  useEffect(() => {
    localStorage.setItem(DASHBOARD_LAYOUT_KEY, JSON.stringify(widgetOrder));
  }, [widgetOrder]);

  const handleReorderWidget = (from: WidgetId, to: WidgetId) => {
    if (from === to) return;
    const fromIndex = widgetOrder.indexOf(from);
    const toIndex = widgetOrder.indexOf(to);
    if (fromIndex === -1 || toIndex === -1) return;

    const updated = [...widgetOrder];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setWidgetOrder(updated);
    setDraggedWidget(null);
    setDragOverWidget(null);
  };

  // Shorten product names for chart labels
  const shortProductDist = productDist.map((d) => ({
    name: d.name.split(" ").slice(0, 2).join(" "),
    value: d.value,
  }));
  const shortRevByProduct = revenueByProduct.map((d) => ({
    name: d.name.split(" ").slice(0, 2).join(" "),
    revenue: d.revenue,
  }));

  return (
    <div className="animate-fade-in">
      {/* Header with filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customer order analytics overview
          </p>
        </div>
        <div className="flex gap-1 bg-card border rounded-lg p-1">
          {DATE_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={dateFilter === f.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setDateFilter(f.value)}
              className="text-xs"
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-card rounded-lg border card-shadow p-4 flex items-center gap-3"
          >
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${kpi.color}`}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts (drag to reorder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        {widgetOrder.map((widget) => {
          const commonProps = {
            draggable: true,
            onDragStart: (e: DragEvent) => {
              e.dataTransfer.setData("text/plain", widget);
              setDraggedWidget(widget);
            },
            onDragOver: (e: DragEvent) => {
              e.preventDefault();
              setDragOverWidget(widget);
            },
            onDragLeave: () => setDragOverWidget(null),
            onDrop: () => {
              if (draggedWidget) {
                handleReorderWidget(draggedWidget, widget);
              }
            },
            onDragEnd: () => {
              setDraggedWidget(null);
              setDragOverWidget(null);
            },
            className: `transition-colors ${
              dragOverWidget === widget ? "bg-muted/30" : "hover:bg-muted/30"
            }`,
          };

          switch (widget) {
            case "revenueTime":
              return (
                <div key={widget} {...commonProps}>
                  <AreaChartWidget
                    title="Revenue Over Time"
                    data={revenueTime}
                    xKey="date"
                    yKey="revenue"
                  />
                </div>
              );
            case "revenueByProduct":
              return (
                <div key={widget} {...commonProps}>
                  <BarChartWidget
                    title="Revenue by Product"
                    data={shortRevByProduct}
                    dataKey="revenue"
                    color="hsl(217, 91%, 60%)"
                  />
                </div>
              );
            case "statusDist":
              return (
                <div key={widget} {...commonProps}>
                  <PieChartWidget title="Order Status Distribution" data={statusDist} />
                </div>
              );
            case "productDist":
              return (
                <div key={widget} {...commonProps}>
                  <BarChartWidget
                    title="Product vs Quantity"
                    data={shortProductDist}
                    dataKey="value"
                    color="hsl(142, 71%, 45%)"
                  />
                </div>
              );
            case "ordersByCreator":
              return (
                <div key={widget} {...commonProps}>
                  <BarChartWidget
                    title="Orders by Creator"
                    data={ordersByCreator}
                    dataKey="count"
                    color="hsl(280, 67%, 55%)"
                  />
                </div>
              );
            case "userInfo":
              return (
                <div key={widget} {...commonProps}>
                  <UserInfoWidget />
                </div>
              );
            default:
              return null;
          }
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-lg border card-shadow">
        <div className="px-5 py-4 border-b">
          <h2 className="text-sm font-semibold text-foreground">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => {
                const statusCls =
                  o.status === "Pending"
                    ? "status-pending"
                    : o.status === "In progress"
                    ? "status-in-progress"
                    : "status-completed";
                return (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                    <td className="px-4 py-3">{o.firstName} {o.lastName}</td>
                    <td className="px-4 py-3">{o.product}</td>
                    <td className="px-4 py-3 font-semibold">${o.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusCls}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No orders found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
