import { createContext, useEffect, useMemo, useState } from "react";

export const LightContext = createContext();

export const LightProvider = ({ children }) => {
  const [isLight, setIsLight] = useState(true);
  const [tries, setTries] = useState(3);

  useEffect(() => {
    isLight ? setTries(3) : setTries(1);
  }, [isLight]);
  
  const value = useMemo(() => ({
    isLight, 
    setIsLight,
    tries,
    setTries
  }), [isLight, tries]);
  return <LightContext.Provider value={value}>{children}</LightContext.Provider>;
};
