import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  FormLabel,
} from "@mui/material";

export default function FormBuilder({ fields, values = {}, onChange }) {
  const [filePreviews, setFilePreviews] = useState({});

  // ✅ YouTube embed URL helper
  const getYouTubeEmbedURL = (url) => {
    try {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return "";
    }
  };

  // ✅ Simplified local helper for field value change
  const handleFieldChange = (name, value) => {
    onChange(name, value);
  };

  return (
    <>
      {fields.map((field) => {
        const value = values[field.name] ?? "";

        switch (field.type) {
          // 📝 Text Input
          case "text":
            return (
              <TextField
                key={field.name}
                label={field.label}
                value={value}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                fullWidth
                margin="normal"
              />
            );

          // 📋 Dropdown (single select)
          case "dropdown":
            return (
              <TextField
                key={field.name}
                label={field.label}
                select
                fullWidth
                margin="normal"
                value={value}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              >
                {field.options.map((opt) => {
                  const val = typeof opt === "object" ? opt.value : opt;
                  const lbl = typeof opt === "object" ? opt.label : opt;
                  return (
                    <MenuItem key={val} value={val}>
                      {lbl}
                    </MenuItem>
                  );
                })}
              </TextField>
            );

          // 🔘 Radio Buttons
          case "radio":
            return (
              <div key={field.name} style={{ marginTop: 8 }}>
                <FormLabel component="legend">{field.label}</FormLabel>
                <RadioGroup
                  name={field.name}
                  value={value}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  row
                >
                  {field.options.map((opt) => {
                    const val = typeof opt === "object" ? opt.value : opt;
                    const lbl = typeof opt === "object" ? opt.label : opt;
                    return (
                      <FormControlLabel
                        key={val}
                        value={val}
                        control={<Radio />}
                        label={lbl}
                      />
                    );
                  })}
                </RadioGroup>
              </div>
            );

          // ☑️ Single Checkbox
          case "checkbox":
            return (
              <FormControlLabel
                key={field.name}
                control={
                  <Checkbox
                    checked={!!value}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.checked)
                    }
                  />
                }
                label={field.label}
              />
            );

          // 📅 Date
          case "date":
            return (
              <TextField
                key={field.name}
                label={field.label}
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={value}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              />
            );

          // 🕒 Datetime
          case "datetime":
            return (
              <TextField
                key={field.name}
                label={field.label}
                type="datetime-local"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={value}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              />
            );

          // 🧩 Multi-select (checkbox group)
          case "multiselect":
            return (
              <div key={field.name} style={{ marginTop: 8, marginBottom: 8 }}>
                <FormLabel component="legend">{field.label}</FormLabel>
                <FormGroup row>
                  {field.options.map((opt) => (
                    <FormControlLabel
                      key={opt.id}
                      control={
                        <Checkbox
                          checked={
                            Array.isArray(value) && value.includes(opt.id)
                          }
                          onChange={(e) => {
                            const prev = Array.isArray(value) ? [...value] : [];
                            if (e.target.checked) {
                              handleFieldChange(field.name, [...prev, opt.id]);
                            } else {
                              handleFieldChange(
                                field.name,
                                prev.filter((id) => id !== opt.id)
                              );
                            }
                          }}
                        />
                      }
                      label={opt.name}
                    />
                  ))}
                </FormGroup>
              </div>
            );

          // 🖼️ File Upload + Preview + Remove
          case "file":
            return (
              <div key={field.name} style={{ marginTop: 12, marginBottom: 12 }}>
                <FormLabel component="legend">{field.label}</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // Optional validation
                    if (file.size > 2 * 1024 * 1024) {
                      alert("File too large! Max 2MB allowed.");
                      return;
                    }
                    if (!file.type.startsWith("image/")) {
                      alert("Only image files allowed!");
                      return;
                    }

                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = reader.result;
                      handleFieldChange(field.name, base64);
                      setFilePreviews((prev) => ({
                        ...prev,
                        [field.name]: base64,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />

                {(filePreviews[field.name] || value) && (
                  <div
                    style={{
                      marginTop: 8,
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    <img
                      src={filePreviews[field.name] || value}
                      alt="Preview"
                      style={{
                        width: 100,
                        height: 140,
                        borderRadius: 8,
                        objectFit: "cover",
                        boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleFieldChange(field.name, "");
                        setFilePreviews((prev) => ({
                          ...prev,
                          [field.name]: "",
                        }));
                      }}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        background: "#d33",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        cursor: "pointer",
                      }}
                      title="Remove Poster"
                    >
                      ×
                    </button>
                  </div>
                )}

                {field.helperText && (
                  <p style={{ fontSize: 12, color: "#777" }}>
                    {field.helperText}
                  </p>
                )}
              </div>
            );

          // 🎥 YouTube URL + Preview
          case "youtube":
            return (
              <div key={field.name} style={{ marginTop: 12, marginBottom: 12 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label={field.label}
                  placeholder="Enter YouTube video link"
                  value={value}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                />
                {value && (
                  <iframe
                    width="360"
                    height="200"
                    src={getYouTubeEmbedURL(value)}
                    title="Trailer Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      borderRadius: 8,
                      marginTop: 10,
                      border: "none",
                      boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                    }}
                  />
                )}
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
}