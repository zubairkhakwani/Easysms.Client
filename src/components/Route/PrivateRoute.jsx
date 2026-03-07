import { Navigate, Outlet } from "react-router-dom";
import TokenService from "../../services/Token/TokenService";

const PrivateRoute = ({ requireAdmin = false }) => {
  const isAuthenticated = TokenService.isAuthenticated();
  const isAdminUser = TokenService.isAdminUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdminUser) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
