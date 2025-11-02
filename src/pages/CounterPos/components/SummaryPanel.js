import React from 'react';
import { Card, CardContent, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { fmtBDT } from '../utils/storage';

export default function SummaryPanel({ form, locations, movies, halls, total }) {
  const locName = locations.find((l) => l.id === form.location_id)?.name || '-';
  const movie = movies.find((m) => m.id === form.movie_id);
  const hallName = halls.find((h) => h.id === form.hall_id)?.name || '-';

  return (
    <Card sx={{ bgcolor: '#0b1220', borderRadius: 3, border: '1px solid #1f2937', position: 'sticky', top: 72, height: 'fit-content' }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" className="mb-3">
          <ShoppingCartIcon fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#bfa14a' }}>Current Selection</Typography>
        </Stack>
        <Divider sx={{ borderColor: '#1f2937', mb: 2 }} />

        {movie ? (
          <img src={movie.poster} alt={movie.name} className="w-full h-44 object-cover rounded-xl mb-3" />
        ) : (
          <div className="w-full h-44 bg-gray-800 rounded-xl mb-3 grid place-items-center text-gray-400">Movie Poster</div>
        )}

        <List dense>
          <ListItem><ListItemText primary="Location" secondary={locName} /></ListItem>
          <ListItem><ListItemText primary="Date" secondary={form.date} /></ListItem>
          <ListItem><ListItemText primary="Movie" secondary={movie?.name || '-'} /></ListItem>
          <ListItem><ListItemText primary="Hall" secondary={hallName} /></ListItem>
          <ListItem><ListItemText primary="Seat Type" secondary={form.seat_type || '-'} /></ListItem>
          <ListItem><ListItemText primary="Qty" secondary={form.seat_qty || 0} /></ListItem>
          <ListItem><ListItemText primary="Selected Seats" secondary={(form.selected_seats||[]).join(', ') || '-'} /></ListItem>
          <ListItem><ListItemText primary="Price Each" secondary={fmtBDT(form.price_each)} /></ListItem>
        </List>

        <Divider sx={{ borderColor: '#1f2937', my: 2 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: '#bfa14a', fontWeight: 800 }}>Total</Typography>
          <Typography variant="h5" sx={{ color: '#bfa14a', fontWeight: 900 }}>{fmtBDT(total)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}