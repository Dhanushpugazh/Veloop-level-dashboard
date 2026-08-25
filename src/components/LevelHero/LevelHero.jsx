import styles from "./LevelHero.module.css";

export default function LevelHero() {
  return (
    <header className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <p className={styles.eyebrow}>Level Progression</p>
      <h1 className={styles.title}>Level Up Your Rewards</h1>
      <p className={styles.subtitle}>
        Keep earning XP, unlock new levels, and discover better rewards along the way.
      </p>
    </header>
  );
}
