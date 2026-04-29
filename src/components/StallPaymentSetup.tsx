import { useEffect, useRef, useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import { useStallSettings } from "../hooks/useStallSettings";
import { Upload, Save, Trash2, Loader2, CheckCircle, QrCode } from "lucide-react";
import { toast } from "sonner";

const STALL_ID = "sunnydays";
const UPI_REGEX = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/;

export default function StallPaymentSetup() {
  const { settings } = useStallSettings(STALL_ID);
  const [upiId, setUpiId] = useState("");
  const [stallName, setStallName] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setUpiId(settings.upiId || "");
      setStallName(settings.stallName || "Sunny Days");
      setPreview(settings.qrImageUrl || "");
    }
  }, [settings]);

  const onPick = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      toast.error("Max file size is 2MB");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(String(e.target?.result || ""));
    reader.readAsDataURL(f);
  };

  const save = async () => {
    if (!UPI_REGEX.test(upiId.trim())) {
      toast.error("Enter a valid UPI ID (e.g. yourname@oksbi)");
      return;
    }
    try {
      setSaving(true);
      let qrImageUrl = settings?.qrImageUrl || "";
      if (file) {
        const ext = file.name.split(".").pop() || "png";
        const ref = storageRef(storage, `stalls/${STALL_ID}/qr.${ext}`);
        await uploadBytes(ref, file);
        qrImageUrl = await getDownloadURL(ref);
      }
      await setDoc(
        doc(db, "stallSettings", STALL_ID),
        {
          stallId: STALL_ID,
          stallName: stallName.trim() || "Sunny Days",
          upiId: upiId.trim(),
          qrImageUrl,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setFile(null);
      toast.success("Payment settings saved!");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const removeQr = async () => {
    if (!settings?.qrImageUrl) {
      setPreview("");
      setFile(null);
      return;
    }
    try {
      setRemoving(true);
      // Best-effort delete from storage
      try {
        const url = new URL(settings.qrImageUrl);
        const pathMatch = decodeURIComponent(url.pathname).match(/o\/(.+)$/);
        if (pathMatch) await deleteObject(storageRef(storage, pathMatch[1]));
      } catch {}
      await setDoc(
        doc(db, "stallSettings", STALL_ID),
        { qrImageUrl: "", updatedAt: serverTimestamp() },
        { merge: true }
      );
      setPreview("");
      setFile(null);
      toast.success("QR removed");
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove QR");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-card p-5 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="w-5 h-5 text-primary" />
        <h3 className="font-black text-foreground text-base">My UPI Setup</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Customers will see your UPI ID and QR code on the payment screen.
      </p>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Stall Name
          </label>
          <input
            value={stallName}
            onChange={(e) => setStallName(e.target.value)}
            placeholder="Sunny Days"
            className="w-full mt-1 px-3 py-2.5 rounded-xl bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            UPI ID
          </label>
          <input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@oksbi"
            className="w-full mt-1 px-3 py-2.5 rounded-xl bg-muted text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {upiId && !UPI_REGEX.test(upiId.trim()) && (
            <p className="text-[11px] text-destructive mt-1">Format: name@bank</p>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            QR Code Image
          </label>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onPick(e.dataTransfer.files?.[0] || null);
            }}
            className="mt-1 border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors"
          >
            {preview ? (
              <div className="flex flex-col items-center">
                <img
                  src={preview}
                  alt="QR preview"
                  className="w-40 h-40 object-contain rounded-lg bg-white p-2"
                />
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-success" />
                  {file ? "New QR ready to save" : "Current QR"}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Click or drop QR image</p>
                <p className="text-xs text-muted-foreground mt-1">PNG/JPG, max 2MB</p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPick(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {(preview || settings?.qrImageUrl) && (
            <button
              onClick={removeQr}
              disabled={removing}
              className="py-2.5 rounded-xl bg-destructive/15 text-destructive font-bold text-sm hover:bg-destructive/25 disabled:opacity-60 flex items-center justify-center gap-1.5"
            >
              {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Remove QR
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className={`py-2.5 rounded-xl gradient-primary text-primary-foreground font-bold text-sm shadow-elevated disabled:opacity-60 flex items-center justify-center gap-1.5 ${
              preview || settings?.qrImageUrl ? "" : "col-span-2"
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}