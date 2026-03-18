import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getOrders, deleteOrder, setOrders as saveOrders } from "@/store/orderStore";
import { CustomerOrder } from "@/types/order";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 5;

export default function Orders() {
  const [orders, setOrders] = useState<CustomerOrder[]>(getOrders);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [dragOverOrderId, setDragOverOrderId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.firstName.toLowerCase().includes(q) ||
        o.lastName.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string) => {
    deleteOrder(id);
    const updated = getOrders();
    setOrders(updated);
    saveOrders(updated);
  };

  const handleReorder = (fromId: string, toId: string) => {
    if (fromId === toId) return;

    const current = orders;
    const fromIndex = current.findIndex((o) => o.id === fromId);
    const toIndex = current.findIndex((o) => o.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;

    const updated = [...current];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    setOrders(updated);
    saveOrders(updated);
    setDraggedOrderId(null);
    setDragOverOrderId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {orders.length} total orders
          </p>
        </div>
        <Link to="/orders/create">
          <Button>
            <PlusCircle className="h-4 w-4" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Qty</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Created By</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((order) => (
                <tr
                  key={order.id}
                  draggable
                  onDragStart={() => setDraggedOrderId(order.id)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverOrderId(order.id);
                  }}
                  onDragLeave={() => setDragOverOrderId(null)}
                  onDragEnd={() => {
                    setDraggedOrderId(null);
                    setDragOverOrderId(null);
                  }}
                  onDrop={() => {
                    if (draggedOrderId) {
                      handleReorder(draggedOrderId, order.id);
                    }
                  }}
                  className={`border-b last:border-0 transition-colors ${
                    dragOverOrderId === order.id ? "bg-muted/30" : "hover:bg-muted/30"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                  <td className="px-4 py-3 font-medium">
                    {order.firstName} {order.lastName}
                  </td>
                  <td className="px-4 py-3">{order.product}</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3 font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{order.createdBy}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(order.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
