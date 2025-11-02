import React from 'react';
import { Chip, FormControl, InputAdornment, MenuItem, Select, Stack, TextField } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Section from './Section';
import { fmtBDT } from '../utils/storage';

export default function StepPayment({ form, update, change }) {
  return (
    <Section title="7. Payment" icon={<CreditCardIcon fontSize="small" /> }>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <FormControl size="small">
          <Select value={form.payment_method} onChange={(e) => update({ payment_method: e.target.value })} sx={{ bgcolor: '#0f172a', color: '#eee', minWidth: 200, borderRadius: 2 }}>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Bkash">Bkash</MenuItem>
            <MenuItem value="Nagad">Nagad</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          type="number"
          label="Received Amount"
          value={form.received_amount}
          onChange={(e) => update({ received_amount: e.target.value })}
          InputProps={{ startAdornment: <InputAdornment position="start">৳</InputAdornment> }}
          sx={{ input: { color: '#eee' } }}
        />
        <Chip label={`Change: ${fmtBDT(change)}`} sx={{ bgcolor: '#1f2937', color: '#bfa14a' }} />
      </Stack>
    </Section>
  );
}