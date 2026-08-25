import { Trophy } from "lucide-react";
import styles from "./LevelUpModal.module.css";

export default function LevelUpModal({ open, level, reward, onContinue }) {
  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="levelup-title">
      <div className={styles.card}>
        <div className={styles.badgeRing}>
          <Trophy size={30} />
        </div>
        <p className={styles.eyebrow}>Achievement Unlocked</p>
        <h2 className={styles.title} id="levelup-title">LEVEL UP!</h2>
        <p className={`${styles.levelNum} data-num`}>Level {String(level).padStart(2, "0")}</p>

        {reward && (
          <div className={styles.rewardPill}>
            +<span className="data-num">{reward.amount}</span> {reward.type} Reward
          </div>
        )}

        <button className={styles.continueBtn} onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
