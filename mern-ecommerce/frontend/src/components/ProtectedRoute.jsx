import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner size="lg" />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === "seller" ? "/seller/products" : "/";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
