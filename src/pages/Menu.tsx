import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import DeveloperWatermark from "../components/DeveloperWatermark";
import { ArrowLeft, Plus, Minus, ShoppingBag, Star, Clock, MapPin, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useStallSettings } from "../hooks/useStallSettings";
import { Copy, Download, Smartphone } from "lucide-react";
import { toast } from "sonner";

const Menu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings: stallSettings } = useStallSettings();

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<{ token: number; total: number } | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [liveOrder, setLiveOrder] = useState<any | null>(null);
  const [upiRef, setUpiRef] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const highlightId = searchParams.get("highlight");

  // Sync search to URL
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (searchQuery) next.set("search", searchQuery);
    else next.delete("search");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Scroll to highlighted item
  useEffect(() => {
    if (!highlightId || menuItems.length === 0) return;
    const t = setTimeout(() => {
      const el = document.getElementById(`menu-item-${highlightId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary", "ring-offset-2");
        setTimeout(() => el.classList.remove("ring-2", "ring-primary", "ring-offset-2"), 2400);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [highlightId, menuItems]);

  // Live order subscription (for payment status updates from owner)
  useEffect(() => {
    if (!orderId) return;
    const unsub = onSnapshot(doc(db, "orders", orderId), (snap) => {
      if (snap.exists()) setLiveOrder({ id: snap.id, ...snap.data() });
    });
    return () => unsub();
  }, [orderId]);

  const submitUpiRef = async () => {
    if (!orderId) return;
    if (!upiRef.trim() || upiRef.trim().length < 6) {
      alert("Please enter a valid UPI transaction reference (min 6 chars)");
      return;
    }
    try {
      setSubmittingPayment(true);
      await updateDoc(doc(db, "orders", orderId), {
        status: "payment_submitted",
        paymentRef: upiRef.trim(),
        paidAt: serverTimestamp(),
      });
    } catch (e) {
      console.error(e);
      alert("Failed to submit. Try again.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  // ================= FETCH MENU =================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "menuItems"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenuItems(items);
    });

    return () => unsub();
  }, []);

  // ================= ADD TO CART =================
  const addToCart = (item: any) => {
    if ("vibrate" in navigator) navigator.vibrate(15);
    // brief accent ring on the card
    const el = document.getElementById(`menu-item-${item.id}`);
    if (el) {
      el.classList.add("ring-2", "ring-accent", "ring-offset-2");
      setTimeout(() => el.classList.remove("ring-2", "ring-accent", "ring-offset-2"), 600);
    }
    const existing = cart.find((i) => i.id === item.id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // ================= REMOVE FROM CART =================
  const removeFromCart = (item: any) => {
    const existing = cart.find((i) => i.id === item.id);
    if (!existing) return;

    if (existing.qty === 1) {
      setCart(cart.filter((i) => i.id !== item.id));
    } else {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty - 1 } : i
        )
      );
    }
  };

  // ================= TOTAL =================
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // ================= PLACE ORDER =================
  const placeOrder = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);

      const tokenNumber = Math.floor(1000 + Math.random() * 9000);

      const ref = await addDoc(collection(db, "orders"), {
        tokenNumber,
        status: "awaiting_payment",
        paymentMethod: "upi",
        items: cart,
        customerId: user.uid,
        customerEmail: user.email,
        totalAmount,
        createdAt: serverTimestamp(),
      });

      setOrderPlaced({ token: tokenNumber, total: totalAmount });
      setOrderId(ref.id);
      setCart([]);
      setShowCart(false);

      // Celebration!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#E23744", "#FC8019", "#FFD93D", "#4ade80"],
      });
      if ("vibrate" in navigator) navigator.vibrate(200);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // ================= GROUP BY CATEGORY =================
  const filteredItems = menuItems
    .filter((item) => item.available === true)
    .filter((item) =>
      !selectedCategory ||
      (item.category || "").toLowerCase() === selectedCategory.toLowerCase()
    )
    .filter((item) =>
      searchQuery === "" ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const allCategories = Array.from(
    new Set(menuItems.filter((i) => i.available).map((i) => i.category || "Others"))
  );

  const grouped = filteredItems.reduce((acc: any, item: any) => {
    const category = item.category || "Others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const getCartQty = (itemId: string) => {
    return cart.find((i) => i.id === itemId)?.qty || 0;
  };

  // ================= UPI PAYMENT SCREEN =================
  if (orderPlaced) {
    const upiId = stallSettings?.upiId || "";
    const stallName = stallSettings?.stallName || "Java Quick Serve";
    const qrUrl = stallSettings?.qrImageUrl || "";
    const upiDeepLink = upiId
      ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(stallName)}&am=${orderPlaced.total}&cu=INR&tn=${encodeURIComponent("Order #" + orderPlaced.token)}`
      : "";

    const copyUpi = async () => {
      if (!upiId) return;
      try {
        await navigator.clipboard.writeText(upiId);
        toast.success("UPI ID copied!");
      } catch {
        toast.error("Couldn't copy");
      }
    };

    const downloadQr = async () => {
      if (!qrUrl) return;
      try {
        const res = await fetch(qrUrl);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${stallName.replace(/\s+/g, "-")}-UPI-QR.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success("QR downloaded");
      } catch {
        toast.error("Download failed");
      }
    };

    return (
      <div className="min-h-screen bg-background">
        <div className="gradient-hero px-4 pt-12 pb-8">
          <h1 className="text-2xl font-black text-primary-foreground">Payment ✅</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">Complete your payment via UPI</p>
        </div>

        <div className="px-4 -mt-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-card p-6 text-center"
          >
            {/* Token */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Your Token Number</p>
              <p className="text-5xl font-black text-primary">#{orderPlaced.token}</p>
            </div>

            {/* Amount */}
            <div className="mb-6 p-4 rounded-xl bg-muted">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-3xl font-black text-foreground">₹{orderPlaced.total}</p>
            </div>

            {/* UPI QR */}
            <div className="mb-4">
              <div className="w-52 h-52 mx-auto bg-white rounded-2xl flex items-center justify-center mb-3 p-3 shadow-card">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt={`${stallName} UPI QR`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-4xl block mb-2">☕</span>
                    <p className="text-xs text-muted-foreground">QR not set up yet</p>
                  </div>
                )}
              </div>

              {upiId ? (
                <button
                  onClick={copyUpi}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-border transition-colors"
                >
                  <span className="text-sm font-mono font-bold text-foreground">{upiId}</span>
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              ) : (
                <p className="text-xs text-muted-foreground">UPI ID not configured</p>
              )}
            </div>

            {/* Quick payment actions */}
            {(qrUrl || upiId) && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {upiId && (
                  <a
                    href={upiDeepLink}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl gradient-primary text-primary-foreground font-bold text-sm shadow-elevated"
                  >
                    <Smartphone className="w-4 h-4" />
                    Pay in UPI App
                  </a>
                )}
                {qrUrl && (
                  <button
                    onClick={downloadQr}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-muted text-foreground font-bold text-sm hover:bg-border transition-colors ${
                      upiId ? "" : "col-span-2"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Download QR
                  </button>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground leading-relaxed">
                Scan the QR or tap <strong>Pay in UPI App</strong>, complete the payment, then paste the UPI Txn ID below so the stall can confirm it.
              </p>
            </div>

            {/* Live status banner */}
            {liveOrder?.status === "payment_submitted" && (
              <div className="mb-4 p-3 rounded-xl bg-warning/10 text-warning text-sm font-bold border border-warning/30">
                ⏳ Waiting for owner to confirm payment…
              </div>
            )}
            {liveOrder?.status === "paid" || liveOrder?.status === "preparing" ? (
              <div className="mb-4 p-3 rounded-xl bg-success/10 text-success text-sm font-bold border border-success/30">
                ✅ Payment confirmed! Order is being prepared.
              </div>
            ) : null}
            {liveOrder?.status === "payment_failed" && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-bold border border-destructive/30">
                ❌ Owner couldn't verify your payment. Please retry.
              </div>
            )}

            {/* UPI ref input — only when awaiting / failed */}
            {(!liveOrder || liveOrder.status === "awaiting_payment" || liveOrder.status === "payment_failed") && (
              <>
                <input
                  type="text"
                  value={upiRef}
                  onChange={(e) => setUpiRef(e.target.value)}
                  placeholder="Enter UPI Txn ID (e.g. 123456789012)"
                  className="w-full mb-3 px-4 py-3 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  onClick={submitUpiRef}
                  disabled={submittingPayment}
                  className="w-full gradient-primary text-primary-foreground rounded-xl py-3.5 font-bold text-sm shadow-elevated hover:opacity-95 transition-opacity mb-3 disabled:opacity-60"
                >
                  {submittingPayment ? "Submitting…" : "✅ I Have Paid — Submit"}
                </button>
              </>
            )}
            <button
              onClick={() => navigate("/customer/home")}
              className="w-full bg-muted text-foreground rounded-xl py-3 font-bold text-sm hover:bg-border transition-colors"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Restaurant Banner */}
      <div className="relative">
        <div className="h-48 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=300&fit=crop"
            alt="Sunny Days"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        </div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-black text-primary-foreground">Sunny Days</h1>
          <p className="text-xs text-primary-foreground/80 mt-0.5">Multi-cuisine • Snacks • Beverages</p>
        </div>
      </div>

      {/* Restaurant Info Bar */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-success text-success-foreground font-bold text-xs">
            <Star className="w-3 h-3 fill-current" /> 4.5
          </span>
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock className="w-3.5 h-3.5" /> 10-15 min
          </span>
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <MapPin className="w-3.5 h-3.5" /> Java Block
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Category pills */}
      {allCategories.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                !selectedCategory
                  ? "gradient-primary text-primary-foreground shadow-elevated scale-105"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              All
            </button>
            {allCategories.map((cat) => {
              const active = selectedCategory?.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(active ? null : cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active
                      ? "gradient-primary text-primary-foreground shadow-elevated scale-105"
                      : "bg-muted text-muted-foreground hover:bg-border"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu Content */}
      <div className="px-4 pb-28">
        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-16 bg-card rounded-2xl shadow-card">
            <span className="text-5xl block mb-3">🍽️</span>
            <p className="text-muted-foreground text-sm">
              {searchQuery
                ? `No items match "${searchQuery}".`
                : selectedCategory
                ? `No ${selectedCategory} available right now 😔`
                : "No menu items available."}
            </p>
          </div>
        )}

        {Object.entries(grouped).map(([category, items]: [string, any]) => (
          <div key={category} className="mb-6">
            <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full gradient-primary inline-block" />
              {category}
              <span className="text-xs text-muted-foreground font-normal ml-1">({items.length})</span>
            </h2>

            <div className="bg-card rounded-2xl shadow-card overflow-hidden divide-y divide-border">
              {items.map((item: any) => {
                const qty = getCartQty(item.id);

                return (
                  <motion.div
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 transition-shadow rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={item.type === "veg" ? "veg-indicator" : "nonveg-indicator"} />
                      </div>
                      <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
                      <p className="text-sm font-bold text-foreground mt-0.5">₹{item.price}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.description}</p>
                      )}
                    </div>

                    {/* Item image if available */}
                    {item.image && (
                      <div className="shrink-0 mx-3">
                        <img src={item.image} alt={item.name} className="w-20 h-16 object-cover rounded-lg" loading="lazy" />
                      </div>
                    )}

                    <div className="shrink-0">
                      {qty === 0 ? (
                        <motion.button
                          layout
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToCart(item)}
                          className="px-5 py-1.5 rounded-lg border-2 border-primary text-primary text-sm font-bold font-cartoon hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          ADD
                        </motion.button>
                      ) : (
                        <motion.div
                          layout
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 380, damping: 22 }}
                          className="flex items-center gap-0 rounded-lg overflow-hidden bg-primary shadow-card"
                        >
                          <button
                            onClick={() => removeFromCart(item)}
                            className="px-2.5 py-1.5 text-primary-foreground hover:opacity-80"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <motion.span
                            key={qty}
                            initial={{ scale: 1.4, y: -4 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 18 }}
                            className="px-3 py-1.5 text-sm font-black text-primary-foreground min-w-[28px] text-center"
                          >
                            {qty}
                          </motion.span>
                          <button
                            onClick={() => addToCart(item)}
                            className="px-2.5 py-1.5 text-primary-foreground hover:opacity-80"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Bar */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 p-4 z-50"
          >
            <button
              onClick={() => setShowCart(!showCart)}
              className="w-full gradient-primary text-primary-foreground rounded-2xl p-4 shadow-elevated flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-foreground/20 rounded-lg p-1.5">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">{totalItems} item{totalItems > 1 ? "s" : ""}</span>
              </div>
              <span className="font-black text-lg">₹{totalAmount}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sheet */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-black text-foreground mb-4">Your Order 🛒</h3>

                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={item.type === "veg" ? "veg-indicator" : "nonveg-indicator"} />
                          <p className="font-semibold text-foreground text-sm">{item.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">₹{item.price} × {item.qty} = ₹{item.price * item.qty}</p>
                      </div>
                      <div className="flex items-center gap-0 rounded-lg overflow-hidden bg-primary">
                        <button onClick={() => removeFromCart(item)} className="px-2 py-1.5 text-primary-foreground">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-1.5 text-xs font-bold text-primary-foreground">{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="px-2 py-1.5 text-primary-foreground">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-medium">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-foreground pt-2 border-t border-border">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={placingOrder}
                  className="w-full gradient-primary text-primary-foreground rounded-xl py-3.5 font-bold text-sm shadow-elevated disabled:opacity-60 transition-opacity"
                >
                  {placingOrder ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Placing Order...
                    </span>
                  ) : (
                    `Place Order — ₹${totalAmount}`
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <DeveloperWatermark />
    </div>
  );
};

export default Menu;