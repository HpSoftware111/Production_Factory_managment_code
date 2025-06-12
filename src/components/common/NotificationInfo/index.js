import React, { useRef } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { blue, green, orange, red, yellow } from "@mui/material/colors";
import { getFormattedDateString } from "../../../utils/dateUtils";
import { NotifyPriority, NotifyTypes } from "../utils";
import DropdownMenu from "../DropdownMenu";

const NotificationInfo = ({ data, type, onEdit, onResolved }) => {
  const {
    Notification_Name,
    Notification_Description,
    Notification_Notes,
    Notification_Priority,
    updatedAt,
  } = data;

  // Reference to the DropdownMenu's IconButton
  const dropdownButtonRef = useRef(null);

  const getColor = (type) => {
    if (type === NotifyTypes.NOTIFICATION) {
      switch (data.Notification_Priority) {
        case NotifyPriority.Critical:
          return green.A400;
        case NotifyPriority.High:
          return green[400];
        case NotifyPriority.Medium:
          return green[600];
        case NotifyPriority.Low:
          return green[900];
        default:
          return green.A400;
      }
    } else if (type === NotifyTypes.WARNING) {
      switch (data.Notification_Priority) {
        case NotifyPriority.Critical:
          return yellow[400];
        case NotifyPriority.High:
          return yellow[500];
        case NotifyPriority.Medium:
          return yellow[800];
        case NotifyPriority.Low:
          return yellow[900];
        default:
          return yellow.A200;
      }
    } else if (type === NotifyTypes.ALERTS) {
      switch (data.Notification_Priority) {
        case NotifyPriority.Critical:
          return red[300];
        case NotifyPriority.High:
          return red[500];
        case NotifyPriority.Medium:
          return red[800];
        case NotifyPriority.Low:
          return red[900];
        default:
          return red[300];
      }
    } else {
      return green.A400;
    }
  };

  const handleNotificationClick = () => {
    if (dropdownButtonRef.current) {
      dropdownButtonRef.current.click();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        marginBottom: "30px",
        cursor: "pointer",
      }}
      onClick={handleNotificationClick} // Trigger the dropdown menu click
    >
      <Box
        sx={{
          width: "8px",
          backgroundColor: getColor(type),
          borderTopRightRadius: "22px",
          borderBottomRightRadius: "22px",
          zIndex: 1,
          marginBottom: "30px",
          marginRight: "30px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          paddingBottom: "30px",
          boxSizing: "border-box",
          paddingRight: "16px",
        }}
      >
        <Avatar
          sx={{
            marginRight: "16px",
            width: 60,
            height: 60,
            bgcolor: getColor(type),
            color: "black",
          }}
        >
          {Notification_Priority + 1}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6">{Notification_Name}</Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginLeft: "16px" }}
              >
                {getFormattedDateString(updatedAt)}
              </Typography>
            </Box>
            <DropdownMenu
              ref={dropdownButtonRef} // Reference to the dropdown menu button
              iconColor={blue.A700}
              onEdit={() => onEdit(data)}
              onResolved={() => onResolved(data, "resolved")}
              last={false}
            />
          </Box>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ marginTop: "0px", fontSize: "16px" }}
          >
            {Notification_Description}
          </Typography>
          {Notification_Notes && (
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ marginTop: "3px", fontSize: "14px" }}
            >
              {Notification_Notes}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationInfo;
