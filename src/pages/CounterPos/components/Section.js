import React from 'react';
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';

export default function Section({ title, icon, children }) {
  return (
    <Card sx={{ bgcolor: '#0b1220', borderRadius: 3, border: '1px solid #1f2937' }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" className="mb-3">
          {icon}
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#bfa14a' }}>{title}</Typography>
        </Stack>
        <Divider sx={{ borderColor: '#1f2937', mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );
}