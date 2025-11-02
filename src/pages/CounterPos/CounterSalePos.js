import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ensureMockData, useCatalog, todayISO, addDaysISO } from './utils/storage';
import Section from './components/Section';
import StepLocation from './components/StepLocation';
import StepDate from './components/StepDate';
import StepMovie from './components/StepMovie';
import StepHallTime from './components/StepHallTime';
import StepSeatType from './components/StepSeatType';
import StepSeatCount from './components/StepSeatCount';
import StepPayment from './components/StepPayment';
import StepSeatLayout from './components/StepSeatLayout';
import ConfirmDialog from './components/ConfirmDialog';
import SummaryPanel from './components/SummaryPanel';

export default function CounterSalePOS() {
  useEffect(() => ensureMockData(), []);
  const { locations, movies, halls, showtimes, pricing, layouts, sales, addSale } = useCatalog();

  const [step] = useState(1); // Step indicator retained for header only (all steps visible)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState({
    location_id: locations[0]?.id || 1,
    date: todayISO(),
    movie_id: null,
    hall_id: null,
    showtime_id: null,
    seat_type: null,
    seat_qty: 0,
    price_each: 0,
    selected_seats: [],
    payment_method: 'Cash',
    received_amount: '',
  });
  const update = (patch) => setForm((p) => ({ ...p, ...patch }));

  const quickDates = [todayISO(), addDaysISO(1), addDaysISO(2)];

  const moviesForSelection = useMemo(() => movies.filter(
    (m) => m.status === 'now_showing' && m.locations?.includes(form.location_id) && m.dates?.includes(form.date)
  ), [movies, form.location_id, form.date]);

  const showtimesForMovie = useMemo(() => {
    if (!form.movie_id) return [];
    return showtimes.filter(
      (s) => s.movie_id === form.movie_id && s.location_id === form.location_id && s.date === form.date
    );
  }, [showtimes, form.movie_id, form.location_id, form.date]);

  const hallsForMovie = useMemo(() => {
    const hallIds = [...new Set(showtimesForMovie.map((s) => s.hall_id))];
    return halls.filter((h) => hallIds.includes(h.id));
  }, [halls, showtimesForMovie]);

  const seatTypesAvailable = useMemo(() => {
    if (!form.showtime_id) return [];
    const list = pricing.filter((p) => p.showtime_id === form.showtime_id);
    return list.map((p) => ({ type: p.seat_type, price: p.price_total }));
  }, [pricing, form.showtime_id]);

  const currentLayout = useMemo(() => (form.hall_id ? (layouts.find((l) => l.hall_id === form.hall_id) || null) : null), [layouts, form.hall_id]);

  const soldSeatIdsForThisShow = useMemo(() => {
    if (!form.showtime_id) return new Set();
    const sold = sales.filter((s) => s.showtime_id === form.showtime_id).flatMap((s) => s.seat_ids || []);
    return new Set(sold);
  }, [sales, form.showtime_id]);

  const total = (form.price_each || 0) * (form.selected_seats?.length || form.seat_qty || 0);
  const change = Math.max(0, Number(form.received_amount || 0) - total);
  const canConfirm = form.selected_seats.length === form.seat_qty && total > 0 && form.payment_method && Number(form.received_amount || 0) >= total;

  return (
    <Box className="min-h-screen bg-gray-950 text-gray-200">
      {/* Header */}
      <Box className="sticky top-0 bg-gray-900 border-b border-gray-800">
        <Box className="max-w-7xl mx-auto flex items-center justify-between p-3">
          <Stack direction="row" spacing={2} alignItems="center">
            <img src="/mnt/data/K-SCREEN-LOGO-W 2.png" alt="KSCREEN" className="h-8" onError={(e)=>{e.currentTarget.style.display='none'}} />
            <Typography variant="h6" sx={{ color: '#bfa14a', fontWeight: 700 }}>Counter Sale</Typography>
            <Chip size="small" label={`Step ${step}/8`} sx={{ bgcolor: '#2a2a2a', color: '#bfa14a' }} />
          </Stack>
          <Button size="small" startIcon={<ShoppingCartIcon />} variant="contained" sx={{ bgcolor: '#bfa14a', color: '#141414', fontWeight: 700 }}>New Ticket</Button>
        </Box>
      </Box>

      {/* Body */}
      <Box className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: All steps stacked */}
        <Box className="lg:col-span-2 space-y-12">
          <StepLocation form={form} update={update} locations={locations} />
          <StepDate form={form} update={update} quickDates={quickDates} />
          <StepMovie form={form} update={update} movies={moviesForSelection} />
          <StepHallTime form={form} update={update} halls={hallsForMovie} showtimes={showtimesForMovie} />
          <StepSeatType form={form} update={update} seatTypes={seatTypesAvailable} pricing={pricing} />
          <StepSeatCount form={form} update={update} />
          <StepPayment form={form} update={update} change={change} />
          <StepSeatLayout form={form} update={update} layout={currentLayout} soldSeatIds={soldSeatIdsForThisShow} />

          <Box className="flex justify-end mt-4">
            <Button disabled={!canConfirm} onClick={() => setConfirmOpen(true)} variant="contained" sx={{ bgcolor: canConfirm ? '#bfa14a' : '#6b7280', color: '#141414', fontWeight: 700 }}>Confirm & Sell</Button>
          </Box>
        </Box>

        {/* Right: Summary */}
        <SummaryPanel form={form} locations={locations} movies={movies} halls={halls} total={total} />
      </Box>

      {/* Confirm */}
      <ConfirmDialog open={confirmOpen} setOpen={setConfirmOpen} form={form} addSale={addSale} total={total} change={change} locations={locations} movies={movies} halls={halls} showtimes={showtimes} />
    </Box>
  );
}