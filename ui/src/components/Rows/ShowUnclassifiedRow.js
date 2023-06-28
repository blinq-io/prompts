import { useState } from "react";
import axios from "axios";
import TableColumn from "../../UI/TableColumn";
import { BackdropDiv, ModelDiv } from "../../styles/components/popup.style";
import CreateTemplate from "../popups/CreateTemplate";
import { Button, Stack, Collapse } from "@mui/material";

const ShowUnclassifiedRow = ({ data, onRowOut }) => {
  const [active, setActive] = useState(false);
  const [expand, setExpand] = useState(
    new Array(data.prompt.length).fill(false)
  );
  const handleOnDelete = async () => {
    await axios.delete(`${process.env.REACT_APP_SERVER_URI}/api/deletePrompt`, {
      data: { id: data.id },
    });

    window.location.reload();
  };

  const handleOnExpand = (e, index) => {
    const expandArr = expand;
    expandArr[index] = !expandArr[index];
    setExpand((prev) => [...expandArr]);
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
                <TableColumn text="Prompt" bold={true} />
                {data.prompt.map((prompt, index) => {
                  return (
                    <tr key={prompt + index}>
                      <Collapse in={!expand[index]}>
                        <TableColumn
                          handleOnExpand={(e) => handleOnExpand(e, index)}
                          pointer
                          text={`Expand prompt ${index + 1}`}
                          expanded={expand[index]}
                        />
                      </Collapse>
                      <Collapse in={expand[index]}>
                        <TableColumn
                          handleOnExpand={(e) => handleOnExpand(e, index)}
                          pointer
                          text={prompt}
                          expanded={expand[index]}
                        />
                      </Collapse>
                    </tr>
                  );
                })}
              </tr>
              <tr>
                <TableColumn text="Response" bold={true} />
                <TableColumn text={data.response} />
              </tr>
              <tr>
                <TableColumn bold={true} text="Created At" />
                <TableColumn text={data.createdAt} />
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
