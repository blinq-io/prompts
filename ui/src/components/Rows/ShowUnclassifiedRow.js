import TableRow from "../../UI/TableRow";
import { BackdropDiv, ModelDiv } from "../../styles/popup.style";

const ShowUnclassifiedRow = ({ data, onRowOut }) => {
  return (
    <div>
      <BackdropDiv onClick={onRowOut} />
      <ModelDiv background="linear-gradient(72.2deg, #39454c 0%, #64757e 100%);">
        <table className="border-collapse table-auto w-full text-sm">
          <tbody>
            <tr>
              <TableRow text="Prompt" bold={true} />
              <TableRow text={data.prompt} />
            </tr>
            <tr>
              <TableRow text="Response" bold={true} />
              <TableRow text={data.response} />
            </tr>
            <tr>
              <TableRow bold={true} text="Created At" />
              <TableRow text={data.createdAt} />
            </tr>
          </tbody>
        </table>
      </ModelDiv>
    </div>
  );
};

export default ShowUnclassifiedRow;
