import React from "react";
import { Modal, Box, Button, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const text = {
  add: {
    titleTxt: "Confirm Addition",
    bodyTxt: "Are you sure you want to add this new item?",
    okayTxt: "Yes, Add It",
    cancelTxt: "No, Go Back",
  },
  update: {
    titleTxt: "Confirm Update",
    bodyTxt: "Are you sure you want to update this item?",
    okayTxt: "Yes, Update It",
    cancelTxt: "Cancel",
  },
  delete: {
    titleTxt: "Confirm Deletion",
    bodyTxt:
      "Are you sure you want to delete this item? This action cannot be undone.",
    okayTxt: "Yes, Delete It",
    cancelTxt: "No, Keep It",
  },
  cancel: {
    titleTxt: "Confirm Cancellation",
    bodyTxt:
      "Are you sure you want to cancel the current action? Any unsaved changes will be lost.",
    okayTxt: "Yes, Cancel It",
    cancelTxt: "No, Go Back",
  },
  duplication: {
    titleTxt: "Confirm Modification",
    bodyTxt:
      "There is an item with this name that already exists. Would you like to modify details?",
    okayTxt: "Yes, Modify It",
    cancelTxt: "No, Go Back",
  },
  newinventory: {
    titleTxt: "Confirm New Inventory Addition",
    bodyTxt:
      "This inventory item does not yet exist. This action will set up a new Vendor Product and a new Inventory Entry. Do you wish to continue?",
    okayTxt: "Yes, Continue",
    cancelTxt: "No, Cancel It",
  },
  newvendor: {
    titleTxt: "Confirm New Vendor Addition",
    bodyTxt:
      "This vendor is not registered yet. To proceed, you must register this vendor first. Do you want to continue?",
    okayTxt: "Yes, Add It",
    cancelTxt: "No, Go Back",
  },
  newvendoralt: {
    titleTxt: "Confirm New Vendor Product Addition",
    bodyTxt:
      "There is not record for this product associated with this Vendor. Please add this as a Vendor Product.",
    okayTxt: "Yes, Add It",
    cancelTxt: "No, Cancel It",
  },
  newemployee: {
    titleTxt: "Confirm New Employee Addition",
    bodyTxt:
      "This user is not in the list of Employees. Please add this new employee first.",
    okayTxt: "Yes, Add It",
    cancelTxt: "No, Cancel It",
  },
  inventoryupdate: {
    titleTxt: "Confirm Inventory Update",
    bodyTxt:
      "These changes will affect all vendors selling this item. Are you sure you want to continue?",
    okayTxt: "Yes, Continue",
    cancelTxt: "No, Go Back",
  },
  configurationupdate: {
    titleTxt: "Confirm System Configuration Update",
    bodyTxt:
      "Changing these configurations will change the availability of the question globally for all Vendors. Are you sure you want to make this change?",
    okayTxt: "Yes, Continue",
    cancelTxt: "No, Go Back",
  },

  equipmentupdate: {
    titleTxt: "Confirm Equipment Update",
    bodyTxt: "Are you sure you want to make this change?",
    okayTxt: "Yes, Continue",
    cancelTxt: "No, Go Back",
  },
  rejectedInvConfirmation: {
    titleTxt: "Confirm Inventory Rejection",
    bodyTxt:
      "Some responses do not meet the required standards. Are you sure these answers are correct? If you proceed, this inventory will be rejected.",
    okayTxt: "Yes, Continue",
    cancelTxt: "No, Go Back",
  },
  returnInvConfirmation: {
    titleTxt: "Confirm Inventory Return",
    bodyTxt:
      "The conditions of inventory meet the required standards. Are you sure these answers are correct? If you proceed, this rejected inventory will be returned to the inventory list.",
    okayTxt: "Yes, Continue",
    cancelTxt: "No, Go Back",
  },

  resolved: {
    titleTxt: "Confirm Resolved Notification",
    bodyTxt:
      "Are you sure you want to mark this notification as resolved? This action cannot be undone.",
    okayTxt: "Yes, Continue",
    cancelTxt: "No, Go Back",
  },

  noticed: {
    titleTxt: "Confirm Noticed Notification",
    bodyTxt:
      "Are you sure you want to mark this notification as noticed? This action cannot be undone.",
    okayTxt: "Yes, Continue",
    cancelTxt: "No, Go Back",
  },

  viewed: {
    titleTxt: "Confirm Viewed Notification",
    bodyTxt:
      "Are you sure you want to mark this notification as viewed? This action cannot be undone.",
    okayTxt: "Yes, Continue",
    cancelTxt: "No, Go Back",
  },

  completed: {
    titleTxt: "Confirm Completed Notification",
    bodyTxt:
      "Are you sure you want to mark this notification as completed? This action cannot be undone.",
    okayTxt: "Yes, Continue",
    cancelTxt: "No, Go Back",
  },
};

const ConfirmationModal = ({
  open,
  onClose,
  onCancel = null,
  onSubmit,
  type,
  from = null,
}) => {
  const mainHandler = async () => {
    await onSubmit();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-2xl font-bold mb-2 ${
              type !== "update" &&
              type !== "add" &&
              type !== "completed" &&
              type !== "resolved"
                ? "text-red-500"
                : "text-BtnBg"
            }`}
          >
            {text[type]?.titleTxt}
          </h2>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
        <p>
          {from
            ? text[type]?.bodyTxt.replace("item", from)
            : text[type]?.bodyTxt}
        </p>
        <div className="flex justify-end space-x-4 mt-3">
          <Button
            variant="contained"
            onClick={mainHandler}
            className={
              type !== "update" &&
              type !== "add" &&
              type !== "completed" &&
              type !== "resolved"
                ? "!bg-red-500"
                : "!bg-BtnBg"
            }
            sx={{ textTransform: "capitalize" }}
          >
            {text[type]?.okayTxt}
          </Button>
          <Button
            variant="text"
            onClick={() => {
              onCancel ? onCancel() : onClose();
            }}
            className="text-gray-500"
            sx={{ textTransform: "capitalize" }}
          >
            {text[type]?.cancelTxt}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
