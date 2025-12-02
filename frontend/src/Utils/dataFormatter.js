// src/utils/dateFormatter.js
export function formatToDDMMYYYY(dateString) {
  if (!dateString) return "";

  const parts = dateString.split("T")[0].split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
