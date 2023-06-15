import { useEffect, useState } from "react";
import TableRow from "../../UI/TableRow";
import { BackdropDiv } from "../../styles/popup.style";
import { ModelDiv } from "../../styles/popup.style";

const ShowClassifiedRow = ({ data, onRowOut }) => {
  const keys = Object.keys(data.list.data[0]);
  const values = Object.values(data.list.data[0]);
  const [row, setRows] = useState([]);

  useEffect(() => {
    const arr = [];

    for (let i = 0; i < values[0].length; i++) {
      arr.push(
        <tr key={i}>
          {keys.map((key) => {
            return <TableRow key={key} text={data.list.data[0][key][i]} />;
          })}
          {<TableRow text={data.response[i]} />}
        </tr>
      );
    }
    setRows(arr);
  }, []);

  return (
    <div>
      <BackdropDiv onClick={onRowOut} />
      <ModelDiv background="linear-gradient(72.2deg, #39454c 0%, #64757e 100%);">
        <table className="border-collapse table-auto w-full text-sm">
          <tbody>
            <tr>
              {keys.map((key) => {
                return <TableRow key={key} text={key} bold={true} />;
              })}
              <TableRow text="response" bold={true} />
            </tr>
            {row}
          </tbody>
        </table>
      </ModelDiv>
    </div>
  );
};

export default ShowClassifiedRow;
