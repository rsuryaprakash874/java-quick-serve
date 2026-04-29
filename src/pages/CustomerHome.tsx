import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Search, Clock, CheckCircle, Loader2, Star, ChevronRight, MapPin, Zap, Flame, LogOut } from "lucide-react";
import DeveloperWatermark from "../components/DeveloperWatermark";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import OrderTracker from "../components/OrderTracker";

const quickCategories = [
  { icon: "🍛", label: "Meals" },
  { icon: "🍟", label: "Snacks" },
  { icon: "☕", label: "Beverages" },
  { icon: "🍰", label: "Desserts" },
  { icon: "🥗", label: "Healthy" },
  { icon: "🍜", label: "Noodles" },
];

const CustomerHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [prevOrders, setPrevOrders] = useState<Map<string, string>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  // Stream menu for live search
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "menuItems"), (snap) => {
      setMenuItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const searchResults = searchQuery.trim().length > 0
    ? menuItems
        .filter((i: any) => i.available !== false)
        .filter((i: any) => {
          const q = searchQuery.toLowerCase();
          return (
            i.name?.toLowerCase().includes(q) ||
            i.category?.toLowerCase().includes(q) ||
            i.description?.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("customerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        data = data.filter((order: any) => order.status !== "sold");

        // Check for status changes to "ready" (skip first load)
        if (!isFirstLoad) {
          data.forEach((order: any) => {
            const prev = prevOrders.get(order.id);
            if (prev && prev !== "ready" && order.status === "ready") {
              toast.success(`🎉 Order #${order.tokenNumber} is ready!`, {
                description: "Head to the counter to pick it up!",
                duration: 8000,
              });
              // Browser notification
              if (Notification.permission === "granted") {
                new Notification("Order Ready! 🎉", {
                  body: `Your order #${order.tokenNumber} is ready for pickup!`,
                  icon: "/favicon.ico",
                });
              }
            }
          });
        } else {
          setIsFirstLoad(false);
          // Request notification permission on first load
          if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
          }
        }

        // Store current statuses for next comparison
        const statusMap = new Map<string, string>();
        data.forEach((o: any) => statusMap.set(o.id, o.status));
        setPrevOrders(statusMap);

        data.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setOrders(data);
      },
      (error) => {
        console.error("Customer fetch error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/15 text-warning";
      case "preparing":
        return "bg-secondary/15 text-secondary";
      case "ready":
        return "bg-success/15 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3.5 h-3.5" />;
      case "preparing":
        return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      case "ready":
        return <CheckCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO — wild doodle style ===== */}
      <div className="relative overflow-hidden">
        <div className="bg-[hsl(var(--foreground))] px-4 pt-10 pb-20 relative">

          {/* scattered doodle emojis — chaotic grid */}
          {[
            { e: "🍕", t: 8, l: 75, s: 38, d: 0, dy: 12, r: 15 },
            { e: "🍔", t: 18, l: 88, s: 32, d: 0.4, dy: -10, r: -12 },
            { e: "🧃", t: 55, l: 82, s: 28, d: 0.9, dy: 8, r: 20 },
            { e: "☕", t: 38, l: 70, s: 24, d: 1.3, dy: -6, r: -8 },
            { e: "🍩", t: 12, l: 55, s: 22, d: 0.6, dy: 10, r: 10 },
            { e: "🌮", t: 50, l: 90, s: 26, d: 1.6, dy: -8, r: -15 },
            { e: "🍦", t: 30, l: 60, s: 20, d: 0.2, dy: 6, r: 12 },
            { e: "🥤", t: 65, l: 75, s: 24, d: 1.1, dy: -12, r: 8 },
            { e: "🍿", t: 5, l: 40, s: 20, d: 1.8, dy: 7, r: -6 },
            { e: "🧁", t: 45, l: 50, s: 18, d: 2.0, dy: -5, r: 10 },
          ].map((d, i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, d.dy, 0],
                rotate: [0, d.r, 0],
              }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: d.d }}
              className="absolute select-none pointer-events-none"
              style={{ top: `${d.t}%`, left: `${d.l}%`, fontSize: d.s, opacity: 0.15 + (i % 3) * 0.08 }}
            >
              {d.e}
            </motion.span>
          ))}

          {/* hand-drawn style circles */}
          <div className="absolute top-[-30px] right-[-40px] w-48 h-48 rounded-full border-[3px] border-dashed border-primary/20 rotate-12" />
          <div className="absolute bottom-10 left-[-20px] w-32 h-32 rounded-full border-[3px] border-dashed border-secondary/20 -rotate-6" />
          <div className="absolute top-20 left-[30%] w-16 h-16 rounded-full border-2 border-dotted border-primary-foreground/10" />

          {/* squiggly line doodle */}
          <svg className="absolute top-[70%] left-0 w-full opacity-10" height="20" viewBox="0 0 400 20">
            <path
              d="M0 10 Q10 0, 20 10 Q30 20, 40 10 Q50 0, 60 10 Q70 20, 80 10 Q90 0, 100 10 Q110 20, 120 10 Q130 0, 140 10 Q150 20, 160 10 Q170 0, 180 10 Q190 20, 200 10 Q210 0, 220 10 Q230 20, 240 10 Q250 0, 260 10 Q270 20, 280 10 Q290 0, 300 10 Q310 20, 320 10 Q330 0, 340 10 Q350 20, 360 10 Q370 0, 380 10 Q390 20, 400 10"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
          </svg>

          {/* Top bar */}
          <div className="flex items-center justify-between mb-5 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xl">☕</span>
              </div>
              <div>
                <h1 className="text-lg font-black text-primary-foreground leading-none tracking-tight">Java Quick Serve</h1>
                <p className="text-primary-foreground/40 text-[11px] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> SRM Kattankulathur
                </p>
              </div>
            </motion.div>
            <button
              onClick={() => { logout(); navigate("/role"); }}
              className="p-2.5 rounded-xl bg-primary-foreground/10 text-primary-foreground/60 hover:bg-primary-foreground/15 hover:text-primary-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Big greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative z-10 mb-7"
          >
            <h2 className="text-[28px] md:text-4xl font-black text-primary-foreground leading-[1.15]">
              What's on your<br />
              mind today? <motion.span
                animate={{ rotate: [0, 14, -14, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >🤔</motion.span>
            </h2>
          </motion.div>

          {/* Search Bar — floats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className={`relative transition-all duration-300 ${searchFocused ? "scale-[1.02]" : ""}`}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder='Search "dosa", "coffee", "noodles"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/customer/menu?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card text-foreground text-sm placeholder:text-muted-foreground/70 focus:outline-none shadow-elevated transition-all border-2 border-transparent focus:border-primary/30"
              />

              {/* Live search dropdown */}
              <AnimatePresence>
                {searchFocused && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl shadow-elevated overflow-hidden z-30 border border-border/50 max-h-80 overflow-y-auto"
                  >
                    {searchResults.length === 0 ? (
                      <div className="p-5 text-center">
                        <p className="text-sm text-muted-foreground">No matches for "{searchQuery}"</p>
                        <p className="text-[11px] text-muted-foreground/70 mt-1">Try "coffee" or "maggi"</p>
                      </div>
                    ) : (
                      searchResults.map((item: any) => (
                        <button
                          key={item.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            navigate(`/customer/menu?highlight=${item.id}`);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left transition-colors border-b border-border/30 last:border-0"
                        >
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              "🍽️"
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
                            <p className="text-[11px] text-muted-foreground">{item.category} · ₹{item.price}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Jagged wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path
              d="M0 50H1440V20C1440 20 1380 35 1300 25C1220 15 1140 5 1060 15C980 25 900 40 800 30C700 20 620 5 520 15C420 25 340 40 260 30C180 20 100 5 50 15C25 20 0 20 0 20V50Z"
              className="fill-background"
            />
          </svg>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="px-4 -mt-1 pb-8">

        {/* Quick Categories — bouncy icons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {quickCategories.map((cat, i) => (
              <motion.button
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, type: "spring", stiffness: 300 }}
                whileHover={{ y: -6, scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(`/customer/menu?category=${encodeURIComponent(cat.label)}`)}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                <div className="w-16 h-16 rounded-[20px] bg-card shadow-card flex items-center justify-center text-[28px] hover:shadow-card-hover transition-all duration-300 border border-border/50 relative overflow-hidden">
                  {/* subtle gradient accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                  <span className="relative z-10">{cat.icon}</span>
                </div>
                <span className="text-[11px] font-semibold text-foreground">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Restaurant Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2">
              <Flame className="w-5 h-5 text-destructive" />
              Popular Near You
            </h2>
            <span className="text-[10px] text-primary font-bold bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wide">
              1 open
            </span>
          </div>

          {/* Sunny Days Card — Zomato style */}
          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/customer/menu")}
            className="w-full text-left group"
          >
            <div className="bg-card rounded-[20px] shadow-card overflow-hidden hover:shadow-elevated transition-all duration-500 border border-border/30">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=300&fit=crop"
                  alt="Sunny Days Stall"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  loading="lazy"
                />
                {/* dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--foreground))] via-[hsl(var(--foreground))/40%] to-transparent" />

                {/* POPULAR badge - tilted */}
                <motion.div
                  initial={{ rotate: -3, opacity: 0 }}
                  animate={{ rotate: -3, opacity: 1 }}
                  className="absolute top-3 left-3"
                >
                  <span className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-elevated">
                    <Zap className="w-3 h-3" /> Popular
                  </span>
                </motion.div>

                {/* Rating pill */}
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-success text-success-foreground text-xs font-black shadow-sm">
                    <Star className="w-3 h-3 fill-current" /> 4.5
                  </span>
                </div>

                {/* Restaurant name over image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-black text-white mb-1 drop-shadow-lg">Sunny Days ☀️</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {["Multi-cuisine", "Snacks", "Coffee"].map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm text-white/90 text-[10px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom info */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1.5 text-foreground font-semibold text-xs">
                      <Clock className="w-3.5 h-3.5 text-success" />
                      10-15 min
                    </span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span className="text-muted-foreground text-xs">₹100 for two</span>
                  </div>
                  <motion.span
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-0.5 text-primary font-bold text-xs"
                  >
                    View Menu <ChevronRight className="w-4 h-4" />
                  </motion.span>
                </div>

                {/* Tags row */}
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                  {[
                    { emoji: "🌿", text: "Veg Options" },
                    { emoji: "⚡", text: "Quick Prep" },
                    { emoji: "💰", text: "Budget Friendly" },
                  ].map((t) => (
                    <span key={t.text} className="shrink-0 px-2.5 py-1 rounded-lg bg-muted text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                      {t.emoji} {t.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.button>

          {/* Coming soon — doodle style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-6 rounded-[20px] border-[3px] border-dashed border-border relative overflow-hidden"
          >
            <div className="absolute top-2 right-4 text-2xl opacity-20 rotate-12">✏️</div>
            <div className="text-center relative z-10">
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl block mb-2"
              >
                🚀
              </motion.span>
              <p className="text-sm font-bold text-foreground">More stalls dropping soon!</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">We're onboarding more campus food spots</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Active Orders */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
              📋 Active Orders
              <span className="text-[10px] text-primary-foreground bg-primary px-2 py-0.5 rounded-full font-black">
                {orders.length}
              </span>
            </h2>
            <div className="space-y-3">
              {orders.map((order: any, i: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="bg-card rounded-[20px] shadow-card p-4 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎟</span>
                      <span className="font-black text-foreground text-lg">#{order.tokenNumber}</span>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold capitalize ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1 border-t border-border pt-3">
                    {order.items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="text-foreground font-medium">× {item.qty}</span>
                      </div>
                    ))}
                  </div>

                  {order.totalAmount && (
                    <div className="border-t border-border mt-3 pt-3 flex justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-bold text-foreground">₹{order.totalAmount}</span>
                    </div>
                  )}

                  <div className="border-t border-border mt-3 pt-2">
                    <OrderTracker status={order.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-10 bg-card rounded-[20px] shadow-card border border-border/30"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl block mb-3"
            >
              🍽️
            </motion.span>
            <p className="text-foreground font-bold">No orders yet</p>
            <p className="text-muted-foreground text-xs mt-1">Tap on Sunny Days to start ordering!</p>
          </motion.div>
        )}
        <DeveloperWatermark />
      </div>
    </div>
  );
};

export default CustomerHome;
