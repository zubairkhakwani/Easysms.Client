import { useEffect, useState, useContext } from "react";
import { SmsContext } from "../../../context/SmsContext";
import { getMyRecentNumbers } from "../../../services/Number/NumberService";
import RecentOrders from "../RecentOrder/RecentOrders";
import RequestNumber from "../Form/RequestNumberForm";
import RequestNumberContainerHeader from "../Header/RequestNumberHeader";
import RequestNumberGuideline from "../Guideline/RequestNumberGuideline";
import "./RequestNumberContainer.css";

export default function RequestNumberContainer() {
  const [recentOrders, setRecentOrders] = useState([]);
  const { latestSms } = useContext(SmsContext);

  const addNewNumber = (newNumber) => {
    setRecentOrders((prev) => [newNumber, ...prev]);
  };

  const cancelNumber = (activationIid) => {
    setRecentOrders((prev) =>
      prev.filter((order) => order.activationId !== activationIid),
    );
  };

  useEffect(() => {
    const fetchMyRecentNumbers = async () => {
      try {
        const res = await getMyRecentNumbers();
        setRecentOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch recent numbers:", error);
      }
    };
    fetchMyRecentNumbers();
  }, []);

  useEffect(() => {
    if (!latestSms) return;

    setRecentOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.activationId === latestSms.activationId) {
          return {
            ...order,
            hasSms: true, 
            code: latestSms.code,
            text: latestSms.text,
          };
        }
        return order;
      }),
    );
  }, [latestSms]);

  return (
    <>
      <RequestNumberContainerHeader />
      <div className="grid">
        <RequestNumberGuideline />
        <RequestNumber onNewNumber={addNewNumber} />
        <RecentOrders
          incomingOrders={recentOrders}
          onCancelNumber={cancelNumber}
        />
      </div>
    </>
  );
}
