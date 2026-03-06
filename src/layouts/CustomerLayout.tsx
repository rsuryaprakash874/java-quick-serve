import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">🍜 JAVA QUICK SERVE</h4>
              <p className="text-sm text-muted-foreground">Your campus canteen, now on your phone.</p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-3 text-sm">Company</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Blog</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-3 text-sm">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">FAQs</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-3 text-sm">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © 2026 Java Quick Serve. Developed by Surya • Allen • Abhilash. all rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
