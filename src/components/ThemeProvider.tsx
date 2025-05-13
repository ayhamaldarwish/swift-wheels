
import React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const useTheme = () => {
  return {
    theme: "light",
    setTheme: () => {},
    toggleTheme: () => {},
  };
};
