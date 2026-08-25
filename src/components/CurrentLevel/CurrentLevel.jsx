import { Info } from "lucide-react";
import { useState } from "react";
import XPProgress from "../XPProgress/XPProgress";
import styles from "./CurrentLevel.module.css";

export default function CurrentLevel({ levelData }) {
  const [showInfo, setShowInfo] = useState(false);
  const { currentLevel, currentLevelName, currentXP, requiredXP } = levelData;

  return (
    <section className={styles.card} aria-labelledby="current-level-heading">
      <div className={styles.topRow}>
        <div className={styles.badgeGroup}>
          <div className={styles.badge}>
            <span className={`${styles.badgeNum} data-num`}>{String(currentLevel).padStart(2, "0")}</span>
          </div>
          <div>
            <p className={styles.kicker} id="current-level-heading">Current Level</p>
            <h2 className={styles.name}>
              Level {currentLevel} · {currentLevelName}
            </h2>
          </div>
        </div>

        <button
          className={styles.infoBtn}
          onClick={() => setShowInfo((s) => !s)}
          aria-expanded={showInfo}
          aria-label="What is XP?"
        >
          <Info size={16} />
        </button>
      </div>

      {showInfo && (
        <p className={styles.infoText} role="note">
          XP helps you progress through VELOOP Rewards levels. As you reach new levels,
          you may unlock additional rewards and experiences according to the platform's
          level system.
        </p>
      )}

      <div className={styles.xpBlock}>
        <p className={styles.kicker}>Current XP</p>
        <p className={`${styles.xpValue} data-num`}>{currentXP.toLocaleString()} XP</p>
      </div>

      <XPProgress currentXP={currentXP} requiredXP={requiredXP} level={currentLevel} />
    </section>
  );
}
