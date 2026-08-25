import { useState } from "react";
import { Check, Lock, MapPin, Coins, Gem } from "lucide-react";
import styles from "./LevelRoadmap.module.css";

const ICONS = { VEs: Coins, Gems: Gem, Spins: Coins };

function statusIcon(status) {
  if (status === "completed") return <Check size={14} />;
  if (status === "current") return <MapPin size={14} />;
  if (status === "locked") return <Lock size={13} />;
  return null;
}

export default function LevelRoadmap({ roadmap }) {
  const [openLevel, setOpenLevel] = useState(null);

  return (
    <section className={styles.wrap} aria-label="Level roadmap">
      <p className={styles.kicker}>Level Roadmap</p>
      <div className={styles.track}>
        <div className={styles.spine} aria-hidden="true" />
        <ol className={styles.list}>
          {roadmap.map((lvl) => {
            const RewardIcon = ICONS[lvl.reward.type] || Coins;
            const isOpen = openLevel === lvl.level;
            return (
              <li key={lvl.level} className={styles.item} data-status={lvl.status}>
                <button
                  className={styles.node}
                  onClick={() => setOpenLevel(isOpen ? null : lvl.level)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.nodeDot}>{statusIcon(lvl.status)}</span>
                  <span className={styles.nodeBody}>
                    <span className={styles.nodeTop}>
                      <span className={styles.nodeLevel}>
                        Level {String(lvl.level).padStart(2, "0")}
                      </span>
                      {lvl.status === "current" && (
                        <span className={styles.youAreHere}>You are here</span>
                      )}
                    </span>
                    <span className={styles.nodeName}>{lvl.name}</span>
                  </span>
                  <span className={styles.nodeReward}>
                    <RewardIcon size={14} />
                    <span className="data-num">{lvl.reward.amount}</span>
                  </span>
                </button>

                {isOpen && (
                  <div className={styles.detail} role="note">
                    {lvl.status === "completed" && "Completed — reward already credited."}
                    {lvl.status === "current" && "This is your current level."}
                    {lvl.status === "next" && "Your next goal — keep earning XP to unlock it."}
                    {lvl.status === "locked" && "Locked until you reach the previous level."}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
