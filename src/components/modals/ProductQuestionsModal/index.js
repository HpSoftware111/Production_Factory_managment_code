import React, { useCallback, useEffect, useState } from "react";

import { Box, Modal } from "@mui/material";

import axios from "../../../api";
import DropdownMenu from "../../common/DropdownMenu";
import CrudModal from "../../modals/CrudModal";
import ConfirmationModal from "../ConfirmationModal";
import { toast } from "react-toastify";
import DynamicDropdownMenu from "../../common/DynamicDropdownMenu";

const DEFAULT_QUESTIONS = [
  // "temp of product",
  // "source",
  // "quality",
  // "receive",
  // "container",
  // "quantity",
];

const ProductQuestionsModal = ({
  data = [],
  setData = null,
  isDelete = false,
  disabled = false,
  isModal = false,
  isModalOpen = false,
  setIsModalOpen = null,
  isSetting = false,
}) => {
  const [formData, setFormData] = useState({
    Question: "",
    Value: "",
    Type: "",
  });

  const [productQuestions, setProductQuestions] = useState([]);
  const [isCrudOpen, setIsCrudOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState("cancel");
  const [btnModal, setBtnModal] = useState("add");
  const [isUpdated, setIsUpdated] = useState(false);

  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [clickedRowPos, setClickedRowPos] = useState({ x: 0, y: 0 });

  const handleAddNewQuestionClick = () => {
    setFormData({
      Question: "",
      Value: "",
      Type: "",
    });
    setBtnModal("add");
    setIsCrudOpen(true);
  };

  const handleCloseAddQuestionModal = () => {
    setIsCrudOpen(false);
  };

  const onEdit = (question, idx) => {
    setFormData({ ...question, index: idx });
    setBtnModal("update");
    setIsCrudOpen(true);
  };

  const onDelete = (question, idx) => {
    setFormData({ ...question, index: idx });
    setBtnModal("delete");
    setIsCrudOpen(true);
  };

  const cancelChangeHandler = () => {
    if (isUpdated) {
      setConfirmationType("cancel");
      setOpenConfirmation(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const saveChangeHandler = () => {
    if (isUpdated) {
      setConfirmationType("configurationupdate");
      setOpenConfirmation(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const posNavHandler = useCallback(
    (id, arrange, step) => {
      axios
        .post("/product-questions/swap-arrange", {
          ProductQID: id,
          step: step,
        })
        .then((res) => {
          let tmp = [...productQuestions];
          let idx = tmp.findIndex((item) => item.Arrange === arrange);
          let val = tmp[idx].Arrange;
          tmp[idx].Arrange = tmp[idx + step].Arrange;
          tmp[idx + step].Arrange = val;
          setProductQuestions(
            tmp.sort((el1, el2) => el1.Arrange - el2.Arrange)
          );
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [productQuestions]
  );

  useEffect(() => {
    if (isModal) {
      axios.get("/product-questions").then((res) => {
        setProductQuestions(res.data.data);
      });
    } else {
      axios.get("/product-questions?visible=true").then((res) => {
        setProductQuestions(res.data.data);
      });
    }
  }, [isModal]);

  return (
    <>
      {isModal ? (
        isModalOpen && (
          <Modal
            open={true}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby="product-questions-modal-title"
            className="flex items-center justify-center"
          >
            {isSetting ? (
              <Box className="bg-white w-11/12 rounded-lg shadow-xl max-w-2xl overflow-y-auto p-5 md:px-11 md:py-6">
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowY: "auto",
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
                      Product Questions
                    </h2>
                    <div
                      style={{
                        borderBottom: "1px solid #D1D5DB",
                        marginBottom: "1rem",
                      }}
                    ></div>
                    <button
                      type="button"
                      className={`py-2 px-6 md:px-16  text-white rounded-xl min-w-36 ${
                        disabled
                          ? "cursor-not-allowed bg-gray-400"
                          : "cursor-pointer bg-BtnBg"
                      }`}
                      onClick={handleAddNewQuestionClick}
                      disabled={disabled}
                    >
                      Add New Question
                    </button>
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "2fr 4fr 4fr 3fr 1fr",
                      bgcolor: "#E2E8F0",
                      borderRadius: 2,
                      py: 2,
                      px: 3,
                      mb: 2,
                      color: "#143664",
                      fontWeight: "bold",
                    }}
                  >
                    <div>
                      Default
                      <br />
                      Settings
                    </div>
                    <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                      Question
                    </div>
                    <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                      Value
                    </div>
                    <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                      Type
                    </div>
                    <div></div>
                  </Box>
                  {productQuestions && productQuestions.length > 0 ? (
                    productQuestions.map((question, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          bgcolor: "#F3F4F6",
                          borderRadius: 2,
                          py: 2,
                          px: 3,
                          mb: 2,
                          display: "grid",
                          gridTemplateColumns: "2fr 4fr 4fr 3fr 1fr",
                          alignItems: "center",
                          "&:hover .pos-nav": {
                            visibility: "visible",
                            opacity: 100,
                          },
                        }}
                      >
                        <div
                          className={`relative flex items-center w-5 h-5 ${
                            DEFAULT_QUESTIONS.includes(question.Question)
                              ? "pointer-events-none opacity-70"
                              : "cursor-pointer"
                          }`}
                        >
                          <span
                            className={`absolute top-0 left-0 border-2 border-solid w-5 h-5 rounded transition-all ${
                              question["Public"]
                                ? " border-BtnBg"
                                : " border-[#D1D5DB]"
                            }`}
                          ></span>
                          <span
                            className={`absolute w-2 h-2 bg-BtnBg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                              question["Public"]
                                ? "opacity-100 visible"
                                : "opacity-0 invisible"
                            }`}
                          ></span>
                          <input
                            type="checkbox"
                            className="w-5 h-5 bg-transparent opacity-0"
                            defaultChecked={question["Public"]}
                            onChange={(e) => {
                              // axios
                              //   .put(
                              //     `/product-questions/${question["ProductQID"]}`,
                              //     {
                              //       Public: !question["Public"],
                              //     }
                              //   )
                              //   .then((res) => {
                              setProductQuestions((prevData) =>
                                prevData.map((item) =>
                                  item["ProductQID"] === question["ProductQID"]
                                    ? { ...item, Public: !question["Public"] }
                                    : item
                                )
                              );
                              setIsUpdated(true);
                              // });
                            }}
                          />
                        </div>
                        <div
                          className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4"
                          onClick={(e) => {
                            setClickedRowPos({
                              x: e.pageX,
                              y: e.pageY,
                            });

                            setClickedRowIndex(
                              index === clickedRowIndex ? null : index
                            );
                          }}
                        >
                          {question.Question}
                        </div>
                        <div
                          className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4"
                          onClick={(e) => {
                            setClickedRowPos({
                              x: e.pageX,
                              y: e.pageY,
                            });

                            setClickedRowIndex(
                              index === clickedRowIndex ? null : index
                            );
                          }}
                        >
                          {question.Value}&nbsp;
                        </div>
                        <div
                          className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4"
                          onClick={(e) => {
                            setClickedRowPos({
                              x: e.pageX,
                              y: e.pageY,
                            });

                            setClickedRowIndex(
                              index === clickedRowIndex ? null : index
                            );
                          }}
                        >
                          {question.Type}
                        </div>
                        {!isDelete && !disabled && (
                          <DropdownMenu
                            onEdit={() => onEdit(question, index)}
                            onDelete={() => onDelete(question, index)}
                            last={index + 1 === productQuestions.length}
                          />
                        )}
                        <div className="pos-nav absolute top-1/2 right-2 flex flex-col -translate-y-1/2 invisible opacity-0">
                          <button
                            onClick={() =>
                              posNavHandler(
                                question["ProductQID"],
                                question.Arrange,
                                -1
                              )
                            }
                            className={`flex items-center justify-center w-4 h-4 p-1 border text-xs rounded hover:bg-BtnBg hover:text-white transition ${
                              question.Arrange - 1 < 1
                                ? "pointer-events-none opacity-0 invisible"
                                : ""
                            }`}
                          >
                            &#9650;
                          </button>
                          <button
                            onClick={() =>
                              posNavHandler(
                                question["ProductQID"],
                                question.Arrange,
                                1
                              )
                            }
                            className={`flex items-center justify-center w-4 h-4 p-1 border text-xs rounded hover:bg-BtnBg hover:text-white transition ${
                              question.Arrange + 1 > productQuestions.length
                                ? "pointer-events-none opacity-0 invisible"
                                : ""
                            }`}
                          >
                            &#9660;
                          </button>
                        </div>
                      </Box>
                    ))
                  ) : (
                    <Box
                      sx={{
                        bgcolor: "#F3F4F6",
                        borderRadius: 2,
                        py: 2,
                        px: 3,
                        mb: 3,
                        display: "grid",
                        gridTemplateColumns: "1fr 2fr 2fr 1fr auto",
                        alignItems: "center",
                        gap: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      No Questions Added
                    </Box>
                  )}

                  {clickedRowIndex !== null && (
                    <div
                      className="absolute"
                      style={{
                        left: clickedRowPos.x,
                        top: clickedRowPos.y,
                      }}
                    >
                      <DynamicDropdownMenu
                        closeHandler={() => setClickedRowIndex(null)}
                        onEdit={() =>
                          onEdit(
                            productQuestions[clickedRowIndex],
                            clickedRowIndex
                          )
                        }
                        onDelete={() =>
                          onDelete(
                            productQuestions[clickedRowIndex],
                            clickedRowIndex
                          )
                        }
                      />
                    </div>
                  )}
                  {isModal && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 3,
                        gap: 3,
                      }}
                    >
                      <button
                        type="button"
                        onClick={cancelChangeHandler}
                        className="py-2 px-6 md:px-16 bg-BtnBg text-white rounded-xl min-w-36 cursor-pointer"
                      >
                        {!isUpdated ? "Go Back" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        onClick={saveChangeHandler}
                        className={`py-2 px-6 md:px-16 text-white rounded-xl min-w-36 cursor-pointer ${
                          !isUpdated
                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                            : "bg-BtnBg"
                        }`}
                        disabled={!isUpdated}
                      >
                        Save
                      </button>
                    </Box>
                  )}
                </Box>
              </Box>
            ) : (
              <Box className="bg-white w-11/12 rounded-lg shadow-xl max-w-2xl overflow-y-auto p-5 md:px-11 md:py-6">
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowY: "auto",
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
                      Product Questions
                    </h2>
                    <div
                      style={{
                        borderBottom: "1px solid #D1D5DB",
                        marginBottom: "1rem",
                      }}
                    ></div>
                    <button
                      type="button"
                      className={`py-2 px-6 md:px-16  text-white rounded-xl min-w-36 ${
                        disabled
                          ? "cursor-not-allowed bg-gray-400"
                          : "cursor-pointer bg-BtnBg"
                      }`}
                      onClick={handleAddNewQuestionClick}
                      disabled={disabled}
                    >
                      Add New Question
                    </button>
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "2fr 4fr 4fr 3fr 1fr",
                      bgcolor: "#E2E8F0",
                      borderRadius: 2,
                      py: 2,
                      px: 3,
                      mb: 2,
                      color: "#143664",
                      fontWeight: "bold",
                    }}
                  >
                    <div className="flex items-center">
                      Use
                      <br />
                      Question
                    </div>
                    <div className="flex items-center">Question</div>
                    <div className="flex items-center pl-4 border-l border-solid border-[#D1D5DB]">
                      Value
                    </div>
                    <div className="flex items-center pl-4 border-l border-solid border-[#D1D5DB]">
                      Type
                    </div>
                    <div></div>
                  </Box>
                  {productQuestions && productQuestions.length > 0 ? (
                    productQuestions.map((question, index) => (
                      <Box
                        key={index}
                        sx={{
                          bgcolor: "#F3F4F6",
                          borderRadius: 2,
                          py: 2,
                          px: 3,
                          mb: 2,
                          display: "grid",
                          gridTemplateColumns: "2fr 4fr 4fr 3fr 1fr",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className={`relative flex items-center w-5 h-5 ${
                            DEFAULT_QUESTIONS.includes(question.Question)
                              ? "pointer-events-none opacity-70"
                              : "cursor-pointer"
                          }`}
                        >
                          <span
                            className={`absolute top-0 left-0 border-2 border-solid w-5 h-5 rounded transition-all ${
                              data.includes(question["ProductQID"])
                                ? " border-BtnBg"
                                : " border-[#D1D5DB]"
                            }`}
                          ></span>
                          <span
                            className={`absolute w-2 h-2 bg-BtnBg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                              data.includes(question["ProductQID"])
                                ? "opacity-100 visible"
                                : "opacity-0 invisible"
                            }`}
                          ></span>
                          <input
                            type="checkbox"
                            className="w-5 h-5 bg-transparent opacity-0"
                            onChange={(e) => {
                              if (data.includes(question["ProductQID"])) {
                                setData(
                                  data.filter(
                                    (item) => item !== question["ProductQID"]
                                  )
                                );
                              } else {
                                setData(
                                  Array.from(
                                    new Set([...data, question["ProductQID"]])
                                  )
                                );
                              }
                            }}
                          />
                        </div>

                        <div className="text-[#4B5563]">
                          {question.Question}
                        </div>
                        <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                          {question.Value}&nbsp;
                        </div>
                        <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                          {question.Type}
                        </div>
                        {!isDelete && !disabled && (
                          <DropdownMenu
                            onEdit={() => onEdit(question, index)}
                            onDelete={() => onDelete(question, index)}
                            last={index + 1 === productQuestions.length}
                          />
                        )}
                      </Box>
                    ))
                  ) : (
                    <Box
                      sx={{
                        bgcolor: "#F3F4F6",
                        borderRadius: 2,
                        py: 2,
                        px: 3,
                        mb: 3,
                        display: "grid",
                        gridTemplateColumns: "1fr 2fr 2fr 1fr auto",
                        alignItems: "center",
                        gap: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      No Questions Added
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Modal>
        )
      ) : (
        <Box className="bg-white w-11/12 rounded-lg shadow-xl max-w-2xl overflow-y-auto p-5 md:px-11 md:py-6">
          <Box
            sx={{
              bgcolor: "#ffffff",
              borderRadius: 2,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <h2 className="text-2xl font-semibold mb-2 text-BtnBg">
                Product Questions
              </h2>
              <div
                style={{
                  borderBottom: "1px solid #D1D5DB",
                  marginBottom: "1rem",
                }}
              ></div>
              <button
                type="button"
                className={`py-2 px-6 md:px-16  text-white rounded-xl min-w-36 ${
                  disabled
                    ? "cursor-not-allowed bg-gray-400"
                    : "cursor-pointer bg-BtnBg"
                }`}
                onClick={handleAddNewQuestionClick}
                disabled={disabled}
              >
                Add New Question
              </button>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 3fr 3fr 2fr 1fr",
                bgcolor: "#E2E8F0",
                borderRadius: 2,
                py: 2,
                px: 3,
                mb: 2,
                color: "#143664",
                fontWeight: "bold",
              }}
            >
              <div>Select</div>
              <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                Question
              </div>
              <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                Value
              </div>
              <div className="pl-4 border-l border-solid border-[#D1D5DB]">
                Type
              </div>
              <div></div>
            </Box>
            {productQuestions && productQuestions.length > 0 ? (
              productQuestions.map((question, index) => (
                <Box
                  key={index}
                  sx={{
                    bgcolor: "#F3F4F6",
                    borderRadius: 2,
                    py: 2,
                    px: 3,
                    mb: 2,
                    display: "grid",
                    gridTemplateColumns: "1fr 3fr 3fr 2fr 1fr",
                    alignItems: "center",
                  }}
                >
                  <div className="relative flex items-center w-5 h-5">
                    <span
                      className={`absolute top-0 left-0 border-2 border-solid w-5 h-5 rounded transition-all ${
                        data.includes(question["ProductQID"])
                          ? " border-BtnBg"
                          : " border-[#D1D5DB]"
                      }`}
                    ></span>
                    <span
                      className={`absolute w-2 h-2 bg-BtnBg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                        data.includes(question["ProductQID"])
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`}
                    ></span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 bg-transparent opacity-0"
                      onChange={(e) => {
                        if (data.includes(question["ProductQID"])) {
                          setData(
                            data.filter(
                              (item) => item !== question["ProductQID"]
                            )
                          );
                        } else {
                          setData(
                            Array.from(
                              new Set([...data, question["ProductQID"]])
                            )
                          );
                        }
                      }}
                    />
                  </div>

                  <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                    {question.Question}
                  </div>
                  <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                    {question.Value}&nbsp;
                  </div>
                  <div className="text-[#4B5563] border-l border-solid border-[#D1D5DB] pl-4">
                    {question.Type}
                  </div>
                  {!isDelete && !disabled && (
                    <DropdownMenu
                      onEdit={() => onEdit(question, index)}
                      onDelete={() => onDelete(question, index)}
                      last={index + 1 === productQuestions.length}
                    />
                  )}
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  bgcolor: "#F3F4F6",
                  borderRadius: 2,
                  py: 2,
                  px: 3,
                  mb: 3,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 2fr 1fr auto",
                  alignItems: "center",
                  gap: 2,
                  whiteSpace: "nowrap",
                }}
              >
                No Questions Added
              </Box>
            )}

            {/* <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
              gap: 3,
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
              className="py-2 px-6 md:px-16 bg-BtnBg text-white rounded-xl min-w-36 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className={`py-2 px-6 md:px-16  text-white rounded-xl min-w-36 ${
                isUpdated ? "bg-BtnBg" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isUpdated}
            >
              Update
            </button>
        </Box> */}
          </Box>
        </Box>
      )}

      {isCrudOpen && (
        <CrudModal
          open={true}
          fieldData={formData}
          handleClose={handleCloseAddQuestionModal}
          btnName={btnModal}
          setProductQuestions={setProductQuestions}
        />
      )}
      <ConfirmationModal
        type={confirmationType}
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onSubmit={() => {
          if (confirmationType === "cancel") {
            setIsModalOpen(false);
          } else if (confirmationType === "configurationupdate") {
            axios
              .put(`/product-questions`, productQuestions)
              .then((res) => {
                setIsModalOpen(false);
                toast.success(
                  "Product Questions Visibility Changed Successfully"
                );
              })
              .catch((err) => {
                console.error(err);
                toast.error(
                  err.response?.data?.errorMessage || "Internal server error"
                );
              });
          }
          setOpenConfirmation(false);
        }}
      />
    </>
  );
};

export default ProductQuestionsModal;
