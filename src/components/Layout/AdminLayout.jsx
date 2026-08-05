//React
import { useEffect, useContext } from "react";

//React-Dom
import { Outlet } from "react-router-dom";

//Context
import { SmsContext } from "../../context/SmsContext";
import { NumberContext } from "../../context/NumberContext";
import { MailContext } from "../../context/MailContext";
//Services
import { connectSignalR } from "../../services/SignalR/SignalRService";

const AdminLayout = () => {
  const { addSms, addMail, setReconnected } = useContext(SmsContext);
  const { OnNewNumbers, OnRemoveNumber } = useContext(NumberContext);
  const { OnNewMails, OnRemoveMail } = useContext(MailContext);

  useEffect(() => {
    try {
      connectSignalR({
        addSms,
        addMail,
        setReconnected,
        OnNewNumbers,
        OnRemoveNumber,
        OnNewMails,
        OnRemoveMail,
      });
    } catch (error) {
      console.error("Failed to connect and register user:", error);
    }
  }, []);
  return (
    <>
      <Outlet />
    </>
  );
};

export default AdminLayout;
