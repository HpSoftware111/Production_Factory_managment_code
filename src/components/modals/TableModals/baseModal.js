import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton, Divider, Select, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCard from "../../common/ContentCard/ContentCard";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
};

const BaseModal = ({ open, onClose, title, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography variant="h1" sx={{color: 'primary.main'}}>
            {title}
          </Typography>

        </Box>

        <Divider sx={{mb: 3, bgcolor: 'primary.main'}}/>

        {React.Children.map(children, child =>
          React.cloneElement(child)
        )}
      </Box>
    </Modal>
  );
};

export default BaseModal;