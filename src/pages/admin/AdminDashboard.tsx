import React from "react";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { adminStats, sampleOrders } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Revenue", value: `₹${adminStats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-success" },
  { label: "Total Orders", value: adminStats.totalOrders, icon: ShoppingBag, color: "text-primary" },
  { label: "Active Customers", value: adminStats.activeCustomers.toLocaleString(), icon: Users, color: "text-secondary" },
  { label: "Avg Order Value", value: `₹${adminStats.avgOrderValue}`, icon: TrendingUp, color: "text-warning" },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  accepted: "bg-blue-100 text-blue-700",
  preparing: "bg-secondary/15 text-secondary",
  ready: "bg-success/15 text-success",
  delivered: "bg-success/15 text-success",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl shadow-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-card rounded-xl shadow-card p-5">
        <h3 className="font-bold text-foreground mb-4">Weekly Revenue</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={adminStats.revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent orders */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-bold text-foreground">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Restaurant</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {sampleOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{order.id}</td>
                  <td className="px-5 py-3 text-muted-foreground">{order.restaurantName}</td>
                  <td className="px-5 py-3 font-medium text-foreground">₹{order.total}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
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
