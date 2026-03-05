import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Eye, EyeOff, Store, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function OwnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      login(res.user, "owner");
      navigate("/owner/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", res.user.uid), {
        email: res.user.email,
        role: "owner",
      });
      login(res.user, "owner");
      navigate("/owner/dashboard");
    } catch (err) {
      setError("Registration failed. Password must be at least 6 characters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <button
          onClick={() => navigate("/role")}
          className="flex items-center gap-1.5 text-muted-foreground text-sm mb-8 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-3">
            <Store className="w-7 h-7 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Stall Owner Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your stall on Java Quick Serve</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email"
              placeholder="owner@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 pr-10 transition-shadow"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive font-medium bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </motion.p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-accent text-accent-foreground rounded-xl py-3.5 font-bold text-sm shadow-elevated hover:opacity-95 transition-opacity disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-card border-2 border-accent text-accent rounded-xl py-3.5 font-bold text-sm hover:bg-accent/5 transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
