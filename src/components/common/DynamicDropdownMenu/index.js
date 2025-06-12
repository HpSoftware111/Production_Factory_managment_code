import React, { useRef } from "react";
import trashIcon from "../../../assets/images/trashIcon.svg";
import editIcon from "../../../assets/images/editIcon.svg";
import printerIcon from "../../../assets/images/printerIcon.svg";
import { DROPDOWN_MENU_ICON_STYLE, DROPDOWN_MENU_ITEM_STYLE } from "../utils";
import checkIcon from "../../../assets/images/checkIcon.svg";

const DynamicDropdownMenu = ({
  closeHandler,
  onEdit,
  onDelete = null,
  onResolved = null,
  onPrint = null,
}) => {
  const menuRef = useRef(null);

  return (
    <div className="relative">
      <div
        style={{ zIndex: 999 }}
        ref={menuRef}
        className="absolute -left-32 mt-0 bg-white custom-dropdown rounded-xl p-4 flex flex-col items-start gap-2 min-w-40 min-h-24"
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            closeHandler();
            onEdit();
          }}
          className={DROPDOWN_MENU_ITEM_STYLE}
        >
          <span className={DROPDOWN_MENU_ICON_STYLE}>
            <img src={editIcon} className="w-4 h-auto" alt="Edit" />
          </span>
          Edit
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeHandler();
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
        {onPrint && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeHandler();
              onPrint();
            }}
            className={DROPDOWN_MENU_ITEM_STYLE}
          >
            <span className={DROPDOWN_MENU_ICON_STYLE}>
              <img src={printerIcon} className="w-5 h-auto" alt="Delete" />
            </span>
            Print
          </button>
        )}
        {/* On RESOLVED */}
        {onResolved && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeHandler();
              onResolved();
            }}
            className={DROPDOWN_MENU_ITEM_STYLE}
          >
            <span className={DROPDOWN_MENU_ICON_STYLE}>
              <img src={checkIcon} className="w-5 h-auto" alt="Delete" />
            </span>
            Resolved
          </button>
        )}
      </div>
    </div>
  );
};

export default DynamicDropdownMenu;
