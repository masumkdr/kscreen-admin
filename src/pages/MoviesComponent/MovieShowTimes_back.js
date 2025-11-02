import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import hallsData from "../../data/halls.json";
import timeSlots from "../../data/time_slots.json";
import seatTypes from "../../data/seat_types.json";

export default function MovieShowtimes({ movie, onShowtimesChange }) {
  const [hallId, setHallId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [dates, setDates] = useState([]);
  const [defaultPrices, setDefaultPrices] = useState({});
  const [editingSlot, setEditingSlot] = useState(null); // { date, slot }
  const [saving, setSaving] = useState(false);
  const [openAddSlotDate, setOpenAddSlotDate] = useState(null);

  const defaultPriceTemplate = {
    base: 150,
    acm: 150,
    sslc: 0,
    vat: 50,
    mtax: 50,
    htax: 50,
    other: 0,
  };

  const calcTotal = (o) =>
    (o?.base || 0) +
    (o?.acm || 0) +
    (o?.sslc || 0) +
    (o?.vat || 0) +
    (o?.mtax || 0) +
    (o?.htax || 0) +
    (o?.other || 0);

  // -------------------- helpers --------------------
  const toggleSlot = (slotId) =>
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );

  const handlePriceChange = (seatType, field, value) => {
    setDefaultPrices((prev) => {
      const current = prev[seatType] || { ...defaultPriceTemplate };
      const updated = { ...current, [field]: parseFloat(value) || 0 };
      return { ...prev, [seatType]: updated };
    });
  };

  const generateDates = (start, end) => {
    if (!hallId || !start || !end || selectedSlots.length === 0) {
      alert("Select hall, date range, and at least one slot.");
      return;
    }
    const arr = [];
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      arr.push({
        date: current.toISOString().split("T")[0],
        slots: selectedSlots.map((slotId) => ({
          id: slotId,
          time: timeSlots.find((t) => t.id === slotId)?.name,
          seat_pricing: Object.entries(defaultPrices).map(([seat, vals]) => ({
            seat_type: seat,
            ...vals,
          })),
        })),
      });
      current.setDate(current.getDate() + 1);
    }
    setDates(arr);
  };

  const handleEditSlot = (date, slot) => setEditingSlot({ date, slot });

  const saveEditedSlot = (updatedPricing) => {
    setDates((prev) =>
      prev.map((d) =>
        d.date === editingSlot.date
          ? {
              ...d,
              slots: d.slots.map((s) =>
                s.id === editingSlot.slot.id ? { ...s, seat_pricing: updatedPricing } : s
              ),
            }
          : d
      )
    );
    setEditingSlot(null);
  };

  const removeSlot = (date, slotId) => {
    setDates((prev) =>
      prev.map((d) =>
        d.date === date ? { ...d, slots: d.slots.filter((s) => s.id !== slotId) } : d
      )
    );
  };

  const handleDeleteFromDialog = () => {
    if (!editingSlot) return;
    removeSlot(editingSlot.date, editingSlot.slot.id);
    setEditingSlot(null);
  };

  const handleSave = () => {
    if (!hallId || !startDate || !endDate || dates.length === 0) {
      alert("Please complete setup first");
      return;
    }
    const hall = hallsData.find((h) => h.id === Number(hallId));
    const newShowtime = {
      hall_id: hall.id,
      hall_name: hall.name,
      date_range: { start: startDate, end: endDate },
      dates,
    };
    onShowtimesChange(newShowtime);
    setHallId("");
    setStartDate("");
    setEndDate("");
    setSelectedSlots([]);
    setDates([]);
    setDefaultPrices({});
    setSaving(true);
    setTimeout(() => setSaving(false), 350);
  };

  const darkFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#1a1a1a",
      color: "#f1f1f1",
      borderRadius: "8px",
      height: "44px",
      "& fieldset": { borderColor: "#333" },
      "&:hover fieldset": { borderColor: "#666" },
      "&.Mui-focused fieldset": { borderColor: "#f44336" },
    },
    "& .MuiInputLabel-root": { color: "#aaa", "&.Mui-focused": { color: "#f44336" } },
    "& .MuiInputBase-input": { color: "#f8f8f8" },
    "& .MuiSelect-icon": { color: "#f8f8f8" },
  };

const handleAddSlotToDate = (date, slotId) => {
  if (!slotId) return;
  const slot = timeSlots.find((t) => t.id === Number(slotId));
  if (!slot) return;

  const alreadyExists = dates.some(
    (d) => d.date === date && d.slots.some((s) => s.time === slot.name)
  );
  if (alreadyExists) {
    alert("Slot already exists for this date.");
    return;
  }

  const newSlot = {
    id: Date.now(),
    time: slot.name,
    seat_pricing: Object.entries(defaultPrices).map(([seat, vals]) => ({
      seat_type: seat,
      ...vals,
    })),
  };

  setDates((prev) =>
    prev.map((d) =>
      d.date === date ? { ...d, slots: [...d.slots, newSlot] } : d
    )
  );
};

const handleDeleteShowtime = (index) => {
  if (!window.confirm("Are you sure you want to delete this showtime?")) return;

  const updated = [...(movie.showtimes || [])];
  updated.splice(index, 1);

  // Pass full updated list to parent
  onShowtimesChange(updated);
};


const handleEditShowtime = (index) => {
  const st = movie.showtimes[index];
  if (!st) return;

  // Load into builder form
  setHallId(st.hall_id.toString());
  setStartDate(st.date_range.start);
  setEndDate(st.date_range.end);
  setDates(st.dates);
  setSelectedSlots(
    Array.from(
      new Set(
        st.dates.flatMap((d) => d.slots.map((s) => timeSlots.find((t) => t.name === s.time)?.id))
      )
    ).filter(Boolean)
  );

  // Prepare defaultPrices from first date-slot (if exists)
  const firstSlot = st.dates?.[0]?.slots?.[0];
  if (firstSlot && firstSlot.seat_pricing?.length) {
    const priceMap = {};
    firstSlot.seat_pricing.forEach((p) => {
      priceMap[p.seat_type] = {
        base: p.base,
        acm: p.acm,
        sslc: p.sslc,
        vat: p.vat,
        mtax: p.mtax,
        htax: p.htax,
        other: p.other,
      };
    });
    setDefaultPrices(priceMap);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
};


  const showtimes = movie?.showtimes || [];

  // -------------------- render --------------------
  return (
    <Box sx={{ mt: 5, backgroundColor: "#0f0f0f", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" color="#fff" gutterBottom>
        🎭 Manage Showtimes for {movie?.name}
      </Typography>
      <Divider sx={{ borderColor: "#333", mb: 2 }} />

      {/* Step 1 */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <EventSeatIcon color="warning" />
        <Typography variant="subtitle1" sx={{ color: "#fff" }}>
          Step 1 — Select Hall & Date Range
        </Typography>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <TextField
          select
          label="Select Hall"
          value={hallId}
          onChange={(e) => setHallId(e.target.value)}
          sx={darkFieldSx}
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
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={darkFieldSx}
        />
      </Box>

      {/* Step 2 */}
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <AccessTimeIcon color="warning" />
        <Typography variant="subtitle1" sx={{ color: "#fff" }}>
          Step 2 — Select Time Slots
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          background: "#1a1a1a",
          p: 2,
          borderRadius: 1,
          mb: 3,
        }}
      >
        {timeSlots.map((slot) => (
          <FormControlLabel
            key={slot.id}
            control={
              <Checkbox
                checked={selectedSlots.includes(slot.id)}
                onChange={() => toggleSlot(slot.id)}
                sx={{ color: "#ffc107" }}
              />
            }
            label={slot.name}
          />
        ))}
      </Box>

      {/* Step 3 — Default Pricing */}
      <Divider sx={{ my: 2, borderColor: "#333" }} />
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <MonetizationOnIcon color="warning" />
        <Typography variant="subtitle1" sx={{ color: "#fff" }}>
          Step 3 — Default Pricing Setup
        </Typography>
      </Box>

      {/* Choose seat types */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          background: "#1a1a1a",
          p: 2,
          borderRadius: 1,
          mb: 3,
        }}
      >
        {seatTypes.map((s) => (
          <FormControlLabel
            key={s.id}
            control={
              <Checkbox
                checked={!!defaultPrices[s.name]}
                onChange={(e) => {
                  if (e.target.checked)
                    setDefaultPrices((prev) => ({
                      ...prev,
                      [s.name]: { ...defaultPriceTemplate },
                    }));
                  else {
                    const copy = { ...defaultPrices };
                    delete copy[s.name];
                    setDefaultPrices(copy);
                  }
                }}
                sx={{ color: "#ffc107" }}
              />
            }
            label={s.name}
          />
        ))}
      </Box>

      {/* Price cards in flex */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {Object.keys(defaultPrices).map((seat) => {
          const vals = defaultPrices[seat];
          return (
            <Box
              key={seat}
              sx={{
                background: "#1a1a1a",
                p: 2,
                mb: 2,
                flex: "1 1 300px",
                borderRadius: 1,
                border: "1px solid #333",
              }}
            >
              <Typography
                variant="subtitle1"
                color="#ffc107"
                gutterBottom
                sx={{ textAlign: "center" }}
              >
                💺 {seat}
              </Typography>
              {["base", "acm", "sslc", "vat", "mtax", "htax", "other"].map((f) => (
                <Box key={f} sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ color: "#ccc", display: "block" }}>
                    {f.toUpperCase()}
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={vals[f] ?? 0}
                    onChange={(e) => handlePriceChange(seat, f, e.target.value)}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        background: "#222",
                        color: "#fff",
                        borderRadius: "6px",
                      },
                    }}
                  />
                </Box>
              ))}
              <Divider sx={{ my: 1, borderColor: "#333" }} />
              <Typography sx={{ color: "#f44336", fontWeight: "bold", textAlign: "center" }}>
                Total = {calcTotal(vals)} ৳
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Button
        variant="outlined"
        sx={{
          borderColor: "#ffc107",
          color: "#ffc107",
          "&:hover": { borderColor: "#f44336", color: "#f44336" },
          mt: 2,
        }}
        onClick={() => generateDates(startDate, endDate)}
      >
        ⚙️ Generate Layout
      </Button>

        {/* Step 4 — Layout */}
        {dates.length > 0 && (
        <>
            <Divider sx={{ my: 3, borderColor: "#333" }} />

            {dates.map((d) => (
            <Box
                key={d.date}
                sx={{
                background: "#141414",
                p: 2,
                mb: 2,
                borderRadius: 2,
                border: "1px solid #333",
                }}
            >
                <Typography variant="subtitle1" color="#fff" sx={{ mb: 1 }}>
                📅 {new Date(d.date).toDateString()}
                </Typography>

                {(d.slots || []).map((s) => (
                <Box
                    key={s.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                    background: "#1f2937",
                    px: 2,
                    py: 1,
                    mt: 1,
                    borderRadius: 1,
                    }}
                >
                    <Typography color="#ddd">
                    {s.time} —{" "}
                    {(s.seat_pricing || [])
                        .map((p) => `${p.seat_type}: ${calcTotal(p)}৳`)
                        .join(", ")}
                    </Typography>

                    <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEditSlot(d.date, s)}
                        sx={{ color: "#ffc107", borderColor: "#ffc107" }}
                    >
                        Edit Price
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => removeSlot(d.date, s.id)}
                        sx={{ color: "#f44336", borderColor: "#f44336" }}
                    >
                        Delete
                    </Button>
                    </Box>
                </Box>
                ))}

                {/* Toggle Add Slot dropdown */}
                <Box sx={{ mt: 2 }}>
                <Button
                    variant="text"
                    color="warning"
                    size="small"
                    onClick={() =>
                    setOpenAddSlotDate((prev) => (prev === d.date ? null : d.date))
                    }
                >
                    {openAddSlotDate === d.date ? "➖ Cancel" : "➕ Add Slot"}
                </Button>

                {openAddSlotDate === d.date && (
                    <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 1,
                        background: "#1a1a1a",
                        p: 2,
                        borderRadius: 1,
                    }}
                    >
                    <TextField
                        select
                        label="Select Time Slot"
                        size="small"
                        sx={{
                        minWidth: 220,
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "#222",
                            color: "#fff",
                        },
                        "& .MuiInputLabel-root": { color: "#ccc" },
                        }}
                        value=""
                        onChange={(e) => {
                        handleAddSlotToDate(d.date, e.target.value);
                        setOpenAddSlotDate(null); // close after add
                        }}
                    >
                        {timeSlots
                        .filter(
                            (t) => !d.slots.some((existing) => existing.time === t.name)
                        )
                        .map((slot) => (
                            <MenuItem key={slot.id} value={slot.id}>
                            {slot.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Typography sx={{ color: "#888", fontSize: 14 }}>
                        Pick a slot to add for this date.
                    </Typography>
                    </Box>
                )}
                </Box>
            </Box>
            ))}
        </>
        )}


      {/* Save */}
      {dates.length > 0 && (
        <Box textAlign="right" mt={3}>
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
            💾 {saving ? "Saving..." : "Save Showtime"}
          </Button>
        </Box>
      )}

      {/* Existing Showtimes */}
      <Divider sx={{ my: 4, borderColor: "#333" }} />
      {/* Existing Showtimes */}
<Divider sx={{ my: 4, borderColor: "#333" }} />
<Box display="flex" alignItems="center" gap={1} mb={2}>
  <ListAltIcon color="warning" />
  <Typography variant="subtitle1" sx={{ color: "#fff" }}>
    Existing Showtimes
  </Typography>
</Box>

{(!movie?.showtimes || movie.showtimes.length === 0) && (
  <Typography color="gray" sx={{ ml: 2 }}>
    No showtimes have been added yet.
  </Typography>
)}

{(movie?.showtimes || []).map((s, idx) => (
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

      <Box display="flex" gap={1}>
        <Button
          variant="outlined"
          size="small"
          sx={{ color: "#ffc107", borderColor: "#ffc107" }}
          onClick={() => handleEditShowtime(idx)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ color: "#f44336", borderColor: "#f44336" }}
          onClick={() => handleDeleteShowtime(idx)}
        >
          Delete
        </Button>
      </Box>
    </Box>

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
  </Box>
))}


      {/* Dialog for editing slot price */}
      <Dialog
        open={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Price — {editingSlot?.slot?.time} ({editingSlot?.date})
        </DialogTitle>
        <DialogContent dividers>
          {(editingSlot?.slot?.seat_pricing || []).map((p, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {p.seat_type}
              </Typography>

              {["base", "acm", "sslc", "vat", "mtax", "htax", "other"].map((f) => (
                <Grid container alignItems="center" spacing={1} key={f} sx={{ mb: 1 }}>
                  <Grid item xs={4}>
                    <Typography variant="caption">{f.toUpperCase()}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      type="number"
                      size="small"
                      value={editingSlot.slot.seat_pricing[idx][f] ?? 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setEditingSlot((prev) => {
                          const nextPricing = prev.slot.seat_pricing.map((sp, i) =>
                            i === idx ? { ...sp, [f]: val } : sp
                          );
                          return { ...prev, slot: { ...prev.slot, seat_pricing: nextPricing } };
                        });
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}

              <Typography sx={{ color: "#f44336", fontWeight: "bold" }}>
                Total = {calcTotal(editingSlot?.slot?.seat_pricing?.[idx] || {})} ৳
              </Typography>
              <Divider sx={{ my: 1, borderColor: "#ddd" }} />
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button
            startIcon={<DeleteOutlineIcon />}
            color="error"
            onClick={handleDeleteFromDialog}
          >
            Delete Slot
          </Button>
          <Box>
            <Button onClick={() => setEditingSlot(null)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => saveEditedSlot(editingSlot.slot.seat_pricing)}
            >
              Save Changes
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
