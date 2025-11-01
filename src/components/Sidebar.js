import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TheaterComedy as TheaterComedyIcon,
  EventSeat as EventSeatIcon,
  Chair as ChairIcon,
  Theaters as TheatersIcon,
  LocationCity as LocationCityIcon,
  Category as CategoryIcon,
  Public as PublicIcon,
  Language as LanguageIcon,
  MovieFilter as MovieFilterIcon,
  Movie as MovieIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as LocalOfferIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Schedule as ScheduleIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

// ========== LOGO ==========
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

// ========== SIDEBAR ==========
export default function Sidebar({ mobileOpen, handleDrawerToggle, drawerWidth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [openGroups, setOpenGroups] = useState({
    theaters: false,
    movies: false,
    coupons: false,
    reports: false,
    settings: false,
  });

  // auto-expand active group
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/locations") || path.startsWith("/theaters") || path.startsWith("/seat"))
      setOpenGroups((prev) => ({ ...prev, theaters: true }));
    if (path.startsWith("/categories") || path.startsWith("/movies"))
      setOpenGroups((prev) => ({ ...prev, movies: true }));
    if (path.startsWith("/coupons") || path.startsWith("/food"))
      setOpenGroups((prev) => ({ ...prev, coupons: true }));
    if (path.startsWith("/reports"))
      setOpenGroups((prev) => ({ ...prev, reports: true }));
    if (path.startsWith("/users") || path.startsWith("/roles"))
      setOpenGroups((prev) => ({ ...prev, settings: true }));
  }, [location.pathname]);

  const handleGroupToggle = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path) => location.pathname === path;

  // ========== MENU DEFINITIONS ==========
  const groups = [
    {
      key: "theaters",
      title: "Theaters",
      icon: <TheaterComedyIcon />,
      items: [
        { text: "Locations", icon: <LocationCityIcon />, path: "/locations" },
        { text: "Theaters", icon: <TheaterComedyIcon />, path: "/theaters" },
        { text: "Seat Types", icon: <ChairIcon />, path: "/seat_types" },
        { text: "Seat Layouts", icon: <EventSeatIcon />, path: "/seat_layouts" },
        { text: "Halls", icon: <TheatersIcon />, path: "/halls" },
      ],
    },
    {
      key: "movies",
      title: "Movies",
      icon: <MovieIcon />,
      items: [
        { text: "Categories", icon: <CategoryIcon />, path: "/categories" },
        { text: "Origins", icon: <PublicIcon />, path: "/origins" },
        { text: "Languages", icon: <LanguageIcon />, path: "/languages" },
        { text: "Genres", icon: <MovieFilterIcon />, path: "/genres" },
        { text: "Time Slots", icon: <ScheduleIcon />, path: "/timeslots" },
        { text: "Movies", icon: <MovieIcon />, path: "/movies" },
        { text: "Show Times", icon: <ScheduleIcon />, path: "/showtimes" },
      ],
    },
    {
      key: "coupons",
      title: "Coupons",
      icon: <LocalOfferIcon />,
      items: [
        { text: "Food Courts", icon: <RestaurantIcon />, path: "/food_courts" },
        { text: "Coupons", icon: <LocalOfferIcon />, path: "/coupons" },
      ],
    },
    {
      key: "reports",
      title: "Reports",
      icon: <AssessmentIcon />,
      items: [
        { text: "Sales Report", icon: <AssessmentIcon />, path: "/reports/sales" },
        { text: "Occupancy Report", icon: <AssessmentIcon />, path: "/reports/occupancy" },
      ],
    },
    {
      key: "settings",
      title: "Settings",
      icon: <SettingsIcon />,
      items: [
        { text: "Users", icon: <PeopleIcon />, path: "/users" },
        { text: "Roles", icon: <SettingsIcon />, path: "/roles" },
      ],
    },
  ];

  // ========== INDENTED ITEM ==========
  const renderSubItem = (item) => (
    <ListItemButton
      key={item.text}
      onClick={() => navigate(item.path)}
      sx={{ pl: 5 }} // ← indent
      className={`my-0.5 rounded-md relative transition-all duration-200 ${
        isActive(item.path)
          ? "bg-gold/10 text-gold border-l-4 border-gold dark:text-gold"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <ListItemIcon
        className={`min-w-[36px] ${
          isActive(item.path)
            ? "text-gold"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.text}
        primaryTypographyProps={{
          className: `text-sm ${
            isActive(item.path)
              ? "font-medium text-gold"
              : "text-gray-800 dark:text-gray-200"
          }`,
        }}
      />
    </ListItemButton>
  );

  // ========== DRAWER ==========
  const drawer = (
    <div
      className={`h-full transition-colors duration-300 ${
        isDark ? "bg-[#111827] text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* Logo */}
      <Toolbar className="px-4 border-b border-gray-200 dark:border-gray-700 !min-h-[64px]">
        <BrandLogo />
      </Toolbar>

      {/* Dashboard */}
      <ListItemButton
        onClick={() => navigate("/")}
        className={`mx-2 my-2 rounded-lg transition-all duration-200 ${
          isActive("/")
            ? "bg-gold text-gray-900 dark:bg-gold-dark dark:text-white"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <ListItemIcon
          className={`min-w-[40px] ${
            isActive("/")
              ? "text-gray-900 dark:text-white"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText
          primary="Dashboard"
          primaryTypographyProps={{
            className: `${
              isActive("/")
                ? "font-medium text-gray-900 dark:text-white"
                : "text-gray-800 dark:text-gray-200"
            }`,
          }}
        />
      </ListItemButton>

      <Divider className="mx-4 mb-2 border-gray-300 dark:border-gray-700" />

      {/* Collapsible Groups */}
      <List component="nav">
        {groups.map((group) => (
          <React.Fragment key={group.key}>
            <ListItemButton
              onClick={() => handleGroupToggle(group.key)}
              className="rounded-md"
            >
              <ListItemIcon
                className={`min-w-[40px] ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {group.icon}
              </ListItemIcon>
              <ListItemText
                primary={group.title}
                primaryTypographyProps={{
                  className: "font-semibold text-sm",
                }}
              />
              {openGroups[group.key] ? (
                <ExpandLess sx={{ color: isDark ? "#fff" : "#111" }} />
              ) : (
                <ExpandMore sx={{ color: isDark ? "#fff" : "#111" }} />
              )}
            </ListItemButton>

            <Collapse in={openGroups[group.key]} timeout="auto" unmountOnExit>
              {group.items.map(renderSubItem)}
            </Collapse>
          </React.Fragment>
        ))}
      </List>

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