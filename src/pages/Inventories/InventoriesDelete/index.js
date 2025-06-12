import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../../components/common/TextInput";
import FileUploader from "../../../components/common/FileUploader";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import InventoryDetailModal from "../../../components/modals/InventoryDetailModal";
import TableComponent from "../../../components/common/TableComponent";
import DollarInput from "../../../components/common/DollarInput";
import SearchableField from "../../../components/common/SearchableField";
import AsyncMultiSelect from "../../../components/common/AsyncMultiSelect";

import { breakLabelText } from "../../../utils/breakLabelText";

const InventoriesDelete = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [inventoryTypeDefault, setInventoryTypeDefault] = useState(null);
  const [inventoryName, setInventoryName] = useState(null);
  const [imageLocation, setImageLocation] = useState(null);
  const [inventoryChildren, setInventoryChildren] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);

  const [openInventoryChild, setOpenInventoryChild] = useState(false);
  const [inventoryChildBtnValue, setInventoryChildBtnValue] = useState("add");
  const [selelctedChildIndex, setSelelctedChildIndex] = useState(null);

  const [confirmationType, setConfirmationType] = useState("delete");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const formHandler = () => {
    setConfirmationType("delete");
    setOpenConfirmation(true);
  };

  const { id } = location.state || {};

  const inventorySchema = yup.object().shape({
    Description: yup.string().required("Description is required"),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(inventorySchema),
    defaultValues: {
      Description: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(() => {
    if (confirmationType === "delete") {
      setOpenConfirmation(false);
      axios
        .delete(`/inventories/${id}`)
        .then((res) => {
          toast.error("Inventory Deleted Successfully");
          navigate(-1);
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            err.response?.data?.errorMessage || "internal server error"
          );
        });
    } else {
      navigate(-1);
    }
  }, [confirmationType, id, navigate]);

  const handleCancel = () => {
    setConfirmationType("cancel");
    setOpenConfirmation(true);
  };

  const getSearchableList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(
        `/inventories/names?keyword=${keyword}&size=5`
      );
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          id: item.InventoryID,
          name: item.Name,
          Image_Location: item.Image_Location,
        }));
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  const fetchInventoryTypes = async (inputValue) => {
    try {
      const res = await axios.get(`/inventory-types?keyword=${inputValue}`);
      if (res.status === 200) {
        return res.data.data.data;
      } else {
        return [];
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const tableHeaders = [
    { id: "Vendor_Name", label: breakLabelText("Vendor Name") },
    { id: "SKU_Number", label: breakLabelText("SKU Number") },
    { id: "Date_Received", label: breakLabelText("Date Recived") },
    { id: "Lot_NumID", label: breakLabelText("Lot Number") },
    { id: "Unit_Measure", label: breakLabelText("Unit of Measure") },
    { id: "Child_Qty", label: breakLabelText("Quantity") },
    { id: "Unit_Price", label: breakLabelText("Unit Price") },
    { id: "Total_Price", label: breakLabelText("Sub-Total Price") },
  ];

  const handleInventoryChildEdit = (row) => {
    setInventoryChildBtnValue("update");
    setOpenInventoryChild(true);
    setSelelctedChildIndex(row["Inventory_ChildID"]);
  };

  const handleInventoryChildDelete = (row) => {
    setInventoryChildBtnValue("delete");
    setOpenInventoryChild(true);
    setSelelctedChildIndex(row["Inventory_ChildID"]);
  };

  const isDelete = true;

  useEffect(() => {
    if (id > 0) {
      axios
        .get(`/inventories/${id}`)
        .then((res) => {
          const info = res.data.data;
          reset({
            Description: info.Description,
          });
          setInventoryName(info.Name);
          setImageLocation(info.Image_Location);
          setInventoryTypeDefault(info.Inventory_Type);
          setTotalPrice(info.Total_Price);
          setInventoryChildren(
            info.Inventory_Children ? info.Inventory_Children : []
          );
        })
        .catch((err) => console.error(err));
    }
  }, [id, reset]);

  return (
    <div className="p-5">
      <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            Inventory Details
          </h2>
          <FileUploader
            bgColor="#A1DAB4"
            defaultValue={imageLocation}
            setter={setImageLocation}
            disabled={isDelete}
          />
        </div>
        <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
        <form
          onSubmit={handleSubmit(formHandler)}
          className="grid grid-cols-3 gap-4"
        >
          <label className="text-gray-700 self-center">
            Name<span className="text-red-700">*</span>
          </label>
          <SearchableField
            fetchData={getSearchableList}
            defaultValue={inventoryName}
            onInputChange={setInventoryName}
            placeholder="Inventory Name"
            className="col-span-2"
            disabled={isDelete}
          />

          <label className="text-gray-700 self-center">
            Description<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Description"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="Description"
                disabled={isDelete}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            Inventory Type<span className="text-red-700">*</span>
          </label>
          <AsyncMultiSelect
            className="col-span-2"
            multiple={false}
            fetchOptions={fetchInventoryTypes}
            displayField="Inventory_Type"
            defaultValue={inventoryTypeDefault}
            buttonLabel="off"
            placeholder="Type to search inventory type..."
            disabled={isDelete}
          />

          <label className="text-gray-700 self-center">
            Total Price<span className="text-red-700">*</span>
          </label>
          <DollarInput
            className="col-span-2"
            placeholder="$0.00"
            value={parseFloat(totalPrice).toFixed(2)}
            disabled={isDelete}
          />

          <label className="text-gray-700 self-center">Orders Received</label>
          <label className="text-gray-700 self-center">
            <span className="text-red-700">*</span>{" "}
            {inventoryChildren && inventoryChildren.length > 0
              ? inventoryChildren.length
              : 0}
          </label>

          <div className="col-span-3 flex justify-end mt-3">
            <button
              type="button"
              className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-6 md:px-16 ml-7 text-center text-white rounded-xl min-w-36 capitalize bg-red-500"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
      <div className="pt-5 flex text-center flex-col items-center sm:flex-row">
        <p className="flex-1 text-BtnBg font-bold text-2xl">{inventoryName}</p>
      </div>

      <InventoryDetailModal
        open={openInventoryChild}
        handleClose={() => setOpenInventoryChild(false)}
        btnValue={inventoryChildBtnValue}
        inventoryID={id}
        id={selelctedChildIndex}
        onSubmit={setInventoryChildren}
      />

      <div className="h-5" />
      <TableComponent
        tableHeaders={tableHeaders}
        data={inventoryChildren.map((item) => ({
          Inventory_ChildID: item.Inventory_ChildID,
          Vendor_Name: item.Vendor.Vendor_Name,
          SKU_Number: item.SKU_Number,
          Date_Received: new Date(item.Date_Received)
            .toISOString()
            .split("T")[0],
          Lot_NumID: item.Lot_NumID,
          Unit_Measure: item.Unit_Measure,
          Child_Qty: item.Unit_Qty,
          Unit_Price: `$${item.Unit_Price.toFixed(2)}`,
          Total_Price: `$${(item.Unit_Qty * item.Unit_Price).toFixed(2)}`,
        }))}
        circleName={"vendorName"}
        onEdit={handleInventoryChildEdit}
        onDelete={handleInventoryChildDelete}
        disable={true}
      />

      <ConfirmationModal
        type={confirmationType}
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default InventoriesDelete;
