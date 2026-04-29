import { motion, useReducedMotion } from "framer-motion";

// Single rotating ring, 4 emojis, no nested counter-rotation. Cheap on GPU.
const items = [
  { e: "🥨", r: 150, angle: 0 },
  { e: "☕", r: 150, angle: 90 },
  { e: "🍔", r: 150, angle: 180 },
  { e: "🍩", r: 150, angle: 270 },
];

export default function OrbitingEmojis() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ contain: "layout paint" as any }}
    >
      <motion.div
        className="relative"
        style={{
          width: 300,
          height: 300,
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        {items.map((it, i) => {
          const rad = (it.angle * Math.PI) / 180;
          const x = Math.cos(rad) * it.r;
          const y = Math.sin(rad) * it.r;
          return (
            <span
              key={i}
              className="absolute text-3xl select-none"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(${x - 16}px, ${y - 16}px)`,
                textShadow: "0 2px 6px rgba(0,0,0,0.35)",
              }}
            >
              {it.e}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}