// src/components/MovieShowtimes/ShowtimeList.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Collapse,
  Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function ShowTimeList({ showtimes, onEdit, onDelete }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleCollapse = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const calcTotal = (o) =>
    (o?.base || 0) +
    (o?.acm || 0) +
    (o?.sslc || 0) +
    (o?.vat || 0) +
    (o?.mtax || 0) +
    (o?.htax || 0) +
    (o?.other || 0);

  if (!showtimes?.length)
    return <Typography color="gray">No showtimes yet.</Typography>;

  return showtimes.map((s, idx) => (
    <Box
      key={idx}
      sx={{
        background: "#141414",
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: "1px solid #333",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" color="#ffc107">
          🎦 {s.hall_name} — {s.date_range?.start} → {s.date_range?.end}
        </Typography>

        <Box display="flex" gap={1} alignItems="center">
          <Button
            variant="text"
            size="small"
            sx={{ color: "#ccc" }}
            onClick={() => toggleCollapse(idx)}
            startIcon={openIndex === idx ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {openIndex === idx ? "Hide Slots" : "Show Slots"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ color: "#ffc107", borderColor: "#ffc107" }}
            onClick={() => onEdit(idx)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DeleteOutlineIcon />}
            sx={{ color: "#f44336", borderColor: "#f44336" }}
            onClick={() => onDelete(idx)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Collapse in={openIndex === idx}>
        <Divider sx={{ my: 1, borderColor: "#333" }} />
        {(s.dates || []).map((d, i) => (
          <Box key={i} sx={{ ml: 2, mt: 1 }}>
            <Typography sx={{ color: "#ccc" }}>📅 {d.date}</Typography>
            {(d.slots || []).map((slot, j) => (
              <Typography key={j} sx={{ ml: 3, color: "#999" }}>
                • {slot.time} —{" "}
                {(slot.seat_pricing || [])
                  .map((p) => `${p.seat_type}: ${calcTotal(p)}৳`)
                  .join(", ")}
              </Typography>
            ))}
          </Box>
        ))}
      </Collapse>
    </Box>
  ));
}
