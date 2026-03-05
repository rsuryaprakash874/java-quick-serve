import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, deliveryFee, taxes, grandTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Your Cart</h1>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden mb-6">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              exit={{ opacity: 0, x: -100 }}
              className="flex items-center gap-4 p-4 border-b border-border last:border-0"
            >
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={item.veg ? "veg-indicator" : "nonveg-indicator"} />
                  <h4 className="font-semibold text-foreground text-sm truncate">{item.name}</h4>
                </div>
                <p className="text-sm font-semibold text-foreground mt-1">₹{item.price * item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-border overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1.5 hover:bg-muted transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1.5 text-sm font-bold min-w-[32px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1.5 hover:bg-muted transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Price breakdown */}
      <div className="bg-card rounded-xl shadow-card p-5 mb-6 space-y-3">
        <h3 className="font-bold text-foreground text-sm mb-3">Bill Details</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Item Total</span>
          <span className="text-foreground font-medium">₹{totalPrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className={`font-medium ${deliveryFee === 0 ? "text-success" : "text-foreground"}`}>
            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Taxes & Charges</span>
          <span className="text-foreground font-medium">₹{taxes}</span>
        </div>
        <div className="pt-3 border-t border-border flex justify-between">
          <span className="font-bold text-foreground">Total</span>
          <span className="font-bold text-foreground text-lg">₹{grandTotal}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="block w-full text-center gradient-primary text-primary-foreground rounded-xl px-6 py-4 font-bold text-base shadow-elevated hover:opacity-95 transition-opacity"
      >
        Proceed to Checkout — ₹{grandTotal}
      </Link>
    </div>
  );
}
