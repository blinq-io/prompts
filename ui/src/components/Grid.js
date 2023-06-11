import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const Grid = ({ data }) => {
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);

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

      res = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}/api/getPage?page=0`
      );
      setRows(
        res.data.map((prompt) => {
          return {
            id: prompt._id,
            prompt: prompt.prompt,
            response: prompt.response,
            createdAt: prompt.createdAt,
          };
        })
      );
    };
    fetch();
  }, []);

  return (
    <div className="w-11/12">
      <DataGrid
        rowCount={count}
        paginationMode="server"
        rows={rows}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        columns={columns}
        onPaginationModelChange={async (e) => {
          let res = await axios.get(
            `${process.env.REACT_APP_SERVER_URI}/api/getPage?page=${e.page}`
          );
          setRows(
            res.data.map((prompt) => {
              return {
                id: prompt._id,
                prompt: prompt.prompt,
                response: prompt.response,
                createdAt: prompt.createdAt,
              };
            })
          );
        }}
      />
    </div>
  );
};

export default Grid;
