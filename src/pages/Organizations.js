import React, { useState } from 'react';
import TableView from '../components/TableView/TableView';
import DialogForm from '../components/DialogForm';
import FormBuilder from '../components/FormBuilder/FormBuilder';
import orgData from '../data/organizations.json';

const Organizations = () => {
  const [data, setData] = useState(orgData);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formValues, setFormValues] = useState({});

  // === FORM FIELDS ===
  const fields = [
    { name: 'name', label: 'Organization Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'industry', label: 'Industry', type: 'dropdown', options: ['Software', 'Entertainment', 'Finance', 'Education', 'Telecom'] },
    { name: 'established', label: 'Established Date', type: 'date' }
  ];

  // === FUNCTIONS ===
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
    if (window.confirm(`Delete organization "${row.name}"?`)) {
      setData(prev => prev.filter(d => d.id !== row.id));
    }
  };

  const handleSave = () => {
    if (!formValues.name) {
      alert('Name is required');
      return;
    }

    if (editItem) {
      setData(prev => prev.map(d => (d.id === editItem.id ? formValues : d)));
    } else {
      setData(prev => [...prev, { id: Date.now(), ...formValues }]);
    }

    setFormOpen(false);
    setEditItem(null);
  };

  return (
    <>
      <TableView
        title="Organizations"
        columns={[
          { field: 'name', title: 'Name' },
          { field: 'email', title: 'Email' },
          { field: 'phone', title: 'Phone' },
          { field: 'industry', title: 'Industry' },
          { field: 'established', title: 'Established At' },
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
        title={editItem ? 'Edit Organization' : 'Add Organization'}
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
    </>
  );
};

export default Organizations;