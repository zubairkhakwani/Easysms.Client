import { createContext, useState } from "react";

export const SmsContext = createContext();

export const SmsProvider = ({ children }) => {
  const [latestSms, setLatestSms] = useState(null);

  const [isReconnected, setIsReconnected] = useState(false);

  const addSms = (sms) => {
    setLatestSms(sms);
  };
  const setReconnected = () => {
    console.log("Reconnected");
    setIsReconnected((prev) => !prev);
  };

  return (
    <SmsContext.Provider
      value={{ latestSms, addSms, isReconnected, setReconnected }}
    >
      {children}
    </SmsContext.Provider>
  );
};
