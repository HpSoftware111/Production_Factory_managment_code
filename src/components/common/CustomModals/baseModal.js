import React from 'react';
import {Modal, Box, IconButton, Button, Typography, Stack} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BaseModal = (
  {
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    confirmColor,
    titleColor,
  }
) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2" color={titleColor}>
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon/>
          </IconButton>
        </Stack>
        <Typography variant="body1" mb={3}>
          {message}
        </Typography>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="contained" color={confirmColor} onClick={onConfirm}>
            {confirmText}
          </Button>
          <Button variant="text" onClick={onClose}>
            {cancelText}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default BaseModal;