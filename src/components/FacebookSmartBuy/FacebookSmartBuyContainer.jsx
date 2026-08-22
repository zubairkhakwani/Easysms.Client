import { useContext, useEffect, useState } from "react";
import { SmsContext } from "../../context/SmsContext";
import { NumberContext } from "../../context/NumberContext";
import ActiveOrders from "../RequestNumber/ActiveOrder/ActiveOrders";
import FacebookSmartBuyForm from "./FacebookSmartBuyForm";
import { getMyTempNumbers } from "../../services/Number/NumberService";
import Guideline from "../Helper/Guideline/Guideline";
import { connectSignalR } from "../../services/SignalR/SignalRService";
import Header from "../Helper/Header/Header";
import { playCodeReceivedSound } from "../../helper/UtilityHelper";
import "../RequestNumber/Container/RequestNumberContainer.css";

export default function FacebookSmartBuyContainer() {
  const { latestSms, addSms, isReconnected, setReconnected } =
    useContext(SmsContext);
  const { OnNewNumbers, OnRemoveNumber } = useContext(NumberContext);

  const [activeOrders, setActiveOrders] = useState([]);
  const [isActiveOrdersLoading, setActiveOrdersLoading] = useState(false);

  const addNewNumber = (newNumber) => {
    setActiveOrders((prev) => [newNumber, ...prev]);
  };

  const handleCancelNumber = (id) => {
    setActiveOrders((prev) => prev.filter((order) => order.id !== id));
  };

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

  useEffect(() => {
    try {
      connectSignalR({ addSms, setReconnected, OnNewNumbers, OnRemoveNumber });
    } catch (error) {
      console.error("Failed to connect and register user:", error);
    }
  }, []);

  const fetchMyActiveNumbers = async () => {
    setActiveOrdersLoading(true);
    try {
      const res = await getMyTempNumbers(true);
      setActiveOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch recent numbers:", error);
    } finally {
      setActiveOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchMyActiveNumbers();
  }, [isReconnected]);

  useEffect(() => {
    if (!activeOrders.length) return;

    const interval = setInterval(() => {
      setActiveOrders((prev) =>
        prev
          .map((order) => ({
            ...order,
            remainingSeconds: Math.max(
              0,
              (order.remainingSeconds ?? order.activationLimit * 60) - 1,
            ),
          }))
          .filter((order) => order.remainingSeconds > 0),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrders.length]);

  useEffect(() => {
    if (!latestSms) return;

    playCodeReceivedSound();

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
        title="Facebook verification"
        description="Temporary numbers for Facebook. Pick a country and we show the best prices for your region."
      />

      <div className="grid">
        <Guideline
          title="How it works"
          subtitle="Facebook only. You do not choose a provider."
          icon="fa-brands fa-facebook number-type-icon"
          steps={[
            {
              title: "Select a country",
              description:
                "Choose where you need the number for Facebook.",
            },
            {
              title: "Choose a price",
              description:
                "We list options sorted by how often codes arrive.",
            },
            {
              title: "Get your number",
              description:
                "Buy a number and use it on Facebook sign-up or login.",
            },
            {
              title: "Receive your code",
              description:
                "Your code appears below. You can finish, cancel, or request another SMS.",
            },
          ]}
          notes={[
            "This page is for Facebook only",
            "Have enough balance before you buy",
            "Use a VPN or proxy from the same country if Facebook asks for it",
          ]}
        />

        <FacebookSmartBuyForm onNewNumber={addNewNumber} />

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
