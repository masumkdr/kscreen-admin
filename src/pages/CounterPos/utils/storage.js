import { useState } from "react";

export const lsGet = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === "undefined") return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};
export const lsSet = (key, val) => localStorage.setItem(key, JSON.stringify(val));

export const fmtBDT = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;
export const todayISO = () => new Date().toISOString().split("T")[0];
export const addDaysISO = (d) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString().split("T")[0];
};
export const genId = (prefix = "T") =>
  `${prefix}${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}-${Math.floor(
    Math.random() * 9999
  )}`;

// Core datasets
export const getMovies = () => lsGet("movies_data", []);
export const getShowtimeTable = () => lsGet("showtimes", {}); // unified by movieId
export const getLocations = () => lsGet("locations_data", []); // full master list
export const getSeatLayout = (hallId) => lsGet(`seat_layout_${hallId}`, null);
export const getSales = () => lsGet("ticket_sales", []);
export const addSale = (sale) => {
  const all = lsGet("ticket_sales", []);
  all.push(sale);
  lsSet("ticket_sales", all);
};

// Hook
export const useCatalog = () => {
  const [movies] = useState(getMovies());
  const [showtimes] = useState(getShowtimeTable());
  const [locations] = useState(getLocations());
  const [sales, setSales] = useState(getSales());
  const pushSale = (sale) => {
    const next = [...sales, sale];
    setSales(next);
    lsSet("ticket_sales", next);
  };
  return { movies, showtimes, locations, sales, pushSale };
};

// Derived helpers (kept for convenience but POS now controls order)
export const getLocationsForMovie = (movieId) => {
  const table = getShowtimeTable();
  const entry = table[movieId];
  if (!entry) return [];
  const pairs = entry.halls.map((h) => ({ location_id: h.location_id, location_name: h.location_name }));
  return pairs.filter((v, i, a) => a.findIndex((x) => x.location_id === v.location_id) === i);
};

export const getHallsForMovieLocation = (movieId, locationId) => {
  const table = getShowtimeTable();
  const entry = table[movieId];
  if (!entry) return [];
  return entry.halls.filter((h) => String(h.location_id) === String(locationId));
};

export const getDatesForHall = (movieId, hallId) => {
  const table = getShowtimeTable();
  const hall = table[movieId]?.halls.find((h) => String(h.hall_id) === String(hallId));
  if (!hall) return [];
  const dates = hall.showtimes.flatMap((s) => (s.dates || []).map((d) => d.date));
  return [...new Set(dates)];
};

// ---------------------------------------------------------
// Return all time slots for a movie + hall + specific date
// ---------------------------------------------------------
export const getTimeSlots = (movieId, hallId, date) => {
  const table = getShowtimeTable();
  const hall = table[movieId]?.halls.find((h) => h.hall_id == hallId);
  if (!hall) return [];

  for (const s of hall.showtimes || []) {
    for (const d of s.dates || []) {
      // normalize dates to YYYY-MM-DD before comparing
      const normalized = new Date(d.date).toISOString().slice(0, 10);
      if (normalized === date) {
        return d.slots || []; // ✅ use 'slots' not 'time_slots'
      }
    }
  }
  return [];
};

// ---------------------------------------------------------
// Return seat pricing for a specific time slot
// ---------------------------------------------------------
export const getSeatPricing = (movieId, hallId, date, slotId) => {
  const slots = getTimeSlots(movieId, hallId, date);
  const slot = slots.find((s) => String(s.id) === String(slotId));
  // flatten base + taxes to total if needed
  if (!slot) return [];
  return slot.seat_pricing.map((sp) => ({
    seat_type: sp.seat_type,
    price_total:
      (sp.base || 0) +
      (sp.acm || 0) +
      (sp.sslc || 0) +
      (sp.vat || 0) +
      (sp.mtax || 0) +
      (sp.htax || 0) +
      (sp.other || 0),
  }));
};
