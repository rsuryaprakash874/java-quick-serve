import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const CreateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { stall, items } = (location.state as any) || {};

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <span className="text-5xl block mb-4">🛒</span>
        <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty.</h2>
        <button
          onClick={() => navigate("/customer/menu")}
          className="mt-4 px-6 py-3 gradient-primary text-primary-foreground rounded-xl font-bold text-sm"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const totalAmount = items.reduce(
    (sum: number, item: any) => sum + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
    try {
      const tokenNumber = Math.floor(1000 + Math.random() * 9000);

      await addDoc(collection(db, "orders"), {
        tokenNumber,
        status: "pending",
        items,
        stallId: stall.id,
        createdAt: new Date(),
      });

      navigate("/customer/home");
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary px-4 pt-12 pb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-black text-primary-foreground">Confirm Order ✅</h1>
      </div>

      <div className="px-4 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-card p-5"
        >
          <h3 className="font-bold text-foreground mb-4">Order Summary</h3>

          <div className="space-y-3 mb-6">
            {items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="text-foreground font-medium">× {item.qty}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 mb-6">
            <div className="flex justify-between text-lg font-black text-foreground">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            className="w-full gradient-primary text-primary-foreground rounded-xl py-3.5 font-bold text-sm shadow-elevated hover:opacity-95 transition-opacity"
          >
            Place Order
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateOrder;
