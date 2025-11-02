import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import Section from './Section';

export default function StepMovie({ form, update, movies }) {
  return (
    <Section title="3. Select Movie" icon={<MovieIcon fontSize="small" /> }>
      {movies.length === 0 && (
        <Typography variant="body2" color="gray">No movies found for this location & date.</Typography>
      )}
      <Grid container spacing={2}>
        {movies.map((m) => (
          <Grid item xs={6} md={4} key={m.id}>
            <Card onClick={() => update({ movie_id: m.id, hall_id: null, showtime_id: null })} className={`cursor-pointer transition-transform hover:scale-[1.01] ${form.movie_id===m.id?'ring-2 ring-[#bfa14a]':''}`} sx={{ bgcolor: '#0f172a', borderRadius: 3 }}>
              <img src={m.poster} alt={m.name} className="w-full h-40 object-cover rounded-t-2xl" />
              <CardContent>
                <Typography sx={{ fontWeight: 700, color: form.movie_id===m.id?'#bfa14a':'#eee' }}>{m.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
