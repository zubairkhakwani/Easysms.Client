import { Navigate, useLocation } from "react-router-dom";

export default function TopUpInstantRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/topup${search}`} replace />;
}
