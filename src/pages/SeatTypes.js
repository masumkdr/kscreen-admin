import React, { useState, useEffect } from 'react';
import TableView from '../components/TableView/TableView';
import DialogForm from '../components/DialogForm';
import FormBuilder from '../components/FormBuilder/FormBuilder';
import { useSnackbarMessage } from '../hooks/useSnackbarMessage';
import seatTypeData from '../data/seat_types.json';

const SeatTypes = () => {
  const [data, setData] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formValues, setFormValues] = useState({});
  const { SnackbarComponent, showMessage } = useSnackbarMessage();

  // 🧭 Load from localStorage or JSON
  useEffect(() => {
    const stored = localStorage.getItem('seat_types_data');
    if (stored && stored !== 'undefined') {
      setData(JSON.parse(stored));
    } else {
      setData(seatTypeData);
      localStorage.setItem('seat_types_data', JSON.stringify(seatTypeData));
    }
  }, []);

  // 💾 Save changes persistently
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem('seat_types_data', JSON.stringify(data));
    }
  }, [data]);

  // 🧾 Form Fields
  const fields = [
    { name: 'name', label: 'Seat Type Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' }
  ];

  // 🧠 CRUD Handlers
  const openForm = () => {
    setEditItem(null);
    setFormValues({});
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditItem(row);
    setFormValues(row);
    setFormOpen(true);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Delete seat type "${row.name}"?`)) {
      setData(prev => prev.filter(d => d.id !== row.id));
      showMessage('info', 'Seat type deleted successfully');
    }
  };

  const handleSave = () => {
    if (!formValues.name) return alert('Name is required');

    if (editItem) {
      setData(prev => prev.map(d => (d.id === editItem.id ? formValues : d)));
      showMessage('success', 'Seat type updated successfully');
    } else {
      setData(prev => [...prev, { id: Date.now(), ...formValues }]);
      showMessage('success', 'Seat type added successfully');
    }

    setFormOpen(false);
    setEditItem(null);
  };

  return (
    <>
      <TableView
        title="Seat Types"
        columns={[
          { field: 'name', title: 'Name', isPrimary: true },
          { field: 'description', title: 'Description' },
        ]}
        data={data}
        defaultSortField="name"
        defaultSortOrder="asc"
        defaultRowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        showSearch={true}
        showAddButton={true}
        onAdd={openForm}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <DialogForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        title={editItem ? 'Edit Seat Type' : 'Add Seat Type'}
      >
        <FormBuilder
          fields={fields}
          values={formValues}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              [e.target.name]: e.target.value
            })
          }
        />
      </DialogForm>

      {SnackbarComponent}
    </>
  );
};

export default SeatTypes;