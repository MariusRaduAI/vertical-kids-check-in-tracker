
import { useState } from "react";
import { STORAGE_KEYS } from "../types";
import { getCurrentSunday } from "@/data/mockData";

export function useCurrentSunday() {
  const [currentSunday, setCurrentSunday] = useState<string>(() => {
    const storedSunday = localStorage.getItem(STORAGE_KEYS.CURRENT_SUNDAY);
    return storedSunday || getCurrentSunday();
  });

  return {
    currentSunday,
    setCurrentSunday
  };
}
