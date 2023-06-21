import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ShowClassifiedRow from "../Rows/ShowClassifiedRow";
import TableRow from "../../UI/TableRow";
import randomBytes from "randombytes";

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
  const avgMinutes = Math.floor(
    data.statistics.responseTime / data.statistics.numOfSessions / 60000
  );
  const avgSeconds = (
    ((data.statistics.responseTime / data.statistics.numOfSessions) % 60000) /
    1000
  ).toFixed(2);
  const maxMinutes = Math.floor(data.statistics.maxResponseTime / 60000);
  const maxSeconds = ((data.statistics.maxResponseTime % 60000) / 1000).toFixed(
    2
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
                <TableRow text={`${data.statistics.totalTokens}`} />
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
                <TableRow text={`${data.statistics.numOfSessions}`} />
              </tr>
            </tbody>
          </ShowClassifiedRow>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ShowClassifiedRow>
            <tbody>
              <TableRow text="Prompts" bold={true} />
              {data.prompt.data.map((pmt, index) => {
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
              {data.regex.data.map((reg, index) => {
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
              {data.params.data.map((listparam, index) => {
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
              {data.groups.data.map((group, index) => {
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

              {data.response.data.map((res, index) => {
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
