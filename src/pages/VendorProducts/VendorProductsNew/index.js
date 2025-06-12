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

const VendorProductsNew = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { name, inventoryId } = location.state;

  const [vendor, setVendor] = useState(null);
  const [product, setProduct] = useState(null);
  const [inventoryType, setInventoryType] = useState(null);
  const [productQuestions, setProductQuestions] = useState([]);
  const [productQuestionsModal, setProductQuestionsModal] = useState(false);
  const [imageLocation, setImageLocation] = useState(null);

  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmationType, setConfirmationType] = useState("cancel");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);

  const [enableQuestions, setEnableQuestions] = useState(false);

  const formHandler = (data) => {
    setConfirmationType("add");
    setFormData(data);
    setOpenConfirmation(true);
  };

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
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
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

  const fetchVendors = async (inputValue) => {
    try {
      const res = await axios.get(`/vendors`);
      if (res.status === 200) {
        let list = res.data.data.data;
        list = list.map((item) => ({
          id: item.VendorID,
          name: item.Vendor_Name,
          Image_Location: item.Image_Location,
        }));
        return list;
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
      );
      if (res.status === 200) {
        let list = res.data.data.data;
        console.log("new inventory list", list)
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
    } else {
      return [];
    }
  };

  const onSubmit = useCallback(() => {
    if (confirmationType === "cancel") {
      navigate("/vendor/manage-vendor-products");
    } else if (confirmationType === "newinventory") {
      setOpenConfirmation(false);
    } else if (confirmationType === "inventoryupdate") {
      setOpenConfirmation(false);
    } else if (confirmationType === "newvendor") {
      navigate("/vendor/manage-vendors/new", {
        state: {
          name: vendor,
        },
      });
    } else if (confirmationType === "add") {
      axios
        .post("/vendor-products", {
          ...formData,
          Product_Name: product && product.name ? product.name : product,
          VendorID: vendor ? vendor.id : null,
          Inventory_TypeID: inventoryType
            ? inventoryType.Inventory_TypeID
            : null,
          Image_Location: imageLocation,
          productQuestions,
          enableQuestions,
        })
        .then((res) => {
          toast.success("Vendor Product Created Successfully");
          navigate("/vendor/manage-vendor-products");
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response.data.errorMessage);
        });
    } else {
      navigate(-1);
    }
  }, [
    confirmationType,
    formData,
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
      navigate("/vendor/manage-vendor-products");
    }
  };

  useEffect(() => {
    if (name) {
      reset({
        Product_Name: name,
      });
    }
  }, [name, reset]);

  useEffect(() => {
    inventoryId &&
      axios.get(`/inventories/${inventoryId}`).then((res) => {
        reset({
          Description: res.data.data.Description,
          SKU_Number: "",
          Unit_Price: 0,
          Usda_Estab_Num: "",
        });
        setInventoryType(res.data.data.Inventory_Type);

        setEnableQuestions(res.data.data.Inventory_Type.Ask_Questions);

        setProduct({
          ...res.data.data,
          id: res.data.data.InventoryID,
          name: res.data.data.Name,
        });
      });
  }, [inventoryId, reset]);

  useEffect(() => {
    let timer;
    console.log(typeof product);
    if (product && inventoryType) {
      if (
        typeof product !== "string" &&
        product.Inventory_TypeID !== inventoryType.Inventory_TypeID
      ) {
        setConfirmationType("inventoryupdate");
        setOpenConfirmation(true);
      } else if (
        typeof product !== "string" &&
        product.Description !== description
      ) {
        timer = setTimeout(() => {
          setConfirmationType("inventoryupdate");
          setOpenConfirmation(true);
        }, 500);
      }

      return () => {
        timer && clearTimeout(timer);
      };
    }
  }, [description, inventoryType, product]);

  useEffect(() => {
    axios.get("/product-questions").then((res) => {
      const questions = res.data.data;
      const ids = [];
      questions.forEach((item) => {
        if (item.Public) ids.push(item.ProductQID);
      });
      setProductQuestions(ids);
    });
  }, []);

  return (
    <div className="p-5">
      <div className="px-4 py-6 sm:px-11 mb-4 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
            Vendor Products Details
          </h2>
          <FileUploader
            bgColor="#B79F61"
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
                disabled={!vendor}
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
                disabled={!vendor}
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
              setIsUpdated(true);
              setInventoryType(value);
              setEnableQuestions(value.Ask_Questions);
            }}
            buttonLabel="off"
            placeholder="Type to search inventory type..."
            error={!inventoryType}
            disabled={!vendor}
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
                disabled={!vendor}
              />
            )}
          />

          <div className="col-span-3 flex justify-end mt-3">
            <div
              type="button"
              onClick={handleCancel}
              className="py-2 px-6 md:px-16 bg-BtnBg text-white rounded-xl min-w-36 cursor-pointer"
            >
              {!isValid || !vendor || !inventoryType ? "Go Back" : "Cancel"}
            </div>
            <button
              type="submit"
              className={`py-2 px-6 md:px-16 ml-7 text-white rounded-xl min-w-36 capitalize  ${!isValid || !vendor || !inventoryType
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-BtnBg"
                }`}
              disabled={!isValid || !vendor || !inventoryType}
            >
              Add
            </button>
          </div>
        </form>
        <ConfirmationModal
          type={confirmationType}
          open={openConfirmation}
          onClose={() => {
            setOpenConfirmation(false);
          }}
          onCancel={() => {
            if (confirmationType === "newinventory") {
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
            } else {
              setOpenConfirmation(false);
            }
          }}
          onSubmit={onSubmit}
        />
      </div>
      <ProductQuestionsModal
        data={productQuestions}
        setData={setProductQuestions}
        disabled={!vendor}
        isModal={true}
        isModalOpen={productQuestionsModal}
        setIsModalOpen={setProductQuestionsModal}
        isSetting={false}
      />
    </div>
  );
};

export default VendorProductsNew;
