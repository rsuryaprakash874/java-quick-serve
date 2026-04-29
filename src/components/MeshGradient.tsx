import { motion, useReducedMotion } from "framer-motion";

// Lightweight: 2 GPU-accelerated blobs, transform-only animation.
const blobs = [
  { color: "hsl(30 100% 55%)", size: 520, x: "5%", y: "10%", dur: 24 },
  { color: "hsl(38 84% 54%)", size: 480, x: "65%", y: "60%", dur: 28 },
];

export default function MeshGradient({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-2xl opacity-70"
          style={{
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            background: b.color,
            willChange: "transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
          animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
        />
      ))}
    </div>
  );
}