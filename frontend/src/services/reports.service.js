import api from "./api";

/* Get low stock report as JSON */
const getLowStockReport = async () => {
  const response = await api.get("/reports/low-stock");
  return response.data;
};

/* Get stock movement report as JSON, with optional filters */
const getStockMovementReport = async ({ startDate, endDate, productId }) => {
  const response = await api.get("/reports/stock-movements", {
    params: { startDate, endDate, productId },
  });
  return response.data;
};

/* Download the low stock report as a CSV file */
const downloadLowStockCSV = async () => {
  const response = await api.get("/reports/low-stock/csv", {
    responseType: "blob",
  });
  triggerDownload(response.data, "low-stock-report.csv");
};

/* Download the stock movement report as a CSV file */
const downloadStockMovementCSV = async ({ startDate, endDate, productId }) => {
  const response = await api.get("/reports/stock-movements/csv", {
    params: { startDate, endDate, productId },
    responseType: "blob",
  });
  triggerDownload(response.data, "stock-movement-report.csv");
};

/* Helper: takes a file blob and makes the browser save it,
   using a temporary invisible link click — the standard trick
   for triggering downloads from JS. */
const triggerDownload = (blobData, filename) => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};

export {
  getLowStockReport,
  getStockMovementReport,
  downloadLowStockCSV,
  downloadStockMovementCSV,
};