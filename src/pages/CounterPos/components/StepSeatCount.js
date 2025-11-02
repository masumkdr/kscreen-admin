import React from 'react';
import { IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import Section from './Section';

export default function StepSeatCount({ form, update }) {
  return (
    <Section title="6. Number of Seats" icon={<EventSeatIcon fontSize="small" /> }>
      {!form.seat_type && <Typography variant="body2" color="gray">Choose a seat type first.</Typography>}
      {form.seat_type && (
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => update({ seat_qty: Math.max(0, (form.seat_qty||0) - 1), selected_seats: [] })}><RemoveIcon /></IconButton>
          <Typography variant="h5" sx={{ color: '#bfa14a', fontWeight: 800 }}>{form.seat_qty || 0}</Typography>
          <IconButton onClick={() => update({ seat_qty: (form.seat_qty||0) + 1, selected_seats: [] })}><AddIcon /></IconButton>
          <Typography variant="body2" color="gray">Select seats next…</Typography>
        </Stack>
      )}
    </Section>
  );
}
