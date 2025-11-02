import React, { useState, useEffect } from 'react';
import TableView from '../components/TableView/TableView';
import DialogForm from '../components/DialogForm';
import FormBuilder from '../components/FormBuilder/FormBuilder';
import locationData from '../data/locations.json';
import { useSnackbarMessage } from '../hooks/useSnackbarMessage';

const Locations = () => {
  const [data, setData] = useState(locationData);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formValues, setFormValues] = useState({});
  const { SnackbarComponent, showMessage } = useSnackbarMessage();

  // Load from localStorage or JSON
useEffect(() => {
  const stored = localStorage.getItem('locations_data');
  if (stored && stored !== 'undefined') {
    setData(JSON.parse(stored));
  } else {
    setData(locationData);
    localStorage.setItem('locations_data', JSON.stringify(locationData));
  }
}, []);


  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('locations_data', JSON.stringify(data));
  }, [data]);

  // Form field configuration
  const fields = [
    { name: 'name', label: 'Location Name', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'status', label: 'Status', type: 'dropdown', options: ['Active', 'Inactive'] }
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
      showMessage('info', 'Location deleted successfully');
    }
  };

  const handleSave = () => {
    if (!formValues.name) return alert('Name is required');

    if (editItem) {
      setData(prev => prev.map(d => (d.id === editItem.id ? formValues : d)));
      showMessage('success', 'Location updated successfully');
    } else {
      setData(prev => [...prev, { id: Date.now(), ...formValues }]);
      showMessage('success', 'Location added successfully');
    }

    setFormOpen(false);
    setEditItem(null);
  };

  return (
    <>
      <TableView
        title="Locations"
        columns={[
          { field: 'name', title: 'Name', isPrimary: true },
          { field: 'address', title: 'Address' },
          { field: 'status', title: 'Status' }
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
        title={editItem ? 'Edit Location' : 'Add Location'}
      >
        <FormBuilder
          fields={fields}
          values={formValues}
          onChange={(name, value) =>
            setFormValues((prev) => ({
              ...prev,
              [name]: value
            }))
          }
        />
      </DialogForm>
	  {SnackbarComponent}
    </>
  );
};

export default Locations;