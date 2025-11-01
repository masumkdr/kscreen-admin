import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Divider,
  MenuItem,
  Button,
} from "@mui/material";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import moviesData from "../data/movies.json";
import hallsData from "../data/halls.json";
import seatTypes from "../data/seat_types.json";

const STORAGE_KEY = "showtimes_data";

export default function ShowtimeManager() {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [movieId, setMovieId] = useState("");
  const [hallIds, setHallIds] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [seatPricing, setSeatPricing] = useState({});
  const [saving, setSaving] = useState(false);

  // ✅ Load initial data
  useEffect(() => {
    const storedMovies =
      JSON.parse(localStorage.getItem("movies_data")) || moviesData;
    const storedShowtimes =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setMovies(storedMovies);
    setShowtimes(storedShowtimes);
  }, []);

  // ✅ Utility: save to localStorage
  const saveToStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setShowtimes(data);
  };

  // ✅ Utility: generate all dates between range
  const generateDates = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // ✅ Step actions
  const handleAddSlot = () => {
    const time = prompt("Enter showtime (e.g., 11:15 AM)");
    if (time) setSlots((prev) => [...prev, time]);
  };

  const handleSetPrices = (time) => {
    const updated = seatTypes.map((s) => {
      const price = prompt(`Enter price for ${s.name} (${time})`);
      return { seat_type: s.name, price: parseFloat(price) || 0 };
    });
    setSeatPricing((prev) => ({ ...prev, [time]: updated }));
  };

  const handleSave = () => {
    if (!movieId || !hallIds.length || !startDate || !endDate || !slots.length) {
      alert("Please fill in all required fields!");
      return;
    }

    const movie = movies.find((m) => m.id === Number(movieId));
    const newConfig = {
      id: Date.now(),
      movie_id: Number(movieId),
      movie_name: movie?.name,
      halls: hallIds.map((id) => ({
        hall_id: id,
        hall_name: hallsData.find((h) => h.id === id)?.name,
        dates: generateDates(startDate, endDate).map((date) => ({
          date,
          slots: slots.map((t) => ({
            time: t,
            seat_pricing: seatPricing[t] || [],
          })),
        })),
      })),
      created_at: new Date().toISOString(),
    };

    const updatedData = [...showtimes, newConfig];
    saveToStorage(updatedData);
    setSaving(true);
    setTimeout(() => {
      alert("✅ Showtime configuration saved successfully!");
      setSaving(false);
      resetForm();
    }, 500);
  };

  const resetForm = () => {
    setMovieId("");
    setHallIds([]);
    setStartDate("");
    setEndDate("");
    setSlots([]);
    setSeatPricing({});
  };

  // ✅ Dark TextField styling
const darkFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#1a1a1a",
    color: "#f1f1f1",
    borderRadius: "8px",
    height: "44px", // ✅ increase input height
    fontSize: "0.95rem", // ✅ make text readable
    "& fieldset": {
      borderColor: "#333",
    },
    "&:hover fieldset": {
      borderColor: "#666",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f44336",
    },
    "& .MuiSelect-select": {
      padding: "10px 14px", // ✅ more breathing space in dropdown
      display: "flex",
      alignItems: "center",
    },
    "& input": {
      padding: "10px 14px", // ✅ even padding for date/text inputs
    },
  },
  "& .MuiInputLabel-root": {
    color: "#aaa",
    fontSize: "0.9rem",
    "&.Mui-focused": {
      color: "#f44336",
    },
  },
  "& .MuiSelect-icon": {
    color: "#f8f8f8",
  },
  "& .MuiInputBase-input": {
    color: "#f8f8f8",
  },
};


  return (
    <div className="p-6 bg-[#0b0f18] text-white min-h-screen">
      <Typography variant="h5" gutterBottom>
        🎞️ Showtime & Ticket Pricing
      </Typography>

      {/* Step 1 — Basic Info */}
      <Divider sx={{ my: 2, borderColor: "#333" }} />
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <MovieFilterIcon color="warning" />
        <Typography variant="h6" sx={{ color: "#ffc107" }}>
          Step 1 — Basic Info
        </Typography>
      </Box>
 <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <TextField
          select
          label="Select Movie"
          size="small"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
        >
             {movies.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Rows"
          type="number"
          size="small"
        />
        <TextField
          label="Columns"
          type="number"
          size="small"
        />
      </Box>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          select
          label="Select Movie"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          size="small"
          variant="outlined"
        >
          {movies.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Select Halls"
          SelectProps={{ multiple: true }}
          value={hallIds}
          onChange={(e) => setHallIds(e.target.value)}
          sx={darkFieldSx}
          size="small"
          variant="outlined"
        >
          {hallsData.map((h) => (
            <MenuItem key={h.id} value={h.id}>
              {h.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={darkFieldSx}
          size="small"
          variant="outlined"
        />

        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={darkFieldSx}
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Step 2 — Add Showtimes */}
      <Divider sx={{ my: 2, borderColor: "#333" }} />
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AccessTimeIcon color="warning" />
        <Typography variant="h6" sx={{ color: "#ffc107" }}>
          Step 2 — Add Time Slots
        </Typography>
      </Box>

      <Box mb={3}>
        <Button
          variant="outlined"
          onClick={handleAddSlot}
          sx={{
            color: "#ffc107",
            borderColor: "#ffc107",
            "&:hover": { borderColor: "#f44336", color: "#f44336" },
          }}
        >
          ➕ Add Showtime Slot
        </Button>
        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          {slots.map((slot) => (
            <Box
              key={slot}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#1f2937"
              px={2}
              py={1}
              borderRadius={1}
            >
              <Typography>{slot}</Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleSetPrices(slot)}
              >
                Set Prices
              </Button>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Step 3 — Review Pricing */}
      <Divider sx={{ my: 2, borderColor: "#333" }} />
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <MonetizationOnIcon color="warning" />
        <Typography variant="h6" sx={{ color: "#ffc107" }}>
          Step 3 — Review Pricing
        </Typography>
      </Box>

      {Object.keys(seatPricing).length > 0 ? (
        <Box bgcolor="#1f2937" p={2} borderRadius={1}>
          {Object.entries(seatPricing).map(([time, pricing]) => (
            <Box key={time} mb={2}>
              <Typography variant="subtitle1" sx={{ color: "#f44336" }}>
                {time}
              </Typography>
              {pricing.map((p, i) => (
                <Typography key={i} sx={{ ml: 2 }}>
                  • {p.seat_type}: {p.price} ৳
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography color="gray">
          No pricing set yet. Use “Set Prices” on each slot above.
        </Typography>
      )}

      {/* Save */}
      <Divider sx={{ my: 3, borderColor: "#333" }} />
      <Box textAlign="right">
        <Button
          variant="contained"
          color="error"
          onClick={handleSave}
          disabled={saving}
          sx={{
            px: 4,
            py: 1.2,
            fontWeight: "bold",
            backgroundColor: "#f44336",
            "&:hover": { backgroundColor: "#d32f2f" },
          }}
        >
          💾 {saving ? "Saving..." : "Save Showtime Configuration"}
        </Button>
      </Box>
    </div>
  );
}
