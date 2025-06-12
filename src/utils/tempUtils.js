// Function to convert temperature between Celsius and Fahrenheit
function convertTemperature(value, type) {
  let result;
  if (type === "C") {
    result = (value * 9) / 5 + 32;
  } else if (type === "F") {
    result = ((value - 32) * 5) / 9;
  } else {
    throw new Error("Invalid conversion type");
  }
  return Math.round(result * 100) / 100;
}

// Export the function
export { convertTemperature };
