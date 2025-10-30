import React, { useState, useEffect } from 'react';
import TableView from '../components/TableView/TableView';
import DialogForm from '../components/DialogForm';
import FormBuilder from '../components/FormBuilder/FormBuilder';
import { useSnackbarMessage } from '../hooks/useSnackbarMessage';
import hallData from '../data/halls.json';
import theaterData from '../data/theaters.json';

const Halls = () => {
  const [data, setData] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formValues, setFormValues] = useState({});
  const { SnackbarComponent, showMessage } = useSnackbarMessage();

  // 🧭 Load from localStorage or fallback to JSON
  useEffect(() => {
    const stored = localStorage.getItem('halls_data');
    if (stored && stored !== 'undefined') {
      setData(JSON.parse(stored));
    } else {
      setData(hallData);
      localStorage.setItem('halls_data', JSON.stringify(hallData));
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem('halls_data', JSON.stringify(data));
    }
  }, [data]);

  // Quick lookup for theater names
  const theaterMap = Object.fromEntries(theaterData.map(t => [t.id, t.name]));

  // === Form fields ===
  const fields = [
    { name: 'name', label: 'Hall Name', type: 'text' },
    {
      name: 'theater_id',
      label: 'Theater',
      type: 'dropdown',
      options: theaterData.map(t => ({ value: t.id, label: t.name }))
    },
    { name: 'capacity', label: 'Capacity', type: 'text' },
    { name: 'status', label: 'Status', type: 'dropdown', options: ['Active', 'Inactive'] }
  ];

  // === CRUD Handlers ===
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
    if (window.confirm(`Delete hall "${row.name}"?`)) {
      setData(prev => prev.filter(d => d.id !== row.id));
      showMessage('info', 'Hall deleted successfully');
    }
  };

  const handleSave = () => {
    if (!formValues.name) return alert('Name is required');

    if (editItem) {
      setData(prev => prev.map(d => (d.id === editItem.id ? formValues : d)));
      showMessage('success', 'Hall updated successfully');
    } else {
      setData(prev => [...prev, { id: Date.now(), ...formValues }]);
      showMessage('success', 'Hall added successfully');
    }

    setFormOpen(false);
    setEditItem(null);
  };

  return (
    <>
      <TableView
        title="Halls"
        columns={[
          { field: 'name', title: 'Name', isPrimary: true },
          {
            field: 'theater_id',
            title: 'Theater',
            render: (row) => theaterMap[row.theater_id] || 'N/A'
          },
          { field: 'capacity', title: 'Capacity' },
          { field: 'status', title: 'Status' },
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
        title={editItem ? 'Edit Hall' : 'Add Hall'}
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

export default Halls;