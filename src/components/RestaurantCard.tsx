import React from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Restaurant } from "@/data/mockData";
import { motion } from "framer-motion";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index?: number;
}

export default function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/restaurant/${restaurant.id}`} className="block group">
        <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
          <div className="relative overflow-hidden aspect-[16/10]">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {restaurant.promoted && (
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-xs font-semibold gradient-primary text-primary-foreground">
                Promoted
              </span>
            )}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-foreground/60 to-transparent" />
            <span className="absolute bottom-2 left-3 text-sm font-semibold text-primary-foreground">
              {restaurant.deliveryTime}
            </span>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors">
                {restaurant.name}
              </h3>
              <span className="flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded-md bg-success text-success-foreground text-xs font-bold">
                <Star className="w-3 h-3 fill-current" />
                {restaurant.rating}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 truncate">{restaurant.cuisine.join(", ")}</p>
            <p className="text-sm text-muted-foreground mt-0.5">₹{restaurant.priceForTwo} for two</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
