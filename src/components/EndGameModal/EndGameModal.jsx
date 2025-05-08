import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { postLeader } from "../../api/api";
import { ErrorContext } from "../../context/errorContext";
import IfError from "../IfError/IfError";
import { AchieveContext } from "../../context/achieveContext";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
const navigate = useNavigate()

  const { err, setErr } = useContext(ErrorContext);
  const { achievements } = useContext(AchieveContext);

  const { pairsCount } = useParams();

  const [user, setUser] = useState('');

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 720);
    };

    handleResize(); // Проверяем при загрузке
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const achievementArray = [];

  if (achievements.hardMode) achievementArray.push(1);
  if (!achievements.superPowerUsed) achievementArray.push(2);

  const title = isWon
    ? pairsCount === "3"
      ? "Поздравляю, ты попал на Лидерборд! Введи свое имя, чтобы его там увидеть."
      : "Ура, ты победил!"
    : "Ты ПРОДУЛ!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const userHandler = e => {
    setUser(e.target.value);
  };
  const leaderboardHandler = async () => {
    if (pairsCount !== "3" || !isWon) return;
    if (!user.trim()) {
      setErr("Введите имя");
      return;
    }

    try {
      postLeader({ name: user, time: gameDurationMinutes * 60 + gameDurationSeconds, achievements: achievementArray });
      navigate('/leaderboard')
    } catch (error) {
      console.warn(error.message);
      setErr(error.message === "Failed to fetch" ? "Проверьте соединение с интернетом" : "Ошибка при сохранении");
    }
  };

  return (
    <div className={styles.modal} style={pairsCount === "3" && isWon ? { height: "634px" } : { height: "459px" }}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {pairsCount === "3" && isWon && (
        <div className={styles.inputContainer}>
          <input type="text" className={styles.user} placeholder="Пользователь" onChange={userHandler}></input>
          {isMobile && (
            <button className={styles.submitButton} onClick={leaderboardHandler } aria-label="Отправить">
              <div className={styles.exit} />
            </button>
          )}
        </div>
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
      {(!isMobile) && isWon && pairsCount === "3" && (
        <Link to={"/leaderboard"} className={styles.link} onClick={leaderboardHandler}>
          Перейти к лидерборду
        </Link>
      )}
    </div>
  );
}
