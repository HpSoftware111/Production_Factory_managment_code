import { useState } from 'react';

const useTableModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openModal = (id = null) => {
    setSelectedId(id); // Assuming each row has an 'id' property
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedId(null);
  };

  return {
    isOpen,
    selectedId,
    openModal,
    closeModal
  };
};

export default useTableModal;