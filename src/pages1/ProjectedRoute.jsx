import React from "react";
import { Navigate } from "react-router-dom";

// Simple JWT decode (no validation of signature, just payload parsing)
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch (e) {
    return null;
  }
}

export default function ProtectedRoute({ children }) {
  const access = localStorage.getItem("access");
  if (!access) return <Navigate to="/" replace />;
  const payload = decodeJWT(access);
  // Check for expiration (exp is in seconds)
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    return <Navigate to="/" replace />;
  }
  return children;
}
