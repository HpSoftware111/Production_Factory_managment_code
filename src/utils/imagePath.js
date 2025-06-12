const assetBaseUrl = process.env.REACT_APP_ASSET_URL || "http://localhost:5000";

export const getImagePath = (url) => {
  return url ? (url.includes("http") ? url : `${assetBaseUrl}${url}`) : "";
};
