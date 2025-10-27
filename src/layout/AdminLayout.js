import React, { useState, useContext } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import Sidebar from "../components/Sidebar";
import { ColorModeContext } from "../context/ThemeContext";

const drawerWidth = 240;

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex" }}>
      {/* ========== HEADER / APPBAR ========== */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
          transition: "background-color 0.3s ease",
        }}
      >
        <Toolbar className="flex justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Header logo */}
            <img
              src={isDark ? "/K-SCREEN-LOGO-W.png" : "/K-SCREEN-LOGO.png"}
              alt="K-SCREEN"
              className="h-7 w-auto"
              loading="eager"
            />

            <Typography variant="h6" noWrap className="font-semibold">
              K SCREEN Admin
            </Typography>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Avatar
              alt="Admin"
              src="/static/images/avatar/1.jpg"
              className="cursor-pointer"
            />
          </div>
        </Toolbar>
      </AppBar>

      {/* ========== SIDEBAR ========== */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

      {/* ========== MAIN CONTENT ========== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
        className="min-h-screen"
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}