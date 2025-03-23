import { shuffle } from "lodash";
import { useContext, useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { LightContext } from "../../context/lightContext";
import SuperPower from "../SuperPower/SuperPower";
import { AchieveContext } from "../../context/achieveContext";
import { useNavigate } from "react-router-dom";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";

export function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
const navigate = useNavigate()

  const { isLight, tries, setTries } = useContext(LightContext);
  const { handleAchievements, achievements } = useContext(AchieveContext);
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);

  const [playerLost, setPlayerLost] = useState(false);

  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);

  // Стейт для таймера, высчитывается в setInterval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  const [isTimerRunning, setIsTimerRunning] = useState(true)

  const [opacity, setOpacity] = useState({ eye: 1, pair: 1 });

  const [pairFromPower, setPairFromPower] = useState("");

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }

  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }

  function resetGame() {
    setOpacity({ eye: 1, pair: 1 });
    setTries(isLight ? 3 : 1);
    setPlayerLost(false);
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setHiddenCards([]);
    handleAchievements({ ...achievements, superPowerUsed: false });
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может переходить в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */

  useEffect(() => {
    if (tries === 0) setPlayerLost(true);
  }, [tries, playerLost]);

  useEffect(() => {
    if (playerLost) finishGame(STATUS_LOST);
  }, [playerLost]);

  const [hiddenCards, setHiddenCards] = useState([]);

  const listForPower = hiddenCards.length > 0 ? hiddenCards : cards;

  const applySuperPower = hidden => {
    if (pairFromPower) {
      hidden.forEach(card => {
        if (card.suit === pairFromPower.suit && card.rank === pairFromPower.rank) return (card.open = true);
      });
    }
  };
  applySuperPower(listForPower);

  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }

    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);
    setHiddenCards(nextCards.filter(card => !card.open));

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    function tryLost() {
      if (openCardsWithoutPair.length === 2) {
        setTries(tries - 1);
        setTimeout(() => {
          setCards(
            cards.reduce((acc, card) => {
              if (card.id === clickedCard.id) {
                return [...acc, { ...card, open: false }];
              }
              return [...acc, card];
            }, []),
          );
          setCards(
            cards.reduce((acc, card) => {
              const previousCard = openCardsWithoutPair.find(item => item.id !== clickedCard.id);
              if (card.id === previousCard.id) {
                return [...acc, { ...card, open: false }];
              }
              return [...acc, card];
            }, []),
          );
        }, 1000);
      }
    }
    tryLost();
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  useEffect(() => {
   let intervalId;

   if(isTimerRunning){
     intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);}
    return () => {if(intervalId)
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate, isTimerRunning]);

  useEffect(() => {
    if (pairsCount === 9) handleAchievements({ ...achievements, hardMode: true });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS && (
          <SuperPower
          isTimerRunning={isTimerRunning}
          setIsTimerRunning={setIsTimerRunning}
          setGameEndDate={setGameEndDate}
          setGameStartDate={setGameStartDate}
          gameStartDate={gameStartDate}
            opacity={opacity}
            setOpacity={setOpacity}
            setStatus={setStatus}
            setPair={setPairFromPower}
            pair={pairFromPower}
            cards={cards}
            hidden={hiddenCards}
          />
        )}
        {status === STATUS_IN_PROGRESS ? (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              {isLight && <p className={styles.tries}>Осталось попыток {tries}</p>}
             <div className={styles.exit} onClick={() => navigate('/')}></div>
          </div>
            <Button onClick={resetGame}>Начать заново</Button>
          </div>
        ) : null}
      </div>
      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
          />
        </div>
      ) : null}
    </div>
  );
}
