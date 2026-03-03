import RecentOrders from "../RecentOrder/RecentOrders";
import RequestNumber from "../Form/RequestNumberForm";
import RequestNumberContainerHeader from "../Header/RequestNumberHeader";
import RequestNumberGuideline from "../Guideline/RequestNumberGuideline";

import "./RequestNumberContainer.css";

export default function RequestNumberContainer() {
  return (
    <>
      <RequestNumberContainerHeader />
      <div className="grid">
        <RequestNumberGuideline />
        <RequestNumber />
        <RecentOrders />
      </div>
    </>
  );
}
