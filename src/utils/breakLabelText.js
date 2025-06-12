export const breakLabelText = (label) => {
  const firstSpaceIndex = label.indexOf(" ");
  if (firstSpaceIndex !== -1) {
    const firstLine = label.substring(0, firstSpaceIndex);
    const secondLine = label.substring(firstSpaceIndex + 1);
    return `${firstLine}<br />${secondLine}`;
  }
  return label;
};
