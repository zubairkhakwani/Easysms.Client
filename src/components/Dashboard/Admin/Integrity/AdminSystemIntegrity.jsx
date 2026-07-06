import { AdminPage } from "../../../Helper/AdminPage/AdminPage";
import SystemIntegrity from "./SystemIntegrity";

export default function AdminSystemIntegrity() {
  return (
    <AdminPage
      title="System Integrity"
      subTitle="Monitor platform data consistency and detect financial or operational drift"
    >
      <SystemIntegrity />
    </AdminPage>
  );
}
