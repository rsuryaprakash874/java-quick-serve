import React, { useState } from "react";
import { menuItems as initialItems } from "@/data/mockData";
import type { MenuItem } from "@/data/mockData";
import { Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item deleted");
  };

  const handleSave = () => {
    if (!editItem) return;
    setItems((prev) => prev.map((i) => (i.id === editItem.id ? editItem : i)));
    toast.success("Item updated");
    setEditItem(null);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">Menu Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <motion.div layout key={item.id} className="bg-card rounded-xl shadow-card overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-36 object-cover" loading="lazy" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={item.veg ? "veg-indicator" : "nonveg-indicator"} />
                <h4 className="font-semibold text-foreground text-sm truncate">{item.name}</h4>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">₹{item.price}</p>
              <p className="text-xs text-muted-foreground truncate">{item.description}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEditItem(item)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => deleteItem(item.id)} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card rounded-xl shadow-elevated w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">Edit Item</h3>
                <button onClick={() => setEditItem(null)} className="p-1 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <input value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Item name" />
                <input type="number" value={editItem.price} onChange={(e) => setEditItem({ ...editItem, price: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Price" />
                <textarea value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-lg bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Description" />
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={editItem.veg} onChange={(e) => setEditItem({ ...editItem, veg: e.target.checked })} className="rounded" />
                  Vegetarian
                </label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setEditItem(null)} className="flex-1 py-2.5 rounded-lg bg-muted text-foreground text-sm font-semibold hover:bg-border transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-95 transition-opacity">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
