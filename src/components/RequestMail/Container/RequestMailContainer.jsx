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
import RequestMailForm from "../RequesMailForm/RequesttMailForm";
import ActiveOrders from "../ActiveOrder/ActiveOrder";

//Sound
import { playCodeReceivedSound } from "../../../helper/UtilityHelper";

export default function RequestMailContainer() {
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
    playCodeReceivedSound();
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
        title="Get a Temporary Mail"
        description="Choose your options, get a mail, receive your SMS — all
        in one place."
      />

      <div className="grid">
        <Guideline
          title="Getting Started"
          subtitle="Follow these steps to receive your temporary email"
          icon="fa-solid fa-envelope-open-text number-type-icon"
          steps={[
            {
              title: "Select a Service",
              description:
                "Choose the platform or service you need the email for, such as Facebook, Google, Telegram, or Discord.",
            },
            {
              title: "Choose Email Type",
              description:
                "Select your preferred email domain or provider, such as Gmail, Mail.com, Outlook, and more.",
            },
            {
              title: "Review Pricing",
              description:
                "Check the price, stock availability, and delivery information before placing your order.",
            },
            {
              title: "Select Quantity",
              description:
                "Choose how many temporary email accounts you want to purchase.",
            },
            {
              title: 'Click "Get Mail"',
              description:
                "Press the button to instantly generate your temporary email account(s).",
            },
            {
              title: "Receive Verification Emails",
              description:
                "Incoming emails and verification codes will automatically appear on this page.",
            },
          ]}
          notes={[
            "Email accounts are temporary and may expire after a limited time",
            "Make sure you have sufficient balance before ordering",
            "Use the email immediately after receiving it",
            "Some services may take longer to deliver verification emails",
          ]}
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
