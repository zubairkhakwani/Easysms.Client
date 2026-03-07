//React
import { useEffect, useState, useContext } from "react";

//Context
import { SmsContext } from "../../../context/SmsContext";

//Components
import RecentOrders from "../RecentOrder/RecentOrders";
import RequestNumber from "../Form/RequestNumberForm";

//Services
import { getMyRecentNumbers } from "../../../services/Number/NumberService";
import RequestNumberContainerHeader from "../Header/RequestNumberHeader";
import RequestNumberGuideline from "../Guideline/RequestNumberGuideline";
import { connectSignalR } from "../../../services/SignalR/SignalRService";
import { getCurrentUser } from "../../../services/User/CurrentUserService";

//Css
import "./RequestNumberContainer.css";

export default function RequestNumberContainer() {
  const { latestSms, addSms } = useContext(SmsContext);
  const [recentOrders, setRecentOrders] = useState([]);

  const addNewNumber = (newNumber) => {
    setRecentOrders((prev) => [newNumber, ...prev]);
  };

  const cancelNumber = (activationIid) => {
    setRecentOrders((prev) =>
      prev.filter((order) => order.activationId !== activationIid),
    );
  };

  //Connect to signalR
  useEffect(() => {
    try {
      let currentUser = getCurrentUser();
      connectSignalR(currentUser.id, addSms);
    } catch (error) {
      console.error("Failed to connect and register user:", error);
    }
  }, []);

  //Get Recent Numbers
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

  //Update the UI when sms code receives
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
