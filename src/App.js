import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import Theaters from "./pages/Theaters";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Organizations from "./pages/Organizations";
import Locations from "./pages/Locations";
import Halls from "./pages/Halls";
import SeatTypes from "./pages/SeatTypes";
import SeatLayouts from "./pages/SeatLayouts/SeatLayouts";
import SeatLayoutBuilder from "./pages/SeatLayouts/SeatLayoutBuilder";
import Categories from "./pages/Categories";
import Origins from "./pages/Origins";
import Languages from "./pages/Languages";
import Genres from "./pages/Genres";
import MovieDetails from "./pages/MoviesComponent/MovieDetails";
import ShowtimeManager from "./pages/ShowTimeManager";
import TimeSlots from "./pages/TimeSlots";

export default function App() {
  const location = useLocation();

  // Simple animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <AdminLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Dashboard />
              </motion.div>
            }
          />
          <Route
            path="/organizations"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Organizations />
              </motion.div>
            }
          />
          <Route
            path="/locations"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Locations />
              </motion.div>
            }
          />
           <Route
            path="/theaters"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Theaters />
              </motion.div>
            }
          />
              <Route
            path="/seat_types"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SeatTypes />
              </motion.div>
            }
          />
           <Route
            path="/halls"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Halls />
              </motion.div>
            }
          />
          <Route
            path="/seat_layouts"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SeatLayouts />
              </motion.div>
            }
          />
          <Route
            path="/seat_layouts/new"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SeatLayoutBuilder />
              </motion.div>
            }
          />
           <Route
            path="/seat_layouts/edit/:id"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SeatLayoutBuilder />
              </motion.div>
            }
          />
          <Route
            path="/categories"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Categories />
              </motion.div>
            }
          />
          <Route
            path="/origins"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Origins />
              </motion.div>
            }
          />
          <Route
            path="/languages"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Languages />
              </motion.div>
            }
          />
          <Route
            path="/genres"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Genres />
              </motion.div>
            }
          />
          <Route
            path="/timeslots"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <TimeSlots />
              </motion.div>
            }
          />
            <Route
            path="/movies"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Movies />
              </motion.div>
            }
          />
            <Route
            path="/movie/:id"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <MovieDetails />
              </motion.div>
            }
          />
            <Route
            path="/showtimes"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ShowtimeManager />
              </motion.div>
            }
          />
          <Route
            path="/users"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Users />
              </motion.div>
            }
          />
          <Route
            path="/settings"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Settings />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </AdminLayout>
  );
}

