import React, { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import FileUploadIcon from "@mui/icons-material/UploadFile";
import axios from "../../../api";
import { getImagePath } from "../../../utils/imagePath";

const FileUploader = ({
  bgColor,
  multiple = false,
  defaultValue,
  setter,
  disabled = false,
}) => {
  const fileInputRef = useRef(null);
  const [url, setUrl] = useState(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const res = await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        multiple ? setter(res.data.filePaths) : setter(res.data.filePaths[0]);
        multiple ? setUrl(res.data.filePaths) : setUrl(res.data.filePaths[0]);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  useEffect(() => {
    setUrl(defaultValue);
  }, [defaultValue]);

  return (
    <div
      className={`flex items-center justify-center text-center ${
        disabled ? "pointer-events-none" : ""
      }`}
    >
      <p className="mr-2">Upload Photo</p>

      <Avatar
        src={getImagePath(url)}
        sx={{ backgroundColor: bgColor, cursor: "pointer" }}
        onClick={handleClick}
      >
        <FileUploadIcon />
      </Avatar>
      {multiple ? (
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          multiple
        />
      ) : (
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      )}
    </div>
  );
};

export default FileUploader;
