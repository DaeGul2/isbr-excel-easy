import React, { useState } from "react";

function SheetSelector({ sheets, fileData, setSelectedData }) {
  const [selectedSheets, setSelectedSheets] = useState([]);
  const [columnsToSelect, setColumnsToSelect] = useState({});

  const handleSheetChange = (sheetName, isChecked) => {
    const updatedSheets = isChecked
      ? [...selectedSheets, sheetName]
      : selectedSheets.filter((name) => name !== sheetName);
    setSelectedSheets(updatedSheets);
  };

  const handleColumnChange = (sheetName, columnName, isChecked) => {
    const updatedColumns = { ...columnsToSelect };

    // 초기화 및 값 확인
    updatedColumns[sheetName] = updatedColumns[sheetName] || [];
    updatedColumns[sheetName] = isChecked
      ? [...updatedColumns[sheetName], columnName]
      : updatedColumns[sheetName].filter((col) => col !== columnName);
    setColumnsToSelect(updatedColumns);

    // 선택된 데이터 업데이트
    const updatedSelectedData = {};
    Object.keys(updatedColumns).forEach((sheet) => {
      if (!fileData[sheet] || fileData[sheet].length === 0) return; // 빈 데이터 방어
      updatedSelectedData[sheet] = fileData[sheet].map((row) =>
        Object.keys(row)
          .filter((key) => updatedColumns[sheet].includes(key))
          .reduce((acc, key) => {
            acc[key] = row[key];
            return acc;
          }, {})
      );
    });
    setSelectedData(updatedSelectedData);
  };

  return (
    <div className="mt-3">
      {sheets.map((sheetName) => (
        <div key={sheetName} className="card my-3">
          <div className="card-header">
            <input
              type="checkbox"
              onChange={(e) =>
                handleSheetChange(sheetName, e.target.checked)
              }
            />
            <span className="ms-2">{sheetName}</span>
          </div>
          {selectedSheets.includes(sheetName) && (
            <div className="card-body">
              {fileData[sheetName] && fileData[sheetName][0] ? (
                Object.keys(fileData[sheetName][0]).map((columnName) => (
                  <div key={columnName} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={(e) =>
                        handleColumnChange(sheetName, columnName, e.target.checked)
                      }
                    />
                    <label className="form-check-label">{columnName}</label>
                  </div>
                ))
              ) : (
                <p>컬럼이 없습니다.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SheetSelector;
