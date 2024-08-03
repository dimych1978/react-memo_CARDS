import React, { useEffect, useState } from "react";
import styles from "./LeaderboardPage.module.css";
import { Button } from "../../components/Button/Button";
import { getLeaders } from "../../api/api";
import { useNavigate } from "react-router-dom";

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const navigate = useNavigate();

  const leaderLoad = async () => {
    try {
      const leaders = await getLeaders();
      setLeaders(leaders.leaders);
    } catch (error) {
      console.warn(error.message);
    }
  };

  const leadersSort = leaders.sort((a, b) => a.time - b.time);

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
        {leadersSort.map((leader, index) => (
          <div key={leader.id} className={styles.leader}>
            <i className={styles.position}># {index + 1}</i>
            <span className={styles.user}>{leader.name}</span>
            <div className={styles.time}>{leader.time}</div>
          </div>
        ))}
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
