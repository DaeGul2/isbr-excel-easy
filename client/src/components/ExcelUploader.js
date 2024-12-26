import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import SheetSelector from "./SheetSelector";
import Spinner from "react-bootstrap/Spinner";

function ExcelUploader() {
  const [sheets, setSheets] = useState([]);
  const [fileData, setFileData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setLoading(true); // 로딩 시작
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const rawSheetNames = Array.from(new Set(workbook.SheetNames)); // 중복된 시트 제거
  
      const rawData = {};
      rawSheetNames.forEach((name) => {
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
  
        if (sheetData.length > 0) {
          // 중복 컬럼 제거
          rawData[name] = sheetData.map((row) =>
            Object.keys(row).reduce((acc, key) => {
              if (!acc.hasOwnProperty(key)) {
                acc[key] = row[key];
              }
              return acc;
            }, {})
          );
        }
      });
  
      const filteredSheetNames = rawSheetNames.filter(
        (name) => rawData[name]?.length > 0
      );
  
      setFileData(rawData);
      setSheets(filteredSheetNames);
      setLoading(false); // 로딩 종료
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
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>데이터 처리 중입니다. 잠시만 기다려주세요...</p>
        </div>
      )}
      {!loading && sheets.length > 0 && (
        <SheetSelector
          sheets={sheets}
          fileData={fileData}
          setSelectedData={setSelectedData}
        />
      )}
      {Object.keys(selectedData).length > 0 && !loading && (
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
