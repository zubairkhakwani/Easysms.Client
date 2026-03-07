import { Navigate, Outlet } from "react-router-dom";
import {
  isAdminUser,
  isAuthenticated,
} from "../../services/User/CurrentUserService";

const PrivateRoute = ({ requireAdmin = false }) => {
  const isAuth = isAuthenticated();
  const isAdmin = isAdminUser();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
