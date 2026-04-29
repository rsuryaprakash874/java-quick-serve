import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronDown, ArrowRight } from "lucide-react";
import DeveloperWatermark from "../components/DeveloperWatermark";
import MeshGradient from "../components/MeshGradient";
import OrbitingEmojis from "../components/OrbitingEmojis";
import RotatingTagline from "../components/RotatingTagline";

const TITLE = "Java Quick Serve";

const safeConfetti = (opts: confetti.Options) => {
  if (typeof document !== "undefined" && document.hidden) return;
  confetti(opts);
};

export default function Splash() {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => {
      safeConfetti({
        particleCount: 80,
        spread: 90,
        startVelocity: 35,
        origin: { y: 0.45 },
        colors: ["#E23744", "#FC8019", "#FFD93D", "#FF6B9D"],
      });
    }, 700);
    return () => clearTimeout(t);
  }, [reduce]);

  const go = () => {
    if (exiting) return;
    setExiting(true);
    safeConfetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    setTimeout(() => navigate("/role"), 450);
  };

  return (
    <motion.div
      animate={exiting ? { scale: 1.15, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeIn" }}
      onClick={go}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-[hsl(var(--foreground))] cursor-pointer"
    >
      <MeshGradient />

      {/* Orbiting food */}
      <div className="absolute inset-0 flex items-center justify-center">
        <OrbitingEmojis />
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-4">
        {/* Coffee + steam */}
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
          className="relative inline-block mb-4"
        >
          <span className="text-7xl block relative">☕</span>
          {!reduce && (
            <>
              <motion.span
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl"
                animate={{ y: [-2, -14, -2], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💨
              </motion.span>
              <motion.span
                className="absolute -top-2 left-1/3 text-xl"
                animate={{ y: [-2, -12, -2], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: 0.4 }}
              >
                💨
              </motion.span>
            </>
          )}
        </motion.div>

        {/* Letter stagger title */}
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight flex justify-center flex-wrap">
          {TITLE.split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: 40, opacity: 0, rotate: -12 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.4 + i * 0.05, type: "spring", stiffness: 260 }}
              className="inline-block"
              style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        {/* Animated underline */}
        <svg width="220" height="14" viewBox="0 0 220 14" className="mx-auto mt-1">
          <motion.path
            d="M5 8 Q55 0, 110 8 T215 8"
            stroke="hsl(27 97% 55%)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
          />
        </svg>

        {/* Rotating tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-5 text-white/85 text-sm md:text-base font-medium"
        >
          <RotatingTagline
            taglines={[
              "SRM's fastest food app ⚡",
              "Skip the queue 🏃‍♂️",
              "Hot food, zero wait 🔥",
              "Tap. Pay. Eat. 🍽️",
            ]}
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          className="mt-10 relative inline-block"
        >
          {/* breathing halo */}
          {!reduce && (
            <motion.div
              className="absolute inset-0 rounded-2xl blur-2xl gradient-primary"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
          )}
          <motion.button
            onClick={(e) => { e.stopPropagation(); go(); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-10 py-4 rounded-2xl gradient-primary text-primary-foreground font-black text-base shadow-elevated flex items-center gap-2 group"
          >
            <span className="relative">Get Started</span>
            <motion.span
              className="relative"
              animate={reduce ? undefined : { x: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* tap hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
          className="mt-8 text-white/50 text-xs flex items-center justify-center gap-1"
        >
          <span>tap anywhere to continue</span>
          <motion.span animate={reduce ? undefined : { y: [0, 4, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
        </motion.div>
      </div>

      <DeveloperWatermark />
    </motion.div>
  );
}