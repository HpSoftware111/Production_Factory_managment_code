import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../../components/common/TextInput";
import AsyncMultiSelect from "../../../components/common/AsyncMultiSelect";
import FileUploader from "../../../components/common/FileUploader";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import DollarInput from "../../../components/common/DollarInput";
import ProductQuestionsModal from "../../../components/modals/ProductQuestionsModal";
import { Checkbox } from "@mui/material";

const VendorProductsDelete = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [vendorDefault, setVendorDefault] = useState(null);
  const [inventoryTypeDefault, setInventoryTypeDefault] = useState(null);
  const [productQuestions, setProductQuestions] = useState([]);
  const [imageLocation, setImageLocation] = useState(null);

  const [confirmationType, setConfirmationType] = useState("update");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const [enableQuestions, setEnableQuestions] = useState(false);

  const formHandler = () => {
    setConfirmationType("delete");
    setOpenConfirmation(true);
  };

  const { id } = location.state || {};

  const vendorProductSchema = yup.object().shape({
    Product_Name: yup.string().required("Product Name is required"),
    Description: yup.string().required("Product Description is required"),
    SKU_Number: yup.string().required("SKU Number is required"),
    Unit_Price: yup
      .number()
      .typeError("Unit Price must be a number")
      .required("Unit Price is required"),
    Usda_Estab_Num: yup.string().required("USDA Number is required"),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(vendorProductSchema),
    defaultValues: {
      Product_Name: "",
      Description: "",
      SKU_Number: "",
      Unit_Price: 0,
      Usda_Estab_Num: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(() => {
    if (confirmationType === "delete") {
      axios
        .delete(`/vendor-products/${id}`)
        .then((res) => {
          toast.success("Vendor Product deleted successfully");
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

  const fetchVendors = async (inputValue) => {
    try {
      const res = await axios.get(`/vendors?keyword=${inputValue}`);
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

  const isDelete = true;

  useEffect(() => {
    if (id) {
      axios
        .get(`/vendor-products/${id}`)
        .then((res) => {
          const info = res.data.data;
          reset({
            Product_Name: info.Product_Name,
            Description: info.Description,
            SKU_Number: info.SKU_Number,
            Unit_Price: info.Unit_Price,
            Usda_Estab_Num: info.Usda_Estab_Num,
          });
          setImageLocation(info.Image_Location);
          setVendorDefault(info.Vendor);
          setInventoryTypeDefault(info.Inventory_Type);
          setProductQuestions(
            info.Product_Questions.map((item) => item["ProductQID"])
          );

          setEnableQuestions(
            info.Inventory_Type.Ask_Questions &&
              info.Product_Questions.length > 0
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [id, reset]);

  return (
    <div className="p-5">
      <div className="px-4 py-6 sm:px-11 mb-4 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            Vendor Products Details
          </h2>
          <FileUploader
            bgColor="#B79F61"
            defaultValue={imageLocation}
            disabled={isDelete}
          />
        </div>
        <div className="border-b-2 border-gray-200 mt-2 mb-4"></div>
        <form
          onSubmit={handleSubmit(formHandler)}
          className="grid grid-cols-3 gap-4"
        >
          <label className="text-gray-700 self-center">
            Vendor Name<span className="text-red-700">*</span>
          </label>
          <AsyncMultiSelect
            className="col-span-2"
            multiple={false}
            fetchOptions={fetchVendors}
            displayField="Vendor_Name"
            defaultValue={vendorDefault}
            buttonLabel="off"
            placeholder="Type to search vendor..."
            disabled={isDelete}
          />

          <label className="text-gray-700 self-center">
            Product Name<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Product_Name"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="Product Name"
                disabled={isDelete}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            Product Description<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Description"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="Detailed description"
                disabled={isDelete}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            SKU Number<span className="text-red-700">*</span>
          </label>
          <Controller
            name="SKU_Number"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="SKU12345"
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
            Unit Price<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Unit_Price"
            control={control}
            render={({ field }) => (
              <DollarInput
                className="col-span-2"
                {...field}
                placeholder="Price"
                disabled={isDelete}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            Product Question<span className="text-red-700">*</span>
          </label>
          <div className="col-span-2 inline-flex">
            {enableQuestions && (
              <button
                type="button"
                className={
                  "py-2 px-6 md:px-16 bg-gray-400 cursor-not-allowed text-white rounded-xl capitalize min-w-48"
                }
                disabled={isDelete}
              >
                {productQuestions.length} question
                {productQuestions.length > 1 ? "s" : ""}
              </button>
            )}
            <label
              className={`${
                enableQuestions && "ml-2"
              } items-center justify-start inline-flex`}
            >
              <Checkbox
                style={{ "padding-left": 0 }}
                checked={enableQuestions}
                onChange={(e) => {
                  // setIsUpdated(true);
                  // setEnableQuestions(e.target.checked);
                }}
                color="primary"
                inputProps={{ "aria-label": "primary checkbox" }}
                disabled={true}
              />
              <span className="ml-2 text-gray-500">Enable Questions</span>
            </label>
          </div>

          <label className="text-gray-700 self-center">
            USDA Number<span className="text-red-700">*</span>
          </label>
          <Controller
            name="Usda_Estab_Num"
            control={control}
            render={({ field }) => (
              <TextInput
                className="col-span-2"
                {...field}
                placeholder="USDA123456"
                disabled={isDelete}
              />
            )}
          />

          <div className="col-span-3 flex justify-end mt-3">
            <div
              type="button"
              className="py-2 px-6 text-center md:px-16 bg-BtnBg text-white rounded-xl min-w-36 cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </div>
            <button
              type="submit"
              className="py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize bg-red-500"
            >
              Delete
            </button>
          </div>
        </form>
        <ConfirmationModal
          type={confirmationType}
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onSubmit={onSubmit}
        />
      </div>

      {enableQuestions && (
        <ProductQuestionsModal
          data={productQuestions}
          setData={setProductQuestions}
          isDelete={true}
          disabled={true}
        />
      )}
    </div>
  );
};

export default VendorProductsDelete;
