import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, Send } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const types = [
  { id: "bug", label: "🐛 Bug", color: "bg-destructive/10 text-destructive" },
  { id: "suggestion", label: "💡 Suggestion", color: "bg-secondary/10 text-secondary" },
  { id: "compliment", label: "❤️ Compliment", color: "bg-primary/10 text-primary" },
];

export default function AppFeedbackButton() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!message.trim()) {
      toast.error("Please type your feedback first");
      return;
    }
    try {
      setSending(true);
      await addDoc(collection(db, "appFeedback"), {
        type,
        message: message.trim(),
        email: email.trim() || user?.email || null,
        userId: user?.uid || null,
        route: window.location.pathname,
        userAgent: navigator.userAgent,
        createdAt: serverTimestamp(),
      });
      toast.success("Thanks! Your feedback was sent 💛");
      setMessage("");
      setEmail("");
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't send feedback. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: -8 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full gradient-primary shadow-elevated flex items-center justify-center text-primary-foreground"
        aria-label="Send feedback"
      >
        <Lightbulb className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[380px] z-50 bg-card rounded-3xl shadow-elevated p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-foreground text-lg">Send us feedback 💬</h3>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2 mb-3">
                {types.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      type === t.id ? `${t.color} ring-2 ring-current` : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3 resize-none"
              />

              {!user && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email (optional)"
                  className="w-full px-3 py-2.5 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
                />
              )}

              <button
                onClick={submit}
                disabled={sending}
                className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-bold text-sm shadow-elevated disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {sending ? "Sending..." : (<><Send className="w-4 h-4" /> Send feedback</>)}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
