import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AdminAddItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", price: "", description: "", category: "", image: "", veg: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success(`${form.name} added successfully!`);
    setLoading(false);
    navigate("/admin/menu");
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-bold text-foreground mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Item Name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Butter Chicken" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Price (₹) *</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="320" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Main Course" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-lg bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Describe the item..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Image URL</label>
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="https://..." />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={form.veg} onChange={(e) => setForm({ ...form, veg: e.target.checked })} className="rounded" />
          Vegetarian
        </label>
        <button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-bold text-sm shadow-elevated hover:opacity-95 transition-opacity disabled:opacity-60">
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
}
