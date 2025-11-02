import React from 'react';
import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import Section from './Section';

export default function StepHallTime({ form, update, halls, showtimes }) {
  return (
    <Section title="4. Select Hall & Time" icon={<EventSeatIcon fontSize="small" /> }>
      {!form.movie_id && <Typography variant="body2" color="gray">Select a movie first.</Typography>}
      {form.movie_id && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Card sx={{ flex: 1, bgcolor: '#0b1220', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#bfa14a', fontWeight: 700, mb: 1 }}>Halls</Typography>
              <Stack direction="row" spacing={1} className="flex-wrap">
                {halls.map((h) => (
                  <Chip key={h.id} label={h.name} onClick={() => update({ hall_id: h.id })} variant={form.hall_id===h.id?'filled':'outlined'} sx={{ bgcolor: form.hall_id===h.id?'#bfa14a':'transparent', color: form.hall_id===h.id?'#141414':'#bfa14a', borderColor: '#bfa14a' }} />
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 2, bgcolor: '#0b1220', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#bfa14a', fontWeight: 700, mb: 1 }}>Showtimes</Typography>
              <Stack direction="row" spacing={1} className="flex-wrap">
                {showtimes.map((s) => (
                  <Chip key={s.id} label={`${(halls.find(x=>x.id===s.hall_id)?.name) || 'Hall'} • ${s.time}`} onClick={() => update({ showtime_id: s.id, hall_id: s.hall_id, selected_seats: [], seat_type: null, seat_qty: 0, price_each: 0 })} variant={form.showtime_id===s.id?'filled':'outlined'} sx={{ bgcolor: form.showtime_id===s.id?'#bfa14a':'transparent', color: form.showtime_id===s.id?'#141414':'#bfa14a', borderColor: '#bfa14a' }} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Section>
  );
}