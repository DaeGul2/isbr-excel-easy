import React from "react";
import ExcelUploader from "./components/ExcelUploader";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Excel 데이터 추출기</h1>
      <ExcelUploader />
    </div>
  );
}

export default App;
