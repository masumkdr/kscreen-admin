// ===================================================
// CounterSalePOS.js — dynamic hall/slot refresh by date
// ===================================================
import React, { useMemo, useState } from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  useCatalog,
  fmtBDT,
  genId,
  todayISO,
  addDaysISO,
  getSeatLayout,
  getSeatPricing,
} from "./utils/storage";

import StepLocation from "./components/StepLocation";   // 1. Location
import StepMovie from "./components/StepMovie";         // 2. Movie
import StepDate from "./components/StepDate";           // 3. Date selector
import StepHallTime from "./components/StepHallTime";   // 4. Halls + slots
import StepSeatType from "./components/StepSeatType";   // 5. Seat type
import StepSeatCount from "./components/StepSeatCount"; // 6. Quantity
import StepPayment from "./components/StepPayment";     // 7. Payment
import StepSeatLayout from "./components/StepSeatLayout";// 8. Seat layout
import SummaryPanel from "./components/SummaryPanel";
import ConfirmDialog from "./components/ConfirmDialog";

export default function CounterSalePOS() {
  const { movies, showtimes, locations, sales, pushSale } = useCatalog();

  const [form, setForm] = useState({
    location_id: null,
    movie_id: null,
    date: todayISO(),
    hall_id: null,
    time_slot_id: null,
    seat_type: null,
    seat_qty: 0,
    price_each: 0,
    selected_seats: [],
    payment_method: "Cash",
    received_amount: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const update = (patch) => setForm((p) => ({ ...p, ...patch }));

  // 1️⃣ All locations
  const allLocations = locations;

  // 2️⃣ Movies filtered by location (status = "now showing")
  const nowShowing = useMemo(
    () => movies.filter((m) => m.status?.toLowerCase() === "now showing"),
    [movies]
  );

  const moviesForLocation = useMemo(() => {
    if (!form.location_id) return nowShowing;
    return nowShowing.filter((m) => {
      const entry = showtimes[m.id];
      if (!entry) return false;
      return entry.halls?.some(
        (h) => String(h.location_id) === String(form.location_id)
      );
    });
  }, [nowShowing, showtimes, form.location_id]);

  // 3️⃣ Quick dates (today, +1, +2)
  const quickDates = useMemo(
    () => [todayISO(), addDaysISO(1), addDaysISO(2)],
    []
  );

  // 4️⃣ Build halls with slots for this movie/location/date
  const hallsWithSlots = useMemo(() => {
    if (!form.movie_id || !form.location_id || !form.date) return [];
    const entry = showtimes[form.movie_id];
    if (!entry) return [];
    return entry.halls
      .filter((h) => String(h.location_id) === String(form.location_id))
      .map((hall) => {
        const dateObj =
          hall.showtimes
            ?.flatMap((s) => s.dates || [])
            .find((d) => new Date(d.date).toISOString().slice(0, 10) === form.date) ||
          null;
        return { ...hall, slots: dateObj?.slots || [] };
      });
  }, [showtimes, form.movie_id, form.location_id, form.date]);

  // 5️⃣ Seat pricing for selected time slot
  const seatPricing = useMemo(() => {
    if (!form.movie_id || !form.hall_id || !form.date || !form.time_slot_id)
      return [];
    return getSeatPricing(
      form.movie_id,
      form.hall_id,
      form.date,
      form.time_slot_id
    );
  }, [form.movie_id, form.hall_id, form.date, form.time_slot_id]);

  // 6️⃣ Seat layout
  const seatLayout = useMemo(
    () => (form.hall_id ? getSeatLayout(form.hall_id) : null),
    [form.hall_id]
  );

  // 7️⃣ Sold seats per slot
  const soldSeatIdsForThisShow = useMemo(() => {
    if (!form.time_slot_id) return new Set();
    const sold = sales
      .filter((s) => s.time_slot_id === form.time_slot_id)
      .flatMap((s) => s.seat_ids || []);
    return new Set(sold);
  }, [sales, form.time_slot_id]);

  // 💰 Totals
  const total =
    (form.price_each || 0) *
    (form.selected_seats?.length || form.seat_qty || 0);
  const change = Math.max(0, Number(form.received_amount || 0) - total);
  const canConfirm =
    form.location_id &&
    form.movie_id &&
    form.hall_id &&
    form.time_slot_id &&
    form.seat_type &&
    form.seat_qty > 0 &&
    form.selected_seats.length === form.seat_qty &&
    Number(form.received_amount || 0) >= total &&
    total > 0;

  // ✅ Confirm purchase
  const handleConfirm = () => {
    const payload = {
      id: genId("T"),
      location_id: form.location_id,
      movie_id: form.movie_id,
      hall_id: form.hall_id,
      date: form.date,
      time_slot_id: form.time_slot_id,
      seat_type: form.seat_type,
      seat_ids: form.selected_seats,
      quantity: form.selected_seats.length,
      price_per_ticket: form.price_each,
      total_price: total,
      received_amount: Number(form.received_amount),
      payment_method: form.payment_method,
      change_amount: change,
      sold_by: "counter_user_1",
      created_at: new Date().toISOString(),
    };
    pushSale(payload);
    setConfirmOpen(false);
    update({ seat_qty: 0, selected_seats: [], received_amount: "" });
  };

  // 🧱 UI
  return (
    <Box className="min-h-screen bg-gray-950 text-gray-200">
      {/* Header */}
      <Box className="sticky top-0 bg-gray-900 border-b border-gray-800">
        <Box className="max-w-7xl mx-auto flex items-center justify-between p-3">
          <Stack direction="row" spacing={2} alignItems="center">
            <img
              src="/mnt/data/K-SCREEN-LOGO-W 2.png"
              alt="KSCREEN"
              className="h-8"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <Typography
              variant="h6"
              sx={{ color: "#bfa14a", fontWeight: 700 }}
            >
              Counter Sale
            </Typography>
            <Chip
              size="small"
              label={`Step 1→8`}
              sx={{ bgcolor: "#2a2a2a", color: "#bfa14a" }}
            />
          </Stack>
          <Button
            size="small"
            startIcon={<ShoppingCartIcon />}
            variant="contained"
            sx={{
              bgcolor: "#bfa14a",
              color: "#141414",
              fontWeight: 700,
            }}
          >
            New Ticket
          </Button>
        </Box>
      </Box>

      {/* Body */}
      <Box className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Box className="lg:col-span-2 space-y-12">
          {/* 1) Location */}
          <StepLocation
            form={form}
            update={(p) =>
              update({
                ...p,
                movie_id: null,
                hall_id: null,
                time_slot_id: null,
                seat_type: null,
                seat_qty: 0,
                selected_seats: [],
              })
            }
            locations={allLocations}
          />

          {/* 2) Movie */}
          <StepMovie
            form={form}
            update={(p) =>
              update({
                ...p,
                hall_id: null,
                time_slot_id: null,
                seat_type: null,
                seat_qty: 0,
                selected_seats: [],
              })
            }
            movies={moviesForLocation}
          />

          {/* 3) Date */}
          <StepDate
            form={form}
            update={(p) =>
              update({
                ...p,
                hall_id: null,
                time_slot_id: null,
                seat_type: null,
                seat_qty: 0,
                selected_seats: [],
              })
            }
            quickDates={quickDates}
          />

          {/* 4) Halls & slots */}
          <StepHallTime
            form={form}
            update={(p) =>
              update({
                ...p,
                seat_type: null,
                seat_qty: 0,
                selected_seats: [],
              })
            }
            halls={hallsWithSlots}
          />

          {/* 5) Seat Type */}
          <StepSeatType
            form={form}
            update={(p) =>
              update({ ...p, seat_qty: 0, selected_seats: [] })
            }
            seatTypes={seatPricing.map((p) => ({
              type: p.seat_type,
              price: p.price_total,
            }))}
            pricing={seatPricing}
          />

          {/* 6) Quantity */}
          <StepSeatCount
            form={form}
            update={(p) => update({ ...p, selected_seats: [] })}
          />

          {/* 7) Payment */}
          <StepPayment form={form} update={update} change={change} />

          {/* 8) Seat Layout */}
          <StepSeatLayout
            form={form}
            update={update}
            layout={seatLayout}
            soldSeatIds={soldSeatIdsForThisShow}
          />

          <Box className="flex justify-end mt-4">
            <Button
              disabled={!canConfirm}
              onClick={() => setConfirmOpen(true)}
              variant="contained"
              sx={{
                bgcolor: canConfirm ? "#bfa14a" : "#6b7280",
                color: "#141414",
                fontWeight: 700,
              }}
            >
              Confirm & Sell
            </Button>
          </Box>
        </Box>

        {/* Right Summary */}
        <SummaryPanel
          form={form}
          locations={allLocations}
          movies={moviesForLocation}
          halls={hallsWithSlots}
          total={total}
        />
      </Box>

      <ConfirmDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        form={form}
        addSale={handleConfirm}
        total={total}
        change={change}
        locations={allLocations}
        movies={moviesForLocation}
        halls={hallsWithSlots}
        showtimes={hallsWithSlots.flatMap((h) => h.slots)}
      />
    </Box>
  );
}
