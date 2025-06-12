import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import PropTypes from 'prop-types';

const InfoCard = ({
                    icon,
                    primaryText,
                    secondaryText,
                    variant = 'filled',
                    iconColor = 'white',
                    number = null,
                    onClick, // Add onClick prop
                  }) => {
  const cardStyles = {
    filled: {
      backgroundColor: '#CCD7E4',
      boxShadow: 'none',
      borderRadius: '20px',
    },
    outlined: {
      backgroundColor: 'white',
      boxShadow: '-20px 23px 100.3px rgba(0, 0, 0, 0.08)',
      borderRadius: '20px',
    },
  };

  const colorStyles = {
    white: {
      bgcolor: 'white',
      color: '#1479ff',
    },
    green: {
      bgcolor: 'rgba(0, 182, 18, 0.1)',
      color: '#00B612',
    },
    yellow: {
      bgcolor: 'rgba(234, 225, 0, 0.1)',
      color: '#EAE100',
    },
    red: {
      bgcolor: 'rgba(255, 0, 0, 0.1)',
      color: '#FF0000',
    },
  };

  const iconSize = 50;

  return (
    <Card
      sx={{
        ...cardStyles[variant],
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        position: 'relative',
        minHeight: `${iconSize + 32}px`,
        cursor: onClick ? 'pointer' : 'default', // Add cursor pointer when clickable
        transition: 'transform 0.2s ease-in-out', // Add smooth transition
        '&:hover': onClick ? {
          transform: 'scale(1.02)', // Add subtle scale effect on hover
          boxShadow: variant === 'outlined'
            ? '-20px 23px 100.3px rgba(0, 0, 0, 0.12)'
            : 'none', // Enhanced shadow on hover for outlined variant
        } : {},
      }}
      onClick={onClick} // Add onClick handler
    >
      {/* Rest of your component remains the same */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
        <Avatar
          sx={{
            ...colorStyles[iconColor],
            width: iconSize,
            height: iconSize,
          }}
        >
          {icon ? (
            <img src={icon} alt="icon" />
          ) : null}
        </Avatar>
      </Box>
      <CardContent
        sx={{
          padding: '0 !important',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: secondaryText ? 'center' : 'center',
          flexGrow: 1,
        }}
      >
        <Typography variant="body1" component="div">
          {primaryText}
        </Typography>
        {secondaryText && (
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {secondaryText}
          </Typography>
        )}
      </CardContent>
      {number !== null && (
        <Avatar
          sx={{
            ...colorStyles[iconColor],
            position: 'absolute',
            right: '16px',
            width: iconSize,
            height: iconSize,
            fontSize: `${iconSize / 2}px`,
            fontWeight: 'bold',
          }}
        >
          {number}
        </Avatar>
      )}
    </Card>
  );
};

InfoCard.propTypes = {
  icon: PropTypes.element.isRequired,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  variant: PropTypes.oneOf(['filled', 'outlined']),
  iconColor: PropTypes.oneOf(['white', 'green', 'yellow', 'red']),
  number: PropTypes.number,
  onClick: PropTypes.func, // Add onClick to PropTypes
};

InfoCard.defaultProps = {
  variant: 'filled',
  iconColor: 'white',
  secondaryText: null,
  number: null,
  onClick: null, // Add onClick to defaultProps
};

export default InfoCard;