import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RotatingTagline({
  taglines,
  className = "",
  interval = 3000,
}: {
  taglines: string[];
  className?: string;
  interval?: number;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % taglines.length), interval);
    return () => clearInterval(t);
  }, [taglines.length, interval]);

  return (
    <div className={`relative h-7 overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {taglines[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
