import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { classifiedActions } from "../../redux/classifiedSlice";
import axios from "axios";
import ClassifiedTabs from "../Navbars/ClassifiedTabs";

const ClassifiedGrid = () => {
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const open = useSelector((state) => state.classifiedSlice.isOpen);
  const rowData = useSelector((state) => state.classifiedSlice.rowData);
  const dispatch = useDispatch();

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    {
      field: "prompt",
      headerName: "Prompt",
      width: 150,
      renderCell: (e) => e.row.prompt.length,
    },
    {
      field: "regex",
      headerName: "Regex",
      width: 150,
      renderCell: (e) => e.row.regex.length,
    },
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
    {
      field: "response",
      headerName: "Response",
      width: 150,
      renderCell: (e) => e.row.response.length,
    },
    {
      field: "updatedAt",
      headerName: "Last updated",
      width: 150,
    },
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
          prompt: {
            length: `Prompt count: ${item.prompt.length}`,
            data: item.prompt,
          },
          regex: {
            length: `Regex count: ${item.regex.length}`,
            data: item.regex,
          },
          params: {
            length: `Param count: ${item.params.length}`,
            data: item.params,
          },
          groups: {
            length: `Group count: ${Object.keys(item.groups).length}`,
            data: item.groups,
          },
          response: {
            length: `Response count: ${item.response.length}`,
            data: item.response,
          },
          updatedAt: item.updatedAt,
          statistics: item.statistics,
        };
      })
    );
  };

  const handleOnRowClick = (row) => {
    dispatch(classifiedActions.setOpen({ isOpen: true }));
    dispatch(classifiedActions.setRowData({ rowData: row.row }));
  };

  return (
    <div className={`${!open ? "w-11/12" : "h-full w-full"}`}>
      {open ? (
        <ClassifiedTabs data={rowData} />
      ) : (
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
      )}
    </div>
  );
};

export default ClassifiedGrid;
