import ProxyHistory from "../../../Order/ProxyHistory/ProxyHistory";
import { getAllActiveProxies } from "../../../../services/Proxy/ProxyService";
import "../Management/User/UserManagement.css";

export default function AdminActiveProxies() {
  return (
    <ProxyHistory
      fetchActiveProxies={getAllActiveProxies}
      pageTitle="Active Proxies"
      pageSubtitle="View all active proxies across the platform"
    />
  );
}
