import { createContext, useState } from "react";

export const AchieveContext = createContext({ easyMode: false, superPowerUsed: false });

export const AchieveProvider = ({ children }) => {
  const [achievements, setAchievements] = useState({ easyMode: false, superPowerUsed: false });

  const handleAchievements = achieve => {
    setAchievements({ superPowerUsed: achieve.superPowerUsed, easyMode: achieve.easyMode });
  };
  return <AchieveContext.Provider value={{ achievements, handleAchievements }}>{children}</AchieveContext.Provider>;
};
