import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import hallsData from "../../data/halls.json";
import theatersData from "../../data/theaters.json";
import locationsData from "../../data/locations.json";

import ShowtimeForm from "./ShowTimeForm";
import ShowtimeList from "./ShowTimeList";

export default function MovieShowtimes({ movie }) {
  const [allShowtimes, setAllShowtimes] = useState({});
  const [showtimes, setShowtimes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(null);

  // ✅ Load all showtimes for all movies
  useEffect(() => {
    try {
      const stored = localStorage.getItem("showtimes");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAllShowtimes(parsed);

        // extract current movie’s showtimes
        if (parsed[movie.id]) {
          const halls = parsed[movie.id].halls || [];
          const mergedShowtimes = halls.flatMap((h) =>
            (h.showtimes || []).map((st) => ({
              ...st,
              hall_id: h.hall_id,
              hall_name: h.hall_name,
              theater_id: h.theater_id,
              theater_name: h.theater_name,
              location_id: h.location_id,
              location_name: h.location_name,
            }))
          );
          setShowtimes(mergedShowtimes);
        } else {
          setShowtimes([]);
        }
      } else {
        setAllShowtimes({});
        setShowtimes([]);
      }
    } catch (err) {
      console.error("Error parsing showtimes:", err);
      setAllShowtimes({});
      setShowtimes([]);
    }
    setLoaded(true);
  }, [movie.id]);

  // ✅ Persist all showtimes
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("showtimes", JSON.stringify(allShowtimes));
  }, [allShowtimes, loaded]);

  const handleSave = (newShowtime, hallInfo, theaterInfo, locationInfo) => {
    setAllShowtimes((prev) => {
      const updated = { ...prev };

      // movie base object
      const movieEntry = updated[movie.id] || {
        movie_id: movie.id,
        movie_name: movie.name,
        halls: [],
      };

      // find hall under this movie
      const hallIndex = movieEntry.halls.findIndex(
        (h) => h.hall_id === hallInfo.id
      );

      if (hallIndex >= 0) {
        // hall exists → update or append showtime
        if (editingIndex !== null)
          movieEntry.halls[hallIndex].showtimes[editingIndex] = newShowtime;
        else movieEntry.halls[hallIndex].showtimes.push(newShowtime);
      } else {
        // create new hall entry
        movieEntry.halls.push({
          hall_id: hallInfo.id,
          hall_name: hallInfo.name,
          theater_id: theaterInfo.id,
          theater_name: theaterInfo.name,
          location_id: locationInfo.id,
          location_name: locationInfo.name,
          showtimes: [newShowtime],
        });
      }

      updated[movie.id] = movieEntry;

      // Flatten data for list rendering
      const mergedShowtimes = movieEntry.halls.flatMap((h) =>
        (h.showtimes || []).map((st) => ({
          ...st,
          hall_id: h.hall_id,
          hall_name: h.hall_name,
          theater_id: h.theater_id,
          theater_name: h.theater_name,
          location_id: h.location_id,
          location_name: h.location_name,
        }))
      );
      setShowtimes(mergedShowtimes);
      setEditingIndex(null);
      setFormData(null);
      return updated;
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(showtimes[index]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (index) => {
    if (!window.confirm("Delete this showtime?")) return;

    const target = showtimes[index];
    if (!target) return;

    setAllShowtimes((prev) => {
      const updated = { ...prev };
      const movieEntry = updated[movie.id];
      if (!movieEntry) return prev;

      const hallIdx = movieEntry.halls.findIndex(
        (h) => h.hall_id === target.hall_id
      );
      if (hallIdx >= 0) {
        movieEntry.halls[hallIdx].showtimes = movieEntry.halls[
          hallIdx
        ].showtimes.filter(
          (st) =>
            !(
              st.date_range.start === target.date_range.start &&
              st.date_range.end === target.date_range.end
            )
        );

        if (movieEntry.halls[hallIdx].showtimes.length === 0)
          movieEntry.halls.splice(hallIdx, 1);
      }

      updated[movie.id] = movieEntry;
      return updated;
    });

    setShowtimes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData(null);
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
        onSave={(newShowtime) => {
          // 🏟 Get hall info
          const hallInfo = hallsData.find(
            (h) => h.id === Number(newShowtime.hall_id)
          );
          if (!hallInfo) {
            alert("Invalid hall selected!");
            return;
          }

          // 🎭 Get theater info for that hall
          const theaterInfo = theatersData.find(
            (t) => t.id === Number(hallInfo.theater_id)
          );
          if (!theaterInfo) {
            alert("Theater not found for this hall.");
            return;
          }

          // 🌍 Get location info for that theater
          const locationInfo = locationsData.find(
            (l) => l.id === Number(theaterInfo.location_id)
          );
          if (!locationInfo) {
            alert("Location not found for this theater.");
            return;
          }

          // ✅ Save with full relational context
          handleSave(
            {
              ...newShowtime,
              hall_id: hallInfo.id,
              hall_name: hallInfo.name,
              theater_id: theaterInfo.id,
              theater_name: theaterInfo.name,
              location_id: locationInfo.id,
              location_name: locationInfo.name,
            },
            hallInfo,
            theaterInfo,
            locationInfo
          );
        }}
        onCancel={handleCancel}
      />

      <Divider sx={{ my: 4, borderColor: "#333" }} />
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <ListAltIcon color="warning" />
        <Typography variant="subtitle1" sx={{ color: "#fff" }}>
          Existing Showtimes
        </Typography>
      </Box>

      {loaded ? (
        <ShowtimeList
          showtimes={showtimes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <Typography sx={{ color: "gray" }}>Loading showtimes...</Typography>
      )}
    </Box>
  );
}
