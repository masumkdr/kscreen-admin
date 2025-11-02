// src/components/MovieShowtimes/MovieShowtimes.js
import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";

import ShowtimeForm from "./ShowTimeForm";
import ShowtimeList from "./ShowTimeList";

export default function MovieShowtimes({ movie, onShowtimesChange }) {
  const [showtimes, setShowtimes] = useState(movie?.showtimes || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(null);

  // 🔁 Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`showtimes_${movie.id || movie.name}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setShowtimes(parsed);
      onShowtimesChange(parsed);
    }
  }, [movie.id, movie.name]);

  // 💾 Save to localStorage every time showtimes changes
  useEffect(() => {
    localStorage.setItem(
      `showtimes_${movie.id || movie.name}`,
      JSON.stringify(showtimes)
    );
    onShowtimesChange(showtimes);
  }, [showtimes]);

  const handleSave = (newShowtime) => {
    let updated = [...showtimes];
    if (editingIndex !== null) {
      updated[editingIndex] = newShowtime;
    } else {
      updated.push(newShowtime);
    }
    setShowtimes(updated);
    setEditingIndex(null);
    setFormData(null);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(showtimes[index]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (index) => {
    if (!window.confirm("Delete this showtime?")) return;
    const updated = showtimes.filter((_, i) => i !== index);
    setShowtimes(updated);
  };

  return (
    <Box sx={{ mt: 5, backgroundColor: "#0f0f0f", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" color="#fff" gutterBottom>
        🎭 Manage Showtimes for {movie?.name}
      </Typography>
      <Divider sx={{ borderColor: "#333", mb: 3 }} />

      <ShowtimeForm
        key={editingIndex ?? "new"}
        formData={formData}
        onSave={handleSave}
        onCancel={() => {
          setEditingIndex(null);
          setFormData(null);
        }}
      />

      <Divider sx={{ my: 4, borderColor: "#333" }} />
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <ListAltIcon color="warning" />
        <Typography variant="subtitle1" sx={{ color: "#fff" }}>
          Existing Showtimes
        </Typography>
      </Box>

      <ShowtimeList
        showtimes={showtimes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
}
