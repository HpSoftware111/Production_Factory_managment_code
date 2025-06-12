import React, { useEffect, useState } from "react";

import { Box, Modal } from "@mui/material";

import axios from "../../../api";
import DropdownMenu from "../../common/DropdownMenu";
import ConfirmationModal from "../ConfirmationModal";
import CrudModalThree from "../CrudModalThree";
import DynamicDropdownMenu from "../../common/DynamicDropdownMenu";

const PrintersModal = ({ isModalOpen = false, setIsModalOpen = null }) => {
  const [formData, setFormData] = useState({
    Printer_Name: "",
    Printer_Description: "",
    Printer_Brand: "",
    Printer_Model: "",
    Printer_Pin: "",
    Printer_IP: "",
    Printer_IP_Mask: "",
    Printer_Password: "",
  });

  const [printers, setPrinters] = useState([]);
  const [isCrudOpen, setIsCrudOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [btnModal, setBtnModal] = useState("add");
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [clickedRowPos, setClickedRowPos] = useState({ x: 0, y: 0 });

  const handleAddNewQuestionClick = () => {
    setFormData({
      Printer_Name: "",
      Printer_Description: "",
      Printer_Brand: "",
      Printer_Model: "",
      Printer_Pin: "",
      Printer_IP: "",
      Printer_IP_Mask: "",
      Printer_Password: "",
    });
    setBtnModal("add");
    setIsCrudOpen(true);
  };

  const handleCloseAddQuestionModal = () => {
    setIsCrudOpen(false);
  };

  const onEdit = (question, idx) => {
    setFormData({ ...question, index: idx });
    setBtnModal("update");
    setIsCrudOpen(true);
  };

  const onDelete = (question, idx) => {
    setFormData({ ...question, index: idx });
    setBtnModal("delete");
    setIsCrudOpen(true);
  };

  useEffect(() => {
    axios.get("/printers").then((res) => { // testing printers
      setPrinters(res.data.data);
    }).catch((error) => {
      if (error.response) {
        // Server responded with a status code outside 2xx
        console.error('Response Error:', error.response.status, error.response.data);
      } else if (error.request) {
        // Request was made, but no response received
        console.error('No Response:', error.request);
      } else {
        // Something else caused the error
        console.error('Axios Error:', error.message);
      }
    });
  }, []);

  return (
    <>
      {isModalOpen && (
        <Modal
          open={true}
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="product-questions-modal-title"
          className="flex items-center justify-center"
        >
          <Box className="bg-white w-11/12 rounded-lg shadow-xl max-w-4xl overflow-y-auto p-5 md:px-11 md:py-6">
            <Box
              sx={{
                bgcolor: "#ffffff",
                borderRadius: 2,
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <Box sx={{ mb: 2 }}>
                <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
                  Printers
                </h2>
                <div
                  style={{
                    borderBottom: "1px solid #D1D5DB",
                    marginBottom: "1rem",
                  }}
                ></div>
                <button
                  type="button"
                  className="py-2 px-6 md:px-16  text-white rounded-xl min-w-36 cursor-pointer bg-BtnBg"
                  onClick={handleAddNewQuestionClick}
                >
                  Add New Printer
                </button>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "4fr 2fr 3fr 2fr 3fr 3fr 1fr",
                  bgcolor: "#E2E8F0",
                  borderRadius: 2,
                  py: 2,
                  px: 3,
                  mb: 2,
                  color: "#143664",
                  fontWeight: "bold",
                }}
              >
                <div>Printer Name</div>
                <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                  Brand
                </div>
                <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                  Model
                </div>
                <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                  PIN
                </div>
                <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                  Printer IP
                </div>
                <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                  IP MASK
                </div>
                <div></div>
              </Box>
              {printers && printers.length > 0 ? (
                printers.map((printer, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: "#F3F4F6",
                      borderRadius: 2,
                      py: 2,
                      px: 3,
                      mb: 2,
                      display: "grid",
                      gridTemplateColumns: "4fr 2fr 3fr 2fr 3fr 3fr 1fr",
                      alignItems: "center",
                    }}
                    onClick={(e) => {
                      setClickedRowPos({
                        x: e.pageX,
                        y: e.pageY,
                      });

                      setClickedRowIndex(
                        index === clickedRowIndex ? null : index
                      );
                    }}
                  >
                    <div className="text-[#4B5563]">{printer.Printer_Name}</div>
                    <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                      {printer.Printer_Brand}
                    </div>
                    <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                      {printer.Printer_Model}
                    </div>
                    <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                      {printer.Printer_Pin
                        ? printer.Printer_Pin.length > 7
                          ? printer.Printer_Pin.slice(0, 2) +
                          "..." +
                          printer.Printer_Pin.slice(-4)
                          : printer.Printer_Pin
                        : ""}
                    </div>
                    <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                      {printer.Printer_IP}
                    </div>
                    <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                      {printer.Printer_IP_Mask}
                    </div>

                    <DropdownMenu
                      onEdit={() => onEdit(printer, index)}
                      onDelete={() => onDelete(printer, index)}
                      last={index + 1 === printers.length}
                    />
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    bgcolor: "#F3F4F6",
                    borderRadius: 2,
                    py: 2,
                    px: 3,
                    mb: 3,
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr 2fr 1fr auto",
                    alignItems: "center",
                    gap: 2,
                    whiteSpace: "nowrap",
                  }}
                >
                  No Printers Added
                </Box>
              )}

              {clickedRowIndex !== null && (
                <div
                  className="absolute"
                  style={{
                    left: clickedRowPos.x,
                    top: clickedRowPos.y,
                  }}
                >
                  <DynamicDropdownMenu
                    closeHandler={() => setClickedRowIndex(null)}
                    onEdit={() =>
                      onEdit(printers[clickedRowIndex], clickedRowIndex)
                    }
                    onDelete={() =>
                      onDelete(printers[clickedRowIndex], clickedRowIndex)
                    }
                  />
                </div>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                  gap: 3,
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36 cursor-pointer"
                >
                  Cancel
                </button>
              </Box>
            </Box>
          </Box>
        </Modal>
      )}

      {isCrudOpen && (
        <CrudModalThree
          open={true}
          fieldData={formData}
          handleClose={handleCloseAddQuestionModal}
          btnName={btnModal}
          setData={setPrinters}
        />
      )}
      <ConfirmationModal
        type="cancel"
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onSubmit={() => {
          setOpenConfirmation(false);
        }}
      />
    </>
  );
};

export default PrintersModal;
