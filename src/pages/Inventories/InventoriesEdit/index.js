import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../../components/common/TextInput";
import FileUploader from "../../../components/common/FileUploader";
import TableComponent from "../../../components/common/TableComponent";
import DollarInput from "../../../components/common/DollarInput";
import SearchableField from "../../../components/common/SearchableField";
import AsyncMultiSelect from "../../../components/common/AsyncMultiSelect";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import InventoryDetailModal from "../../../components/modals/InventoryDetailModal";

import { breakLabelText } from "../../../utils/breakLabelText";
import InventoryPrintModal from "../../../components/modals/InventoryPrintModal";
import { genSKUSuffix } from "../../../utils/skuUtils";

const InventoriesEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [inventoryType, setInventoryType] = useState(null);
  const [inventoryTypeDefault, setInventoryTypeDefault] = useState(null);
  const [inventoryName, setInventoryName] = useState(null);
  const [imageLocation, setImageLocation] = useState(null);
  const [inventoryChildren, setInventoryChildren] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);

  const [openInventoryChild, setOpenInventoryChild] = useState(false);
  const [inventoryChildBtnValue, setInventoryChildBtnValue] = useState("add");
  const [selelctedChildIndex, setSelelctedChildIndex] = useState(null);

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState("update");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);

  const [openInventoryPrint, setOpenInventoryPrint] = useState(false);
  const [selectedPrintItem, setSelectedPrintItem] = useState(null);

  const [originInventory, setOriginInventory] = useState(null);

  const formHandler = (data) => {
    setConfirmationType("inventoryupdate");
    setFormData(data);
    setOpenConfirmation(true);
  };

  const { id } = location.state || {};

  const inventorySchema = yup.object().shape({
    Description: yup.string().required("Description is required"),
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(inventorySchema),
    defaultValues: {
      Description: "",
    },
    mode: "onChange",
  });

  const description = watch("Description");

  const onSubmit = useCallback(() => {
    if (confirmationType === "inventoryupdate") {
      axios
        .put(`/inventories/${id}`, {
          ...formData,
          Name: inventoryName,
          Image_Location: imageLocation,
          Inventory_TypeID: inventoryType.Inventory_TypeID,
        })
        .then((res) => {
          toast.success(`Inventory Updated Successfully`);
          navigate(-1);
        })
        .catch((err) => {
          console.error(err);
          toast.error(`Failed to Update Inventory!`);
        });
    } else {
      // navigate(-1);
      resetFormData();
    }
  }, [
    confirmationType,
    formData,
    id,
    imageLocation,
    inventoryName,
    inventoryType,
    navigate,
  ]);

  const handleCancel = () => {
    if (isDirty || isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      navigate(-1);
    }
  };

  const resetFormData = () => {
    getInventoryByID(id);
    setOpenConfirmation(false);
    setIsUpdated(false);
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

  const inventoryNameChangeHandler = useCallback(
    (value) => {
      if (inventoryName !== value) {
        setInventoryName(value);
        setIsUpdated(true);
      }
    },
    [inventoryName]
  );

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
    { id: "Child_Qty", label: breakLabelText("Quantity") },
    { id: "Unit_Price", label: breakLabelText("Unit Price") },
    { id: "Total_Price", label: breakLabelText("Sub-Total Price") },
    { id: "more", label: "" },
  ];

  const handleInventoryChildEdit = (row) => {
    console.log(row);
    setInventoryChildBtnValue("update");
    setOpenInventoryChild(true);
    setSelelctedChildIndex(row["Inventory_ChildID"]);
  };

  const handleInventoryChildDelete = (row) => {
    setInventoryChildBtnValue("delete");
    setOpenInventoryChild(true);
    setSelelctedChildIndex(row["Inventory_ChildID"]);
  };

  const handleInventoryChildPrint = (row) => {
    setSelectedPrintItem({
      ...row,
      Name: inventoryName,
      Description: description,
      Type: "INVENTORY",
    });
    setOpenInventoryPrint(true);
  };

  const getInventoryByID = (id) => {
    axios
      .get(`/inventories/${id}`)
      .then((res) => {
        const info = res.data.data;
        setOriginInventory(info);
        reset({
          Description: info.Inventory_Description,
        });
        setInventoryName(info.Inventory_Name);
        setImageLocation(info.Image_Location);
        setInventoryType(info.Inventory_Type);
        setInventoryTypeDefault(info.Inventory_Type);
        setTotalPrice(info.Total_Price);
        setInventoryChildren(
          info.Inventory_Children
            ? info.Inventory_Children.map((item) => {
                const { Answered_Questions, ...data } = item;
                const unitMeasureQuestion = Answered_Questions.find(
                  (question) =>
                    question.Product_Question?.Question === "container"
                );
                return {
                  ...data,
                  Unit_Measure: unitMeasureQuestion
                    ? unitMeasureQuestion.Answer
                    : null,
                  Inventory_Type: info.Inventory_Type.Inventory_Type,
                  Storage_Method: info.Inventory_Type.Storage_Method,
                };
              })
            : []
        );
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getInventoryByID(id);
  }, [id, reset]);

  useEffect(() => {
    if (inventoryChildren && inventoryChildren.length > 0) {
      let sum = 0;
      inventoryChildren.forEach((item) => {
        sum += item.Unit_Price * item.Unit_Qty;
      });
      setTotalPrice(sum);
    }
  }, [inventoryChildren]);

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
            setter={(path) => {
              setIsUpdated(true);
              setImageLocation(path);
            }}
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
            onChange={inventoryNameChangeHandler}
            placeholder="Inventory Name"
            className="col-span-2"
            error={!inventoryName}
            disabled={true}
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
                error={errors.Description}
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
            onSelect={(value) => {
              setInventoryType(value);
              setIsUpdated(true);
            }}
            buttonLabel="off"
            placeholder="Type to search inventory type..."
          />

          <label className="text-gray-700 self-center">Total Price</label>
          <DollarInput
            className="col-span-2"
            placeholder="$0.00"
            value={parseFloat(totalPrice).toFixed(2)}
            disabled={true}
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
              {!isValid || !inventoryType || (!isDirty && !isUpdated)
                ? "Go Back"
                : "Cancel"}
            </button>
            <button
              type="submit"
              className={`py-2 px-6 md:px-16 ml-7 text-center text-white rounded-xl min-w-36 capitalize ${
                !isValid || !inventoryType || (!isDirty && !isUpdated)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-BtnBg"
              }`}
              disabled={!isValid || !inventoryType || (!isDirty && !isUpdated)}
            >
              Update
            </button>
          </div>
        </form>
      </div>
      <div className="pt-5 flex text-center flex-col items-center sm:flex-row">
        <button
          type="button"
          className="bg-BtnBg text-white rounded-xl py-2 px-7 min-w-48"
          onClick={() => {
            setInventoryChildBtnValue("add");
            setSelelctedChildIndex(null);
            setOpenInventoryChild(true);
          }}
        >
          Add Shipment
        </button>
        <p className="flex-1 text-BtnBg font-bold text-2xl">{inventoryName}</p>
        <button
          type="button"
          className="bg-BtnBg text-white rounded-xl py-2 px-7 min-w-48 opacity-0 invisible pointer-events-none"
        >
          Add Shipment
        </button>
      </div>

      {openInventoryChild && (
        <InventoryDetailModal
          open={true}
          handleClose={() => setOpenInventoryChild(false)}
          btnValue={inventoryChildBtnValue}
          inventoryID={id}
          id={selelctedChildIndex}
          onSubmit={setInventoryChildren}
          inventory={{
            Name: inventoryName,
            Description: description,
            inventoryType: inventoryType,
          }}
        />
      )}
      <div className="h-5" />
      <ConfirmationModal
        type={confirmationType}
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onSubmit={onSubmit}
      />
      <TableComponent
        tableHeaders={tableHeaders}
        data={inventoryChildren.map((item) => ({
          Inventory_ChildID: item.Inventory_ChildID,
          Vendor_Name: item.Vendor.Vendor_Name,
          SKU_Number: `${item.SKU_Number}-${item.IncreaseSuffix}`,
          Date_Received: new Date(item.Date_Received)
            .toISOString()
            .split("T")[0],
          Lot_NumID: item.Lot_NumID,
          Child_Qty: item.Unit_Qty,
          Unit_Price: `$${item.Unit_Price.toFixed(2)}`,
          Total_Price: `$${(item.Unit_Qty * item.Unit_Price).toFixed(2)}`,
          Unit_Measure: item.Unit_Measure,
          Inventory_Type: item.Inventory_Type,
          Storage_Method: item.Storage_Method,
        }))}
        circleName={"vendorName"}
        onEdit={handleInventoryChildEdit}
        onDelete={handleInventoryChildDelete}
        onPrint={handleInventoryChildPrint}
      />
      {openInventoryPrint && selectedPrintItem && (
        <InventoryPrintModal
          open={openInventoryPrint}
          onClose={() => setOpenInventoryPrint(false)}
          item={selectedPrintItem}
        />
      )}
    </div>
  );
};

export default InventoriesEdit;
