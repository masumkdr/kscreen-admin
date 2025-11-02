import { useState } from 'react';

export const lsGet = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === 'undefined') return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};
export const lsSet = (key, val) => localStorage.setItem(key, JSON.stringify(val));

export const fmtBDT = (n) => `৳${Number(n || 0).toLocaleString('en-BD')}`;
export const todayISO = () => new Date().toISOString().split('T')[0];
export const addDaysISO = (d) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString().split('T')[0];
};
export const genId = (prefix = 'T') => `${prefix}${new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0,14)}-${Math.floor(Math.random()*9999)}`;

const autoLayout = (hall_id, rows = 8, cols = 12) => {
  const seats = {};
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  for (let r = 0; r < rows; r++) {
    const rowLabel = letters[r];
    for (let c = 1; c <= cols; c++) {
      const id = `${rowLabel}${c}`;
      let type = 'Regular';
      if (r < 2) type = 'VIP';
      seats[id] = { type };
    }
  }
  return { hall_id, rows, cols, seats };
};

export function ensureMockData() {
  const locations = lsGet('locations_data', [
    { id: 1, name: 'Dhaka' },
    { id: 2, name: 'Chattogram' },
    { id: 3, name: 'Sylhet' },
  ]); lsSet('locations_data', locations);

  const movies = lsGet('movies_data', [
    { id: 101, name: 'Avatar 3', poster: 'https://picsum.photos/200/300?random=11', locations: [1,2], dates: [todayISO(), addDaysISO(1), addDaysISO(2)], status: 'now_showing' },
    { id: 102, name: 'Dune: Part Two', poster: 'https://picsum.photos/200/300?random=22', locations: [1], dates: [todayISO(), addDaysISO(1)], status: 'now_showing' },
  ]); lsSet('movies_data', movies);

  const halls = lsGet('halls_data', [
    { id: 5, name: 'Hall 1', location_id: 1 },
    { id: 6, name: 'Hall 2', location_id: 1 },
    { id: 7, name: 'CTG Hall A', location_id: 2 },
  ]); lsSet('halls_data', halls);

  const showtimes = lsGet('showtimes_data', [
    { id: 20, movie_id: 101, hall_id: 5, location_id: 1, date: todayISO(), time: '14:30' },
    { id: 21, movie_id: 101, hall_id: 5, location_id: 1, date: todayISO(), time: '19:30' },
    { id: 22, movie_id: 102, hall_id: 6, location_id: 1, date: todayISO(), time: '17:00' },
    { id: 23, movie_id: 101, hall_id: 7, location_id: 2, date: todayISO(), time: '20:00' },
  ]); lsSet('showtimes_data', showtimes);

  const pricing = lsGet('showtime_pricing', [
    { showtime_id: 20, seat_type: 'Regular', price_total: 300 },
    { showtime_id: 20, seat_type: 'VIP',     price_total: 500 },
    { showtime_id: 21, seat_type: 'Regular', price_total: 320 },
    { showtime_id: 21, seat_type: 'VIP',     price_total: 520 },
    { showtime_id: 22, seat_type: 'Regular', price_total: 280 },
    { showtime_id: 22, seat_type: 'Couple',  price_total: 700 },
    { showtime_id: 23, seat_type: 'Regular', price_total: 260 },
  ]); lsSet('showtime_pricing', pricing);

  const layouts = lsGet('seat_layouts', [
    autoLayout(5, 8, 12),
    autoLayout(6, 6, 10),
    autoLayout(7, 6, 10),
  ]); lsSet('seat_layouts', layouts);

  const sales = lsGet('ticket_sales', []); lsSet('ticket_sales', sales);
}

export const useCatalog = () => {
  const [locations] = useState(lsGet('locations_data', []));
  const [movies]    = useState(lsGet('movies_data', []));
  const [halls]     = useState(lsGet('halls_data', []));
  const [showtimes] = useState(lsGet('showtimes_data', []));
  const [pricing]   = useState(lsGet('showtime_pricing', []));
  const [layouts]   = useState(lsGet('seat_layouts', []));
  const [sales, setSales] = useState(lsGet('ticket_sales', []));

  const addSale = (sale) => {
    const next = [...sales, sale];
    setSales(next);
    lsSet('ticket_sales', next);
  };

  return { locations, movies, halls, showtimes, pricing, layouts, sales, addSale };
};