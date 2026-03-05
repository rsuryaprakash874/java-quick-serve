import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/role" replace />;
  if (requireAdmin && user.role !== "owner") return <Navigate to="/" replace />;

  return <>{children}</>;
}
