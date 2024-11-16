import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { postLeader } from "../../api/api";
import { ErrorContext } from "../../context/errorContext";
import IfError from "../IfError/IfError";
import { AchieveContext } from "../../context/achiveContext";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const { err, setErr } = useContext(ErrorContext);
  const { achievements, handleAchievements } = useContext(AchieveContext);

  const { pairsCount } = useParams();

  const [user, setUser] = useState();

  // ;
  useEffect(() => {
    if (isWon && pairsCount !== "9") handleAchievements({ ...achievements, easyMode: true });
    console.log(achievements);
  }, []);
  const achievementArray = [1, 2];
  achievements.superPowerUsed
    ? achievementArray.shift()
    : achievements.easyMode
    ? achievementArray.pop()
    : achievementArray.splice(0, 2);

  const title = isWon ? (pairsCount === "9" ? "Вы попали на Лидерборд!" : "Вы победили!") : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const userHandler = e => {
    setUser(e.target.value);
  };
  const leaderboardHandler = async () => {
    if (pairsCount !== "9" || !isWon) return;
    try {
      postLeader({ name: user, time: gameDurationMinutes * 60 + gameDurationSeconds, achievements: achievementArray });
    } catch (error) {
      console.warn(error.message);
      if (error.message === "Failed to fetch") setErr("Проверьте соединение с интернетом");
    }
  };

  return (
    <div className={styles.modal} style={pairsCount === "9" && isWon ? { height: "634px" } : { height: "459px" }}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {pairsCount === "9" && isWon && (
        <input type="text" className={styles.user} placeholder="Пользователь" onChange={userHandler}></input>
      )}
      {err && <IfError error={err} />}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Button
        onClick={() => {
          onClick();
          leaderboardHandler();
        }}
      >
        Начать сначала
      </Button>
      {isWon && pairsCount === "9" && (
        <Link to={"/leaderboard"} className={styles.link} onClick={leaderboardHandler}>
          Перейти к лидерборду
        </Link>
      )}
    </div>
  );
}
