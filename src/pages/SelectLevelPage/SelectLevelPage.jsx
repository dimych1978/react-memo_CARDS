import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useContext } from "react";
import { LightContext } from "../../context/lightContext";

export function SelectLevelPage() {
  const { isLight, setIsLight } = useContext(LightContext);

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <div className={styles.checkbox}>
          <input className="" type="checkbox" checked={isLight} id="light" onChange={() => setIsLight(!isLight)} />
          <label className={styles.light} htmlFor="light">
            Уровень "light" <i>(Можно сделать 2 ошибки без прекращения игры)</i>
          </label>
        </div>
      </div>
    </div>
  );
}
