import React, {useState, useEffect, useCallback, useRef, memo} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  PaginationItem,
  TextField,
  Button, styled, InputAdornment, IconButton, Menu, MenuItem, MenuList, ListItemIcon, debounce, Typography, Grid,
} from "@mui/material";
import {ArrowBack, ArrowForward, Search, MoreVert, Edit, Delete, MoreHoriz} from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import editIcon from "../../../assets/images/editIcon.svg";
import trashIcon from "../../../assets/images/trashIcon.svg";
import {useTheme} from "@mui/material/styles";


const CustomTable = memo((
  {
    useSpecialRendering = false,
    renderConfig,

    titleText = '',

    isNew,
    showPagination = true,

    data = [],
    dataConfig = [],

    onEdit,
    onDelete,
    menuItems, // Please use this instead

    onAddClick = null,
    onAddText = null,

    showSearch = true,
    searchText = "Search...",
    onSearch,

    currentPage,
    totalPages,
    onPageChange,

  }
) => {
  const theme = useTheme()

  // For popup Menu
  const [clickedRowPos, setClickedRowPos] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const visibleColumns = dataConfig.filter(col => col.visible);

  const handleSearchChange = useCallback((e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onSearch(newValue);
  }, [onSearch]);
  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  /**
   * This useEffect removes the menu popup the moment you click away or scroll
   */
  useEffect(() => {
    const handleClickOutsideOrScroll = (event) => {
      if (clickedRowPos) {
        setClickedRowPos(null);
        setSelectedRow(null);
      }
    };

    document.addEventListener('click', handleClickOutsideOrScroll);
    window.addEventListener('scroll', handleClickOutsideOrScroll);

    return () => {
      document.removeEventListener('click', handleClickOutsideOrScroll);
      window.removeEventListener('scroll', handleClickOutsideOrScroll);
    };
  }, [clickedRowPos]);

  /**
   * This handler sets the clickedRowPos which the popup uses. It uses absolute positioning, and since it gets removed
   * the moment we scroll we do not need to handle position recalculations.
   */
  const handleMenuClick = (event, row) => {
    event.preventDefault();
    event.stopPropagation();

    const buttonElement = event.currentTarget;
    const rect = buttonElement.getBoundingClientRect();

    setClickedRowPos({
      x: rect.left - 160,
      y: rect.top,
    });
    setSelectedRow(row);
  };

  /**
   * This callback will return menu items if this prop has been passed to this table component. Regrettably I hardcoded
   * onEdit and onDelete popup menu items. However, some crud screens want to use different icons, and more/less popup
   * menu items. To handle this dynamically we can now pass an object that looks like this into the CustomTable
   *
   * <CustomTable
   *   menuItems={[
   *     {
   *       icon: editIcon,
   *       label: 'Edit',
   *       handler: handleEdit,
   *     },
   *     {
   *       icon: trashIcon,
   *       label: 'Delete',
   *       handler: handleDelete,
   *     },
   *     // any other arbitrary amount of icons, leabel and handler functions
   *  ]}
   *
   *  You can decide for yourself if you want you UI page component to use menuItems, or the legacy method below
   *
   *  <CustomTable
   *   onEdit={handleEdit}
   *   onDelete={handleDelete}
   *   // ... other props
   *  />
   *
   */
  const getMenuItems = useCallback(() => {
    if (menuItems) {
      return menuItems;
    }

    // Fall back to legacy pattern
    const defaultItems = [];
    if (onEdit) {
      defaultItems.push({
        icon: editIcon,
        label: 'Edit',
        handler: onEdit,
      });
    }
    if (onDelete) {
      defaultItems.push({
        icon: trashIcon,
        label: 'Delete',
        handler: onDelete,
      });
    }
    return defaultItems;

  }, [menuItems, onEdit, onDelete]);

  const StyledTableContainer = styled(TableContainer)(({theme}) => ({
    marginTop: theme.spacing(2),
    boxShadow: 'none',
    backgroundColor: 'transparent',
    marginBottom: '1rem',
    position: 'relative'
  }));

  const StyledTable = styled(Table)(({theme}) => ({
    borderCollapse: 'separate',
    borderSpacing: '0 16px', // This creates space between rows
  }));

  const StyledHeaderCell = styled(TableCell, {
    shouldForwardProp: (prop) => !['isFirst', 'isLast'].includes(prop)
  })(({theme, isFirst, isLast}) => ({
    color: '#143664',
    fontWeight: 'bold',
    fontSize: '15px',
    lineHeight: '1.15rem',
    borderWidth: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.secondary,
    '&:first-of-type': {
      borderTopLeftRadius: isFirst ? '20px' : 0,
      borderBottomLeftRadius: isFirst ? '20px' : 0,
    },
    '&:last-child': {
      borderTopRightRadius: isLast ? '20px' : 0,
      borderBottomRightRadius: isLast ? '20px' : 0,
    },
  }));

  const StyledBodyCell = styled(TableCell, {
    shouldForwardProp: (prop) => !['isFirst', 'isLast'].includes(prop)
  })(({theme, isFirst, isLast}) => ({
    borderWidth: 0,
    padding: theme.spacing(2),
    '&:first-of-type': {
      borderTopLeftRadius: '20px',
      borderBottomLeftRadius: '20px',
    },
    '&:last-child': {
      borderTopRightRadius: '20px',
      borderBottomRightRadius: '20px',
    },
    '&:not(:last-child)': {
      position: 'relative',
      '&::after': {
        content: isLast ? 'none' : '""', // Don't show separator for last cell
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        height: '18px',
        width: '1px',
        backgroundColor: '#888888',
      },
    },
  }));

  const PillContent = styled('div')(({theme, variant = 'neutral'}) => {
    const variants = {
      neutral: {
        backgroundColor: theme.palette.primary.main,
        color: "#ffffff",
      },
      success: {
        backgroundColor: theme.palette.septenary.tertiary,
        color: theme.palette.primary.tertiary,
      },
      warning: {
        backgroundColor: theme.palette.senary.secondary,
        color: theme.palette.primary.tertiary,
      },
      done: {
        backgroundColor: theme.palette.primary.quaternary,
        color: "#ffffff",
      },
    };

    const variantStyles = variants[variant];

    return {
      ...variantStyles,
      borderRadius: '16px',  // Fully rounded corners for pill shape
      padding: theme.spacing(2, 3, 2, 3),  // Adjust padding as needed
      textAlign: 'center',
    };
  });

  const UnderlinedBoldContent = styled('div')(({theme}) => ({
    textDecoration: 'underline',
    fontWeight: 'bold',
  }));

  const StyledMenuList = styled(MenuList)(({theme}) => ({
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    '& .MuiMenuItem-root': {
      padding: '8px',
      borderRadius: '8px',
      ...theme.typography.label1,
      color: '#2D3748',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    },
  }));

  /**
   * Styled the icons in the popup actions menu
   */
  const StyledListItemIcon = styled(ListItemIcon)(({theme}) => ({
    backgroundColor: theme.palette.tertiary.main,
    borderRadius: '12px',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12px',
    '& img': {
      width: '20px',
      height: '20px',
    },
  }));

  const renderCell = (column, row) => {
    const value = row[column.key];
    // console.log(row)
    if (!useSpecialRendering) {
      return value;
    }

    if (column.key === 'day' && row.isToday) {
      return <UnderlinedBoldContent>{value}</UnderlinedBoldContent>;
    }

    if (column.key.startsWith('Production')) {
      const statusKey = `${column.key}-status`;
      return <PillContent variant={row[statusKey]}>{value}</PillContent>;
    }

    return value;
  };

  /**
   * renderConfig object can optionally specify how to render a row background color. Use this example object
   * here to map key, and key values to particular colors in the UI. See <ProductionJob/> component to see how
   * it is used.
   *
   * const renderConfig = {
   *   rowColorConfig: {
   *     key: 'status',
   *     colorMap: (theme) => ({
   *       done: theme.palette.success.light,
   *       late: theme.palette.error.light,
   *       'in-progress': theme.palette.warning.light,
   *       cancelled: theme.palette.grey[200]
   *     })
   *   }
   * };
   */
  const getRowColor = (row) => {
    if (!renderConfig?.rowColorConfig) return 'white'
    const {key, colorMap} = renderConfig.rowColorConfig;
    const value = row[key];
    const color = colorMap[value]
    console.log("value", value, color)

    return color || 'white';
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        marginBottom=".75rem"
        marginTop="2rem"
        spacing={2}
      >
        {/* Left column for Add New Button */}
        <Grid item xs={4}>
          {onAddText && (
            <Button
              variant="contained"
              onClick={onAddClick}
              disabled={isNew}
              sx={{
                borderRadius: '12px',
                padding: '8px 28px',
                minHeight: '48px',
                textTransform: 'none'
              }}
            >
              {onAddText}
            </Button>
          )}
        </Grid>

        {/* Center column for Title */}
        <Grid item xs={4}>
          {titleText && (
            <Typography
              variant="h1"
              sx={{
                textAlign: 'center',
                fontFamily: 'Raleway',
                fontSize: '32px',
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
              {titleText}
            </Typography>
          )}
        </Grid>

        {/* Right column for Search Field */}
        <Grid item xs={4} display="flex" justifyContent="flex-end">
          {showSearch && (
            <TextField
              placeholder={searchText}
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search/>
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '350px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  '& fieldset': {
                    border: 'none',
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '16px 14px',
                  }
                }
              }}
            />
          )}
        </Grid>
      </Grid>

      <StyledTableContainer component={Paper}>
        <StyledTable>
          <TableHead>
            <TableRow>
              {visibleColumns.map((column, index) => (
                <StyledHeaderCell
                  key={column.key}
                  isFirst={index === 0}
                  isLast={index === visibleColumns.length - 1}
                >
                  {column.header}
                </StyledHeaderCell>
              ))}
              <StyledHeaderCell isLast>Actions</StyledHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  backgroundColor: getRowColor(row)
                }}
              >
                {visibleColumns.map((column, cellIndex) => (
                  <StyledBodyCell
                    key={column.key}
                    isFirst={cellIndex === 0}
                    isLast={cellIndex === visibleColumns.length - 1}
                  >
                    {renderCell(column, row)}
                  </StyledBodyCell>
                ))}
                <StyledBodyCell isLast>
                  <IconButton
                    onClick={(e) => handleMenuClick(e, row)}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#F5F8FA',
                        '& .MuiSvgIcon-root': {
                          color: theme.palette.tertiary.main,
                        }
                      },
                      borderRadius: '8px',
                    }}
                  >
                    <MoreHoriz sx={{
                      color: selectedRow === row ? theme.palette.tertiary.main : '#666666',
                      fontSize: '28px'
                    }}/>
                  </IconButton>
                </StyledBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      <Stack
        spacing={2}
        className="h-14 flex text-center w-full justify-center"
        sx={{
          '& .MuiPagination-ul': {
            margin: 0,
            padding: 0,
            '& .MuiPaginationItem-root': {
              margin: 0,
              padding: 0
            }
          },
          marginBottom: '1rem'
        }}
      >
        {isNew || !showPagination ?

          <></>
          :
          <Pagination
            count={totalPages}
            page={currentPage}
            siblingCount={1}
            onChange={handlePageChange}
            // onChange={(e, page) => setCurrentPage(page)}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                components={{
                  previous: () => (
                    <div
                      className="bg-BtnBg px-6 py-3 rounded-xl flex items-center gap-1 hover:bg-opacity-80 transition-all mr-auto">
                      <ArrowBack sx={{fontSize: 12, color: "#fff"}}/>
                      <span className="text-base font-normal text-BtnText">
                Previous
              </span>
                    </div>
                  ),
                  next: () => (
                    <div
                      className="bg-BtnBg px-6 py-3 rounded-xl flex items-center gap-1 hover:bg-opacity-80 transition-all ml-auto">
              <span className="text-base font-normal text-BtnText">
                Next
              </span>
                      <ArrowForward sx={{fontSize: 12, color: "#fff"}}/>
                    </div>
                  ),
                }}
              />
            )}
          />
        }

      </Stack>

      {clickedRowPos && (
        <div
          className="fixed z-50"
          style={{
            left: clickedRowPos.x,
            top: clickedRowPos.y,
          }}
        >
          <StyledMenuList>
            {getMenuItems().map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  item.handler(selectedRow);
                  setClickedRowPos(null);
                }}
              >
                <StyledListItemIcon>
                  <img src={item.icon} alt={item.label}/>
                </StyledListItemIcon>
                {item.label}
              </MenuItem>
            ))}
          </StyledMenuList>
        </div>
      )}
    </>
  );
});

export default CustomTable;