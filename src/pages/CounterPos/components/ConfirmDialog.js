import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import { genId, fmtBDT } from '../utils/storage';

export default function ConfirmDialog({ open, setOpen, form, addSale, total, change, locations, movies, halls, showtimes }) {
  const handleConfirm = () => {
    const payload = {
      id: genId('T'),
      location_id: form.location_id,
      date: form.date,
      movie_id: form.movie_id,
      hall_id: form.hall_id,
      showtime_id: form.showtime_id,
      seat_type: form.seat_type,
      seat_ids: form.selected_seats,
      quantity: form.selected_seats.length,
      price_per_ticket: form.price_each,
      total_price: total,
      received_amount: Number(form.received_amount || 0),
      payment_method: form.payment_method,
      change_amount: change,
      sold_by: 'counter_user_1',
      created_at: new Date().toISOString(),
    };
    addSale(payload);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Confirm Purchase</DialogTitle>
      <DialogContent>
        <List>
          <ListItem><ListItemText primary="Location" secondary={locations.find(l=>l.id===form.location_id)?.name} /></ListItem>
          <ListItem><ListItemText primary="Date" secondary={form.date} /></ListItem>
          <ListItem><ListItemText primary="Movie" secondary={movies.find(m=>m.id===form.movie_id)?.name} /></ListItem>
          <ListItem><ListItemText primary="Hall" secondary={halls.find(h=>h.id===form.hall_id)?.name} /></ListItem>
          <ListItem><ListItemText primary="Showtime" secondary={showtimes.find(s=>s.id===form.showtime_id)?.time} /></ListItem>
          <ListItem><ListItemText primary="Seat Type" secondary={form.seat_type} /></ListItem>
          <ListItem><ListItemText primary="Seats" secondary={form.selected_seats.join(', ')} /></ListItem>
          <ListItem><ListItemText primary="Price Each" secondary={fmtBDT(form.price_each)} /></ListItem>
          <ListItem><ListItemText primary="Total" secondary={fmtBDT(total)} /></ListItem>
          <ListItem><ListItemText primary="Payment" secondary={`${form.payment_method} • Received ${fmtBDT(form.received_amount)}`} /></ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" sx={{ bgcolor: '#bfa14a', color: '#141414', fontWeight: 700 }}>Complete Purchase</Button>
      </DialogActions>
    </Dialog>
  );
}
