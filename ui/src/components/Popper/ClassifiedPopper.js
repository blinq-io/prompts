import { useState } from "react";
import TableRow from "../../UI/TableRow";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Button from "@mui/material/Button";
import ShowClassifiedRow from "../Rows/ShowClassifiedRow";

const ClassifiedPopper = ({ open, anchorEl, data }) => {
  const [table, setTable] = useState(null);
  const [scrollX, setScrollX] = useState(false);
  const [scrollY, setScrollY] = useState(false);

  const handleOnPromptClick = () => {
    const prompt = (
      <tbody>
        <TableRow text="Prompts" bold={true} />
        {data.prompt.map((pmt, index) => {
          return (
            <tr>
              <TableRow
                key={`prompt ${index}`}
                text={`${index + 1}. ${pmt.role.toUpperCase()}: ${pmt.content}`}
              />
            </tr>
          );
        })}
      </tbody>
    );
    setScrollY(true);
    setTable(prompt);
  };

  const handleOnRegexClick = () => {
    const regex = (
      <tbody>
        <TableRow text="Regexs" bold={true} />
        {data.regex.map((reg, index) => {
          return (
            <tr>
              <TableRow key={`regex ${index}`} text={`${index + 1}. ${reg}`} />
            </tr>
          );
        })}
      </tbody>
    );

    setTable(regex);
  };

  const handleOnParamsClick = () => {
    const params = (
      <tbody>
        <TableRow text="Params" bold={true} />
        {data.params.data.map((listparam, index) => {
          let paramArray = "[";
          listparam.forEach((param) => {
            paramArray += param + ", ";
          });
          paramArray = paramArray.slice(0, -2);
          paramArray += "]";
          return (
            <tr>
              <TableRow
                key={`params ${index}`}
                text={`${index + 1}. ${paramArray}`}
              />
            </tr>
          );
        })}
      </tbody>
    );

    setTable(params);
  };

  const handleOnGroupsClick = () => {
    const groups = (
      <tbody>
        <TableRow text="Groups" bold={true} />
        {data.groups.data.map((group, index) => {
          return (
            <tr>
              <TableRow bold={true} text={`Prompt ${index + 1}:`} />
              {Object.keys(group).map((key) => {
                return (
                  <TableRow
                    key={`group ${index}`}
                    text={`${key}: ${group[key]}`}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
    setScrollX(true);
    setScrollY(true);
    setTable(groups);
  };

  const handleOnResponseClick = () => {
    const res = !data.response.data.choices[0].message
      ? data.response.data.choices[0].text
      : data.response.data.choices[0].message.content;
    const response = (
      <tbody>
        <TableRow text="Response" bold={true} />
        <tr>
          <TableRow text={res} />
        </tr>
      </tbody>
    );
    setScrollY(true);
    setTable(response);
  };

  const onRowOut = () => {
    setTable(null);
    setScrollX(false);
    setScrollY(false);
  };

  return (
    <div>
      {table !== null && (
        <ShowClassifiedRow
          onRowOut={onRowOut}
          scrollx={scrollX}
          scrolly={scrollY}
        >
          {table}
        </ShowClassifiedRow>
      )}
      <Popper
        open={open.open}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Button onClick={handleOnPromptClick}>Prompt</Button>
              <Button onClick={handleOnRegexClick}>Regex</Button>
              <Button onClick={handleOnParamsClick}>Parameters</Button>
              <Button onClick={handleOnGroupsClick}>Groups</Button>
              <Button onClick={handleOnResponseClick}>Response</Button>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
};

export default ClassifiedPopper;
