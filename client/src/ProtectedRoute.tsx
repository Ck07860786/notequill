import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const email = localStorage.getItem("userEmail");

  if (!email) {
    // Not authenticated
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
