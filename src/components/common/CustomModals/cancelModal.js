import React from 'react';
import BaseModal from './baseModal';

const CancelModal = ({ open, onClose, onConfirm }) => {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Cancel Changes"
      message="Are you sure you want to cancel? All unsaved changes will be lost."
      confirmText="Yes, Cancel"
      cancelText="No, Continue Editing"
      confirmColor="error"
      titleColor="error"
    />
  );
};

export default CancelModal;