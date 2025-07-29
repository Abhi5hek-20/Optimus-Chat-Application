import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("optimus-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("optimus-theme", theme);
    set({ theme });
  },
}));