import { createContext, useState } from "react";

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [err, setErr] = useState(null);
  const value = { err, setErr };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};
