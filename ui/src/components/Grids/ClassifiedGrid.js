import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import axios from "axios";
import ShowClassifiedRow from "../Rows/ShowClassifiedRow";
import NavBar from "../Navbars/NavBar";

const ClassifiedGrid = () => {
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState({});
  const [rowActive, setRowActive] = useState(false);
  const columns = [
    { field: "regex", headerName: "Regex", width: 150 },
    {
      field: "list",
      headerName: "List",
      width: 150,
      renderCell: (e) => e.row.list.length,
    },
  ];

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}/api/getRegexCount`
      );
      setCount(res.data);
      handleRows();
    };
    fetch();
  }, []);

  const handleRows = async (page = 0) => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URI}/api/getClassifiedPage?page=${page}`
    );
    setRows(
      res.data.map((item) => {
        return {
          id: item._id,
          regex: item.regex,
          list: {
            length: `List count: ${Object.values(item.list[0])[0].length}`,
            data: item.list,
          },
          response: item.response,
        };
      })
    );
  };

  const handleOnRowClick = (e) => {
    setRowData(e.row);
    setRowActive(true);
  };

  const onRowOut = () => {
    setRowData({});
    setRowActive(false);
  };

  //<NavBar />;

  return (
    <div className="w-11/12">
      {rowActive && <ShowClassifiedRow data={rowData} onRowOut={onRowOut} />}
      <DataGrid
        rows={rows}
        rowCount={count}
        columns={columns}
        paginationMode="server"
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10]}
        onPaginationModelChange={(e) => handleRows(e.page)}
        onRowClick={handleOnRowClick}
      />
    </div>
  );
};

export default ClassifiedGrid;
