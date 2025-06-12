import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../../components/common/TextInput";
import FileUploader from "../../../components/common/FileUploader";
import DollarInput from "../../../components/common/DollarInput";
import SearchableField from "../../../components/common/SearchableField";
import AsyncMultiSelect from "../../../components/common/AsyncMultiSelect";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";

const InventoriesNew = () => {
  const navigate = useNavigate();

  const [inventoryType, setInventoryType] = useState("");
  const [inventoryName, setInventoryName] = useState("");
  const [imageLocation, setImageLocation] = useState("");

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState("update");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const inventorySchema = yup.object().shape({
    Description: yup.string().required("Description is required"),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(inventorySchema),
    defaultValues: {
      Description: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    (data) => {
      axios
        .post("/inventories", {
          ...data,
          Name: inventoryName,
          Image_Location: imageLocation,
          Inventory_TypeID: inventoryType?.Inventory_TypeID,
          Child_Qty: 0,
        })
        .then((res) => {
          toast.success(`Inventory Added Successfully`);
          navigate(-1);
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            err.response?.data?.errorMessage || "internal server error"
          );
        });
    },
    [imageLocation, inventoryName, inventoryType, navigate]
  );

  const handleCancel = () => {
    if (isDirty || isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      navigate(-1);
    }
  };

  const getSearchableList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(`/vendor-products?keyword=${keyword}&size=5`);
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          id: item.VendorProdID,
          name: item.Product_Name,
          Description: item.Description,
          Inventory_TypeID: item.Inventory_TypeID,
          Inventory_Type: item.Inventory_Type,
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

  return (
    <div className="p-5">
      <div className="px-4 py-6 sm:px-11 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            Inventory Details
          </h2>
          <FileUploader
            bgColor="#A1DAB4"
            setter={(path) => {
              setIsUpdated(true);
              setImageLocation(path);
            }}
          />
        </div>
        <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <label className="text-gray-700 self-center">
            Name<span className="text-red-700">*</span>
          </label>
          <SearchableField
            fetchData={getSearchableList}
            defaultValue={inventoryName}
            onChange={(value) => {
              setIsUpdated(true);
              if (typeof value === "string") {
                setInventoryName(value);
              } else {
                setInventoryName(value.name);
                setInventoryType(value.Inventory_Type);
                reset({
                  Description: value.Description,
                });
              }
            }}
            placeholder="Inventory Name"
            className="col-span-2"
            error={!inventoryName}
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
            defaultValue={inventoryType}
            onSelect={(value) => {
              setIsUpdated(true);
              setInventoryType(value);
            }}
            buttonLabel="off"
            placeholder="Type to search inventory type..."
          />
          <label className="text-gray-700 self-center">
            Total Price<span className="text-red-700">*</span>
          </label>
          <DollarInput
            className="col-span-2"
            placeholder="$0.00"
            disabled={true}
          />
          <label className="text-gray-700 self-center">Orders Received</label>
          <label className="text-gray-700 self-center">0</label>
          <div className="col-span-3 flex justify-end mt-3">
            <button
              type="button"
              className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36"
              onClick={handleCancel}
            >
              {!isValid || !inventoryType ? "Go Back" : "Cancel"}
            </button>
            <button
              type="submit"
              className={`py-2 px-6 md:px-16 ml-7 text-center text-white rounded-xl min-w-36 capitalize ${!isValid || !inventoryType
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-BtnBg"
                }`}
              disabled={!isValid || !inventoryType}
            >
              Add
            </button>
          </div>
        </form>
        <ConfirmationModal
          type={confirmationType}
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onSubmit={() => {
            if (confirmationType === "cancel") {
              navigate(-1);
            } else {
              navigate("/vendor/manage-vendor-products/new", {
                state: {
                  name: inventoryName,
                },
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default InventoriesNew;
