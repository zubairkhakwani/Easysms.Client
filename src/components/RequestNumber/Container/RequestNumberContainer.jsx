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
  const [isActiveOrdersLoading, setActiveOrdersLoading] = useState(true);

  const addNewNumber = (newNumber) => {
    setActiveOrders((prev) => [newNumber, ...prev]);
  };

  //When number is successfully cancelled
  const handleCancelNumber = (activationId) => {
    setActiveOrders((prev) =>
      prev.filter((order) => order.activationId !== activationId),
    );
  };

  //When number is not able to cancel so we update the otp if coming
  const handleCancelNumberFailure = (data) => {
    setActiveOrders((prev) =>
      prev.map((order) => {
        if (order.activationId === data.activationId) {
          return {
            ...order,
            hasSms: true,
            code: data.code,
            text: data.text,
          };
        }
        return order;
      }),
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
        setActiveOrdersLoading(false);
        setActiveOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch recent numbers:", error);
      }
    };
    fetchMyRecentNumbers();
  }, [isReconnected]);

  function handleNumberExpired(activationId) {
    setActiveOrders((prev) =>
      prev.filter((order) => order.activationId !== activationId),
    );
  }

  //Checks the expiry of the numbers, if expired remove from the DOM.
  useEffect(() => {
    const interval = setInterval(() => {
      activeOrders.forEach((order) => {
        const startTime = new Date(order.activationStartTime).getTime();

        const expiryTime = startTime + order.activationLimit * 60 * 1000;

        if (expiryTime - Date.now() <= 0) {
          handleNumberExpired(order.activationId);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrders]);

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
          ordersLoading={isActiveOrdersLoading}
          incomingOrders={activeOrders}
          onCancelNumber={handleCancelNumber}
          OnNumberCancelFailure={handleCancelNumberFailure}
        />
      </div>
    </>
  );
}
