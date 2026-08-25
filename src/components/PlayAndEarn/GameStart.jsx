import { Coins, Play } from "lucide-react";
import { GAME_CONFIG } from "../../data/levelConfig";
import styles from "./Game.module.css";

export default function GameStart({ attemptsLeft, onStart }) {
  const canPlay = attemptsLeft > 0;

  return (
    <div className={styles.startScreen}>
      <div className={styles.coinIllustration} aria-hidden="true">
        <Coins size={40} />
      </div>

      <ul className={styles.rulesList}>
        {GAME_CONFIG.rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>

      {canPlay ? (
        <button className={styles.primaryBtn} onClick={onStart}>
          <Play size={16} /> Start Challenge
        </button>
      ) : (
        <div className={styles.exhausted}>
          <p>You've used all your attempts for today.</p>
          <p className={styles.exhaustedSub}>New challenge coming soon.</p>
        </div>
      )}
    </div>
  );
}
