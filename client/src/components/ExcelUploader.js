import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import SheetSelector from "./SheetSelector";

function ExcelUploader() {
  const [sheets, setSheets] = useState([]);
  const [fileData, setFileData] = useState({});
  const [selectedData, setSelectedData] = useState({});

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const rawSheetNames = workbook.SheetNames;

      // 데이터를 시트별로 변환
      const rawData = {};
      rawSheetNames.forEach(
        (name) => (rawData[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name]))
      );

      // 빈 시트 제외
      const filteredSheetNames = rawSheetNames.filter(
        (name) => rawData[name].length > 0
      );

      setFileData(rawData);
      setSheets(filteredSheetNames);
    };
    reader.readAsBinaryString(file);
  };

  const handleExtraction = () => {
    const workbook = XLSX.utils.book_new();
    Object.keys(selectedData).forEach((sheetName) => {
      const rows = selectedData[sheetName];
      const worksheet = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "ExtractedData.xlsx");
  };

  return (
    <div className="mt-3">
      <input
        type="file"
        className="form-control"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />
      {sheets.length > 0 && (
        <SheetSelector
          sheets={sheets}
          fileData={fileData}
          setSelectedData={setSelectedData}
        />
      )}
      {Object.keys(selectedData).length > 0 && (
        <button
          className="btn btn-primary mt-3"
          onClick={handleExtraction}
        >
          해당 정보들 추출하기
        </button>
      )}
    </div>
  );
}

export default ExcelUploader;
