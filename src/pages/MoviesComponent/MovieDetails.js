import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Divider, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";

import categories from "../../data/categories.json";
import genres from "../../data/genres.json";
import languages from "../../data/languages.json";
import origins from "../../data/origins.json";
import MovieShowtimes from "./MovieShowTimes";

const STORAGE_KEY = "movies_data";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  // ✅ Load movie data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const found = parsed.find((m) => String(m.id) === id);
      setMovie(found || null);
    }
  }, [id]);

  if (!movie)
    return (
      <div className="p-10 text-center text-gray-400">
        Movie not found.
        <div>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>
      </div>
    );

  // ✅ Helper to map IDs to names
  const mapNames = (ids, list) => {
    if (!ids) return "";
    const arr = Array.isArray(ids) ? ids : [ids];
    return arr
      .map((id) => {
        const match = list.find((item) => String(item.id) === String(id));
        return match ? match.name : "";
      })
      .filter(Boolean)
      .join(", ");
  };

  const {
    name,
    poster_url,
    category_id,
    genre_id,
    language_id,
    rating,
    synopsis,
    release,
    actors,
    trailer_url,
  } = movie;

  // ✅ Robust YouTube URL parser
  const getEmbedURL = (url) => {
    if (!url) return "";
    try {
      let videoId = "";

      // If standard YouTube link
      const vParam = new URL(url).searchParams.get("v");
      if (vParam) {
        videoId = vParam;
      } else {
        // If short youtu.be link
        const match = url.match(/youtu\.be\/([^?]+)/);
        if (match) videoId = match[1];
      }

      if (!videoId) return "";
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } catch (err) {
      console.error("Invalid YouTube URL:", url, err);
      return "";
    }
  };

  const trailerEmbed = getEmbedURL(trailer_url);

  return (
    <div
      style={{
        backgroundColor: "#0b0f18",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
        position: "relative",
      }}
    >
      {/* ===== Overlay for Trailer ===== */}
      {showTrailer && trailerEmbed && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <div style={{ position: "relative", width: "80%", maxWidth: "900px" }}>
            <IconButton
              onClick={() => setShowTrailer(false)}
              style={{
                position: "absolute",
                top: -40,
                right: -10,
                color: "white",
                background: "rgba(255,255,255,0.15)",
              }}
            >
              <CloseIcon />
            </IconButton>
            <iframe
              width="100%"
              height="500"
              src={trailerEmbed}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        </div>
      )}

      {/* ===== Movie Info Section ===== */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Poster */}
        <div style={{ flex: "0 0 320px" }}>
          {poster_url ? (
            <img
              src={poster_url}
              alt={name}
              style={{
                width: "100%",
                borderRadius: 8,
                boxShadow: "0 0 16px rgba(0,0,0,0.6)",
              }}
            />
          ) : (
            <div
              style={{
                width: 320,
                height: 450,
                background: "#222",
                borderRadius: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#777",
              }}
            >
              No Poster Available
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ flex: 1, maxWidth: 600 }}>
          <h1 style={{ fontSize: "28px", marginBottom: 8 }}>{name}</h1>
          <p style={{ marginBottom: 8 }}>RATE: {rating || "N/A"} ⭐</p>

          <p>
            <strong>Category:</strong> {mapNames(category_id, categories) || "-"}
          </p>
          <p>
            <strong>Actor:</strong> {actors || "-"}
          </p>
          <p>
            <strong>Genre:</strong> {mapNames(genre_id, genres) || "-"}
          </p>
          <p>
            <strong>Release:</strong> {release || "-"}
          </p>
          <p>
            <strong>Language:</strong> {mapNames(language_id, languages) || "-"}
          </p>

          {/* Buttons */}
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => alert("Showtime feature coming soon!")}
              style={{ padding: "8px 20px", fontWeight: "bold" }}
            >
              Show Time
            </Button>
            {trailerEmbed && (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<PlayArrowIcon />}
                onClick={() => setShowTrailer(true)}
                style={{
                  borderColor: "#ccc",
                  color: "white",
                  padding: "8px 20px",
                  fontWeight: "bold",
                }}
              >
                Watch Trailer
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ===== Synopsis ===== */}
      <div style={{ marginTop: 40, maxWidth: 900 }}>
        <h2
          style={{
            borderBottom: "2px solid #555",
            paddingBottom: 8,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          | Synopsis |
        </h2>
        <p
          style={{
            lineHeight: "1.6",
            color: "#ddd",
            fontSize: "15px",
            whiteSpace: "pre-line",
          }}
        >
          {synopsis ||
            "No synopsis available for this movie. Please update details."}
        </p>
      </div>
      <Divider sx={{ my: 4, borderColor: "#333" }} />

      <MovieShowtimes
        movie={movie}
        onShowtimesChange={(newShowtime) => {
          const stored = JSON.parse(localStorage.getItem("movies_data")) || [];
          const updated = stored.map((m) => {
            if (m.id === movie.id) {
              const updatedShowtimes = [...(m.showtimes || []), newShowtime];
              return { ...m, showtimes: updatedShowtimes };
            }
            return m;
          });

          localStorage.setItem("movies_data", JSON.stringify(updated));
          setMovie({
            ...movie,
            showtimes: [...(movie.showtimes || []), newShowtime],
          });
        }}
      />

    </div>
  );
}
