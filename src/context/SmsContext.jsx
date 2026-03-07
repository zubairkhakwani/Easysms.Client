import { createContext, useState } from "react";

export const SmsContext = createContext();

export const SmsProvider = ({ children }) => {
  const [latestSms, setLatestSms] = useState(null);
  const addSms = (sms) => {
    setLatestSms(sms);
  };

  return (
    <SmsContext.Provider value={{ latestSms, addSms }}>
      {children}
    </SmsContext.Provider>
  );
};
