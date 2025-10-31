import React, { useState, useEffect } from 'react';
import TableView from '../components/TableView/TableView';
import DialogForm from '../components/DialogForm';
import FormBuilder from '../components/FormBuilder/FormBuilder';
import { useSnackbarMessage } from '../hooks/useSnackbarMessage';
import theaterData from '../data/theaters.json';
import locationData from '../data/locations.json';

const Theaters = () => {
  const [data, setData] = useState(theaterData);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formValues, setFormValues] = useState({});
  const { SnackbarComponent, showMessage } = useSnackbarMessage();

  // 🧭 Load data (from localStorage or JSON)
  useEffect(() => {
    const stored = localStorage.getItem('theaters_data');
    if (stored && stored !== 'undefined') {
      setData(JSON.parse(stored));
    } else {
      setData(theaterData);
      localStorage.setItem('theaters_data', JSON.stringify(theaterData));
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem('theaters_data', JSON.stringify(data));
    }
  }, [data]);

  // 🧾 Form Fields
  const fields = [
    { name: 'name', label: 'Theater Name', type: 'text' },
    {
      name: 'location_id',
      label: 'Location',
      type: 'dropdown',
      options: locationData.map(l => ({ value: l.id, label: l.name }))
    },
    { name: 'status', label: 'Status', type: 'dropdown', options: ['Active', 'Inactive'] }
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
    if (window.confirm(`Delete theater "${row.name}"?`)) {
      setData(prev => prev.filter(d => d.id !== row.id));
      showMessage('info', 'Theater deleted successfully');
    }
  };

  const handleSave = () => {
    if (!formValues.name) return alert('Name is required');

    if (editItem) {
      setData(prev => prev.map(d => (d.id === editItem.id ? formValues : d)));
      showMessage('success', 'Theater updated successfully');
    } else {
      setData(prev => [...prev, { id: Date.now(), ...formValues }]);
      showMessage('success', 'Theater added successfully');
    }

    setFormOpen(false);
    setEditItem(null);
  };

  // 🧮 Helper: find location name by id
  // const getLocationName = (id) => {
  //   const loc = locationData.find(l => l.id === Number(id));
  //   return loc ? loc.name : 'N/A';
  // };

  return (
    <>
      <TableView
		title="Theaters"
		columns={[
			{ field: 'name', title: 'Name', isPrimary: true },
			{
			field: 'location_id',
			title: 'Location',
			render: (row) => {
				const loc = locationData.find(l => l.id === Number(row.location_id));
				return loc ? loc.name : 'N/A';
			}
			},
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
        title={editItem ? 'Edit Theater' : 'Add Theater'}
      >
        <FormBuilder
          fields={fields}
          values={formValues}
          onChange={(e) => {
            setFormValues({
              ...formValues,
              [e.target.name]: e.target.value
            });
          }}
        />
      </DialogForm>

      {SnackbarComponent}
    </>
  );
};

export default Theaters;