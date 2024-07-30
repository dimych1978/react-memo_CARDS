import React from "react";
import styles from "./LeaderboardPage.module.css";
import { Button } from "../../components/Button/Button";
import { getTimerValue } from "../../components/Cards/Cards";

const LeaderboardPage = () => {
  const { minutes, seconds } = getTimerValue();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>Лидерборд</p>
        <Button>Начать заново</Button>
      </div>
      <section className={styles.leaders}>
        <div className={styles.leader_header}>
          <i className={styles.position_header}>Позиция</i>
          <span className={styles.user_header}>Пользователь</span>
          <div className={styles.time_header}>Время </div>
        </div>
        <div className={styles.leader}>
          <i className={styles.position}>#1</i>
          <span className={styles.user}>ab98awj_918mlz1lavfh_ru</span>
          <div className={styles.time}>
            {minutes}.{seconds}
          </div>
        </div>
        <div className={styles.leader}>
          <i className={styles.position}>#2</i>
          <span className={styles.user}>B</span>
          <div className={styles.time}>
            {minutes}.{seconds}
          </div>
        </div>
        <div className={styles.leader}>
          <i className={styles.position}>#3</i>
          <span className={styles.user}>C</span>
          <div className={styles.time}>
            {minutes}.{seconds}
          </div>
        </div>
        <div className={styles.leader}>
          <i className={styles.position}></i>
          <span className={styles.user}>D</span>
          <div className={styles.time}>
            {" "}
            {minutes}.{seconds}
          </div>
        </div>
        <div className={styles.leader}>
          <i className={styles.position}></i>
          <span className={styles.user}>E</span>
          <div className={styles.time}></div>
        </div>
        <div className={styles.leader}>
          <i className={styles.position}></i>
          <span className={styles.user}>F</span>
          <div className={styles.time}></div>
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
