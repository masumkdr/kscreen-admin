// ===============================================
// StepHallTime.js — show hall names & their slots
// ===============================================
import React from "react";
import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import Section from "./Section";

export default function StepHallTime({ form, update, halls, showtimes }) {
  const handleSelectSlot = (hallId, slotId) => {
    update({
      hall_id: hallId,
      time_slot_id: slotId,
      seat_type: null,
      seat_qty: 0,
      selected_seats: [],
    });
  };

  return (
    <Section
      title="4. Select Hall & Showtime"
      icon={<EventSeatIcon fontSize="small" />}
    >
      {!form.movie_id && (
        <Typography variant="body2" color="gray">
          Select a movie first.
        </Typography>
      )}

      {form.movie_id && halls.length === 0 && (
        <Typography variant="body2" color="gray">
          No halls available for this location.
        </Typography>
      )}

      {form.movie_id && halls.length > 0 && (
        <Stack spacing={2}>
          {halls.map((hall) => (
            <Card
              key={hall.hall_id}
              sx={{
                bgcolor: "#0f172a",
                borderRadius: 3,
                border:
                  form.hall_id === hall.hall_id
                    ? "1px solid #bfa14a"
                    : "1px solid #1f2937",
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#bfa14a", fontWeight: 700 }}
                >
                  {hall.hall_name} — {hall.theater_name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#9ca3af", display: "block", mb: 1 }}
                >
                  {hall.location_name}
                </Typography>
                <Divider sx={{ borderColor: "#1f2937", mb: 2 }} />

                {/* Find slots for this hall + selected date */}
                {(() => {
                  const dateObj =
                    hall.showtimes
                      ?.flatMap((s) => s.dates || [])
                      .find((d) => d.date === form.date) || null;
                  const slots = dateObj?.slots || [];

                  if (slots.length === 0)
                    return (
                      <Typography variant="body2" color="gray">
                        No showtimes for {form.date}.
                      </Typography>
                    );

                  return (
                    <Stack direction="row" spacing={1} className="flex-wrap">
                      {slots.map((slot) => (
                        <Chip
                          key={slot.id}
                          label={slot.time}
                          onClick={() =>
                            handleSelectSlot(hall.hall_id, slot.id)
                          }
                          variant={
                            form.time_slot_id === slot.id ? "filled" : "outlined"
                          }
                          sx={{
                            bgcolor:
                              form.time_slot_id === slot.id
                                ? "#bfa14a"
                                : "transparent",
                            color:
                              form.time_slot_id === slot.id
                                ? "#141414"
                                : "#bfa14a",
                            borderColor: "#bfa14a",
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Stack>
                  );
                })()}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Section>
  );
}
