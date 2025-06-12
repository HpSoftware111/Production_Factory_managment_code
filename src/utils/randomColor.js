export const randomColor = (index) => {
  const colors = [
    "#A1DAB4",
    "#8C96C6",
    "#F768A1",
    "#FD8D3C",
    "#41B6C4",
    "#7A0177",
  ];
  return colors[index % colors.length];
};
