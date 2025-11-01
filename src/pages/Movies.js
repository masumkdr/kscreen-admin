import React, { useEffect, useState } from "react";
import TableView from "../components/TableView/TableView";
import FormBuilder from "../components/FormBuilder/FormBuilder";
import DialogForm from "../components/DialogForm";
import { useSnackbarMessage } from "../hooks/useSnackbarMessage";
import { useNavigate } from "react-router-dom";
import defaultMovies from "../data/movies.json";
import categories from "../data/categories.json";
import origins from "../data/origins.json";
import languages from "../data/languages.json";
import genres from "../data/genres.json";
import { Visibility } from "@mui/icons-material";

const STORAGE_KEY = "movies_data";

export default function Movies() {
  const [movies, setMovies] = useState(defaultMovies);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formValues, setFormValues] = useState({});
  const { SnackbarComponent, showMessage } = useSnackbarMessage();

  const navigate = useNavigate();
  

  // ✅ Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMovies(parsed);
          return;
        }
      }
      setMovies(defaultMovies);
    } catch {
      setMovies(defaultMovies);
    }
  }, []);

  // ✅ Safe LocalStorage Save
  const saveToStorage = (data) => {
    try {
      const safe = JSON.parse(
        JSON.stringify(data, (key, value) => {
          if (
            value === null ||
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" ||
            Array.isArray(value)
          ) {
            return value;
          }
          if (
            typeof value === "function" ||
            value instanceof HTMLElement ||
            value instanceof File ||
            value instanceof Blob ||
            value?._reactInternals ||
            key.startsWith("__react") ||
            key.startsWith("_owner")
          ) {
            return undefined;
          }
          if (typeof value === "object") return value;
          return undefined;
        })
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
      setMovies(safe);
    } catch (err) {
      console.error("❌ Failed to save movies:", err, data);
    }
  };

  // ➕ Add Movie
  const handleAdd = (movie) => {
    if (!movie || typeof movie !== "object") {
      console.warn("Invalid movie data:", movie);
      return;
    }

    const normalizeField = (val) => {
      if (Array.isArray(val)) {
        return val.map((v) => (typeof v === "object" ? v.id : v));
      }
      return val;
    };

    const newMovie = {
      ...movie,
      category_id: normalizeField(movie.category_id),
      origin_id: normalizeField(movie.origin_id),
      language_id: normalizeField(movie.language_id),
      genre_id: normalizeField(movie.genre_id),
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveToStorage([...movies, newMovie]);
    setFormValues({});
    setFormOpen(false);
    showMessage("✅ Movie added successfully!");
  };

  // ✏️ Edit Movie
  const handleEdit = (updatedMovie) => {
    const newData = movies.map((m) =>
      m.id === updatedMovie.id
        ? { ...updatedMovie, updated_at: new Date().toISOString() }
        : m
    );
    saveToStorage(newData);
    showMessage("✏️ Movie updated successfully!");
  };

  // 🗑 Delete Movie
  const handleDelete = (id) => {
    const newData = movies.filter((m) => m.id !== id);
    saveToStorage(newData);
    showMessage("🗑 Movie deleted.");
  };

  // 🔄 Reset
  const resetToDefault = () => {
    saveToStorage(defaultMovies);
    showMessage("✅ Reset to default movie list.");
  };

  // 💾 Save (Add / Edit)
  const handleSave = () => {
    if (editItem) {
      handleEdit({ ...editItem, ...formValues });
      showMessage("✏️ Movie updated successfully!");
    } else {
      handleAdd(formValues);
      showMessage("✅ Movie added successfully!");
    }
    setFormOpen(false);
    setEditItem(null);
    setFormValues({});
  };

  // ================================
  // Table Columns
  // ================================
  const columns = [
    { field: "name", title: "Movie Name", width: 200 },
    // {
    //   field: "poster_url",
    //   title: "Poster",
    //   width: 100,
    //   renderCell: (row) =>
    //     row.poster_url ? (
    //       <img
    //         src={row.poster_url}
    //         alt="poster"
    //         className="w-12 h-16 rounded object-cover"
    //       />
    //     ) : (
    //       "-"
    //     ),
    // },
    {
      field: "category_id",
      title: "Category",
      width: 150,
      renderCell: (row) => mapNames(row.category_id, categories),
    },
    {
      field: "origin_id",
      title: "Origin",
      width: 120,
      renderCell: (row) => mapNames(row.origin_id, origins),
    },
    {
      field: "language_id",
      title: "Language",
      width: 120,
      renderCell: (row) => mapNames(row.language_id, languages),
    },
    {
      field: "genre_id",
      title: "Genre",
      width: 150,
      renderCell: (row) => mapNames(row.genre_id, genres),
    },
    { field: "release", title: "Release", width: 120 },
    {
          field: "preview",
          title: "Preview",
          render: (row) => (
            <Visibility
              fontSize="small"
              color="action"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/movie/${row.id}`)} // ✅ updated
            />
          ),
        },
    { field: "status", title: "Status", width: 120 },
  ];

  // ================================
  // Form Fields
  // ================================
  const formFields = [
    { name: "name", label: "Movie Name", type: "text", fullWidth: true },
    { name: "category_id", label: "Categories", type: "multiselect", options: categories },
    { name: "origin_id", label: "Origins", type: "multiselect", options: origins },
    { name: "language_id", label: "Languages", type: "multiselect", options: languages },
    { name: "genre_id", label: "Genres", type: "multiselect", options: genres },
    { name: "actors", label: "Actors", type: "text", fullWidth: true },
    { name: "director", label: "Director", type: "text", fullWidth: true },
    { name: "release", label: "Release Date", type: "date" },
    { name: "runtime", label: "Runtime (min)", type: "text" },
    { name: "rating", label: "Rating", type: "text" },
    { name: "synopsis", label: "Synopsis", type: "text", fullWidth: true },
    {
      name: "poster_url",
      label: "Poster Upload",
      type: "file",
      helperText: "Upload poster to preview before save",
    },
    {
      name: "trailer_url",
      label: "YouTube Trailer URL",
      type: "youtube",
      fullWidth: true,
    },
    {
      name: "status",
      label: "Status",
      type: "radio",
      options: [
        { label: "Now Showing", value: "now showing" },
        { label: "Coming Soon", value: "coming soon" },
        { label: "Draft", value: "draft" },
        { label: "Ended", value: "ended" },
      ],
    },
  ];

  // ================================
  // Render
  // ================================
  return (
    <div className="p-4">
      {/* ✅ Main Table */}
      <TableView
        title="Movies"
        data={Array.isArray(movies) ? movies : []}
        columns={columns}
        formFields={formFields}
        onAdd={() => setFormOpen(true)}
        onEdit={(row) => {
          setEditItem(row);
          setFormValues(row);
          setFormOpen(true);
        }}
        onDelete={handleDelete}
        primaryField="name"
      />

      {/* ✅ Reset Button */}
      <div className="text-right mt-4">
        <button
          onClick={resetToDefault}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Reset to Default
        </button>
      </div>

      {/* ✅ Dialog Form */}
      <DialogForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        title={editItem ? "Edit Movie" : "Add Movie"}
      >
        <FormBuilder
          fields={formFields}
          values={formValues}
          onChange={(name, value) =>
            setFormValues((prev) => ({
              ...prev,
              [name]: value,
            }))
          }
        />
      </DialogForm>

      {/* ✅ Snackbar */}
      {SnackbarComponent}
    </div>
  );
}

// ================================
// Helper
// ================================
function mapNames(ids, list) {
  if (!ids) return "";
  const arr = Array.isArray(ids) ? ids : [ids];
  return arr
    .map((id) => {
      const match = list.find((item) => String(item.id) === String(id));
      return match ? match.name : "";
    })
    .filter(Boolean)
    .join(", ");
}
