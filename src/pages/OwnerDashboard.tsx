import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Loader2, CheckCircle, Package, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ================= FETCH ORDERS =================
  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const activeOrders = data.filter(
          (order: any) => order.status !== "sold"
        );

        setOrders(activeOrders);
      },
      (error) => {
        console.error("Error fetching orders:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // ================= UPDATE STATUS =================
  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);

      await updateDoc(doc(db, "orders", id), {
        status,
      });
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update order.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ================= STATS =================
  const pendingCount = orders.filter((o: any) => o.status === "pending").length;
  const preparingCount = orders.filter((o: any) => o.status === "preparing").length;
  const readyCount = orders.filter((o: any) => o.status === "ready").length;

  // ================= STATUS STYLING =================
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "bg-warning/15 text-warning", icon: <Clock className="w-4 h-4" /> };
      case "preparing":
        return { bg: "bg-secondary/15 text-secondary", icon: <Loader2 className="w-4 h-4 animate-spin" /> };
      case "ready":
        return { bg: "bg-success/15 text-success", icon: <CheckCircle className="w-4 h-4" /> };
      case "sold":
        return { bg: "bg-muted text-muted-foreground", icon: <Package className="w-4 h-4" /> };
      default:
        return { bg: "bg-muted text-muted-foreground", icon: null };
    }
  };

  const getActionButton = (order: any) => {
    const isUpdating = updatingId === order.id;
    const base = "w-full py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60";

    if (order.status === "pending") {
      return (
        <button
          onClick={() => updateStatus(order.id, "preparing")}
          disabled={isUpdating}
          className={`${base} bg-secondary text-secondary-foreground hover:opacity-90`}
        >
          {isUpdating ? "Updating..." : "🔥 Start Preparing"}
        </button>
      );
    }
    if (order.status === "preparing") {
      return (
        <button
          onClick={() => updateStatus(order.id, "ready")}
          disabled={isUpdating}
          className={`${base} bg-success text-success-foreground hover:opacity-90`}
        >
          {isUpdating ? "Updating..." : "✅ Mark Ready"}
        </button>
      );
    }
    if (order.status === "ready") {
      return (
        <button
          onClick={() => updateStatus(order.id, "sold")}
          disabled={isUpdating}
          className={`${base} bg-muted text-foreground hover:bg-border`}
        >
          {isUpdating ? "Updating..." : "📦 Mark Sold"}
        </button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero px-4 pt-12 pb-10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-primary-foreground/80 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => { logout(); navigate("/role"); }}
            className="flex items-center gap-1.5 text-primary-foreground/80 text-sm hover:text-primary-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
        <h1 className="text-2xl font-black text-primary-foreground">Owner Dashboard 📊</h1>
        <p className="text-primary-foreground/70 text-sm mt-1">Sunny Days Stall</p>
      </div>

      <div className="px-4 -mt-4 pb-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-card p-4 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <p className="text-2xl font-black text-foreground">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card rounded-2xl shadow-card p-4 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center mx-auto mb-2">
              <Loader2 className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-2xl font-black text-foreground">{preparingCount}</p>
            <p className="text-xs text-muted-foreground">Preparing</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl shadow-card p-4 text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <p className="text-2xl font-black text-foreground">{readyCount}</p>
            <p className="text-xs text-muted-foreground">Ready</p>
          </motion.div>
        </div>

        {/* Total orders */}
        <div className="bg-card rounded-2xl shadow-card p-4 mb-6 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Active Orders</span>
          <span className="text-xl font-black text-foreground">{orders.length}</span>
        </div>

        {/* Orders */}
        {orders.length === 0 && (
          <div className="text-center py-16 bg-card rounded-2xl shadow-card">
            <span className="text-5xl block mb-3">☕</span>
            <p className="text-muted-foreground text-sm">No active orders.</p>
            <p className="text-muted-foreground text-xs mt-1">Relax, orders will appear here.</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order: any, i: number) => {
            const status = getStatusStyle(order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl shadow-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎟</span>
                    <span className="font-black text-foreground text-xl">#{order.tokenNumber}</span>
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${status.bg}`}>
                    {status.icon}
                    {order.status?.toUpperCase()}
                  </span>
                </div>

                {order.totalAmount && (
                  <div className="mb-3 px-3 py-2 rounded-lg bg-muted inline-block">
                    <span className="text-sm font-bold text-foreground">₹{order.totalAmount}</span>
                  </div>
                )}

                <div className="space-y-1.5 border-t border-border pt-3 mb-4">
                  {order.items?.length > 0 ? (
                    order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="text-foreground font-medium">× {item.qty}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No items</p>
                  )}
                </div>

                {getActionButton(order)}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
