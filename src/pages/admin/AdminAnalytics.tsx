import React from "react";
import { adminStats } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(356,76%,55%)", "hsl(27,97%,55%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)", "hsl(210,60%,50%)"];

export default function AdminAnalytics() {
  const pieData = adminStats.topItems.map((item) => ({ name: item.name, value: item.orders }));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-card p-5">
          <h3 className="font-bold text-foreground text-sm mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={adminStats.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: "12px" }} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl shadow-card p-5">
          <h3 className="font-bold text-foreground text-sm mb-4">Top Selling Items</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name }) => name.split(" ")[0]}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top items table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-bold text-foreground text-sm">Weekly Summary</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">#</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Item</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Orders</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {adminStats.topItems.map((item, i) => (
              <tr key={item.name} className="border-b border-border last:border-0">
                <td className="px-5 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-5 py-3 font-medium text-foreground">{item.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{item.orders}</td>
                <td className="px-5 py-3 font-medium text-foreground">₹{item.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
