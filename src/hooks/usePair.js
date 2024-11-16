export default function usePair(cards) {
  const baseCard = Math.floor(Math.random() * cards.length);
  const filteredCards = cards.find(card => cards.indexOf(card) === baseCard);
  return filteredCards;
}
