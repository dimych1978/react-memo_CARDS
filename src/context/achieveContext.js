import { createContext, useState } from "react";

export const AchieveContext = createContext({ hardMode: false, superPowerUsed: false });

export const AchieveProvider = ({ children }) => {
  const [achievements, setAchievements] = useState({ hardMode: false, superPowerUsed: false });

  const handleAchievements = achieve => {
    setAchievements({ superPowerUsed: achieve.superPowerUsed, hardMode: achieve.hardMode });
  };
  return <AchieveContext.Provider value={{ achievements, handleAchievements }}>{children}</AchieveContext.Provider>;
};
