import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from "../../../api";
import TextInput from "../../../components/common/TextInput";
import ProductQuestionsModal from "../../../components/modals/ProductQuestionsModal";
import AsyncMultiSelect from "../../../components/common/AsyncMultiSelect";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import FileUploader from "../../../components/common/FileUploader";
import SearchableField from "../../../components/common/SearchableField";
import DollarInput from "../../../components/common/DollarInput";
import { Checkbox } from "@mui/material";

const VendorProductsEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState("");
  const [product, setProduct] = useState("");
  const [inventoryType, setInventoryType] = useState("");
  const [productQuestions, setProductQuestions] = useState([]);
  const [productQuestionsModal, setProductQuestionsModal] = useState(false);
  const [imageLocation, setImageLocation] = useState("");

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState("update");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState("");

  const [enableQuestions, setEnableQuestions] = useState(false);

  const formHandler = (data) => {
    setConfirmationType("update");
    setFormData(data);
    setOpenConfirmation(true);
  };

  const { id } = location.state || {};

  const vendorProductSchema = yup.object().shape({
    Description: yup.string().required("Product Description is required"),
    SKU_Number: yup.string().required("SKU Number is required"),
    Unit_Price: yup
      .number()
      .typeError("Unit Price must be a number")
      .required("Unit Price is required"),
    Usda_Estab_Num: yup.string().required("USDA Number is required"),
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(vendorProductSchema),
    defaultValues: {
      Description: "",
      SKU_Number: "",
      Unit_Price: 0,
      Usda_Estab_Num: "",
    },
    mode: "onChange",
  });

  const description = watch("Description");

  const onSubmit = useCallback(() => {
    if (confirmationType === "update") {
      axios
        .put(`/vendor-products/${id}`, {
          ...formData,
          Product_Name: product && product.name ? product.name : product,
          VendorID: vendor ? vendor.VendorID : null,
          Inventory_TypeID: inventoryType
            ? inventoryType.Inventory_TypeID
            : null,
          Image_Location: imageLocation,
          productQuestions,
          enableQuestions,
        })
        .then((res) => {
          toast.success("Vendor Product Updated Successfully");
          navigate(-1);
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            err.response?.data?.errorMessage || "internal server error"
          );
        });
    } else if (confirmationType === "newinventory") {
      setOpenConfirmation(false);
    } else if (confirmationType === "inventoryupdate") {
      setOpenConfirmation(false);
    } else {
      navigate(-1);
    }
  }, [
    confirmationType,
    formData,
    id,
    imageLocation,
    inventoryType,
    navigate,
    product,
    productQuestions,
    vendor,
  ]);

  const handleCancel = () => {
    if (isDirty || isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      navigate(-1);
    }
  };

  const fetchVendors = async (inputValue) => {
    try {
      const res = await axios.get(`/vendors?keyword=${inputValue}`);
      if (res.status === 200) {
        let list = res.data.data.data;
        if (list.length > 0) {
          list = list.map((item) => ({
            id: item.VendorID,
            name: item.Vendor_Name,
            Image_Location: item.Image_Location,
          }));
          return list;
        } else {
          setConfirmationType("newvendor");
          setOpenConfirmation(true);
          return [];
        }
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

  const getSearchableList = async (keyword) => {
    if (keyword && keyword.length > 0) {
      const res = await axios.get(
        `/inventories/names?keyword=${keyword}&size=5`
      )
        .then((res) => {
          if (res.status === 200) {
            let list = res.data.data.data;
            console.log("res.data", res.data);
            list = list.map((item) => ({
              id: item.InventoryID,
              name: item.Inventory_Name,
              Description: item.Inventory_Description,
              Inventory_TypeID: item.Inventory_TypeID,
              Inventory_Type: item.Inventory_Type,
              Image_Location: item.Image_Location,
            }));
            return list;
          } else {
            window.alert("Add new item");
            return [];
          }
        })
        .catch((error) => {
          console.log("error", error)
        })

    } else {
      return [];
    }
  };

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
          setVendor({
            id: info.Vendor.VendorID,
            name: info.Vendor.Vendor_Name,
            Image_Location: info.Vendor.Image_Location,
          });
          setProduct({ ...info, name: info.Product_Name });
          setInventoryType(info.Inventory_Type);

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

  useEffect(() => {
    let timer;
    if (
      product &&
      inventoryType &&
      product.Description &&
      product.Inventory_TypeID &&
      inventoryType.Inventory_TypeID
    ) {
      if (product.Description !== description) {
        timer = setTimeout(() => {
          setConfirmationType("inventoryupdate");
          setOpenConfirmation(true);
        }, 500);
      } else if (product.Inventory_TypeID !== inventoryType.Inventory_TypeID) {
        setConfirmationType("inventoryupdate");
        setOpenConfirmation(true);
      }

      return () => {
        timer && clearTimeout(timer);
      };
    }
  }, [description, inventoryType, product]);

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
            setter={(path) => {
              setImageLocation(path);
              setIsUpdated(true);
            }}
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
          <SearchableField
            fetchData={fetchVendors}
            defaultValue={vendor}
            onChange={(value) => {
              setIsUpdated(true);
              setVendor(value);
            }}
            onBlur={(value) => {
              if (vendor && typeof vendor === "string") {
                setConfirmationType("newvendor");
                setOpenConfirmation(true);
              }
            }}
            placeholder="Type to search vendor..."
            className="col-span-2"
            error={!vendor}
            disabled={true}
          />

          <label className="text-gray-700 self-center">
            Product Name<span className="text-red-700">*</span>
          </label>
          <SearchableField
            fetchData={getSearchableList}
            defaultValue={product && product.name ? product.name : product}
            onChange={(value) => {
              setIsUpdated(true);
              if (typeof value === "string") {
                setProduct(value);
              } else {
                setProduct(value);
                setInventoryType(value.Inventory_Type);
                setEnableQuestions(value.Inventory_Type.Ask_Questions);

                reset({
                  Description: value.Description,
                });
              }
            }}
            onBlur={(value) => {
              if (product && typeof product === "string") {
                setConfirmationType("newinventory");
                setOpenConfirmation(true);
              }
            }}
            placeholder="Inventory Name"
            className="col-span-2"
            error={!product}
            disabled={!vendor}
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
                placeholder="Product Description"
                error={!!errors.Description}
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
                placeholder="SKU Number"
                error={!!errors.SKU_Number}
                disabled={true}
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
            defaultValue={inventoryType}
            displayField="Inventory_Type"
            onSelect={(value) => {
              setInventoryType(value);
              setEnableQuestions(value.Ask_Questions);

              setIsUpdated(true);
            }}
            buttonLabel="off"
            placeholder="Type to search inventory type..."
            error={!inventoryType}
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
                error={!!errors.Unit_Price}
                disabled={!vendor}
              />
            )}
          />

          <label className="text-gray-700 self-center">
            Product Question<span className="text-red-700">*</span>
          </label>
          <div className="col-span-2 inline-flex">
            <button
              type="button"
              onClick={() => setProductQuestionsModal(true)}
              className={`py-2 px-6 md:px-16 text-white rounded-xl capitalize min-w-48 ${!(vendor && enableQuestions)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-BtnBg cursor-default"
                }`}
              disabled={!(vendor && enableQuestions)}
            >
              {productQuestions.length} question
              {productQuestions.length > 1 ? "s" : ""}
            </button>

            <label className="items-center ml-2 justify-center inline-flex">
              <Checkbox
                checked={enableQuestions}
                onChange={(e) => {
                  setIsUpdated(true);
                  setEnableQuestions(e.target.checked);
                }}
                color="primary"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
              <span className="ml-2 text-gray-700">Enable Questions</span>
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
                placeholder="USDA Number"
                error={!!errors.Usda_Estab_Num}
              />
            )}
          />

          <div className="col-span-3 flex justify-end mt-3">
            <div
              type="button"
              className="py-2 px-6 md:px-16 bg-BtnBg text-center text-white rounded-xl min-w-36 cursor-pointer"
              onClick={handleCancel}
            >
              {!isValid || !vendor || !inventoryType || (!isDirty && !isUpdated)
                ? "Go Back"
                : "Cancel"}
            </div>
            <button
              type="submit"
              className={`py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize  ${!isValid ||
                !vendor ||
                !inventoryType ||
                (!isDirty && !isUpdated)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-BtnBg"
                }`}
              disabled={
                !isValid ||
                !vendor ||
                !inventoryType ||
                (!isDirty && !isUpdated)
              }
            >
              Update
            </button>
          </div>
        </form>
        <ConfirmationModal
          type={confirmationType}
          open={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onCancel={() => {
            if (confirmationType === "newinventory") {
              setOpenConfirmation(false);
              navigate("/vendor/manage-vendor-products/");
            } else if (confirmationType === "inventoryupdate") {
              setOpenConfirmation(false);
              setProduct(null);
              setInventoryType(null);
              setEnableQuestions(false);

              reset({
                Description: "",
                SKU_Number: "",
                Unit_Price: 0,
                Usda_Estab_Num: "",
              });
            } else if (confirmationType === "inventoryupdate") {
              setOpenConfirmation(false);
              setProduct(null);
              setInventoryType(null);
              setEnableQuestions(false);

              reset({
                Description: "",
                SKU_Number: "",
                Unit_Price: 0,
                Usda_Estab_Num: "",
              });
            } else if (confirmationType === "newvendor") {
              setOpenConfirmation(false);
              setVendor(null);
            } else {
              setOpenConfirmation(false);
            }
          }}
          onSubmit={onSubmit}
        />
      </div>
      <ProductQuestionsModal
        data={productQuestions}
        setData={(data) => {
          setProductQuestions(data);
          setIsUpdated(true);
        }}
        isModal={true}
        isModalOpen={productQuestionsModal}
        setIsModalOpen={setProductQuestionsModal}
        isSetting={false}
      />
    </div>
  );
};

export default VendorProductsEdit;
