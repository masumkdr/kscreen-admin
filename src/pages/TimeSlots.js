import React, { useState, useEffect } from 'react';
import TableView from '../components/TableView/TableView';
import DialogForm from '../components/DialogForm';
import FormBuilder from '../components/FormBuilder/FormBuilder';
import TimeSlotsData from '../data/time_slots.json';
import { useSnackbarMessage } from '../hooks/useSnackbarMessage';

const TimeSlots = () => {
  const [data, setData] = useState(TimeSlotsData);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formValues, setFormValues] = useState({});
  const { SnackbarComponent, showMessage } = useSnackbarMessage();

  // Load from localStorage or JSON
useEffect(() => {
  const stored = localStorage.getItem('timeslots_data');
  if (stored && stored !== 'undefined') {
    setData(JSON.parse(stored));
  } else {
    setData(TimeSlotsData);
    localStorage.setItem('timeslots_data', JSON.stringify(TimeSlotsData));
  }
}, []);


  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('genres_data', JSON.stringify(data));
  }, [data]);

  // Form field configuration
  const fields = [
    { name: 'name', label: 'Time Slot Name', type: 'text' },
  ];

  // CRUD handlers
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
    if (window.confirm(`Delete location "${row.name}"?`)) {
      setData(prev => prev.filter(d => d.id !== row.id));
      showMessage('info', 'Time Slot deleted successfully');
    }
  };

  const handleSave = () => {
    if (!formValues.name) return alert('Name is required');

    if (editItem) {
      setData(prev => prev.map(d => (d.id === editItem.id ? formValues : d)));
      showMessage('success', 'Time Slot updated successfully');
    } else {
      setData(prev => [...prev, { id: Date.now(), ...formValues }]);
      showMessage('success', 'Time Slot added successfully');
    }

    setFormOpen(false);
    setEditItem(null);
  };

  return (
    <>
      <TableView
        title="TimeSlots"
        columns={[
          { field: 'name', title: 'Name', isPrimary: true }
        ]}
        data={data}
        defaultSortField="name"
        defaultSortOrder="asc"
        defaultRowsPerPage={10}
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
        title={editItem ? 'Edit Time Slot' : 'Add Time Slot'}
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

export default TimeSlots;