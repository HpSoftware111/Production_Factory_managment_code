import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationInfo from "../../common/NotificationInfo";
import ConfirmationModal from "../ConfirmationModal";
import NotificationEditModal from "../NotificationEditModal";

const NotificationModal = ({
  type,
  open,
  onClose,
  maxWidth = "sm",
  data,
  onChangeData,
}) => {
  const [formData, setFormData] = useState({
    NotificationsID: "",
    Notification_Name: "",
    Notification_Description: "",
    Notification_Group: "",
    Notification_Type: "",
    Notification_Priority: "",
    Notification_Notes: "",
    Notification_Resolution: "",
  });

  const [notifications, setNotifications] = useState([...data]);
  const [isCrudOpen, setIsCrudOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmType] = useState("resolved");
  const [btnModal, setBtnModal] = useState("update");

  const handleCloseAddQuestionModal = () => {
    setIsCrudOpen(false);
  };

  const onEdit = (question, idx) => {
    setFormData({ ...question, index: idx });
    setBtnModal("update");
    setIsCrudOpen(true);
  };

  const onResolved = (question, action, idx) => {
    setFormData({ ...question, index: idx });
    setBtnModal(action);
    setIsCrudOpen(true);
  };

  const handleSetData = (resdata) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.NotificationsID === resdata?.NotificationsID ? resdata : item
      )
    );
    onChangeData(resdata);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(8px)",
        },
        "& .MuiPaper-root": {
          borderRadius: "20px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          p: 3,
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 2,
          }}
        >
          <Typography
            variant="h1"
            color="primary.main"
            sx={{
              fontFamily: '"Raleway", "Helvetica", "Arial", sans-serif',
              fontWeight: 700,
            }}
          >
            {type}s
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              backgroundColor: "primary.main",
              width: 32,
              height: 32,
              "&:hover": { backgroundColor: "primary.main", opacity: 0.9 },
            }}
          >
            <CloseIcon sx={{ color: "white", fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ mt: 2, p: 0 }}>
        {notifications.map((notification, index) => (
          <NotificationInfo
            key={notification.NotificationsID}
            data={notification}
            type={type}
            onEdit={(data) => onEdit(data, index)}
            onResolved={(data, action) => onResolved(data, action, index)}
          />
        ))}

        {isCrudOpen && (
          <NotificationEditModal
            open={true}
            fieldData={formData}
            handleClose={handleCloseAddQuestionModal}
            btnName={btnModal}
            setData={handleSetData}
          />
        )}
        <ConfirmationModal
          type={confirmType}
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onSubmit={() => {
            setOpenConfirmation(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
