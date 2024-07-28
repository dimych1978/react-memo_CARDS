import { createContext, useState } from "react";

export const LightContext = createContext();

export const LightProvider = ({ children }) => {
  const [isLight, setIsLight] = useState(true);
  const [tries, setTries] = useState(3);

  return <LightContext.Provider value={{ isLight, setIsLight, tries, setTries }}>{children}</LightContext.Provider>;
};
