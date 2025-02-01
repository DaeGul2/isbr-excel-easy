import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function SheetSelector({ sheets, fileData, setSelectedData }) {
  const [selectedSheets, setSelectedSheets] = useState([]);
  const [columnsToSelect, setColumnsToSelect] = useState({});

  const handleSheetChange = (sheetName, isChecked) => {
    const updatedSheets = isChecked
      ? [...selectedSheets, sheetName]
      : selectedSheets.filter((name) => name !== sheetName);
    setSelectedSheets(updatedSheets);

    // 시트가 선택 해제되면 해당 시트의 컬럼 선택도 초기화
    if (!isChecked) {
      const updatedColumns = { ...columnsToSelect };
      delete updatedColumns[sheetName];
      setColumnsToSelect(updatedColumns);
      updateSelectedData(updatedColumns);
    }
  };

  const handleColumnChange = (sheetName, columnName, isChecked) => {
    if (!fileData[sheetName] || fileData[sheetName].length === 0) return;

    const updatedColumns = { ...columnsToSelect };
    updatedColumns[sheetName] = updatedColumns[sheetName] || [];
    updatedColumns[sheetName] = isChecked
      ? [...updatedColumns[sheetName], columnName]
      : updatedColumns[sheetName].filter((col) => col !== columnName);

    setColumnsToSelect(updatedColumns);
    updateSelectedData(updatedColumns);
  };

  const updateSelectedData = (updatedColumns) => {
    const updatedSelectedData = {};
    Object.keys(updatedColumns).forEach((sheet) => {
      if (!fileData[sheet] || fileData[sheet].length === 0) return;
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
    <Row className="mt-3">
      <Col md={8}>
        <Accordion defaultActiveKey="0">
          {sheets.map((sheetName, index) => (
            <Accordion.Item eventKey={index.toString()} key={sheetName}>
              <Accordion.Header>
                <Form.Check
                  type="checkbox"
                  id={`sheet-${sheetName}`}
                  label={sheetName}
                  onChange={(e) =>
                    handleSheetChange(sheetName, e.target.checked)
                  }
                  className="me-2"
                />
                
              </Accordion.Header>
              {selectedSheets.includes(sheetName) && (
                <Accordion.Body>
                  {fileData[sheetName] && fileData[sheetName][0] ? (
                    Object.keys(fileData[sheetName][0]).map((columnName) => (
                      <Form.Check
                        key={columnName}
                        type="checkbox"
                        id={`column-${sheetName}-${columnName}`}
                        label={columnName}
                        onChange={(e) =>
                          handleColumnChange(
                            sheetName,
                            columnName,
                            e.target.checked
                          )
                        }
                        className="mb-2"
                      />
                    ))
                  ) : (
                    <p className="text-muted">컬럼이 없습니다.</p>
                  )}
                </Accordion.Body>
              )}
            </Accordion.Item>
          ))}
        </Accordion>
      </Col>
      <Col md={4}>
        <Card>
          <Card.Header>선택된 시트 및 컬럼</Card.Header>
          <ListGroup variant="flush">
            {selectedSheets.length === 0 ? (
              <ListGroup.Item>선택된 시트가 없습니다.</ListGroup.Item>
            ) : (
              selectedSheets.map((sheetName) => (
                <ListGroup.Item key={sheetName}>
                  <strong>{sheetName}</strong>
                  {columnsToSelect[sheetName] &&
                  columnsToSelect[sheetName].length > 0 ? (
                    <ul className="mt-2">
                      {columnsToSelect[sheetName].map((columnName) => (
                        <li key={columnName}>{columnName}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">선택된 컬럼이 없습니다.</p>
                  )}
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default SheetSelector;
