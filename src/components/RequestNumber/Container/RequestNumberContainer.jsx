//React
import { useEffect, useState, useContext } from "react";

//Context
import { SmsContext } from "../../../context/SmsContext";
import { NumberContext } from "../../../context/NumberContext";

//Components
import ActiveOrders from "../ActiveOrder/ActiveOrders";
import RequestNumberForm from "../RequestNumberForm/RequestNumberForm";

//Services
import { getMyNumbers } from "../../../services/Number/NumberService";
import Guideline from "../../Helper/Guideline/Guideline";
import { connectSignalR } from "../../../services/SignalR/SignalRService";
import Header from "../../Helper/Header/Header";

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
  const handleCancelNumber = (id) => {
    setActiveOrders((prev) => prev.filter((order) => order.id !== id));
  };

  //When number is not able to cancel so we update the otp if coming
  const handleCancelNumberFailure = (data) => {
    setActiveOrders((prev) =>
      prev.map((order) => {
        if (order.id === data.id) {
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
        setActiveOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch recent numbers:", error);
      } finally {
        setActiveOrdersLoading(false);
      }
    };
    fetchMyRecentNumbers();
  }, [isReconnected]);

  function handleNumberExpired(id) {
    setActiveOrders((prev) => prev.filter((order) => order.id !== id));
  }

  //Checks the expiry of the numbers, if expired remove from the DOM.
  useEffect(() => {
    const interval = setInterval(() => {
      activeOrders.forEach((order) => {
        const startTime = new Date(order.activationStartTime).getTime();

        const expiryTime = startTime + order.activationLimit * 60 * 1000;

        if (expiryTime - Date.now() <= 0) {
          handleNumberExpired(order.id);
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
        if (order.id === latestSms.id) {
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
      <Header
        title="Get a Temporary Number"
        description="Choose your options, get a number, receive your SMS — all
        in one place."
      />
      
      <div className="grid">
        <Guideline
          title="Getting Started"
          subtitle="Follow these steps to receive your verification code"
          icon="fa-solid fa-list-check number-type-icon"
          steps={[
            {
              title: "Select Your Options",
              description:
                "Choose your SMS provider, service, country, and operator from the form on the right.",
            },
            {
              title: "Check Price & Availability",
              description:
                "Review the service information to see the price and available numbers.",
            },
            {
              title: 'Click "Get Number"',
              description:
                "Press the button to receive your temporary phone number instantly.",
            },
            {
              title: "Use the Number",
              description:
                " Enter the provided number in your app or service to receive the SMS code.",
            },
            {
              title: "Get Your Code",
              description:
                "Your verification code will appear on this page within a few minutes.",
            },
          ]}
          notes={[
            "Numbers are temporary and expire after 15–20 minutes",
            "Make sure you have sufficient balance before ordering",
            "Use the number immediately after receiving it",
            "Some services may take longer to deliver SMS codes",
          ]}
        />

        <RequestNumberForm onNewNumber={addNewNumber} />

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
