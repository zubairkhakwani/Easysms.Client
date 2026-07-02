import { AdminPage } from "../../../Helper/AdminPage/AdminPage";
import IpReplacementLedger from "./IpReplacementLedger";
import "../Management/User/UserManagement.css";

export default function AdminIpReplacementLedger() {
  return (
    <AdminPage
      title="IP Replacement Ledger"
      subTitle="Track proxy IP replacement requests across the platform"
    >
      <IpReplacementLedger />
    </AdminPage>
  );
}
