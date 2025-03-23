import { useContext, useEffect, useRef } from "react";
import usePair from "../../hooks/usePair";
import styles from "./SuperPower.module.css";
import { AchieveContext } from "../../context/achieveContext";
import { useTemporaryShowCards } from "../../hooks/useTemporaryShowCards";

const SuperPower = ({ setIsTimerRunning, setGameStartDate, setGameEndDate, gameStartDate, opacity, setOpacity, setPair, cards, hidden, setCards }) => {
  const { achievements, handleAchievements } = useContext(AchieveContext);

  const refEye = useRef();
  const refPair = useRef();
  const list = hidden.length > 0 ? hidden : cards;
  const pairs = usePair(list);
  const showAllCards = useTemporaryShowCards(setCards);

  useEffect(() => {
    refEye.current.style.opacity = opacity.eye;
    refPair.current.style.opacity = opacity.pair;
  }, [setOpacity, opacity]);

  const handler = e => {
    if (e.target === refEye.current && opacity.eye !== 0.8) {
      showAllCards(cards, setIsTimerRunning, setGameEndDate, setGameStartDate, gameStartDate);

      handleAchievements({ ...achievements, superPowerUsed: true });

      setOpacity({ eye: 0.8 });
      refEye.current.disabled = true;
    }

    if (e.target === refPair.current && opacity.pair !== 0.8) {
      if (list.length === 2) {
        alert("Невозможно выбрать случайную пару из одной пары. Откройте карту");
        return;
      }
      setPair(pairs);

      handleAchievements({ ...achievements, superPowerUsed: true });

      setOpacity({ pair: 0.8 });
      refEye.current.disabled = true;
    }
    return;
  };

  return (
    <>
      <div ref={refEye} className={styles.superPower_eye} disabled={false} onClick={handler} />
      <div ref={refPair} className={styles.superPower_pair} disabled={false} onClick={handler} />
    </>
  );
};

export default SuperPower;