import { useEffect, useRef, useState, useCallback } from "react";
import { Coins } from "lucide-react";
import styles from "./Game.module.css";

let coinIdCounter = 0;

export default function GamePlay({ durationSeconds, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState([]);
  const stageRef = useRef(null);
  const scoreRef = useRef(0);
  const spawnRef = useRef(null);
  const tickRef = useRef(null);
  const fallDuration = 2.6; // seconds, matches CSS animation below

  const removeCoin = useCallback((id) => {
    setCoins((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const catchCoin = useCallback(
    (id) => {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      removeCoin(id);
    },
    [removeCoin]
  );

  useEffect(() => {
    // spawn a coin roughly every 700-1100ms
    function spawn() {
      const id = ++coinIdCounter;
      const left = 8 + Math.random() * 80; // percent, inset from edges
      setCoins((prev) => [...prev, { id, left }]);
      // auto-remove if not caught before it lands
      setTimeout(() => removeCoin(id), fallDuration * 1000);
      spawnRef.current = setTimeout(spawn, 650 + Math.random() * 450);
    }
    spawnRef.current = setTimeout(spawn, 400);

    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tickRef.current);
          clearTimeout(spawnRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(tickRef.current);
      clearTimeout(spawnRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      const finalScore = scoreRef.current;
      const t = setTimeout(() => onComplete(finalScore), 400);
      return () => clearTimeout(t);
    }
  }, [timeLeft, onComplete]);

  return (
    <div className={styles.playScreen}>
      <div className={styles.hud}>
        <span className={styles.hudItem}>
          Time <span className="data-num">{timeLeft}s</span>
        </span>
        <span className={styles.hudItem}>
          Score <span className="data-num">{score}</span>
        </span>
      </div>

      <div className={styles.stage} ref={stageRef}>
        {coins.map((coin) => (
          <button
            key={coin.id}
            className={styles.coin}
            style={{
              left: `${coin.left}%`,
              animationDuration: `${fallDuration}s`,
            }}
            onClick={() => catchCoin(coin.id)}
            aria-label="Collect coin"
          >
            <Coins size={22} />
          </button>
        ))}
      </div>
    </div>
  );
}
