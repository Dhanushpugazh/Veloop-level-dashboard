import { useState, useCallback, useEffect } from "react";
import GameStart from "./GameStart";
import GamePlay from "./GamePlay";
import GameResult from "./GameResult";
import { GAME_CONFIG } from "../../data/levelConfig";
import styles from "./Game.module.css";

const ATTEMPTS_KEY = "veloop_game_attempts_used_demo"; // prototype-only, resets per session

function getReward(score) {
  const tiers = [...GAME_CONFIG.scoreThresholds].sort((a, b) => b.minScore - a.minScore);
  const tier = tiers.find((t) => score >= t.minScore);
  return tier ? tier.reward : GAME_CONFIG.scoreThresholds[0].reward;
}

export default function GameContainer({ onXPEarned }) {
  const [phase, setPhase] = useState("start"); // start | playing | result
  const [lastScore, setLastScore] = useState(0);
  const [attemptsUsed, setAttemptsUsed] = useState(0);

  useEffect(() => {
    const stored = Number(sessionStorage.getItem(ATTEMPTS_KEY) || 0);
    setAttemptsUsed(stored);
  }, []);

  const attemptsLeft = Math.max(0, GAME_CONFIG.maxAttemptsPerDay - attemptsUsed);

  const handleStart = useCallback(() => {
    if (attemptsLeft <= 0) return;
    setPhase("playing");
  }, [attemptsLeft]);

  const handleComplete = useCallback(
    (score) => {
      setLastScore(score);
      const next = attemptsUsed + 1;
      setAttemptsUsed(next);
      sessionStorage.setItem(ATTEMPTS_KEY, String(next));
      setPhase("result");
    },
    [attemptsUsed]
  );

  const handlePlayAgain = useCallback(() => {
    if (attemptsLeft <= 0) {
      setPhase("start");
      return;
    }
    setPhase("start");
  }, [attemptsLeft]);

  const reward = getReward(lastScore);

  return (
    <section className={styles.wrap} aria-labelledby="play-earn-heading">
      <div className={styles.headerRow}>
        <div>
          <p className={styles.kicker}>Play &amp; Earn</p>
          <h2 id="play-earn-heading" className={styles.title}>{GAME_CONFIG.name}</h2>
        </div>
        <span className={styles.attemptsBadge}>
          <span className="data-num">{attemptsLeft}</span> / {GAME_CONFIG.maxAttemptsPerDay} attempts left today
        </span>
      </div>

      <div className={styles.stage}>
        {phase === "start" && (
          <GameStart
            attemptsLeft={attemptsLeft}
            onStart={handleStart}
          />
        )}
        {phase === "playing" && (
          <GamePlay
            durationSeconds={GAME_CONFIG.durationSeconds}
            onComplete={handleComplete}
          />
        )}
        {phase === "result" && (
          <GameResult
            score={lastScore}
            reward={reward}
            attemptsLeft={attemptsLeft}
            onPlayAgain={handlePlayAgain}
            onXPEarned={onXPEarned}
          />
        )}
      </div>

      <p className={styles.disclaimer}>
        Prototype: score, attempts and rewards are simulated locally for this
        demo and are not yet connected to backend reward processing.
      </p>
    </section>
  );
}
