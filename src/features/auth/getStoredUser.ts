import { AuthUser } from "./authTypes";

export const getStoredUser = (): AuthUser | null => {
  try {
    const data = localStorage.getItem("auth");
    if (!data) return null;

    const parsed = JSON.parse(data);

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem("auth");
      return null;
    }

    return parsed.user;
  } catch {
    return null;
  }
};