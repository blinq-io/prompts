import { useState, useEffect } from "react";
import axios from "axios";
import ShowClassifiedRow from "../Rows/ShowClassifiedRow";
import TableColumn from "../../UI/TableColumn";
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
  Collapse,
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
  const [expand, setExpand] = useState(
    new Array(version.templates.length).fill(
      new Array(version.templates[0].prompt.length).fill(false)
    )
  );
  const [expandGroups, setExpandGroups] = useState(
    new Array(version.templates.length).fill(
      new Array(version.templates[0].groups.length).fill(false)
    )
  );

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
      setExpand(
        new Array(res.data.templates.length).fill(
          new Array(res.data.templates[0].prompt.length).fill(false)
        )
      );
      setExpandGroups(
        new Array(res.data.templates.length).fill(
          new Array(res.data.templates[0].groups.length).fill(false)
        )
      );
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

  const handleOnExpand = (e, index) => {
    const expandArr = expand;
    expandArr[selectorVal][index] = !expandArr[selectorVal][index];
    setExpand((prev) => [...expandArr]);
  };

  const handleOnExpandGroups = (e, index) => {
    const expandArr = expandGroups;
    expandArr[selectorVal][index] = !expandArr[selectorVal][index];
    setExpandGroups((prev) => [...expandArr]);
  };

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
              <TableColumn text="Statistics" bold={true} />
              <tr>
                <TableColumn text="Average response time:" bold={true} />
                <TableColumn
                  text={`${
                    avgMinutes > 0 ? avgMinutes + " minutes and " : ""
                  }${avgSeconds} seconds`}
                />
              </tr>
              <tr>
                <TableColumn text="Total tokens:" bold={true} />
                <TableColumn
                  text={`${version.templates[selectorVal].statistics.totalTokens}`}
                />
              </tr>
              <tr>
                <TableColumn text="Max response time:" bold={true} />
                <TableColumn
                  text={`${
                    maxMinutes > 0 ? maxMinutes + " minutes and " : ""
                  }${maxSeconds} seconds`}
                />
              </tr>
              <tr>
                <TableColumn text="Number of sessions:" bold={true} />
                <TableColumn
                  text={`${version.templates[selectorVal].statistics.numOfSessions}`}
                />
              </tr>
            </tbody>
          </ShowClassifiedRow>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ShowClassifiedRow>
            <tbody>
              <TableColumn text="Prompts" bold={true} />
              {version.templates[selectorVal].prompt.map((pmt, index) => {
                return (
                  <tr key={randomBytes(16).toString("hex")}>
                    <Collapse in={!expand[selectorVal][index]}>
                      <TableColumn
                        handleOnExpand={(e) => handleOnExpand(e, index)}
                        pointer
                        text={`Expand prompt ${index + 1}`}
                        expanded={expand[selectorVal][index]}
                      />
                    </Collapse>
                    <Collapse in={expand[selectorVal][index]}>
                      <TableColumn
                        handleOnExpand={(e) => handleOnExpand(e, index)}
                        pointer
                        text={`${index + 1}. ${pmt.role.toUpperCase()}: ${
                          pmt.content
                        }`}
                        expanded={expand[selectorVal][index]}
                      />
                    </Collapse>
                  </tr>
                );
              })}
            </tbody>
          </ShowClassifiedRow>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ShowClassifiedRow>
            <tbody>
              <TableColumn text="Regexs" bold={true} />
              {version.templates[selectorVal].regex.map((reg, index) => {
                return (
                  <tr key={randomBytes(16).toString("hex")}>
                    <TableColumn
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
              <TableColumn text="Params" bold={true} />
              {version.templates[selectorVal].params.map((listparam, index) => {
                let paramArray = "[";
                listparam.forEach((param) => {
                  paramArray += param + ", ";
                });
                paramArray = paramArray.slice(0, -2);
                paramArray += "]";
                return (
                  <tr key={randomBytes(16).toString("hex")}>
                    <TableColumn
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
              <TableColumn text="Groups" bold={true} />
              {version.templates[selectorVal].groups.map((group, index) => {
                return (
                  <tr key={randomBytes(16).toString("hex")}>
                    <Collapse in={expandGroups[selectorVal][index]}>
                      <TableColumn
                        bold={true}
                        text={`Prompt ${index + 1}:`}
                        pointer
                        expanded={expandGroups[selectorVal][index]}
                        handleOnExpand={(e) => handleOnExpandGroups(e, index)}
                      />

                      {Object.keys(group).map((key) => {
                        return (
                          <TableColumn
                            key={randomBytes(16).toString("hex")}
                            text={`${key.toUpperCase()}: ${group[key]}`}
                          />
                        );
                      })}
                    </Collapse>
                    <Collapse in={!expandGroups[selectorVal][index]}>
                      <TableColumn
                        bold={true}
                        text={`Prompt ${index + 1}: Click to extend`}
                        pointer
                        expanded={expandGroups[selectorVal][index]}
                        handleOnExpand={(e) => handleOnExpandGroups(e, index)}
                      />
                    </Collapse>
                  </tr>
                );
              })}
            </tbody>
          </ShowClassifiedRow>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ShowClassifiedRow>
            <tbody>
              <TableColumn bold={true} text="Responses"></TableColumn>

              {version.templates[selectorVal].response.map((res, index) => {
                return (
                  <tr key={randomBytes(16).toString("hex")}>
                    <TableColumn
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
