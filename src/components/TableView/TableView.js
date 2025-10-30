import React, { useState, useMemo, useEffect } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TextField, MenuItem, Button, TablePagination, TableSortLabel,
  IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TableView = ({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  filters = [], // 👈 configuration for filter fields
  defaultSortField = '',
  defaultSortOrder = 'asc',
  defaultRowsPerPage = 5,
  rowsPerPageOptions = [5, 10, 25, 50],
  showSearch = true,
  showAddButton = true,
}) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [filterValues, setFilterValues] = useState({});

  // 🧭 Handle sort click
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // 🧮 Handle filter change
  const handleFilterChange = (name, value) => {
    setFilterValues(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => setFilterValues({});

  // 🔍 Step 1: Apply filters (industry, date, status, etc.)
  const filtered = useMemo(() => {
    let result = [...data];
    filters.forEach(filter => {
      const val = filterValues[filter.name];
      if (!val) return;

      switch (filter.type) {
        case 'dropdown':
          result = result.filter(r => String(r[filter.name]) === String(val));
          break;
        case 'dateRange':
          const { from, to } = val;
          if (from) result = result.filter(r => new Date(r[filter.field]) >= new Date(from));
          if (to) result = result.filter(r => new Date(r[filter.field]) <= new Date(to));
          break;
        case 'text':
          result = result.filter(r =>
            String(r[filter.name] || '').toLowerCase().includes(val.toLowerCase())
          );
          break;
        default:
          break;
      }
    });
    return result;
  }, [data, filters, filterValues]);

  // 🔍 Step 2: Apply search
  const searched = useMemo(() => {
    if (!search) return filtered;
    return filtered.filter(row =>
      Object.values(row).some(v =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [filtered, search]);

  // 🔽 Step 3: Apply sort
  const sorted = useMemo(() => {
    if (!sortField) return searched;
    return [...searched].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searched, sortField, sortOrder]);

  // Render a filter control based on config
  const renderFilterControl = (filter) => {
    switch (filter.type) {
      case 'dropdown':
        return (
          <TextField
            key={filter.name}
            select
            size="small"
            label={filter.label}
            value={filterValues[filter.name] || ''}
            onChange={(e) => handleFilterChange(filter.name, e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All</MenuItem>
            {filter.options.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        );
      case 'dateRange':
        return (
          <div key={filter.name} className="flex items-center gap-1">
            <TextField
              label={filter.label + ' (From)'}
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filterValues[filter.name]?.from || ''}
              onChange={(e) =>
                handleFilterChange(filter.name, {
                  ...filterValues[filter.name],
                  from: e.target.value
                })
              }
            />
            <TextField
              label="To"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filterValues[filter.name]?.to || ''}
              onChange={(e) =>
                handleFilterChange(filter.name, {
                  ...filterValues[filter.name],
                  to: e.target.value
                })
              }
            />
          </div>
        );
      case 'text':
        return (
          <TextField
            key={filter.name}
            label={filter.label}
            size="small"
            value={filterValues[filter.name] || ''}
            onChange={(e) => handleFilterChange(filter.name, e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {title && <h3 className="mb-3 font-semibold">{title}</h3>}

      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <div className="flex flex-wrap gap-2 items-center">
          {showSearch && (
            <TextField
              label="Search"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          {filters.map(renderFilterControl)}
          {filters.length > 0 && (
            <Button size="small" variant="outlined" onClick={resetFilters}>
              Reset
            </Button>
          )}
        </div>

        {showAddButton && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
          >
            Add
          </Button>
        )}
      </div>

      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell
                key={col.field}
                sortDirection={sortField === col.field ? sortOrder : false}
                style={{ cursor: 'pointer' }}
              >
                <TableSortLabel
                  active={sortField === col.field}
                  direction={sortField === col.field ? sortOrder : 'asc'}
                  onClick={() => handleSort(col.field)}
                >
                  {col.title}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sorted
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow key={row.id} hover>
               {columns.map(col => {
                    const cellValue = col.render ? col.render(row) : row[col.field];
                    const isPrimary = col.isPrimary;

                    return (
                      <TableCell
                        key={col.field}
                        sx={{
                          fontWeight: isPrimary ? 'bold' : 'normal',
                          color: isPrimary ? '#bfa14a' : 'inherit', // 🎨 golden
                          fontSize: isPrimary ? '0.95rem' : '0.9rem'
                        }}
                      >
                        {cellValue}
                      </TableCell>
                    );
                  })}
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton color="primary" size="small" onClick={() => onEdit(row)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" size="small" onClick={() => onDelete(row)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={sorted.length}
        page={page}
        onPageChange={(e, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
      />
    </div>
  );
};

export default TableView;