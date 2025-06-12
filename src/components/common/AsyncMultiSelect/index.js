import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import { Avatar } from "@mui/material";
import { getImagePath } from "../../../utils/imagePath";

const AsyncMultiSelect = ({
  className = "",
  fetchOptions,
  displayField,
  defaultValue,
  onSelect,
  label,
  placeholder = "Type to search...",
  buttonLabel = "Add New",
  buttonDisable = false,
  onButtonClick,
  multiple = true,
  disabled = false,
  error = false,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(multiple ? [] : null);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async (keyword) => {
      const response = await fetchOptions(keyword);
      if (active) {
        setOptions(response);
      } else {
        setOptions([]);
      }
    })(inputValue);

    return () => {
      active = false;
    };
  }, [loading, inputValue, fetchOptions]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleOnChange = (event, value) => {
    if (multiple) {
      const uniqueValues = value.filter(
        (v, i, arr) =>
          arr.findIndex((opt) => opt[displayField] === v[displayField]) === i
      );
      setSelectedOptions(uniqueValues);
      onSelect(uniqueValues);
    } else {
      setSelectedOptions(value);
      onSelect(value);
    }
  };

  useEffect(() => {
    setSelectedOptions(defaultValue);
  }, [defaultValue]);

  return (
    <Autocomplete
      multiple={multiple}
      disableClearable={multiple}
      disabled={disabled}
      id="async-multi-select"
      className={`bg-[#f4f4f4] ${className} ${
        disabled ? "cursor-not-allowed" : "cursor-default"
      }`}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onInputChange={async (event, value) => {
        // setInputValue(value);
        // await fetchOptions(value)
        //   .then((res) => {
        //     setOptions(res);
        //   })
        //   .catch((err) => {
        //     console.error(err);
        //     setOptions([]);
        //   });
      }}
      getOptionLabel={(option) => option[displayField]}
      options={options}
      loading={loading}
      value={selectedOptions}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <React.Fragment key={`selected-${index}-${option[displayField]}`}>
            <Chip
              variant="outlined"
              avatar={
                option["Image_Location"] ? (
                  <Avatar
                    alt={option[displayField]}
                    src={getImagePath(option["Image_Location"])}
                  />
                ) : undefined
              }
              label={option[displayField]}
              {...getTagProps({ index })}
            />
          </React.Fragment>
        ))
      }
      onChange={handleOnChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          className={`async-multi-selector rounded-lg ${
            error ? "bg-red-50 error" : ""
          }`}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <React.Fragment>
                {buttonLabel !== "off" && (
                  <InputAdornment position="start">
                    <Button
                      variant="contained"
                      className="add-new-item"
                      onClick={onButtonClick}
                      disabled={buttonDisable}
                    >
                      {buttonLabel}
                    </Button>
                  </InputAdornment>
                )}
                {params.InputProps.startAdornment}
              </React.Fragment>
            ),
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default AsyncMultiSelect;
