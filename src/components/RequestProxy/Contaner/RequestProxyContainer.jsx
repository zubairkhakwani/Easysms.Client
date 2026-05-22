//React
import { useEffect, useState, useContext } from "react";

//Context
import { SmsContext } from "../../../context/SmsContext";

//Services
import { connectSignalR } from "../../../services/SignalR/SignalRService";
import { getMyTempMails } from "../../../services/TempMail/TempMailService";

//Toaster
import { errorToast } from "../../../helper/Toaster";

//Components
import Header from "../../Helper/Header/Header";
import Guideline from "../../Helper/Guideline/Guideline";
import RequestMailForm from "../RequestProxyForm/RequestProxyForm";
import ActiveOrders from "../ActiveOrder/ActiveOrder";

export default function RequestProxyContainer() {
  //Contexts
  const { latestMail, addMail, setReconnected, isReconnected } =
    useContext(SmsContext);
  //Data
  const [activeTempMails, setActiveTempMails] = useState([]);

  //Loading
  const [isActiveTempMailsLoading, setActiveTempMailsLoading] = useState(true);

  //Api Calls
  const fetchMyTempMails = async () => {
    let responseData = [];
    try {
      const res = await getMyTempMails(true);
      responseData = res.data;
      setActiveTempMails(res.data);
    } catch {
      errorToast("Failed to fetch active temp mails");
    } finally {
      setActiveTempMailsLoading(false);
      setActiveTempMails(responseData);
    }
  };

  useEffect(() => {
    try {
      connectSignalR({ addMail, setReconnected });
    } catch (error) {
      console.error("Failed to connect and register user:", error);
    }
  }, []);

  useEffect(() => {
    fetchMyTempMails();
  }, [isReconnected]);

  const addNewTempMail = (newTempMail) => {
    setActiveTempMails((prev) => [...newTempMail, ...prev]);
  };

  //When temp mail is successfully cancelled
  const handleCancelTempMail = (id) => {
    setActiveTempMails((prev) => prev.filter((order) => order.id !== id));
  };

  //When temp email is not able to cancel so we update the otp if coming
  const handleCancelTempEmailFailure = (data) => {
    setActiveTempMails((prev) =>
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

  function handleTempMailExpired(id) {
    setActiveTempMails((prev) => prev.filter((order) => order.id !== id));
  }

  //Update the UI when sms code receives
  useEffect(() => {
    if (!latestMail) return;

    setActiveTempMails((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === latestMail.id) {
          return {
            ...order,
            hasSms: true,
            code: latestMail.code,
            text: latestMail.text,
          };
        }
        return order;
      }),
    );
  }, [latestMail]);

  return (
    <>
      <Header
        title="Get IPv4 Proxy"
        description="Select your preferred location, duration, and usage type to instantly purchase high-quality IPv4 proxies."
      />

      <div className="grid">
        <Guideline
          title="Getting Started"
          subtitle="Follow these steps to purchase your proxy service"
          icon="fa-solid fa-network-wired number-type-icon"
          steps={[
            {
              title: "Select Proxy Type",
              description:
                "Currently, we provide IPv4 proxies only. Additional proxy services and types will be added in the future.",
            },
            {
              title: "Choose a Location",
              description:
                "Select the country or region where you want your proxy IP address to be located.",
            },
            {
              title: "Select Rental Period",
              description:
                "Choose how long you want to use the proxy, such as 1 week, 1 month, 3 months, or other available durations.",
            },
            {
              title: "Choose Usage Purpose",
              description:
                "Select the intended use for your proxy, such as social media platforms like Facebook, Instagram, or Telegram, gaming services like FIFA, or other supported activities.",
            },
            {
              title: "Select Quantity",
              description:
                "Choose how many proxy connections or IPs you want to purchase.",
            },
            {
              title: 'Click "Get Proxy"',
              description:
                "Press the button to instantly receive your proxy details and access credentials.",
            },
          ]}
          //   notes={[
          //     "Currently only IPv4 proxies are available",
          //     "More proxy types and services will be added in future updates",
          //     "Make sure you have sufficient balance before placing an order",
          //     "Proxy availability may vary depending on location and demand",
          //     "Use proxies according to the platform's terms and policies",
          //   ]}
        />
        <RequestMailForm onNewTempMail={addNewTempMail} />
        <ActiveOrders
          activeMailsLoading={isActiveTempMailsLoading}
          activeMails={activeTempMails}
          onCancelTempEmail={handleCancelTempMail}
          OnTempEmailCancelFailure={handleCancelTempEmailFailure}
          OnTempMailExpiration={handleTempMailExpired}
        />
      </div>
    </>
  );
}
