import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import * as XLSX from 'xlsx';

function TextToExcel() {
  const [text, setText] = useState('');
  const [tableData, setTableData] = useState([]);
  const [maxColumns, setMaxColumns] = useState(0);
  const [option, setOption] = useState('workHistory');
  const [showModal, setShowModal] = useState(false);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleOptionChange = (event) => {
    setOption(event.target.value);
  };

  const handleProcessText = () => {
    const splitLines = text.split('\n').filter(line => line.trim() !== '');
    const linesWithSlash = splitLines.filter(line => line.includes('/'));
    const parsedData = linesWithSlash.map(line => 
      line.split('/').map(part => part.trim())
    );
    const maxCols = parsedData.reduce((max, arr) => Math.max(max, arr.length), 0);
    setMaxColumns(maxCols);
    setTableData(parsedData);
    setShowModal(true);
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };

  const deleteRow = (index) => {
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
  };

  const downloadExcel = () => {
    const fileName = prompt("엑셀 파일명을 입력하세요 (확장자 제외):", "파싱결과");
    if (fileName) {
      const headers = option === 'workHistory' ?
        ['근무자', '근무일자', '근무유형', '근무장소', '근무내용', '프로젝트연번'] :
        ['대상자', '정정요청일자', '요청사유'];
      const extraHeaders = Array.from({ length: maxColumns - headers.length }, () => '기타');
      const fullHeaders = headers.concat(extraHeaders);

      const worksheet = XLSX.utils.json_to_sheet(tableData, { skipHeader: true });
      XLSX.utils.sheet_add_aoa(worksheet, [fullHeaders], { origin: 'A1' });
      
      // Apply style to header
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1"; // Target first row, which is the header
        if (!worksheet[address]) continue;
        worksheet[address].s = {
          font: { bold: true }
        };
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <h2>텍스트 분석 및 엑셀 형식으로 표시</h2>
      <div>
        <div className="form-check">
          <input
            type="radio"
            id="workHistory"
            name="option"
            value="workHistory"
            checked={option === 'workHistory'}
            onChange={handleOptionChange}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="workHistory">휴일근무내역</label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            id="attendanceAdjustment"
            name="option"
            value="attendanceAdjustment"
            checked={option === 'attendanceAdjustment'}
            onChange={handleOptionChange}
            className="form-check-input"
          />
          <label className="form-check-label" htmlFor="attendanceAdjustment">근태기록정정</label>
        </div>
      </div>
      <textarea
        className="form-control"
        rows="10"
        value={text}
        onChange={handleTextChange}
        placeholder="여기에 텍스트를 입력하세요."
      ></textarea>
      <button className="btn btn-primary mt-3" onClick={handleProcessText}>
        텍스트 처리
      </button>

      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>파싱 결과</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered>
            <thead>
              <tr>
                {option === 'workHistory' ?
                  ['근무자', '근무일자', '근무유형', '근무장소', '근무내용', '프로젝트연번'].map((header, index) => (
                    <th key={index}>{header}</th>
                  )) :
                  ['대상자', '정정요청일자', '요청사유'].map((header, index) => (
                    <th key={index}>{header}</th>
                  ))
                }
                {Array.from({ length: maxColumns - (option === 'workHistory' ? 6 : 3) }, (_, i) => <th key={i}>기타</th>)}
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, idx) => (
                    <td key={idx} contentEditable onInput={(e) => updateCell(index, idx, e.currentTarget.textContent)}>{cell}</td>
                  ))}
                  {Array.from({ length: maxColumns - row.length }).map((_, i) => <td key={i}>-</td>)}
                  <td><Button variant="danger" onClick={() => deleteRow(index)}>삭제</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>닫기</Button>
          <Button variant="success" onClick={downloadExcel}>엑셀 다운로드</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TextToExcel;
