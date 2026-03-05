import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { sampleOrders } from "@/data/mockData";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  accepted: "bg-blue-100 text-blue-700",
  preparing: "bg-secondary/15 text-secondary",
  ready: "bg-success/15 text-success",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};

export default function OrdersPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Your Orders</h1>
      </div>

      <div className="space-y-4">
        {sampleOrders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl shadow-card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-foreground text-sm">{order.restaurantName}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{order.id} • {order.date}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className="border-t border-border pt-3 mb-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                  <span className="text-foreground">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="font-bold text-foreground">₹{order.total}</span>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Reorder
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
