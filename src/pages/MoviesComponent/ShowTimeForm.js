// src/components/MovieShowtimes/ShowtimeForm.js
import React, { useState, useEffect } from "react";
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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import hallsData from "../../data/halls.json";
import timeSlots from "../../data/time_slots.json";
import seatTypes from "../../data/seat_types.json";
import theatersData from "../../data/theaters.json";
import locationsData from "../../data/locations.json";

export default function ShowTimeForm({ formData, onSave, onCancel }) {
  const [hallId, setHallId] = useState(formData?.hall_id || "");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [dates, setDates] = useState(formData?.dates || []);
  const [defaultPrices, setDefaultPrices] = useState({});
  const [saving, setSaving] = useState(false);

  const [openAddSlotDate, setOpenAddSlotDate] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);

  const today = new Date();
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);

const [startDate, setStartDate] = useState(
  today.toISOString().split("T")[0]
);
const [endDate, setEndDate] = useState(
  nextWeek.toISOString().split("T")[0]
);

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

  useEffect(() => {
    if (formData) {
      const slotIds = Array.from(
        new Set(
          formData.dates.flatMap((d) =>
            d.slots.map((s) => timeSlots.find((t) => t.name === s.time)?.id)
          )
        )
      ).filter(Boolean);
      setSelectedSlots(slotIds);

      const firstSlot = formData.dates?.[0]?.slots?.[0];
      if (firstSlot?.seat_pricing?.length) {
        const map = {};
        firstSlot.seat_pricing.forEach((p) => (map[p.seat_type] = p));
        setDefaultPrices(map);
      }
    }
  }, [formData]);

  const toggleSlot = (slotId) =>
    setSelectedSlots((prev) =>
      prev.includes(slotId) ? prev.filter((id) => id !== slotId) : [...prev, slotId]
    );

  const toggleSeatType = (name, checked) => {
    if (checked)
      setDefaultPrices((prev) => ({ ...prev, [name]: { ...defaultPriceTemplate } }));
    else {
      const copy = { ...defaultPrices };
      delete copy[name];
      setDefaultPrices(copy);
    }
  };

  const handlePriceChange = (seatType, field, value) => {
    setDefaultPrices((prev) => ({
      ...prev,
      [seatType]: {
        ...(prev[seatType] || defaultPriceTemplate),
        [field]: parseFloat(value) || 0,
      },
    }));
  };

  const generateDates = () => {
    if (!hallId || !startDate || !endDate || selectedSlots.length === 0) {
      alert("Select hall, date range, and at least one slot.");
      return;
    }
    const arr = [];
    let current = new Date(startDate);
    const last = new Date(endDate);
    while (current <= last) {
      arr.push({
        date: current.toISOString().split("T")[0],
        slots: selectedSlots.map((slotId) => ({
          id: `${current.toISOString().split("T")[0]}_${slotId}`,
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

  const handleSave = () => {
    if (!hallId || !dates.length) {
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
    onSave(newShowtime);
    // Reset form
    setHallId("");
    setStartDate("");
    setEndDate("");
    setSelectedSlots([]);
    setDates([]);
    setDefaultPrices({});
    setSaving(true);
    setTimeout(() => setSaving(false), 300);
  };

  const removeSlot = (date, slotId) => {
    setDates((prev) =>
      prev.map((d) =>
        d.date === date ? { ...d, slots: d.slots.filter((s) => s.id !== slotId) } : d
      )
    );
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
      prev.map((d) => (d.date === date ? { ...d, slots: [...d.slots, newSlot] } : d))
    );
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
  };

  return (
    <Box>
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
          sx={{ ...darkFieldSx, minWidth: 240 }}
        >
          {hallsData.map((h) => {
            const theater = theatersData.find((t) => t.id === h.theater_id);
            const location = locationsData.find(
              (l) => l.id === theater?.location_id
            );
            return (
              <MenuItem key={h.id} value={h.id}>
                {`${h.name} — ${theater?.name || "?"}, ${location?.name || "?"}`}
              </MenuItem>
            );
          })}
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
      <Box display="flex" alignItems="center" gap={1} mb={2}>
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

      {/* Step 3 — unified card with selectable seat types */}
      <Divider sx={{ my: 3, borderColor: "#333" }} />
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <MonetizationOnIcon color="warning" />
        <Typography variant="subtitle1" sx={{ color: "#fff" }}>
          Step 3 — Default Pricing Setup
        </Typography>
      </Box>

      <Box
        sx={{
          background: "#1a1a1a",
          p: 2,
          borderRadius: 1,
          border: "1px solid #333",
        }}
      >
        {/* All seat type checkboxes in one row */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {seatTypes.map((s) => (
            <FormControlLabel
              key={s.id}
              control={
                <Checkbox
                  checked={!!defaultPrices[s.name]}
                  onChange={(e) => toggleSeatType(s.name, e.target.checked)}
                  sx={{ color: "#ffc107" }}
                />
              }
              label={s.name}
            />
          ))}
        </Box>

        {/* Only selected seat types show pricing inputs */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {Object.entries(defaultPrices).map(([seat, vals]) => (
            <Box
              key={seat}
              sx={{
                flex: "1 1 300px",
                background: "#222",
                p: 2,
                borderRadius: 1,
                border: "1px solid #333",
              }}
            >
              <Typography variant="subtitle1" color="#ffc107" gutterBottom>
                💺 {seat}
              </Typography>
              {["base", "acm", "sslc", "vat", "mtax", "htax", "other"].map((f) => (
                <Box key={f} sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ color: "#ccc" }}>
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
                        background: "#1a1a1a",
                        color: "#fff",
                        borderRadius: "6px",
                      },
                    }}
                  />
                </Box>
              ))}
              <Typography
                sx={{ color: "#f44336", fontWeight: "bold", textAlign: "center" }}
              >
                Total = {calcTotal(vals)} ৳
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Button
        variant="outlined"
        sx={{
          borderColor: "#ffc107",
          color: "#ffc107",
          "&:hover": { borderColor: "#f44336", color: "#f44336" },
          mt: 2,
        }}
        onClick={generateDates}
      >
        ⚙️ Generate Layout
      </Button>

      {/* Step 4 layout (same as before, omitted here for brevity — keep your current version) */}
      {/* Step 4 — Layout with Edit/Delete + Add Slot */}
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

        {/* Add Slot dropdown per date */}
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
                  setOpenAddSlotDate(null);
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

{/* Save Button (unchanged) */}
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
      💾 {saving ? "Saving..." : formData ? "Update Showtime" : "Save Showtime"}
    </Button>
    {formData && (
      <Button onClick={onCancel} sx={{ ml: 2, color: "#ccc" }}>
        Cancel
      </Button>
    )}
  </Box>
)}

{/* Edit Price Dialog (unchanged) */}
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
      onClick={() => {
        removeSlot(editingSlot.date, editingSlot.slot.id);
        setEditingSlot(null);
      }}
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