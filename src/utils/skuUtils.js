export const genSKUSuffix = (num = 1, length = 4) => {
  const formattedSuffix = num.toString().padStart(length, "0");
  return formattedSuffix;
};
