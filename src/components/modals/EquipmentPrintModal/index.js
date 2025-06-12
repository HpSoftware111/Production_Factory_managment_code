import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import axios from "../../../api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Print } from "@mui/icons-material";

const formatNumberWithLeadingZeros = (number) => {
  return number.toString().padStart(8, "0");
};

const EquipmentPrintModal = ({ open, onClose, item }) => {
  const {
    Name,
    Description,
    Manufacturer,
    Model_Number,
    Serial_Number,
    Equipment_BarCode,
  } = item;
  const [printers, setPrinters] = useState([]);

  // const receivedDateFormatted = new Date(Date_Received)
  //   .toLocaleDateString("en-US")
  //   .replace(/\//g, "/");

  const onPrint = () => {
    const input = document.getElementById("printable-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [6.2, 4.1],
      });
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(`${Name}_label.pdf`);
    });
  };

  useEffect(() => {
    axios.get("/printers").then((res) => {
      setPrinters(res.data.data);
    });
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogActions>
        <IconButton className="!bg-gray-400" onClick={onClose}>
          <CloseIcon className=" text-white" />
        </IconButton>
      </DialogActions>
      <DialogContent
        id="printable-content"
        className="relative p-2 group"
        style={{
          width: "4.1in",
          height: "6.2in",
          padding: "12px",
        }}
      >
        <div className="flex flex-col pt-8 pb-4 px-4 h-full bg-white border border-gray-300 mx-auto">
          <div className="text-center mb-4">
            <div className="flex justify-center items-center h-16">
              <h1 className="text-3xl font-bold leading-8">{Name}</h1>
            </div>
            {/* <div className="flex justify-center items-center h-8">
              <h2 className="text-xl font-bold leading-8 whitespace-nowrap">
                {Vendor_Name}
              </h2>
            </div> */}
          </div>

          <div className="flex-1 pb-3 text-center border-b-2">
            <div className="flex justify-center items-center h-24 mb-4">
              <p className="leading-6">{Description}</p>
            </div>
            <p className="text-2xl capitalize font-bold">{`-------------------------`}</p>
            <p className="mb-4 text-2xl capitalize font-bold">{Manufacturer}</p>
            <div className="text-xl text-center capitalize mb-2">
              Model Number : {Model_Number}
            </div>
            <div className="text-xl text-center capitalize mb-2">
              Serial Number : {Serial_Number}
            </div>
            {/* <div className="text-xl text-center capitalize">
              {Unit_Measure ? Unit_Measure : "Box"} : {Child_Qty}
              {Unit_Measure?.toLowerCase() !== "flat" ? " LBS" : " Flats"}
            </div> */}
          </div>

          <div className="flex relative justify-center">
            <Barcode value={Equipment_BarCode} width={3} height={120} />
            {/* <div className="absolute right-2 top-1 text-xs">
              Lot-{formatNumberWithLeadingZeros(Lot_NumID)}
            </div> */}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          startIcon={<Print />}
          onClick={onPrint}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EquipmentPrintModal;
