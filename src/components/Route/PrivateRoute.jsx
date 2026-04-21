import { Navigate, Outlet } from "react-router-dom";

import {
  isAuthenticatedUser,
  isAuthorizedUser,
  getRolePermissions,
} from "../../services/Auth/AuthService";

const PrivateRoute = ({
  requireAuthorized = false,
  requiredPermissions = [],
}) => {
  const isAuthenticated = isAuthenticatedUser();
  const isAuthorized = isAuthorizedUser();
  const permissions = getRolePermissions();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAuthorized && !isAuthorized) {
    return <Navigate to="*" />; //This path does not exist so we end up in no page found and thats what we need.
  }
  if (
    requiredPermissions.length > 0 &&
    !requiredPermissions.every((p) => permissions.includes(p))
  ) {
    return <Navigate to="*" />; //This path does not exist so we end up in no page found and thats what we need.
  }

  return <Outlet />;
};

export default PrivateRoute;
