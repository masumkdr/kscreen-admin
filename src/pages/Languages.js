import React, { useState, useEffect } from 'react';
import TableView from '../components/TableView/TableView';
import DialogForm from '../components/DialogForm';
import FormBuilder from '../components/FormBuilder/FormBuilder';
import LanguagesData from '../data/languages.json';
import { useSnackbarMessage } from '../hooks/useSnackbarMessage';

const Languages = () => {
  const [data, setData] = useState(LanguagesData);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formValues, setFormValues] = useState({});
  const { SnackbarComponent, showMessage } = useSnackbarMessage();

  // Load from localStorage or JSON
useEffect(() => {
  const stored = localStorage.getItem('languages_data');
  if (stored && stored !== 'undefined') {
    setData(JSON.parse(stored));
  } else {
    setData(LanguagesData);
    localStorage.setItem('languages_data', JSON.stringify(LanguagesData));
  }
}, []);


  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('languages_data', JSON.stringify(data));
  }, [data]);

  // Form field configuration
  const fields = [
    { name: 'name', label: 'Language Name', type: 'text' },
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
      showMessage('info', 'Language deleted successfully');
    }
  };

  const handleSave = () => {
    if (!formValues.name) return alert('Name is required');

    if (editItem) {
      setData(prev => prev.map(d => (d.id === editItem.id ? formValues : d)));
      showMessage('success', 'Language updated successfully');
    } else {
      setData(prev => [...prev, { id: Date.now(), ...formValues }]);
      showMessage('success', 'Language added successfully');
    }

    setFormOpen(false);
    setEditItem(null);
  };

  return (
    <>
      <TableView
        title="Languages"
        columns={[
          { field: 'name', title: 'Name', isPrimary: true }
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
        title={editItem ? 'Edit Language' : 'Add Language'}
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

export default Languages;