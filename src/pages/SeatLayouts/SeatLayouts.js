import React, { useEffect, useState } from "react";
import TableView from "../../components/TableView/TableView";
import { GridView, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import defaultLayouts from "../../data/seat_layouts.json";

export default function SeatLayoutList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    const local = localStorage.getItem("seat_layouts");
    if (local) {
      const localLayouts = JSON.parse(local);
      const merged = [
        ...defaultLayouts.filter(
          (d) => !localLayouts.some((l) => l.id === d.id)
        ),
        ...localLayouts,
      ];
      setData(merged);
    } else {
      setData(defaultLayouts);
    }
  }, []);

  useEffect(() => {
    if (data.length) {
      localStorage.setItem("seat_layouts", JSON.stringify(data));
    }
  }, [data]);

  const columns = [
    { field: "id", title: "ID" },
    { field: "name", title: "Layout Name", isPrimary: true },
    { field: "total_rows", title: "Rows" },
    { field: "total_columns", title: "Columns" },
    {
      field: "preview",
      title: "Preview",
      render: (row) => (
        <Visibility
          fontSize="small"
          color="action"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/seat_layouts/edit/${row.id}`)} // ✅ updated
        />
      ),
    },
    { field: "status", title: "Status" },
  ];

  const handleAdd = () => {
    navigate("/seat_layouts/new"); // ✅ updated
  };

  const handleEdit = (row) => {
    navigate(`/seat_layouts/edit/${row.id}`); // ✅ updated
  };

  const handleDelete = (row) => {
    setData(data.filter((item) => item.id !== row.id));
  };

  return (
    <TableView
      title="Seat Layouts"
      icon={<GridView />}
      data={data}
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}