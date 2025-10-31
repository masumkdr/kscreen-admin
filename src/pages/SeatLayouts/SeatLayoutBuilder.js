import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Box,
  Tooltip,
  Divider,
  Slider,
} from "@mui/material";
import {
  Save,
  GridOn,
  Visibility,
  EventSeat,
  FormatListNumbered,
  Layers,
  Chair,
  Movie,
  ZoomIn,
  ZoomOut,
  ChairAlt,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import seatTypeData from "../../data/seat_types.json";

export default function SeatLayoutBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(8);
  const [seatTypes, setSeatTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [layout, setLayout] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [totalSeats, setTotalSeats] = useState(0);
  const [isBlankMode, setIsBlankMode] = useState(false);
  const [zoom, setZoom] = useState(40); // base seat size (px)

  // Load seat types
  useEffect(() => {
    setSeatTypes(seatTypeData);
  }, []);

  // Load existing layout if editing
  useEffect(() => {
    if (id) {
      const savedLayouts = JSON.parse(localStorage.getItem("seat_layouts")) || [];
      const existing = savedLayouts.find((l) => l.id === parseInt(id));
      if (existing) {
        setName(existing.name);
        setRows(existing.total_rows);
        setCols(existing.total_columns);
        setLayout(existing.layout_json || []);
      }
    }
  }, [id]);

  // Generate grid
  const handleGenerate = () => {
    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        type: null,
        blank: false,
        label: "",
      }))
    );
    updateSeatNumbers(grid);
  };

  // Auto-number seats
  const updateSeatNumbers = (grid) => {
    const numbered = grid.map((row, rIdx) => {
      let seatNum = 1;
      return row.map((seat) => {
        if (seat.blank) return { ...seat, label: "" };
        const label = `${String.fromCharCode(65 + rIdx)}${seatNum}`;
        seatNum++;
        return { ...seat, label };
      });
    });
    setLayout(numbered);
  };

  // Count active seats
  useEffect(() => {
    const count = layout.flat().filter((s) => !s.blank && s.type).length;
    setTotalSeats(count);
  }, [layout]);

  // Disable blank mode when selecting seat type
  useEffect(() => {
    if (selectedType && isBlankMode) setIsBlankMode(false);
  }, [selectedType, isBlankMode]);

  // Click handler
  const handleSeatClick = (r, c) => {
    const newLayout = layout.map((row, ri) =>
      row.map((seat, ci) => {
        if (ri === r && ci === c) {
          if (isBlankMode) {
            return { ...seat, blank: !seat.blank, type: seat.blank ? seat.type : null };
          } else if (selectedType) {
            return { ...seat, blank: false, type: selectedType };
          }
        }
        return seat;
      })
    );
    updateSeatNumbers(newLayout);
  };

  // Save layout
  const handleSave = () => {
    if (!name) return alert("Please enter a layout name.");
    if (!layout.length) return alert("Please generate a layout first.");

    const newLayout = {
      id: id ? parseInt(id) : Date.now(),
      name,
      total_rows: rows,
      total_columns: cols,
      layout_json: layout,
      total_seats: totalSeats,
      status: "active",
    };

    const saved = JSON.parse(localStorage.getItem("seat_layouts")) || [];
    const updated = id
      ? saved.map((l) => (l.id === parseInt(id) ? newLayout : l))
      : [...saved, newLayout];
    localStorage.setItem("seat_layouts", JSON.stringify(updated));

    alert("Layout saved successfully!");
    navigate("/seat_layouts");
  };

  // Screen banner
  const ScreenBanner = () => (
    <div
      style={{
        width: "100%",
        height: 40,
        background: "linear-gradient(to right, #444, #ccc, #fff, #ccc, #444)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        boxShadow: "0 4px 12px rgba(255,255,255,0.2)",
        marginBottom: "12px",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: "#000",
          fontWeight: "bold",
          letterSpacing: 2,
        }}
      >
        🎥 SCREEN THIS SIDE
      </Typography>
    </div>
  );

  // Grid Renderer (used in builder & preview)
 const renderGrid = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `auto repeat(${cols}, ${zoom}px)`,
      gap: "6px",
      justifyContent: "center",
      background: "#111",
      padding: "10px",
      borderRadius: "8px",
    }}
  >
    {layout.map((row, rIdx) => (
      <React.Fragment key={`row-${rIdx}`}>
        {/* 🎬 Row Label — click to bulk-assign seat type */}
        <div
          onClick={() => {
            if (!selectedType) return alert("Select a seat type first.");
            const updated = layout.map((r, idx) => {
              if (idx === rIdx) {
                return r.map((s) =>
                  s.blank ? s : { ...s, type: selectedType }
                );
              }
              return r;
            });
            updateSeatNumbers(updated);
          }}
          style={{
            width: zoom - 5,
            height: zoom - 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 13 + zoom / 15,
            textShadow: "0 0 4px rgba(0,0,0,0.8)",
            background: selectedType ? "#333" : "#111",
            borderRadius: 4,
            cursor: selectedType ? "pointer" : "not-allowed",
            transition: "0.2s",
          }}
          title={
            selectedType
              ? `Click to assign all seats in row ${String.fromCharCode(
                  65 + rIdx
                )} as ${selectedType}`
              : "Select a seat type first"
          }
        >
          {String.fromCharCode(65 + rIdx)}
        </div>

        {/* 🎟️ Seat Icons */}
        {row.map((seat, cIdx) => {
          if (seat.blank)
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => handleSeatClick(rIdx, cIdx)}
                style={{
                  width: zoom,
                  height: zoom,
                  background: "#111",
                  cursor: "pointer",
                }}
              ></div>
            );

          const seatType = seatTypes.find((t) => t.name === seat.type);
          const color = seatType ? seatType.color : "#777";

          return (
            <Tooltip
              key={`${rIdx}-${cIdx}`}
              title={
                seat.type
                  ? `${seat.label} (${seat.type})`
                  : `${seat.label} (Unassigned)`
              }
            >
              <div
                onClick={() => handleSeatClick(rIdx, cIdx)}
                style={{
                  width: zoom,
                  height: zoom,
                  position: "relative",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Chair
                  sx={{
                    fontSize: zoom * 0.8,
                    color: color,
                    transition: "0.2s",
                    "&:hover": {
                      transform: "scale(1.3)",
                      color: "#b7b4b4ff",
                    },
                  }}
                />
                {seat.label && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: zoom * 0.08,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: 9 + zoom / 10,
                      fontWeight: 700,
                      color: "#fff",
                      pointerEvents: "none",
                      textShadow: "0 0 4px rgba(0,0,0,0.8)",
                      "&:hover": {
                      transform: "scale(1.3)",
                      color: "#fff",
                    },
                    }}
                  >
                    {seat.label.replace(/[A-Z]/, "")}
                  </span>
                )}
              </div>
            </Tooltip>
          );
        })}
      </React.Fragment>
    ))}
  </div>
);


  return (
    <div className="p-6">
      <Typography variant="h5" gutterBottom>
        🎭 {id ? "Edit Seat Layout" : "Create Seat Layout"}
      </Typography>

      {/* Step 1 */}
      <Divider sx={{ my: 2 }} />
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <FormatListNumbered color="primary" />
        <Typography variant="h6">Step 1 — Basic Info</Typography>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <TextField
          label="Layout Name"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Rows"
          type="number"
          size="small"
          value={rows}
          onChange={(e) => setRows(parseInt(e.target.value))}
        />
        <TextField
          label="Columns"
          type="number"
          size="small"
          value={cols}
          onChange={(e) => setCols(parseInt(e.target.value))}
        />
        <Button
          variant="contained"
          startIcon={<GridOn />}
          onClick={handleGenerate}
        >
          Generate Grid
        </Button>
      </Box>

      {/* Step 2 */}
      <Divider sx={{ my: 2 }} />
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Layers color="error" />
        <Typography variant="h6">Step 2 — Mark Blank Seats</Typography>
      </Box>
      <Box mb={3}>
        <Button
          variant={isBlankMode ? "contained" : "outlined"}
          color={isBlankMode ? "error" : "inherit"}
          onClick={() => setIsBlankMode(!isBlankMode)}
        >
          {isBlankMode ? "🟥 Blank Mode On" : "⬜ Mark Blank Seats"}
        </Button>
      </Box>

     {/* STEP 3 */}
<Divider sx={{ my: 2 }} />
<Box display="flex" alignItems="center" gap={1} mb={2}>
  <ChairAlt color="success" />
  <Typography variant="h6">Step 3 — Assign Seat Types</Typography>
</Box>

<Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
  Click a seat type to select it, then click seats or row labels to assign.
</Typography>

<Box
  display="flex"
  flexDirection="column"
  gap={1}
  sx={{
    background: "#1e1e1e",
    borderRadius: "8px",
    padding: "10px 12px",
    maxWidth: 250,
  }}
>
  {seatTypes.map((t) => {
    // Count how many seats use this type
    const seatCount = layout
      .flat()
      .filter((s) => s.type === t.name && !s.blank).length;

    // Check if this type is used anywhere
    const isUsed = seatCount > 0;
    const isSelected = selectedType === t.name;

    return (
      <Box
        key={t.id}
        onClick={() => setSelectedType(t.name)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          padding: "8px 10px",
          borderRadius: "6px",
          cursor: "pointer",
          border: isSelected ? `2px solid ${t.color}` : "1px solid #444",
          backgroundColor: isSelected ? "#333" : "transparent",
          transition: "0.2s",
          "&:hover": {
            backgroundColor: "#2c2c2c",
          },
        }}
      >
        {/* Left side: Color and name */}
        <Box display="flex" alignItems="center" gap={1}>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: t.color,
              borderRadius: 3,
            }}
          ></div>
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: "#fff",
              fontWeight: isSelected ? 600 : 400,
            }}
          >
            {t.name}
          </Typography>
        </Box>

        {/* Right side: Count + tick */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: seatCount > 0 ? "#ccc" : "#666",
              minWidth: 50,
              textAlign: "right",
            }}
          >
            {seatCount > 0 ? `${seatCount} seat${seatCount > 1 ? "s" : ""}` : "-"}
          </Typography>

          {isUsed && (
            <span
              style={{
                color: t.color,
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              ✓
            </span>
          )}
        </Box>
      </Box>
    );
  })}
</Box>


      {/* Step 4 */}
      <Divider sx={{ my: 2 }} />
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Movie color="info" />
        <Typography variant="h6">Step 4 — Design Preview</Typography>
      </Box>
      {layout.length > 0 && (
        <>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Total Active Seats: <strong>{totalSeats}</strong>
          </Typography>
          <ScreenBanner />
          <div style={{ perspective: "600px" }}>
            {renderGrid()}
            </div>

          {/* 🎚️ Zoom Control */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            justifyContent="center"
            mt={2}
          >
            <ZoomOut sx={{ color: "#fff" }} />
            <Slider
              value={zoom}
              onChange={(e, val) => setZoom(val)}
              step={2}
              min={30}
              max={60}
              sx={{ width: 200, color: "#fbc02d" }}
            />
            <ZoomIn sx={{ color: "#fff" }} />
          </Box>
        </>
      )}

      {/* Action Buttons */}
      <Box mt={4} display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<Visibility />}
          onClick={() => setPreviewOpen(true)}
        >
          Preview
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<Save />}
          onClick={handleSave}
        >
          Save Layout
        </Button>
        <Button variant="outlined" onClick={() => navigate("/seat_layouts")}>
          Cancel
        </Button>
      </Box>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} maxWidth="md" fullWidth>
        <DialogTitle>🎥 Final Layout Preview: {name}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Rows: {rows} | Columns: {cols} | Total Seats: {totalSeats}
          </Typography>
          <ScreenBanner />
          {renderGrid()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button variant="contained" color="success" onClick={handleSave}>
            Confirm & Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}