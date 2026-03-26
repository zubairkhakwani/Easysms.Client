//React
import { useEffect, useState, useContext } from "react";

//Context
import { SmsContext } from "../../../context/SmsContext";
import { NumberContext } from "../../../context/NumberContext";

//Components
import ActiveOrders from "../ActiveOrder/ActiveOrders";
import RequestNumber from "../Form/RequestNumberForm";

//Services
import { getMyNumbers } from "../../../services/Number/NumberService";
import RequestNumberContainerHeader from "../Header/RequestNumberHeader";
import RequestNumberGuideline from "../Guideline/RequestNumberGuideline";
import { connectSignalR } from "../../../services/SignalR/SignalRService";

//Css
import "./RequestNumberContainer.css";

export default function RequestNumberContainer() {
  const { latestSms, addSms, isReconnected, setReconnected } =
    useContext(SmsContext);

  const { OnNewNumbers, OnRemoveNumber } = useContext(NumberContext);

  const [activeOrders, setActiveOrders] = useState([]);

  const addNewNumber = (newNumber) => {
    setActiveOrders((prev) => [newNumber, ...prev]);
  };

  const cancelNumber = (activationIid) => {
    setActiveOrders((prev) =>
      prev.filter((order) => order.activationId !== activationIid),
    );
  };

  //Connect to signalR
  useEffect(() => {
    try {
      connectSignalR(addSms, setReconnected, OnNewNumbers, OnRemoveNumber);
    } catch (error) {
      console.error("Failed to connect and register user:", error);
    }
  }, []);

  //Get Recent Numbers
  useEffect(() => {
    const fetchMyRecentNumbers = async () => {
      try {
        const res = await getMyNumbers(true);
        setActiveOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch recent numbers:", error);
      }
    };
    fetchMyRecentNumbers();
  }, [isReconnected]);

  //Update the UI when sms code receives
  useEffect(() => {
    if (!latestSms) return;

    setActiveOrders((prevOrders) =>
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
        <ActiveOrders
          incomingOrders={activeOrders}
          onCancelNumber={cancelNumber}
        />
      </div>
    </>
  );
}
