import { useEffect } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import styles from "./Game.module.css";

export default function GameResult({ score, reward, attemptsLeft, onPlayAgain, onXPEarned }) {
  useEffect(() => {
    if (reward.type === "XP" && onXPEarned) {
      onXPEarned(reward.amount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.resultScreen}>
      <div className={styles.resultBurst} aria-hidden="true">
        <Sparkles size={32} />
      </div>
      <p className={styles.resultKicker}>Challenge Complete</p>
      <p className={`${styles.resultScore} data-num`}>Score: {score}</p>

      <div className={styles.rewardPill}>
        +<span className="data-num">{reward.amount}</span> {reward.type}
      </div>

      <button className={styles.primaryBtn} onClick={onPlayAgain} disabled={attemptsLeft <= 0}>
        <RotateCcw size={16} />
        {attemptsLeft > 0 ? "Play Again" : "No attempts left today"}
      </button>
    </div>
  );
}
