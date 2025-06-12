import React, { useEffect, useRef, useState, forwardRef } from "react";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import trashIcon from "../../../assets/images/trashIcon.svg";
import editIcon from "../../../assets/images/editIcon.svg";
import printerIcon from "../../../assets/images/printerIcon.svg";
import checkIcon from "../../../assets/images/checkIcon.svg";
import eyeIcon from "../../../assets/images/eyeIcon.svg";
import informationIcon from "../../../assets/images/informationIcon.svg";
import { DROPDOWN_MENU_ICON_STYLE, DROPDOWN_MENU_ITEM_STYLE } from "../utils";

const DropdownMenu = forwardRef(
  (
    {
      onEdit = null,
      onNoticed = null,
      onDelete = null,
      onViewed = null,
      onPrint = null,
      onResolved = null,
      onComplete = null,
      last = false,
      iconColor = null,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="relative">
        <IconButton
          ref={ref} // Reference is forwarded here
          sx={{ color: open ? "#1479FF" : iconColor ?? "#272727" }}
          aria-label="more"
          size="small"
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </IconButton>
        {open && (
          <div
            style={{ zIndex: 999 }}
            ref={menuRef}
            className={`absolute mt-0 bg-white custom-dropdown rounded-xl p-4 flex flex-col items-start gap-2 min-w-40 min-h-24 ${
              last ? "right-full bottom-0" : "right-full top-0"
            }`}
          >
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  onEdit();
                }}
                className={DROPDOWN_MENU_ITEM_STYLE}
              >
                <span className={DROPDOWN_MENU_ICON_STYLE}>
                  <img src={editIcon} className="w-4 h-auto" alt="Edit" />
                </span>
                Edit
              </button>
            )}
            {onNoticed && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  onNoticed();
                }}
                className={DROPDOWN_MENU_ITEM_STYLE}
              >
                <span className={DROPDOWN_MENU_ICON_STYLE}>
                  <img
                    src={informationIcon}
                    className="w-4 h-auto"
                    alt="Noticed"
                  />
                </span>
                Noticed
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  onDelete();
                }}
                className={DROPDOWN_MENU_ITEM_STYLE}
              >
                <span className={DROPDOWN_MENU_ICON_STYLE}>
                  <img src={trashIcon} className="w-4 h-auto" alt="Delete" />
                </span>
                Delete
              </button>
            )}
            {onViewed && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  onViewed();
                }}
                className={DROPDOWN_MENU_ITEM_STYLE}
              >
                <span className={DROPDOWN_MENU_ICON_STYLE}>
                  <img src={eyeIcon} className="w-5 h-auto" alt="Viewed" />
                </span>
                Viewed
              </button>
            )}
            {onPrint && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  onPrint();
                }}
                className={DROPDOWN_MENU_ITEM_STYLE}
              >
                <span className={DROPDOWN_MENU_ICON_STYLE}>
                  <img src={printerIcon} className="w-5 h-auto" alt="Print" />
                </span>
                Print
              </button>
            )}
            {onComplete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  onComplete();
                }}
                className={DROPDOWN_MENU_ITEM_STYLE}
              >
                <span className={DROPDOWN_MENU_ICON_STYLE}>
                  <img src={checkIcon} className="w-5 h-auto" alt="Complete" />
                </span>
                Complete
              </button>
            )}
            {onResolved && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  onResolved();
                }}
                className={DROPDOWN_MENU_ITEM_STYLE}
              >
                <span className={DROPDOWN_MENU_ICON_STYLE}>
                  <img src={checkIcon} className="w-5 h-auto" alt="Resolved" />
                </span>
                Resolved
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default DropdownMenu;
