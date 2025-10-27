import React, { createContext, useMemo, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Context to share toggle function
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState("light");

  // Load stored theme
  useEffect(() => {
    const saved = localStorage.getItem("kscreen-theme");
    if (saved) setMode(saved);
  }, []);

  // Toggle theme and persist to localStorage
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("kscreen-theme", next);
          return next;
        });
      },
    }),
    []
  );

  // =======================
  // 🎨 Custom K-SCREEN Theme
  // =======================
  const theme = useMemo(() => {
    const gold = "#C6A049"; // dark gold brand color

    return createTheme({
      palette: {
        mode,
        primary: {
          main: gold,
          light: "#D4AF37",
          dark: "#8C6E1E",
          contrastText: "#ffffff",
        },
        ...(mode === "light"
          ? {
              // ----- LIGHT MODE -----
              background: {
                default: "#f3f4f6", // Tailwind gray-100
                paper: "#ffffff",   // Header / Card / Drawer BG
              },
              text: {
                primary: "#111827", // Tailwind gray-900
                secondary: "#374151",
              },
              divider: "rgba(0,0,0,0.1)",
            }
          : {
              // ----- DARK MODE -----
              background: {
                default: "#111827", // Tailwind gray-900
                paper: "#111827",   // Match header background
              },
              text: {
                primary: "#f3f4f6", // Tailwind gray-100
                secondary: "#9ca3af", // Tailwind gray-400
              },
              divider: "rgba(255,255,255,0.1)",
            }),
      },
      typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 600,
            letterSpacing: "0.5px",
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 500,
          },
          button: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: "none",
              transition: "background-color 0.3s ease",
            },
          },
        },
      },
    });
  }, [mode]);

  // Sync Tailwind's .dark class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}