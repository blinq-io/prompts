import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ShowClassifiedRow from "../Rows/ShowClassifiedRow";
import TableRow from "../../UI/TableRow";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ClassifiedTabs = ({ data }) => {
  const [value, setValue] = useState(0);
  const [session, setSession] = useState("");
  const [savedData, setSavedData] = useState(data);

  const handleSelectChange = (event) => {
    const val = event.target.value;
    const end = data.regex.length;
    setSession(val);
    setSavedData((prev) => {
      return data;
    });

    if (val === "all") {
      return;
    }

    setSavedData((prev) => {
      const groups = prev.groups.data.slice(val * end, end * (val + 1));
      const prompt = prev.prompt.slice(val * end, end * (val + 1));
      const response = prev.response[val];

      return {
        groups: { data: groups },
        params: prev.params,
        prompt,
        regex: prev.regex,
        response: [response],
      };
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs variant="fullWidth" value={value} onChange={handleChange}>
          <Tab label="Statistics" />

          <Tab label="Prompts" />
          <Tab label="Regex" />
          <Tab label="Parameters" />
          <Tab label="Groups" />
          <Tab label="Responses" />
        </Tabs>
      </Box>
      <FormControl className="w-80">
        <InputLabel className="mt-2 ml-2" id="select-label">
          Sessions
        </InputLabel>
        <Select
          className="mt-2 ml-2"
          labelId="select-label"
          id="select"
          value={session}
          label="Session"
          onChange={handleSelectChange}
        >
          <MenuItem value="all">All Sessions</MenuItem>
          {savedData.regex.map((reg, index) => {
            return (
              <MenuItem key={`Session${index + 1}`} value={index}>{`Session ${
                index + 1
              }`}</MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <TabPanel value={value} index={0}>
        <ShowClassifiedRow>
          <tbody>
            <TableRow text="Statistics" bold={true} />
          </tbody>
        </ShowClassifiedRow>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ShowClassifiedRow>
          <tbody>
            <TableRow text="Prompts" bold={true} />
            {savedData.prompt.map((pmt, index) => {
              return (
                <tr key={`prompts ${index}`}>
                  <TableRow
                    key={`prompt ${index}`}
                    text={`${index + 1}. ${pmt.role.toUpperCase()}: ${
                      pmt.content
                    }`}
                  />
                </tr>
              );
            })}
          </tbody>
        </ShowClassifiedRow>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ShowClassifiedRow>
          <tbody>
            <TableRow text="Regexs" bold={true} />
            {savedData.regex.map((reg, index) => {
              return (
                <tr key={`regexes ${index}`}>
                  <TableRow
                    key={`regex ${index}`}
                    text={`${index + 1}. ${reg}`}
                  />
                </tr>
              );
            })}
          </tbody>
        </ShowClassifiedRow>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ShowClassifiedRow>
          <tbody>
            <TableRow text="Params" bold={true} />
            {savedData.params.data.map((listparam, index) => {
              let paramArray = "[";
              listparam.forEach((param) => {
                paramArray += param + ", ";
              });
              paramArray = paramArray.slice(0, -2);
              paramArray += "]";
              return (
                <tr key={`parameters ${index}`}>
                  <TableRow
                    key={`params ${index}`}
                    text={`${index + 1}. ${paramArray}`}
                  />
                </tr>
              );
            })}
          </tbody>
        </ShowClassifiedRow>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ShowClassifiedRow>
          <tbody>
            <TableRow text="Groups" bold={true} />
            {savedData.groups.data.map((group, index) => {
              return (
                <tr key={`grp ${index}`}>
                  <TableRow bold={true} text={`Prompt ${index + 1}:`} />
                  {Object.keys(group).map((key) => {
                    return (
                      <TableRow
                        key={`group ${index}`}
                        text={`${key.toUpperCase()}: ${group[key]}`}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </ShowClassifiedRow>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <ShowClassifiedRow>
          <tbody>
            <TableRow bold={true} text="Responses"></TableRow>

            {savedData.response.map((res, index) => {
              return (
                <tr key={`rs ${index}`}>
                  <TableRow
                    key={`response ${index}`}
                    text={`${index + 1}. ${
                      res.data.choices[0].message.content
                    }`}
                  />
                </tr>
              );
            })}
          </tbody>
        </ShowClassifiedRow>
      </TabPanel>
    </Box>
  );
};

export default ClassifiedTabs;
