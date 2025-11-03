import React from 'react';
import { FormControl, MenuItem, Select } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import Section from './Section';

export default function StepLocation({ form, update, locations }) {
  return (
    <Section title="1. Select Location" icon={<PlaceIcon fontSize="small" /> }>
      <FormControl size="small">
        <Select
          value={form.location_id || ''}
          onChange={(e) => update({ location_id: Number(e.target.value), movie_id: null, hall_id: null, showtime_id: null })}
          sx={{ bgcolor: '#0f172a', color: '#eee', minWidth: 240, borderRadius: 2 }}
        >
          {locations.map((loc) => (
            <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Section>
  );
}
