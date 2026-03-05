import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Store } from "lucide-react";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        <span className="text-6xl block mb-4">☕</span>
        <h1 className="text-2xl font-black text-foreground mb-1">Java Quick Serve</h1>
        <p className="text-sm text-muted-foreground mb-10">How would you like to continue?</p>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/customer/login")}
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 text-left"
          >
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">I'm a Customer</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Order food from campus stalls</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/owner/login")}
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <Store className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">I'm a Stall Owner</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Manage your stall & orders</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
