import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Banknote, Smartphone, ArrowLeft, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
  { id: "cash", label: "Cash on Delivery", icon: Banknote },
];

export default function CheckoutPage() {
  const { items, grandTotal, totalPrice, deliveryFee, taxes, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("SRM Hostel Block C, Room 204, Kattankulathur");
  const [payment, setPayment] = useState("upi");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setOrderPlaced(true);
    clearCart();
    toast.success("Order placed successfully!");
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
        </motion.div>
        <h1 className="text-2xl font-black text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">Your order is being prepared and will arrive soon.</p>
        <p className="text-sm text-muted-foreground mb-8">Order ID: #ORD{Date.now().toString().slice(-6)}</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate("/orders")} className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-bold text-sm hover:opacity-95 transition-opacity">
            Track Order
          </button>
          <button onClick={() => navigate("/")} className="w-full bg-muted text-foreground rounded-xl py-3 font-bold text-sm hover:bg-border transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Checkout</h1>
      </div>

      {/* Address */}
      <div className="bg-card rounded-xl shadow-card p-5 mb-4">
        <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" /> Delivery Address
        </h3>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>

      {/* Payment */}
      <div className="bg-card rounded-xl shadow-card p-5 mb-4">
        <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" /> Payment Method
        </h3>
        <div className="space-y-2">
          {paymentMethods.map((pm) => (
            <label
              key={pm.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                payment === pm.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={pm.id}
                checked={payment === pm.id}
                onChange={() => setPayment(pm.id)}
                className="sr-only"
              />
              <pm.icon className={`w-5 h-5 ${payment === pm.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-sm font-medium ${payment === pm.id ? "text-foreground" : "text-muted-foreground"}`}>{pm.label}</span>
              {payment === pm.id && <CheckCircle className="w-4 h-4 text-primary ml-auto" />}
            </label>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-card rounded-xl shadow-card p-5 mb-6">
        <h3 className="font-bold text-foreground text-sm mb-3">Order Summary</h3>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1.5">
            <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
            <span className="text-foreground font-medium">₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t border-border mt-3 pt-3 space-y-1.5">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{totalPrice}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span className={deliveryFee === 0 ? "text-success font-medium" : ""}>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Taxes</span><span>₹{taxes}</span></div>
          <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border"><span>Total</span><span className="text-lg">₹{grandTotal}</span></div>
        </div>
      </div>

      <button
        onClick={handleOrder}
        disabled={loading}
        className="w-full gradient-primary text-primary-foreground rounded-xl py-4 font-bold text-base shadow-elevated hover:opacity-95 transition-opacity disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Placing Order...
          </span>
        ) : (
          `Place Order — ₹${grandTotal}`
        )}
      </button>
    </div>
  );
}
