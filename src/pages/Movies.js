import React from "react";
import { Typography } from "@mui/material";

export default function Movies() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        🎞️ Movies
      </Typography>
      <Typography>Manage movie listings, schedules, and posters here.</Typography>
    </div>
  );
}
