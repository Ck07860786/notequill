import React from "react"; // ✅ Add this line
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const email = localStorage.getItem("userEmail");

  if (!email) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
