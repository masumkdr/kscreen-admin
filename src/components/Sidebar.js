import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MovieIcon from "@mui/icons-material/Movie";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

// =====================
//  MENU ITEMS
// =====================
const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Movies", icon: <MovieIcon />, path: "/movies" },
  { text: "Theaters", icon: <TheaterComedyIcon />, path: "/theaters" },
  { text: "Bookings", icon: <EventSeatIcon />, path: "/bookings" },
  { text: "Users", icon: <PeopleIcon />, path: "/users" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

// =====================
//  LOGO COMPONENT
// =====================
function BrandLogo() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <a
      href="/"
      className="w-full flex items-center justify-center py-4"
      title="K-SCREEN Admin"
    >
      <img
        src={isDark ? "/K-SCREEN-LOGO-W.png" : "/K-SCREEN-LOGO.png"}
        alt="K-SCREEN"
        className="h-8 w-auto transition-all duration-300"
        loading="eager"
      />
    </a>
  );
}

// =====================
//  SIDEBAR COMPONENT
// =====================
export default function Sidebar({ mobileOpen, handleDrawerToggle, drawerWidth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const drawer = (
    <div
      className={`h-full transition-colors duration-300 ${
        isDark ? "bg-[#111827] text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* ====== LOGO ====== */}
      <Toolbar className="px-4 border-b border-gray-200 dark:border-gray-700 !min-h-[64px]">
        <BrandLogo />
      </Toolbar>

      {/* ====== MENU LIST ====== */}
      <List className="mt-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                className={`mx-2 my-1 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gold text-gray-900 dark:bg-gold-dark dark:text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <ListItemIcon
                  className={`min-w-[40px] ${
                    isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    className: `${
                      isActive
                        ? "font-medium text-gray-900 dark:text-white"
                        : "text-gray-800 dark:text-gray-200"
                    }`,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* ====== FOOTER ====== */}
      <Divider className="mx-4 mt-2 border-gray-300 dark:border-gray-700" />
      <div className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400 pb-4">
        © {new Date().getFullYear()} K-SCREEN Admin
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            zIndex: 1100,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}