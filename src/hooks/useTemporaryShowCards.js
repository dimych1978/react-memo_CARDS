export function useTemporaryShowCards() {
  const showAllCards = (cards, setIsTimerRunning, setGameEndDate, setGameStartDate, gameStartDate) => {
    if (typeof setGameEndDate !== "function") {
      console.error("setGameEndDate is not a function");
      return;
    }
    const originalState = cards.map(card => ({ ...card }));

    const currentElapsedTime = (new Date() - gameStartDate) / 1000; 
    
    setIsTimerRunning(false);
    setGameEndDate(new Date());

    cards.forEach(card => (card.open = true));

    setTimeout(() => {
      cards.forEach((card, index) => Object.assign(card, originalState[index]));

      const newStartDate = new Date(new Date() - currentElapsedTime * 1000); 
      
      setGameStartDate(newStartDate);
      setIsTimerRunning(true);
      setGameEndDate(null);
    }, 4000);
  };

  return showAllCards;
}
