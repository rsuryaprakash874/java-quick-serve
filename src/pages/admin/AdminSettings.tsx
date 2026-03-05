import React, { useState } from "react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    restaurantName: "Java Food Hub",
    email: "admin@javafoodhub.com",
    phone: "+91 98765 43210",
    address: "MG Road, Bangalore, Karnataka",
    gst: "29AABCT1332L1ZM",
    deliveryRadius: "10",
    minOrder: "100",
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-bold text-foreground mb-4">Settings</h2>
      <div className="bg-card rounded-xl shadow-card p-6 space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-foreground mb-1.5 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </label>
            <input
              value={value}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ))}
        <button onClick={handleSave} className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-bold text-sm shadow-elevated hover:opacity-95 transition-opacity">
          Save Settings
        </button>
      </div>
    </div>
  );
}
