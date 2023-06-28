import { useState, useEffect } from "react";
import axios from "axios";
import ShowClassifiedRow from "../Rows/ShowClassifiedRow";
import TableRow from "../../UI/TableRow";
import randomBytes from "randombytes";
import {
  Stack,
  Select,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Box,
  Tab,
  Tabs,
} from "@mui/material";

import "../../styles/css/tabs.css";

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
  const [version, setVersion] = useState({
    templates: [
      {
        ...data,
        prompt: data.prompt.data,
        regex: data.regex.data,
        params: data.params.data,
        groups: data.groups.data,
        response: data.response.data,
        ver: 0,
      },
    ],
  });

  const [selectorVal, setSelectorVal] = useState(0);
  useEffect(() => {
    const fetch = async () => {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URI}/api/getVersionByName`,
        {
          name: data.name,
        }
      );
      setVersion(res.data);
      setSelectorVal(data.ver ? data.ver : 0);
    };

    fetch();
  }, [data]);

  const avgMinutes = Math.floor(
    version.templates[selectorVal].statistics.responseTime /
      version.templates[selectorVal].statistics.numOfSessions /
      60000
  );
  const avgSeconds = (
    ((version.templates[selectorVal].statistics.responseTime /
      version.templates[selectorVal].statistics.numOfSessions) %
      60000) /
    1000
  ).toFixed(2);
  const maxMinutes = Math.floor(
    version.templates[selectorVal].statistics.maxResponseTime / 60000
  );
  const maxSeconds = (
    (version.templates[selectorVal].statistics.maxResponseTime % 60000) /
    1000
  ).toFixed(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleOnDelete = async () => {
    await axios.delete(
      `${process.env.REACT_APP_SERVER_URI}/api/deleteTemplate`,
      {
        data: { name: version.name },
      }
    );
    window.location.reload();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs variant="fullWidth" value={value} onChange={handleChange}>
          <Tab label="Statistics" />
          <Tab label="Prompts" />
          <Tab label="Groups" />
          <Tab label="Responses" />
        </Tabs>
      </Box>
      <Stack direction="row" spacing={2} className="my-3 ml-2">
        <FormControl className="w-80">
          <InputLabel id="select-label">Versions</InputLabel>
          <Select
            onChange={(e) => setSelectorVal(Number(e.target.value))}
            value={selectorVal}
            labelId="select-label"
            id="select"
            label="Session"
          >
            {version.templates.map((temp, index) => {
              return (
                <MenuItem
                  key={randomBytes(16).toString("hex")}
                  value={index}
                >{`V${index + 1}`}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button
          onClick={handleOnDelete}
          color="error"
          variant="outlined"
          className="font-semibold"
        >
          Delete Template
        </Button>
      </Stack>

      <div className="overflow-y-auto tab-height border border-1">
        <TabPanel value={value} index={0}>
          <ShowClassifiedRow>
            <tbody>
              <TableRow text="Statistics" bold={true} />
              <tr>
                <TableRow text="Average response time:" bold={true} />
                <TableRow
                  text={`${
                    avgMinutes > 0 ? avgMinutes + " minutes and " : ""
                  }${avgSeconds} seconds`}
                />
              </tr>
              <tr>
                <TableRow text="Total tokens:" bold={true} />
                <TableRow
                  text={`${version.templates[selectorVal].statistics.totalTokens}`}
                />
              </tr>
              <tr>
                <TableRow text="Max response time:" bold={true} />
                <TableRow
                  text={`${
                    maxMinutes > 0 ? maxMinutes + " minutes and " : ""
                  }${maxSeconds} seconds`}
                />
              </tr>
              <tr>
                <TableRow text="Number of sessions:" bold={true} />
                <TableRow
                  text={`${version.templates[selectorVal].statistics.numOfSessions}`}
                />
              </tr>
            </tbody>
          </ShowClassifiedRow>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ShowClassifiedRow>
            <tbody>
              <TableRow text="Prompts" bold={true} />
              {version.templates[selectorVal].prompt.map((pmt, index) => {
                return (
                  <tr key={randomBytes(16).toString("hex")}>
                    <TableRow
                      key={randomBytes(16).toString("hex")}
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
              {version.templates[selectorVal].regex.map((reg, index) => {
                return (
                  <tr key={randomBytes(16).toString("hex")}>
                    <TableRow
                      key={randomBytes(16).toString("hex")}
                      text={`${index + 1}. ${reg}`}
                    />
                  </tr>
                );
              })}
            </tbody>
          </ShowClassifiedRow>
          <ShowClassifiedRow>
            <tbody>
              <TableRow text="Params" bold={true} />
              {version.templates[selectorVal].params.map((listparam, index) => {
                let paramArray = "[";
                listparam.forEach((param) => {
                  paramArray += param + ", ";
                });
                paramArray = paramArray.slice(0, -2);
                paramArray += "]";
                return (
                  <tr key={randomBytes(16).toString("hex")}>
                    <TableRow
                      key={randomBytes(16).toString("hex")}
                      text={`${index + 1}. ${paramArray}`}
                    />
                  </tr>
                );
              })}
            </tbody>
          </ShowClassifiedRow>
          <ShowClassifiedRow>
            <tbody>
              <TableRow text="Groups" bold={true} />
              {version.templates[selectorVal].groups.map((group, index) => {
                return (
                  <tr key={randomBytes(16).toString("hex")}>
                    <TableRow bold={true} text={`Prompt ${index + 1}:`} />
                    {Object.keys(group).map((key) => {
                      return (
                        <TableRow
                          key={randomBytes(16).toString("hex")}
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
        <TabPanel value={value} index={3}>
          <ShowClassifiedRow>
            <tbody>
              <TableRow bold={true} text="Responses"></TableRow>

              {version.templates[selectorVal].response.map((res, index) => {
                return (
                  <tr key={randomBytes(16).toString("hex")}>
                    <TableRow
                      key={randomBytes(16).toString("hex")}
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
      </div>
    </Box>
  );
};

export default ClassifiedTabs;
