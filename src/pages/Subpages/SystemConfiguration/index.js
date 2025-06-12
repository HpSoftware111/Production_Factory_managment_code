import React, { useState } from "react";

import InventoryModal from "../../../components/modals/InventoryModal";
import ProductQuestionsModal from "../../../components/modals/ProductQuestionsModal";
import LotNumber from "../../../components/modals/LotNumberModal";
import PrintersModal from "../../../components/modals/PrintersModal";
import { useNavigate } from "react-router-dom";

const SystemConfiguration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tempValue: "F",
    inventoryType: "",
    productQuestion: "",
  });

  const handleEdit = (row) => { return true };
  const handleDelete = () => { };
  const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [isProductQuestionsModalOpen, setProductQuestionsModalOpen] =
    useState(false);
  const [isPrintersModalOpen, setIsPrintersModalOpen] = useState(false);
  const [isLotItemModalOpen, setisLotItemModalOpen] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const openInventoryModal = () => setInventoryModalOpen(true);
  const closeInventoryModal = () => setInventoryModalOpen(false);

  const openProductQuestionsModal = () => setProductQuestionsModalOpen(true);

  const openPrintersModal = () => setIsPrintersModalOpen(true);

  const closeLotItemModal = () => setisLotItemModalOpen(false);

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-5">
      <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            System Configuration
          </h2>
        </div>
        <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <label className="text-gray-700 self-center">Temp Value</label>
          <div className="flex items-center space-x-4 col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="tempValue"
                value="F"
                checked={formData.tempValue === "F"}
                onChange={() => handleChange("tempValue", "F")}
                className="custom-radio"
              />
              <span>F</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="tempValue"
                value="C"
                checked={formData.tempValue === "C"}
                onChange={() => handleChange("tempValue", "C")}
                className="custom-radio"
              />
              <span>C</span>
            </label>
          </div>

          <label className="text-gray-700 self-center">Inventory Types</label>
          <button
            type="button"
            className="col-span-2 py-2 px-4 bg-BtnBg text-white rounded-lg max-w-48"
            onClick={openInventoryModal}
          >
            Modify
          </button>

          <label className="text-gray-700 self-center">Product Questions</label>
          <button
            type="button"
            className="col-span-2 py-2 px-4 bg-BtnBg text-white rounded-lg max-w-48"
            onClick={openProductQuestionsModal}
          >
            Modify
          </button>

          <label className="text-gray-700 self-center">Printers</label>
          <button
            type="button"
            className="col-span-2 py-2 px-4 bg-BtnBg text-white rounded-lg max-w-48"
            onClick={openPrintersModal}
          >
            Modify
          </button>

          <label className="text-gray-700 self-center">Lot Items</label>
          <button
            type="button"
            className="col-span-2 py-2 px-4 bg-gray-400 text-white rounded-lg max-w-48"
          >
            Add
          </button>

          <div className="col-span-3 flex justify-end mt-3">
            <button
              type="button"
              className="py-2 px-6 md:px-16 bg-BtnBg text-white rounded-xl"
              onClick={handleCancel}
            >
              Go Back
            </button>
            {/* <button
              type="button"
              className="py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize bg-BtnBg"
            >
              Add
            </button> */}
          </div>
        </div>
      </div>

      {isInventoryModalOpen && (
        <InventoryModal
          handleClose={closeInventoryModal}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {isProductQuestionsModalOpen && (
        <ProductQuestionsModal
          isModal={true}
          isModalOpen={isProductQuestionsModalOpen}
          setIsModalOpen={setProductQuestionsModalOpen}
          isSetting={true}
        />
      )}
      <PrintersModal
        isModalOpen={isPrintersModalOpen}
        setIsModalOpen={setIsPrintersModalOpen}
      />
      <LotNumber handleClose={closeLotItemModal} open={isLotItemModalOpen} />
    </div>
  );
};

export default SystemConfiguration;
