import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const STORAGE_KEY = "pivotTableData";

const initialData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { country: "Country 1", gender: "Male", ageGroup: "20-40" },
  // ... (other data)
];

const PivotTable = () => {
  const [rowData, setRowData] = useState(initialData);
  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Country", field: "country", editable: true },
    { headerName: "Gender", field: "gender", editable: true },
    { headerName: "Age Group", field: "ageGroup", editable: true },
  ]);

  const [totalRow, setTotalRow] = useState({
    country: "Total",
    gender: "",
    ageGroup: "",
  });

  const defaultColDef = {
    flex: 1,
    minWidth: 150,
    editable: true,
  };

  useEffect(() => {
    updateTotalRow();
    saveDataToLocalStorage();
  }, [columnDefs, rowData]);

  const updateTotalRow = () => {
    const updatedTotalRow = { ...totalRow };
    columnDefs.forEach((column) => {
      if (
        column.field !== "country" &&
        column.field !== "ageGroup" &&
        column.field !== "gender"
      ) {
        updatedTotalRow[column.field] = calculateTotal(column.field);
      }
    });
    setTotalRow(updatedTotalRow);
  };

  const addNewColumn = () => {
    const newColumn = {
      headerName: prompt("Enter Column Header Name"),
      field: prompt("Enter Column Field Name"),
      editable: true,
    };

    if (newColumn.headerName && newColumn.field) {
      setColumnDefs((prevColumnDefs) => [...prevColumnDefs, newColumn]);
    } else {
      alert("Please enter valid column details.");
    }
  };

  const addNewRow = () => {
    const newRow = { country: "", gender: "", ageGroup: "" };
    setRowData((prevRowData) => [...prevRowData, newRow]);
  };

  const calculateTotal = (field) => {
    return rowData.reduce((total, row) => {
      if (field !== "ageGroup" && field !== "gender") {
        const value = parseFloat(row[field]) || 0;
        return total + value;
      }
      return total;
    }, 0);
  };

  const saveDataToLocalStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rowData));
  };

  return (
    <div>
      <button onClick={addNewRow}>Add New Row</button>
      <button onClick={addNewColumn}>Add New Column</button>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={[...rowData, totalRow]} // Include the total row in rowData
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default PivotTable;
