import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ClipboardList, UtensilsCrossed, PlusCircle, BarChart3, Settings, LogOut, Menu, X, ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Orders", icon: ClipboardList, path: "/admin/orders" },
  { label: "Menu Management", icon: UtensilsCrossed, path: "/admin/menu" },
  { label: "Add Item", icon: PlusCircle, path: "/admin/add-item" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-border">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl">🍜</span>
            <span className="font-bold text-gradient text-lg">JFH Admin</span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
        <button onClick={() => setMobileOpen(false)} className="md:hidden p-1.5">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive(item.path)
                ? "gradient-primary text-primary-foreground shadow-elevated"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mb-1"
          onClick={() => setMobileOpen(false)}
        >
          <ChevronLeft className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </Link>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 md:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 border-b border-border bg-card/95 backdrop-blur-md md:px-6">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-1.5 rounded-lg hover:bg-muted">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-foreground text-lg">
            {sidebarItems.find((i) => isActive(i.path))?.label || "Admin"}
          </h2>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
