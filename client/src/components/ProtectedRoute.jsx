// client/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  // Basic protection: require token. For stronger protection, call backend /api/auth/me to validate token.
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
