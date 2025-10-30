import { useState } from 'react';
import SnackbarMessage from '../components/SnackbarMessage';

export const useSnackbarMessage = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success'
  });

  const showMessage = (type, message) => {
    setSnackbar({ open: true, message, type });
  };

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const SnackbarComponent = (
    <SnackbarMessage
      open={snackbar.open}
      message={snackbar.message}
      type={snackbar.type}
      onClose={handleClose}
    />
  );

  return { SnackbarComponent, showMessage };
};