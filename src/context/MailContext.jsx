import { createContext, useState } from "react";

export const MailContext = createContext();

export const MailProvider = ({ children }) => {
  const [newMails, setNewMails] = useState();
  const [removeMailId, setRemoveMailId] = useState();

  const OnNewMails = (mails) => {
    setNewMails(mails);
  };

  const OnRemoveMail = (id) => {
    setRemoveMailId(id);
  };

  return (
    <MailContext.Provider
      value={{ newMails, removeMailId, OnNewMails, OnRemoveMail }}
    >
      {children}
    </MailContext.Provider>
  );
};
