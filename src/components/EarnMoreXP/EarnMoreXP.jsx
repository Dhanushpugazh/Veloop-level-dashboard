import { ArrowRight, Eye, Trophy, Users, Flame, Target } from "lucide-react";
import styles from "./EarnMoreXP.module.css";

const ICON_MAP = {
  "daily-challenge": Trophy,
  "watch-earn": Eye,
  "refer-earn": Users,
  "streak-xp": Flame,
  "weekly-quest": Target,
};

export default function EarnMoreXP({ features }) {
  return (
    <section className={styles.wrap} aria-labelledby="earn-more-heading">
      <p className={styles.kicker}>Ways to reach your next level</p>
      <h2 id="earn-more-heading" className={styles.title}>Earn More XP &amp; Rewards</h2>

      <div className={styles.grid}>
        {features.map((f) => {
          const Icon = ICON_MAP[f.id] || Trophy;
          const comingSoon = f.status === "coming_soon";
          return (
            <div key={f.id} className={styles.card} data-soon={comingSoon}>
              {comingSoon && <span className={styles.soonTag}>Coming Soon</span>}
              <div className={styles.cardIcon}>
                <Icon size={20} />
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardXp}>Earn {f.xpLabel}</p>
              <p className={styles.cardDesc}>{f.description}</p>
              <button className={styles.cardBtn} disabled={comingSoon}>
                {comingSoon ? "Notify me" : "Start"} <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
