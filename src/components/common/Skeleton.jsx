import styles from "./common.module.css";

export function DashboardSkeleton() {
  return (
    <div className={styles.skeletonPage} aria-busy="true" aria-label="Loading level progress">
      <div className={`${styles.skel} ${styles.skelHero}`} />
      <div className={styles.skelGrid}>
        <div className={`${styles.skel} ${styles.skelCard}`} />
        <div className={`${styles.skel} ${styles.skelCardSmall}`} />
      </div>
      <div className={`${styles.skel} ${styles.skelWide}`} />
      <div className={styles.skelGrid}>
        <div className={`${styles.skel} ${styles.skelCard}`} />
        <div className={`${styles.skel} ${styles.skelCardSmall}`} />
      </div>
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <div className={styles.errorWrap} role="alert">
      <p className={styles.errorTitle}>Unable to Load Level Progress</p>
      <p className={styles.errorSub}>
        We couldn't load your level information right now.
      </p>
      <button className={styles.retryBtn} onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}
