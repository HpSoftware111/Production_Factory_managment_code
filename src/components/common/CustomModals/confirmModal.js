import React from 'react';
import BaseModal from './baseModal';

const ConfirmModal = ({ open, onClose, onConfirm }) => {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Continue"
      message="Do you want to proceed with the current action?"
      confirmText="Yes, Continue"
      cancelText="No, Go Back"
      confirmColor="primary"
      titleColor="primary"
    />
  );
};

export default ConfirmModal;