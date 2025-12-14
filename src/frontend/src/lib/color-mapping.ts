export const getColorName = (hex: string): string => {
  const colorMap: Record<string, string> = {
    "#000000": "Đen",
    "#FFFFFF": "Trắng",
    "#808080": "Xám",
    "#FF0000": "Đỏ",
    "#0000FF": "Xanh dương",
    "#000080": "Xanh Navy",
    "#00FF00": "Xanh lá",
    "#FFFF00": "Vàng",
    "#FFA500": "Cam",
    "#800080": "Tím",
    "#FFC0CB": "Hồng",
    "#A52A2A": "Nâu",
    "#F5F5DC": "Kem",
  };

  return colorMap[hex.toUpperCase()] || hex;
};
