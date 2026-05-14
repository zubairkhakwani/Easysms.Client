import { createContext, useState } from "react";

export const SmsContext = createContext();

export const SmsProvider = ({ children }) => {
  const [latestSms, setLatestSms] = useState(null);
  const [latestMail, setLatestMail] = useState(null);

  const [isReconnected, setIsReconnected] = useState(false);

  const addSms = (sms) => {
    setLatestSms(sms);
  };

  const addMail = (mail) => {
    setLatestMail(mail);
  };

  const setReconnected = () => {
    console.log("Reconnected");
    setIsReconnected((prev) => !prev);
  };

  return (
    <SmsContext.Provider
      value={{
        latestSms,
        addSms,
        latestMail,
        addMail,
        isReconnected,
        setReconnected,
      }}
    >
      {children}
    </SmsContext.Provider>
  );
};
