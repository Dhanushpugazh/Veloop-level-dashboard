import { useEffect, useState, useCallback } from "react";
import {
  DUMMY_USER_LEVEL_DATA,
  DUMMY_LEVEL_ROADMAP,
  DUMMY_XP_ACTIVITY,
  DUMMY_EARNING_FEATURES,
} from "../data/levelConfig";

// Simulates a network call. Swap the resolve() body for a real fetch()
// to `/api/level` (or similar) when the backend is ready — every
// component below only depends on this hook's return shape.
function fetchLevelData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        levelData: DUMMY_USER_LEVEL_DATA,
        roadmap: DUMMY_LEVEL_ROADMAP,
        activity: DUMMY_XP_ACTIVITY,
        earningFeatures: DUMMY_EARNING_FEATURES,
      });
    }, 900);
  });
}

export function useLevelData() {
  const [state, setState] = useState({
    status: "loading", // loading | success | error
    data: null,
  });

  const load = useCallback(() => {
    setState({ status: "loading", data: null });
    fetchLevelData()
      .then((data) => setState({ status: "success", data }))
      .catch(() => setState({ status: "error", data: null }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, retry: load };
}
