import { createContext, useState } from "react";

export const NumberContext = createContext();

export const NumberProvider = ({ children }) => {
  const [newNumbers, setNewNumbers] = useState();
  const [removeNumberId, setRemoveNumberId] = useState();

  const OnNewNumbers = (numbers) => {
    setNewNumbers(numbers);
  };

  const OnRemoveNumber = (id) => {
    setRemoveNumberId(id);
  };

  return (
    <NumberContext.Provider
      value={{ newNumbers, removeNumberId, OnNewNumbers, OnRemoveNumber }}
    >
      {children}
    </NumberContext.Provider>
  );
};
