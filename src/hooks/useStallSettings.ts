import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export type StallSettings = {
  stallId: string;
  stallName?: string;
  upiId?: string;
  qrImageUrl?: string;
};

const DEFAULT_STALL_ID = "sunnydays";

export function useStallSettings(stallId: string = DEFAULT_STALL_ID) {
  const [settings, setSettings] = useState<StallSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "stallSettings", stallId),
      (snap) => {
        if (snap.exists()) {
          setSettings({ stallId, ...(snap.data() as any) });
        } else {
          setSettings({ stallId });
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [stallId]);

  return { settings, loading };
}