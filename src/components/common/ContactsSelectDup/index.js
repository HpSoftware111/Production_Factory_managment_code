import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, InputAdornment } from "@mui/material";
import { toast } from "react-toastify";

const ContactsSelectDup = ({
  className = "",
  displayField,
  fetchOptions,
  onSelect,
  placeholder = "Type to search...",
  onButtonClick,
  buttonLabel = "selected",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const loading = open && options.length === 0;

  const handleOnChange = (event, value) => {
    onSelect(value);
  };

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

  return (
    <Autocomplete
      multiple
      disableClearable={true}
      disabled={disabled}
      id={`async-multi-select`}
      className={`bg-[#f4f4f4] ${className}`}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={[]}
      onChange={handleOnChange}
      onInputChange={async (event, value) => {
        setInputValue(value);
      }}
      getOptionLabel={(option) => option[displayField]}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          className="async-multi-selector"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <React.Fragment>
                <InputAdornment position="start">
                  <Button
                    variant="contained"
                    color={buttonLabel === "selected" ? "success" : "primary"}
                    className="add-new-item"
                    onClick={onButtonClick}
                  >
                    {buttonLabel}
                  </Button>
                </InputAdornment>
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

export default ContactsSelectDup;
