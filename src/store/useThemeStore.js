import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "coffee",
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("chat-theme", theme);
    }
    set({ theme });
  },
}));

if (typeof window !== "undefined") {
  const savedTheme = window.localStorage.getItem("chat-theme");
  if (savedTheme) {
    useThemeStore.setState({ theme: savedTheme });
  }
}
