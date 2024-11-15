import React, { useContext, useEffect, useState } from "react";
import styles from "./LeaderboardPage.module.css";
import { Button } from "../../components/Button/Button";
import { getLeaders } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { ErrorContext } from "../../context/errorContext";
import IfError from "../../components/IfError/IfError";

const LeaderboardPage = () => {
  const { err, setErr } = useContext(ErrorContext);

  const [leaders, setLeaders] = useState([]);
  const navigate = useNavigate();

  const leaderLoad = async () => {
    try {
      const leaders = await getLeaders();
      setLeaders(leaders.leaders);
    } catch (error) {
      console.warn(error.message);
      if (error.message === "Failed to fetch") setErr("Проверьте соединение с интернетом");
    }
  };

  const leadersSort = leaders.sort((a, b) => a.time - b.time);

  const timeFormat = digit => {
    let minutes = Math.floor(digit / 60);
    let seconds = digit % 60;
    return [minutes < 10 ? "0" + minutes : minutes, ".", seconds < 10 ? "0" + seconds : seconds];
  };

  useEffect(() => {
    leaderLoad();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>Лидерборд</p>
        <Button onClick={() => navigate("/")}>Начать заново</Button>
      </div>
      <section className={styles.leaders}>
        <div className={styles.leader_header}>
          <i className={styles.position_header}>Позиция</i>
          <span className={styles.user_header}>Пользователь</span>
          <div className={styles.time_header}>Время </div>
        </div>
        {err && <IfError error={err} />}
        {leadersSort.map(
          (leader, index) =>
            index <= 9 && (
              <div key={leader.id} className={styles.leader}>
                <i className={styles.position}># {index + 1}</i>
                <span className={styles.user}>{leader.name}</span>
                <div className={styles.time}>{timeFormat(leader.time)}</div>
              </div>
            ),
        )}
        <div className={styles.leader}>
          <i className={styles.position}># 198 872 278</i>
          <span className={styles.user}>ab98awj_918mlz1lavfh_ru</span>
          <div className={styles.time}>99.99</div>
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
