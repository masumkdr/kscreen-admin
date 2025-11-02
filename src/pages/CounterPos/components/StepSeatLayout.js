import React from 'react';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { Typography } from '@mui/material';
import Section from './Section';
import SeatLayoutGrid from './SeatLayoutGrid';

export default function StepSeatLayout({ form, update, layout, soldSeatIds }) {
  const canProceed = form.seat_type && (form.seat_qty > 0);
  return (
    <Section title="8. Select Seats from Layout" icon={<EventSeatIcon fontSize="small" /> }>
      {!canProceed && (
        <Typography variant="body2" color="gray">Select seat type and quantity first.</Typography>
      )}
      {canProceed && layout && (
        <SeatLayoutGrid
          layout={layout}
          selected={form.selected_seats}
          onToggle={(id) => {
            const seat = layout.seats[id];
            const isSold = soldSeatIds.has(id);
            if (!seat || isSold || seat.type !== form.seat_type) return;
            const exists = form.selected_seats.includes(id);
            let next = exists ? form.selected_seats.filter((x) => x !== id) : [...form.selected_seats, id];
            if (next.length > form.seat_qty) return;
            update({ selected_seats: next });
          }}
          disableReason={(id) => {
            const seat = layout.seats[id];
            if (!seat) return 'N/A';
            if (soldSeatIds.has(id)) return 'Sold';
            if (seat.type !== form.seat_type) return seat.type;
            return '';
          }}
        />
      )}
    </Section>
  );
}