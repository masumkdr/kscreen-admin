import React from 'react';
import { Chip, Stack, TextField } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Section from './Section';

export default function StepDate({ form, update, quickDates }) {
  return (
    <Section title="2. Select Date" icon={<CalendarTodayIcon fontSize="small" /> }>
      <Stack direction="row" spacing={1} className="flex-wrap">
        {quickDates.map((d) => (
          <Chip key={d} label={d} onClick={() => update({ date: d, movie_id: null, hall_id: null, showtime_id: null })} variant={form.date===d?'filled':'outlined'} sx={{ bgcolor: form.date===d?'#bfa14a':'transparent', color: form.date===d?'#141414':'#bfa14a', borderColor: '#bfa14a' }} />
        ))}
      </Stack>
      <TextField
        type="date"
        size="small"
        value={form.date}
        onChange={(e) => update({ date: e.target.value, movie_id: null, hall_id: null, showtime_id: null })}
        sx={{ mt: 2, input: { color: '#eee' } }}
      />
    </Section>
  );
}