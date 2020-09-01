import * as React from "react";
import { useMediaQuery } from "@material-ui/core";

const persist = (key: string, value: boolean) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, String(value));
  }
};

const getPersisted = (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem(key);

  return value == null ? value : value === "true";
};

let initialized = false;

export const usePersistentDarkModePreference = (persistentKey: string): [boolean, () => void] => {
  const [prefersDarkMode, setDarkModePreference] = React.useState(useMediaQuery("(prefers-color-scheme: dark)"));
  const persisted = getPersisted(persistentKey);

  if (!initialized && persisted) {
    setDarkModePreference(persisted);
  }

  initialized = true;
  persist(persistentKey, prefersDarkMode);

  const toggle = React.useCallback(() => setDarkModePreference(!prefersDarkMode), [prefersDarkMode]);
  return [prefersDarkMode, toggle];
};
