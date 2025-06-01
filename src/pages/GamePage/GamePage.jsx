import { useParams } from "react-router-dom";

import { Cards } from "../../components/Cards/Cards";
import { useCallback, useState } from "react";

export function GamePage() {
  const { pairsCount } = useParams();
  const [gameKey, setGameKey] = useState(0);
  const resetGame = useCallback(() => {
    setTimeout(() => {
      setGameKey(prev => prev + 1);
    }, 100);
  }, []);

  return <Cards key={gameKey} pairsCount={parseInt(pairsCount, 10)} previewSeconds={5} onReset={resetGame}></Cards>;
}
