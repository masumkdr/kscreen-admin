import React from 'react';
import { Card, CardContent, FormControlLabel, Radio, RadioGroup, Stack, Typography, Box } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import Section from './Section';

export default function StepSeatType({ form, update, seatTypes, pricing }) {
  const handleChooseSeatType = (type) => {
    const p = pricing.find((x) => x.showtime_id === form.showtime_id && x.seat_type === type)?.price_total || 0;
    update({ seat_type: type, price_each: p, selected_seats: [] });
  };

  return (
    <Section title="5. Select Seat Type & Price" icon={<EventSeatIcon fontSize="small" /> }>
      {!form.showtime_id && <Typography variant="body2" color="gray">Choose a showtime first.</Typography>}
      {form.showtime_id && (
        <RadioGroup value={form.seat_type || ''} onChange={(e) => handleChooseSeatType(e.target.value)}>
          <Stack direction="row" spacing={2} className="flex-wrap">
            {seatTypes.map((t) => (
              <Card key={t.type} className={`min-w-[180px] ${form.seat_type===t.type?'ring-2 ring-[#bfa14a]':''}`} sx={{ bgcolor: '#0f172a', borderRadius: 3 }}>
                <CardContent>
                  <FormControlLabel value={t.type} control={<Radio sx={{ color: '#bfa14a' }} />} label={<Box>
                    <Typography sx={{ fontWeight: 700 }}>{t.type}</Typography>
                    <Typography variant="caption" color="#bfa14a">৳{t.price}</Typography>
                  </Box>} />
                </CardContent>
              </Card>
            ))}
          </Stack>
        </RadioGroup>
      )}
    </Section>
  );
}