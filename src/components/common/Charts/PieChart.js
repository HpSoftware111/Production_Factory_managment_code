import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Tooltip } from "@mui/material";

const StarRating = ({ rating }) => {
  const totalStars = 5; // Changed to 5 stars total
  if (rating === 2) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <StarIcon sx={{ color: "inherit" }} />
        <Typography
          sx={{
            margin: "0 4px",
            fontSize: "24px", // Increase font size
            fontWeight: "bold", // Make it bold
            lineHeight: 1,
          }}
        >
          -
        </Typography>
        <Box sx={{ display: "flex" }}>
          <StarIcon sx={{ color: "inherit" }} />
          <StarIcon sx={{ color: "inherit" }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {[...Array(totalStars)].map((_, index) => (
        <Box key={index}>
          {index < rating ? (
            <StarIcon sx={{ color: "inherit" }} />
          ) : (
            <StarBorderIcon sx={{ color: "inherit" }} />
          )}
        </Box>
      ))}
    </Box>
  );
};

const SimplePieChart = ({ data: { unitMeasure, data }, showStars = false }) => {
  const theme = useTheme();

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.tertiary.main,
    theme.palette.quaternary.main,
    theme.palette.quinary.main,
  ];

  const formatValue = (value) => {
    switch (unitMeasure.toUpperCase()) {
      case "USD":
        return `$${value.toLocaleString()}`;
      case "PCT":
        return `${value}%`;
      case "LBS":
        return `${value.toLocaleString()} lbs`;
      default:
        return `${value.toLocaleString()} ${unitMeasure}`;
    }
  };

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const formatLabel = (entry) => {
    const percentage = (entry.value / total) * 100;
    return `${percentage.toFixed(0)}%`;
  };

  // Function to convert text ratings to numbers
  const getStarRating = (name) => {
    switch (name.toLowerCase()) {
      case "awesome":
        return 5;
      case "good":
        return 4;
      case "ok":
        return 3;
      case "bad":
        return 2;
      default:
        return 0;
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-around" }}>
      <Box
        sx={{
          width: "60%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveContainer width="100%" height={350}>
          <PieChart width={350} height={350}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              label={formatLabel}
              fontSize={"20px"}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatValue(value)} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box
        sx={{
          width: "35%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        {data.map((entry, index) => (
          <Box
            key={`label-${index}`}
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "10px",
                height: "40px",
                borderRadius: "5px",
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: "1rem",
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {showStars ? (
                <Box
                  sx={{
                    color: COLORS[index % COLORS.length],
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <StarRating rating={getStarRating(entry.name)} />
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="label1"
                    sx={{
                      color: COLORS[index % COLORS.length],
                      textAlign: "left",
                    }}
                  >
                    {entry.name}
                  </Typography>
                  {entry.tooltip && (
                    <Tooltip title={entry.tooltip}>
                      <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                        <HelpOutlineIcon
                          fontSize="small"
                          sx={{ color: COLORS[index % COLORS.length] }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )}
              <Typography
                variant="label2"
                sx={{
                  color: COLORS[index % COLORS.length],
                  width: "100%",
                  textAlign: "left",
                  marginTop: "-0.5rem",
                }}
              >
                {formatValue(entry.value)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SimplePieChart;
