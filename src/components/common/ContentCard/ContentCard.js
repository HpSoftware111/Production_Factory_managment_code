import React, {useState} from 'react';
import {Card, CardContent, Typography, Box, Divider, Select, MenuItem} from '@mui/material';
import PropTypes from 'prop-types';

const ContentCard = (
  {
    title,
    children,
    showDateDropdown = false,
    whiteBackground = false,
    icon = null,
    iconTitle = null,
  }) => {

  const [selectedDate, setSelectedDate] = useState('year')
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value)
  }
  const dateOptions = [
    {value: 'year', label: 'year'},
    {value: 'quarter', label: 'quarter'},
    {value: 'month', label: 'month'},
  ];

  return (
    <Card
      sx={{
        backgroundColor: whiteBackground ? '#FFFFFF' : '#F4F4F4',
        boxShadow: 'none',
        borderRadius: '20px',
        padding: '20px',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography variant="h1" sx={{color: 'primary.main'}}>
          {title}
        </Typography>
        {showDateDropdown && (
          <Select
            value={selectedDate}
            onChange={handleDateChange}
            size="small"
            sx={{
              minWidth: 120,  // Set a fixed minimum width
              height: 20,     // Set a fixed height

            }}
          >
            {dateOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
        {(iconTitle || icon ) && (
          <Box>
            {iconTitle} {icon}
          </Box>
        )}
      </Box>

      <Divider sx={{mb: 3, bgcolor: 'primary.main'}}/>

      <Box
        sx={{
          flex: 1,
          minHeight: '350px',
          // maxHeight: '350px',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '5px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '5px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
          },
        }}
      >
        {React.Children.map(children, child =>
          React.cloneElement(child, {selectedDate})
        )}
      </Box>
    </Card>
  );
};


export default ContentCard;