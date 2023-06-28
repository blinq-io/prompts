import { useState } from "react";
import axios from "axios";
import TableRow from "../../UI/TableRow";
import { BackdropDiv, ModelDiv } from "../../styles/components/popup.style";
import CreateTemplate from "../popups/CreateTemplate";
import { Button, Stack } from "@mui/material";

const ShowUnclassifiedRow = ({ data, onRowOut }) => {
  const [active, setActive] = useState(false);

  const handleOnDelete = async () => {
    await axios.delete(`${process.env.REACT_APP_SERVER_URI}/api/deletePrompt`, {
      data: { id: data.id },
    });

    window.location.reload();
  };

  return (
    <div>
      <BackdropDiv onClick={onRowOut} />
      {!active ? (
        <ModelDiv background="linear-gradient(72.2deg, #ffffff 0%, #ffffff 100%);">
          <Stack direction="row" spacing={2} className="mb-3">
            <Button
              variant="outlined"
              onClick={() => setActive(true)}
              className="font-semibold pb-3 pl-3 hover:text-slate-700 duration-100"
            >
              + Add classification
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleOnDelete}
              className="font-semibold pb-4 pl-3.5 hover:text-slate-700 duration-100"
            >
              - Delete
            </Button>
          </Stack>
          <hr />
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
      ) : (
        <CreateTemplate promptId={data.id} prompt={data.prompt} />
      )}
    </div>
  );
};

export default ShowUnclassifiedRow;
