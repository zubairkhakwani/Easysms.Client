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
        title="Rent a Mail Inbox"
        description="Choose your service, pick from Gmail, Outlook, and many more, and receive verification codes — all in one place."
      />

      <div className="grid">
        <Guideline
          title="Getting Started"
          subtitle="Follow these steps to rent your mail inbox"
          icon="fa-solid fa-envelope-open-text number-type-icon"
          steps={[
            {
              title: "Select a Service",
              description:
                "Choose the platform you need the inbox for from our supported service list.",
            },
            {
              title: "Choose Mail Provider",
              description: "Pick from Gmail, Outlook, and many more.",
            },
            {
              title: "Review Pricing",
              description:
                "Check price, stock, and delivery information before ordering.",
            },
            {
              title: "Select Quantity",
              description: "Choose how many mail inboxes you need to rent.",
            },
            {
              title: 'Click "Rent Mail"',
              description:
                "Your rented inbox is assigned instantly after confirming.",
            },
            {
              title: "Receive Verification Mail",
              description:
                "Incoming mail and OTP codes appear automatically on this page.",
            },
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
