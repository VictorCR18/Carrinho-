import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

import type { ProtectedRouteProps } from "../../../types/types";

export function ProtectedRoute({
  children,
  onlyAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (onlyAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
