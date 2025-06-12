import React, { useState } from "react";
import { Modal, Box, useMediaQuery, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import TextInput from "../../common/TextInput";

const LotNumber = ({ open, handleClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    lotNumber: "",
    lotDesc: "",
    lotDate: "",
    lotTime: "",
    lotDetail: "",
  });

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="access-levels-modal-title"
    >
      <div
        className="bg-white w-11/12 md:max-w-3xl"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
        }}
      >
        <div className="small_scroller  p-5 md:py-6 md:px-10 max-h-[90vh] overflow-y-auto">
          <Box>
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
            <div className="flex flex-col">
              <h2
                id="access-levels-modal-title"
                className="text-xl font-semibold mb-2 text-BtnBg"
              >
                Lot Numbers
              </h2>
              <div className="border-b border-gray-300 mb-4"></div>
              <div className="grid grid-cols-3 gap-4">
                <label className="text-gray-700 self-center">
                  Lot Number ID
                </label>
                <TextInput
                  className="col-span-2"
                  value={formData.lotNumber}
                  onChange={(value) => handleChange("lotNumber", value)}
                  placeholder="loreum ipsum"
                />
                <label className="text-gray-700 self-center">
                  Lot Description
                </label>
                <TextInput
                  className="col-span-2"
                  value={formData.lotDesc}
                  onChange={(value) => handleChange("lotDesc", value)}
                  placeholder="loreum ipsum"
                />

                <label className="text-gray-700 self-center">Lot Date</label>
                <TextInput
                  className="col-span-2"
                  type="date"
                  value={formData.lotDate}
                  onChange={(value) => handleChange("lotDate", value)}
                  placeholder="MM/DD/YYYY"
                />
                <label className="text-gray-700 self-center">Lot Time</label>
                <TextInput
                  className="col-span-2"
                  value={formData.lotTime}
                  type="time"
                  onChange={(value) => handleChange("lotTime", value)}
                  placeholder="00:00"
                />
                <label className="text-gray-700 self-center">Lot Details</label>
                <TextInput
                  className="col-span-2"
                  value={formData.lotDetail}
                  onChange={(value) => handleChange("lotDetail", value)}
                  placeholder="simply dummy text"
                />
              </div>

              <div className="col-span-3 flex justify-end mt-5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="py-2 px-8 bg-BtnBg text-center text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-8 ml-3 bg-BtnBg text-white rounded-xl"
                >
                  Update
                </button>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </Modal>
  );
};

export default LotNumber;
