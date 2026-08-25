import { useEffect, useRef, useState } from "react";
import styles from "./XPProgress.module.css";

export default function XPProgress({ currentXP, requiredXP, level }) {
  const pct = Math.min(100, Math.round((currentXP / requiredXP) * 100));
  const [animatedPct, setAnimatedPct] = useState(0);
  const barRef = useRef(null);

  useEffect(() => {
    // animate on mount, respects prefers-reduced-motion via CSS transition removal
    const raf = requestAnimationFrame(() => setAnimatedPct(pct));
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  const remaining = Math.max(0, requiredXP - currentXP);

  return (
    <div className={styles.wrap}>
      <div className={styles.labelRow}>
        <span className={styles.levelTag}>Level {String(level).padStart(2, "0")}</span>
        <span className={`${styles.xpFraction} data-num`}>
          {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
        </span>
      </div>

      <div
        className={styles.track}
        ref={barRef}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Level ${level} progress`}
      >
        <div className={styles.fill} style={{ width: `${animatedPct}%` }} />
      </div>

      <div className={styles.footRow}>
        <span className={`${styles.pct} data-num`}>{pct}%</span>
        <span className={styles.remaining}>
          <span className="data-num">{remaining.toLocaleString()}</span> XP remaining
        </span>
      </div>
    </div>
  );
}
