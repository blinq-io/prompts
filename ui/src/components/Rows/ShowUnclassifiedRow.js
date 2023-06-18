import { useState } from "react";
import TableRow from "../../UI/TableRow";
import { BackdropDiv, ModelDiv } from "../../styles/components/popup.style";
import CreateTemplate from "../CreateTemplate";

const ShowUnclassifiedRow = ({ data, onRowOut }) => {
  const [active, setActive] = useState(false);

  return (
    <div>
      <BackdropDiv onClick={onRowOut} />
      {!active ? (
        <ModelDiv background="linear-gradient(72.2deg, #ffffff 0%, #ffffff 100%);">
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
          <button
            onClick={() => setActive(true)}
            className="font-semibold pt-5 pl-3 hover:text-slate-700 duration-100"
          >
            Add classification
          </button>
        </ModelDiv>
      ) : (
        <CreateTemplate promptId={data.id} prompt={data.prompt} />
      )}
    </div>
  );
};

export default ShowUnclassifiedRow;
