import { Navigate, Outlet } from "react-router-dom";
import TokenService from "../../services/Token/TokenService";

const PrivateRoute = () => {
  return TokenService.isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
