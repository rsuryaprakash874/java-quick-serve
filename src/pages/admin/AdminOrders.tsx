import React, { useState } from "react";
import { sampleOrders } from "@/data/mockData";
import type { Order } from "@/data/mockData";

const allStatuses = ["pending", "accepted", "preparing", "ready", "delivered", "cancelled"] as const;

const statusColors: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  accepted: "bg-blue-100 text-blue-700",
  preparing: "bg-secondary/15 text-secondary",
  ready: "bg-success/15 text-success",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  const updateStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">All Orders</h2>
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Items</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Payment</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{order.id}</td>
                  <td className="px-5 py-3 text-muted-foreground max-w-[200px] truncate">
                    {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">₹{order.total}</td>
                  <td className="px-5 py-3 text-muted-foreground">{order.paymentMethod}</td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as Order["status"])}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${statusColors[order.status]}`}
                    >
                      {allStatuses.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
