import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Clock, ArrowLeft, ShoppingCart } from "lucide-react";
import { restaurants, menuItems } from "@/data/mockData";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function RestaurantPage() {
  const { id } = useParams();
  const { totalItems, totalPrice } = useCart();
  const restaurant = restaurants.find((r) => r.id === id);
  const items = useMemo(() => menuItems.filter((m) => m.restaurantId === id), [id]);

  const categorized = useMemo(() => {
    const map = new Map<string, typeof items>();
    items.forEach((item) => {
      const arr = map.get(item.category) || [];
      arr.push(item);
      map.set(item.category, arr);
    });
    return Array.from(map.entries());
  }, [items]);

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Restaurant not found</h1>
        <Link to="/" className="text-primary font-medium hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <>
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link to="/" className="p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors inline-flex">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl md:text-3xl font-black text-primary-foreground">{restaurant.name}</h1>
          <p className="text-sm text-primary-foreground/80 mt-1">{restaurant.cuisine.join(" • ")}</p>
        </div>
      </div>

      {/* Info bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-success text-success-foreground font-bold text-xs">
            <Star className="w-3 h-3 fill-current" /> {restaurant.rating}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" /> {restaurant.deliveryTime}
          </span>
          <span className="text-muted-foreground">₹{restaurant.priceForTwo} for two</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" /> {restaurant.address}
          </span>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-6 pb-32">
        {categorized.map(([category, catItems]) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-1">{category}</h3>
            <p className="text-xs text-muted-foreground mb-4">{catItems.length} items</p>
            <div className="bg-card rounded-xl shadow-card divide-y divide-border">
              {catItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky cart bar */}
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 inset-x-0 z-40 p-4 md:p-0"
        >
          <div className="container mx-auto md:px-4 md:pb-4">
            <Link
              to="/cart"
              className="flex items-center justify-between w-full gradient-primary text-primary-foreground rounded-xl px-6 py-4 shadow-elevated hover:opacity-95 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-bold">{totalItems} {totalItems === 1 ? "item" : "items"}</span>
                <span className="text-sm opacity-80">|</span>
                <span className="font-bold">₹{totalPrice}</span>
              </div>
              <span className="font-semibold text-sm">View Cart →</span>
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
}
