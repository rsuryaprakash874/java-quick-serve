import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function OwnerMenuToggle() {
  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "menu"), (snap) => {
      setMenu(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const toggle = async (item: any) => {
    await updateDoc(doc(db, "menu", item.id), {
      available: !item.available,
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <h2 className="text-xl font-black text-foreground mb-6">Menu Availability 🍽️</h2>

      <div className="space-y-3">
        {menu.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between bg-card rounded-xl shadow-card p-4"
          >
            <span className="font-semibold text-foreground text-sm">{item.name}</span>
            <button
              onClick={() => toggle(item)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                item.available
                  ? "bg-success/15 text-success hover:bg-success/25"
                  : "bg-destructive/15 text-destructive hover:bg-destructive/25"
              }`}
            >
              {item.available ? "Enabled" : "Disabled"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
