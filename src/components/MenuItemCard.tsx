import React from "react";
import { Plus, Minus } from "lucide-react";
import type { MenuItem } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 p-4 border-b border-border last:border-0"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={item.veg ? "veg-indicator" : "nonveg-indicator"} />
          {item.bestseller && (
            <span className="text-xs font-semibold text-secondary">★ Bestseller</span>
          )}
        </div>
        <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
        <p className="text-sm font-semibold text-foreground mt-0.5">₹{item.price}</p>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
      </div>
      <div className="relative shrink-0 w-28">
        <img
          src={item.image}
          alt={item.name}
          className="w-28 h-24 object-cover rounded-lg"
          loading="lazy"
        />
        <div className="absolute -bottom-3 inset-x-0 flex justify-center">
          {quantity === 0 ? (
            <button
              onClick={() => addItem(item)}
              className="px-6 py-1.5 rounded-lg bg-card border-2 border-primary text-primary text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-0 rounded-lg overflow-hidden bg-primary shadow-sm">
              <button onClick={() => updateQuantity(item.id, quantity - 1)} className="px-2 py-1.5 text-primary-foreground hover:opacity-80 transition-opacity">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 py-1.5 text-sm font-bold text-primary-foreground min-w-[28px] text-center">{quantity}</span>
              <button onClick={() => updateQuantity(item.id, quantity + 1)} className="px-2 py-1.5 text-primary-foreground hover:opacity-80 transition-opacity">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
