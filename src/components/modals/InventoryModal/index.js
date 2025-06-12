import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  useMediaQuery,
  IconButton,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import axios from "../../../api";
import DropdownMenu from "../../common/DropdownMenu";
import CrudModalTwo from "../../modals/CrudModalTwo";
import DynamicDropdownMenu from "../../common/DynamicDropdownMenu";

const InventoryModal = ({ handleClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    Inventory_Type: "",
  });
  const [isCrudOpen, setIsCrudOpen] = useState(false);
  const [btnModal, setBtnModal] = useState("");
  const [inventoryTypes, setInventoryTypes] = useState([]);

  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [clickedRowPos, setClickedRowPos] = useState({ x: 0, y: 0 });

  const handleAddNewClick = () => {
    setFormData({
      Inventory_TypeID: null,
      Inventory_Type: "",
      Image_Location: "",
    });
    setBtnModal("add");
    setIsCrudOpen(true);
  };

  const handleEdit = (item) => {
    console.log("item", item);
    setFormData({
      ...item,
    });
    setBtnModal("update");
    setIsCrudOpen(true);
  };

  const handleDelete = (item) => {
    setFormData({
      ...item,
    });
    setBtnModal("delete");
    setIsCrudOpen(true);
  };

  useEffect(() => {
    axios.get("/inventory-types").then((res) => {
      setInventoryTypes(res.data.data.data);
    });
  }, []);

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="inventory-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "700px",
          bgcolor: "background.paper",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
        }}
      >
        <div style={{ position: "relative" }}>
          {isMobile && (
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}

          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            Inventory Types
          </h2>
          <div className="border-b border-gray-300 mb-4"></div>
          <button
            type="button"
            className="py-2 px-6 md:px-16 bg-BtnBg text-white rounded-xl min-w-36 cursor-pointer"
            onClick={handleAddNewClick}
          >
            Add New Types
          </button>
          <div className="grid grid-cols-12 px-5 py-4 mt-6 mb-5 bg-[#CCD7E4] text-[#143664] rounded-2xl">
            <div className="col-span-4 flex items-center text-base font-bold">
              Type Name
            </div>
            <div className="col-span-4 flex items-center text-base font-bold">
              Storage Method
            </div>
            <div className="col-span-3 flex items-center text-base font-bold">
              Cooler Schedule
            </div>
            <div className="col-span-1 h-[34px]"></div>
          </div>

          {inventoryTypes.map((type, index) => (
            <div
              key={index}
              className="grid grid-cols-12 bg-[#F5F5F5] rounded-xl py-2 px-5 mb-4"
              onClick={(e) => {
                setClickedRowPos({
                  x: e.pageX,
                  y: e.pageY,
                });

                setClickedRowIndex(index === clickedRowIndex ? null : index);
              }}
            >
              <Typography
                variant="body1"
                color="textPrimary"
                className="col-span-4 flex items-center"
              >
                {type.Inventory_Type}
              </Typography>
              <Typography
                variant="body1"
                color="textPrimary"
                className="col-span-4 flex items-center"
              >
                {type.Storage_Method}
              </Typography>
              <Typography
                variant="body1"
                color="textPrimary"
                className="col-span-3 flex items-center"
              >
                {type.Cooler_Schedule !== null && (
                  <>
                    {type.Cooler_Schedule}{" "}
                    {type.Cooler_Schedule > 1 ? "days" : "day"}
                  </>
                )}
              </Typography>
              <div className="col-span-1 flex items-center justify-end">
                <DropdownMenu
                  closeOthers={() => setClickedRowIndex(null)}
                  onEdit={() => handleEdit(type)}
                  onDelete={() => handleDelete(type)}
                />
              </div>
            </div>
          ))}

          {clickedRowIndex !== null && (
            <div
              className="absolute"
              style={{
                left: clickedRowPos.x / 2,
                top: clickedRowPos.y - 70,
              }}
            >
              <DynamicDropdownMenu
                closeHandler={() => setClickedRowIndex(null)}
                onEdit={() => handleEdit(inventoryTypes[clickedRowIndex])}
                onDelete={() => handleDelete(inventoryTypes[clickedRowIndex])}
              />
            </div>
          )}
          <div className="flex justify-end mt-5 gap-3">
            <button
              type="button"
              className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36 cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>

        {isCrudOpen && (
          <CrudModalTwo
            open={isCrudOpen}
            fieldData={formData}
            handleClose={() => setIsCrudOpen(false)}
            btnName={btnModal}
            setData={setInventoryTypes}
          />
        )}
      </Box>
    </Modal>
  );
};

export default InventoryModal;
