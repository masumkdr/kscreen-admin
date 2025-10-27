import React, { useState, useMemo, useEffect } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, TablePagination, TableSortLabel, IconButton, Tooltip
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
  defaultSortField = '',
  defaultSortOrder = 'asc',
  defaultRowsPerPage = 5,
  rowsPerPageOptions = [5, 10, 25, 50],
  showSearch = true,
  showAddButton = true,
  filterComponent = null,
  onSortChange = null,
}) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);

  useEffect(() => {
    if (onSortChange && sortField) onSortChange(sortField, sortOrder);
  }, [sortField, sortOrder]);

  // 🔍 Search filter
  const filtered = useMemo(() => {
    if (!search) return data;
    return data.filter(row =>
      Object.values(row).some(v =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  // 🔽 Sort
  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField] ?? '';
      const bValue = b[sortField] ?? '';
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortOrder]);

  // 🧭 Handle Sort
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  return (
    <div>
      {title && <h3 className="mb-3 font-semibold">{title}</h3>}

      <div className="flex justify-between mb-3 items-center">
        {showSearch && (
          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
        )}
        <div className="flex items-center gap-2">
          {filterComponent}
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
      </div>

      <Table>
        <TableHead>
          <TableRow hover>
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
                {columns.map(col => (
                  <TableCell key={col.field}>{row[col.field]}</TableCell>
                ))}
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => onEdit(row)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => onDelete(row)}
                    >
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