import React, { useState, useEffect, useRef } from "react";

const SearchableField = ({
  fetchData,
  defaultValue,
  onChange,
  onfocus = null,
  onBlur = null,
  placeholder = "Search",
  disabled = false,
  className = "",
  error = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [debounceTimeout, hideTimeout]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    setInputValue(value);
    onChange(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);
    if (hideTimeout) clearTimeout(hideTimeout);

    if (value) {
      const timeout = setTimeout(async () => {
        const data = await fetchData(value);
        setItems(data);
        setDropdownVisible(true);

        const hideTimeoutId = setTimeout(() => {
          setDropdownVisible(false);
        }, 60000);
        setHideTimeout(hideTimeoutId);
      }, 300);

      setDebounceTimeout(timeout);
    } else {
      setDropdownVisible(false);
      setItems([]);
    }
  };

  const handleFocusChange = async (e) => {
    const data = await fetchData(e.target.value);
    setItems(data);
    setDropdownVisible(true);

    const hideTimeoutId = setTimeout(() => {
      setDropdownVisible(false);
    }, 60000);
    setHideTimeout(hideTimeoutId);
  };

  const handleBlurChange = (e) => {
    const value = e.target.value;

    onBlur && items.length < 1 && onBlur(value);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [debounceTimeout, hideTimeout]);

  useEffect(() => {
    if (defaultValue) {
      defaultValue.name
        ? setInputValue(defaultValue.name)
        : setInputValue(defaultValue);
      setDropdownVisible(false);
    } else {
      setInputValue("");
    }
  }, [defaultValue]);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlurChange}
        onFocus={handleFocusChange}
        placeholder={placeholder}
        className={`rounded-lg py-2 px-4 w-full bg-[#f4f4f4] placeholder:text-[#4D5658] text-[#4D5658] focus:outline-none focus:ring-2 focus:ring-BtnBg ${
          error ? "bg-red-50 focus:!ring-red-200" : ""
        } ${disabled ? "cursor-not-allowed" : "cursor-default"}`}
        disabled={disabled}
        autoComplete="off"
      />
      {isDropdownVisible && items && items.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => onChange(item)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
      <svg
        className="absolute top-1/2 right-2 -translate-y-1/2 MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        data-testid="ArrowDropDownIcon"
      >
        <path d="M7 10l5 5 5-5z" fill="#706B6B"></path>
      </svg>
    </div>
  );
};

export default SearchableField;
