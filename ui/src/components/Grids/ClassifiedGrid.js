import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import axios from "axios";
import ClassifiedPopper from "../Popper/ClassifiedPopper";

const ClassifiedGrid = () => {
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState({});

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "prompt", headerName: "Prompt", width: 450 },
    { field: "regex", headerName: "Regex", width: 150 },
    {
      field: "pramas",
      headerName: "Parameters",
      width: 200,
      renderCell: (e) => e.row.params.length,
    },
    {
      field: "groups",
      headerName: "Groups",
      width: 150,
      renderCell: (e) => e.row.groups.length,
    },
    { field: "response", headerName: "Response", width: 450 },
  ];

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}/api/getTemplateCount`
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
          name: item.name,
          prompt: item.prompt,
          regex: item.regex,
          params: {
            length: `Param count: ${item.params.length}`,
            data: item.params,
          },
          groups: {
            length: `Group count: ${Object.keys(item.groups).length}`,
            data: item.groups,
          },
          response: item.response,
        };
      })
    );
  };

  const handleOnRowClick = (row, e) => {
    setRowData(row.row);
    if (row.row.name === open.name) {
      setOpen({ open: false, name: "" });
    } else {
      setOpen({ open: true, name: row.row.name });
    }
    setAnchorEl(e.currentTarget);
  };

  return (
    <div className="w-11/12">
      <ClassifiedPopper open={open} anchorEl={anchorEl} data={rowData} />
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
