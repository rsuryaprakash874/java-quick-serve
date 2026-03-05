import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-hero px-4 relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
      <div className="absolute bottom-[-15%] left-[-10%] w-80 h-80 rounded-full bg-primary-foreground/5 blur-3xl" />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center relative z-10"
      >
        <span className="text-8xl block mb-6">☕</span>
        <h1 className="text-4xl md:text-5xl font-black text-primary-foreground tracking-tight">
          Java Quick Serve
        </h1>
        <p className="text-primary-foreground/80 mt-3 text-base font-medium max-w-xs mx-auto">
          Order food from SRM Kattankulathur campus stalls
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-14 relative z-10"
      >
        <button
          onClick={() => navigate("/role")}
          className="px-12 py-4 rounded-2xl bg-card text-foreground font-bold text-base shadow-elevated hover:shadow-card-hover hover:scale-105 transition-all duration-300"
        >
          Get Started →
        </button>
      </motion.div>
    </div>
  );
}
