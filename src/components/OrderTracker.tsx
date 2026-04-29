import { motion } from "framer-motion";
import { ShoppingBag, ChefHat, CheckCircle, Bell } from "lucide-react";

const steps = [
  { id: "pending", label: "Placed", Icon: ShoppingBag },
  { id: "preparing", label: "Cooking", Icon: ChefHat },
  { id: "ready", label: "Ready", Icon: Bell },
  { id: "sold", label: "Picked", Icon: CheckCircle },
];

const order = ["pending", "preparing", "ready", "sold"];

export default function OrderTracker({ status }: { status: string }) {
  const idx = Math.max(0, order.indexOf(status));
  const pct = (idx / (steps.length - 1)) * 100;

  return (
    <div className="px-1 py-2">
      <div className="relative">
        <div className="absolute top-4 left-4 right-4 h-1 bg-muted rounded-full" />
        <motion.div
          className="absolute top-4 left-4 h-1 gradient-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `calc(${pct}% - ${pct === 0 ? 0 : 32}px)` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ maxWidth: "calc(100% - 32px)" }}
        />
        <div className="relative flex justify-between">
          {steps.map((s, i) => {
            const active = i <= idx;
            const current = i === idx;
            return (
              <div key={s.id} className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={current ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 1.4, repeat: current ? Infinity : 0 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    active ? "gradient-primary text-primary-foreground shadow-elevated" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <s.Icon className="w-4 h-4" />
                </motion.div>
                <span className={`text-[10px] font-bold ${active ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
