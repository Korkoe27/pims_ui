import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const downloadReport = (data, filename = "report.xlsx") => {
  if (!data || !Array.isArray(data)) {
    alert("No data available to download.");
    return;
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, filename);
};
