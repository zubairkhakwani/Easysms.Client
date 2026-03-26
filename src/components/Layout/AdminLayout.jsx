//React
import { useEffect, useContext } from "react";

//React-Dom
import { Outlet } from "react-router-dom";

//Context
import { SmsContext } from "../../context/SmsContext";
import { NumberContext } from "../../context/NumberContext";
//Services
import { connectSignalR } from "../../services/SignalR/SignalRService";

const AdminLayout = () => {
  const { addSms, setReconnected } = useContext(SmsContext);
  const { OnNewNumbers, OnRemoveNumber } = useContext(NumberContext);

  useEffect(() => {
    try {
      connectSignalR(addSms, setReconnected, OnNewNumbers, OnRemoveNumber);
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
