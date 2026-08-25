import { useState, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { useLevelData } from "../../hooks/useLevelData";
import { DashboardSkeleton, ErrorState } from "../../components/common/Skeleton";
import LevelHero from "../../components/LevelHero/LevelHero";
import CurrentLevel from "../../components/CurrentLevel/CurrentLevel";
import NextLevelReward from "../../components/NextLevelReward/NextLevelReward";
import LevelRoadmap from "../../components/LevelRoadmap/LevelRoadmap";
import GameContainer from "../../components/PlayAndEarn/GameContainer";
import XPActivity from "../../components/XPActivity/XPActivity";
import EarnMoreXP from "../../components/EarnMoreXP/EarnMoreXP";
import LevelUpModal from "../../components/LevelUpModal/LevelUpModal";
import styles from "./LevelDashboard.module.css";

export default function LevelDashboard() {
  const { status, data, retry } = useLevelData();
  const [localXP, setLocalXP] = useState(null);
  const [levelUpOpen, setLevelUpOpen] = useState(false);

  const handleXPEarned = useCallback(
    (amount) => {
      if (!data) return;
      const base = localXP ?? data.levelData.currentXP;
      const newXP = base + amount;

      if (newXP >= data.levelData.requiredXP) {
        setLevelUpOpen(true);
      }
      setLocalXP(newXP);
    },
    [data, localXP]
  );

  if (status === "loading") return <DashboardSkeleton />;
  if (status === "error") return <ErrorState onRetry={retry} />;

  const { levelData, roadmap, activity, earningFeatures } = data;
  const effectiveXP = localXP ?? levelData.currentXP;
  const remaining = Math.max(0, levelData.requiredXP - effectiveXP);
  const liveLevelData = { ...levelData, currentXP: Math.min(effectiveXP, levelData.requiredXP) };

  return (
    <div className={styles.page}>
      <LevelHero />

      <div className={styles.container}>
        <div className={styles.recommend}>
          <Sparkles size={16} />
          <span>
            You're only <strong className="data-num">{remaining.toLocaleString()}</strong> XP away
            from Level {levelData.nextLevel}. Play the challenge or complete a daily task to close the gap.
          </span>
        </div>

        <div className={styles.topGrid}>
          <CurrentLevel levelData={liveLevelData} />
          <NextLevelReward levelData={liveLevelData} />
        </div>

        <LevelRoadmap roadmap={roadmap} />

        <div className={styles.midGrid}>
          <GameContainer onXPEarned={handleXPEarned} />
          <XPActivity activity={activity} />
        </div>

        <EarnMoreXP features={earningFeatures} />
      </div>

      <LevelUpModal
        open={levelUpOpen}
        level={levelData.nextLevel}
        reward={levelData.nextLevelReward}
        onContinue={() => setLevelUpOpen(false)}
      />
    </div>
  );
}
