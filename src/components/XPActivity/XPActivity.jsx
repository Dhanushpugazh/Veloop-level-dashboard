import { Plus, Zap } from "lucide-react";
import styles from "./XPActivity.module.css";

export default function XPActivity({ activity }) {
  const isEmpty = !activity || activity.length === 0;

  return (
    <section className={styles.wrap} aria-labelledby="xp-activity-heading">
      <p className={styles.kicker} id="xp-activity-heading">Recent XP Activity</p>

      {isEmpty ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><Zap size={20} /></div>
          <p className={styles.emptyTitle}>Your XP journey starts here.</p>
          <button className={styles.emptyCta}>Start Earning XP →</button>
        </div>
      ) : (
        <ul className={styles.list}>
          {activity.map((entry) => (
            <li key={entry.id} className={styles.item}>
              <span className={styles.plusIcon}>
                <Plus size={12} />
              </span>
              <span className={styles.itemBody}>
                <span className={`${styles.itemAmount} data-num`}>+{entry.amount} XP</span>
                <span className={styles.itemSource}>{entry.source}</span>
              </span>
              <span className={styles.itemTime}>{entry.time}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
