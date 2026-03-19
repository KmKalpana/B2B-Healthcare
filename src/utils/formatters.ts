import { TIME_LABELS } from "./constants/dashboard";

 export const formatTimeAgo = (timeDiff: number): string => {
    const minutes = Math.floor(timeDiff / (1000 * 60));

    if (minutes < 1) return TIME_LABELS.JUST_NOW;
    if (minutes < 60) return `${minutes}${TIME_LABELS.MINUTES}`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}${TIME_LABELS.HOURS}`;

    const days = Math.floor(hours / 24);
    return `${days}${TIME_LABELS.DAYS}`;
  };