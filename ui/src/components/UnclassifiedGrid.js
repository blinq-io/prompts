import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import ShowRow from "./ShowRow";

const UnclassifiedGrid = ({ data }) => {
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState({});
  const [rowActive, setRowActive] = useState(false);

  const columns = [
    { field: "prompt", headerName: "Prompt", width: 150 },
    { field: "response", headerName: "Response", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 150 },
  ];

  useEffect(() => {
    const fetch = async () => {
      let res = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}/api/getPromptsCount`
      );
      setCount(res.data);
      handleRows();
    };
    fetch();
  }, []);

  const onRowClick = (params) => {
    setRowData(params.row);
    setRowActive(true);
  };

  const onRowOut = () => {
    setRowData({});
    setRowActive(false);
  };

  const handleRows = async (page = 0) => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URI}/api/getPage?page=${page}`
    );
    setRows(
      res.data.map((prompt) => {
        if (typeof prompt.prompt === "object") {
          prompt.prompt = prompt.prompt.map((item) => {
            const content = `${item.role.toUpperCase()}: ${item.content} `;
            return content;
          });

          return {
            id: prompt._id,
            prompt: prompt.prompt,
            response: prompt.response.data.choices[0].message.content,
            createdAt: prompt.createdAt,
          };
        }

        return {
          id: prompt._id,
          prompt: prompt.prompt,
          response: prompt.response.data.choices[0].text,
          createdAt: prompt.createdAt,
        };
      })
    );
  };

  return count > 0 ? (
    <div className="w-11/12">
      {rowActive && <ShowRow data={rowData} onRowOut={onRowOut} />}
      <DataGrid
        onRowClick={onRowClick}
        rowCount={count}
        paginationMode="server"
        rows={rows}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10]}
        columns={columns}
        onPaginationModelChange={(e) => {
          handleRows(e.page);
        }}
      />
    </div>
  ) : (
    <h1>Nothing to see here!</h1>
  );
};

export default UnclassifiedGrid;
