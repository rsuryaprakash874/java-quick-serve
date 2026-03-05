import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { restaurants, categories } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
              Hungry between<br />classes? We got you! 🔥
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg">
              Order from SRM campus canteens. Skip the queue, grab your food fast.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="#restaurants"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card text-primary font-bold text-sm hover:opacity-90 transition-opacity shadow-elevated"
              >
                Order Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-bold text-sm hover:bg-primary-foreground/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">What are you craving? 🤤</h2>
            <div className="flex gap-2">
              <button onClick={() => scroll("left")} className="p-2 rounded-full bg-muted hover:bg-border transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scroll("right")} className="p-2 rounded-full bg-muted hover:bg-border transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants */}
      <section id="restaurants" className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">Campus canteens & stalls 🏫</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
