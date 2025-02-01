import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ExcelUploader from './components/ExcelUploader/ExcelUploader';
import TextToExcel from './components/TextToExcel/TextToExcel';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/excel-uploader" element={<ExcelUploader />} />
          <Route path="/text-to-excel" element={<TextToExcel />} />
          <Route path="/" element={<ExcelUploader />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
