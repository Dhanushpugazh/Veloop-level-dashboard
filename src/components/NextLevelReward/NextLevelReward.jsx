import { Lock, Info, Gem, Coins } from "lucide-react";
import { useState } from "react";
import styles from "./NextLevelReward.module.css";

const ICONS = { VEs: Coins, Gems: Gem, Spins: Coins };

export default function NextLevelReward({ levelData }) {
  const [showInfo, setShowInfo] = useState(false);
  const { currentXP, requiredXP, nextLevel, nextLevelReward } = levelData;
  const pct = Math.min(100, Math.round((currentXP / requiredXP) * 100));
  const Icon = ICONS[nextLevelReward.type] || Gem;

  return (
    <section className={styles.card} aria-labelledby="next-reward-heading">
      <div className={styles.header}>
        <p className={styles.kicker} id="next-reward-heading">Next Level Reward</p>
        <button
          className={styles.infoBtn}
          onClick={() => setShowInfo((s) => !s)}
          aria-expanded={showInfo}
          aria-label="About this reward"
        >
          <Info size={14} />
        </button>
      </div>

      <div className={styles.vault}>
        <div className={styles.lockRing}>
          <Lock size={18} />
        </div>
        <Icon size={40} className={styles.rewardIcon} />
        <p className={`${styles.amount} data-num`}>
          {nextLevelReward.amount.toLocaleString()} {nextLevelReward.type}
        </p>
      </div>

      <p className={styles.unlockLine}>Reach Level {String(nextLevel).padStart(2, "0")} to unlock</p>

      <div className={styles.miniTrack} aria-hidden="true">
        <div className={styles.miniFill} style={{ width: `${pct}%` }} />
      </div>
      <p className={`${styles.miniPct} data-num`}>{pct}% there</p>

      {showInfo && (
        <p className={styles.infoText} role="note">
          The displayed reward is associated with the next level according to the
          current reward configuration.
        </p>
      )}
    </section>
  );
}
