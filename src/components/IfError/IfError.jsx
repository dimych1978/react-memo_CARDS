import styles from "./IfError.module.css";

const IfError = ({ error }) => {
  return <p className={styles.err}>{error}</p>;
};

export default IfError;
