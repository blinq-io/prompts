import { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { classifiedActions } from "../../redux/classifiedSlice";
import { useSelector, useDispatch } from "react-redux";
import ShowClassifiedRow from "../Rows/ShowClassifiedRow";
import TableColumn from "../../UI/TableColumn";
import randomBytes from "randombytes";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
  CircularProgress,
} from "@mui/material";

import "../../styles/css/tabs.css";
import SessionGrid from "../Grids/SessionGrid";

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
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [sessions, setSessions] = useState([]);
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
  const isLoading = useSelector((state) => state.classifiedSlice.isLoading);

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

  useEffect(() => {
    dispatch(classifiedActions.setIsLoading(true));
    const treeSessions = [];
    const numOfSessions =
      version.templates[selectorVal].statistics.numOfSessions;
    const pmt = version.templates[selectorVal].prompt;
    const params = version.templates[selectorVal].params;
    const response = version.templates[selectorVal].response;
    const groups = version.templates[selectorVal].groups;
    let index = 0;

    for (
      let i = numOfSessions;
      i > (numOfSessions - 10 < 0 ? 0 : numOfSessions - 10);
      i--
    ) {
      treeSessions.push(
        <TreeItem
          nodeId={randomBytes(16).toString("hex")}
          label={`Session ${i}`}
          sx={{ marginBottom: "0.50rem" }}
          key={randomBytes(16).toString("hex")}
        >
          <ShowClassifiedRow>
            <tr>
              <TableColumn text="Response" bold />
              <TableColumn
                text={
                  !response[i - 1].data.choices[0].message.content
                    ? response[i - 1].data.choices[0].text
                    : response[i - 1].data.choices[0].message.content
                }
              />
            </tr>
          </ShowClassifiedRow>
          <SessionGrid
            params={params}
            promptsPerSession={pmt.length / numOfSessions}
            groups={groups.slice(
              pmt.length -
                (index * pmt.length) / numOfSessions -
                pmt.length / numOfSessions,
              pmt.length - (index * pmt.length) / numOfSessions
            )}
          />
        </TreeItem>
      );
      index++;
    }
    setSessions(treeSessions);
  }, [dispatch, selectorVal, version.templates]);

  useLayoutEffect(() => {
    dispatch(classifiedActions.setIsLoading(false));
  });

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
  const avgTokens =
    version.templates[selectorVal].statistics.totalTokens /
    version.templates[selectorVal].statistics.numOfSessions;

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
          <Tab label="Sessions" />
        </Tabs>
      </Box>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <CircularProgress />
          </div>
        </div>
      ) : (
        <>
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
                    <TableColumn text="Average tokens:" bold={true} />
                    <TableColumn text={avgTokens} />
                  </tr>
                  <tr>
                    <TableColumn text="Max tokens:" bold={true} />
                    <TableColumn
                      text={version.templates[selectorVal].statistics.maxTokens}
                    />
                  </tr>
                  <tr>
                    <TableColumn text="Average response time:" bold={true} />
                    <TableColumn
                      text={`${
                        avgMinutes > 0 ? avgMinutes + " minutes and " : ""
                      }${avgSeconds} seconds`}
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
                  <tr>
                    <TreeView
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
                      sx={{ marginTop: "0.75rem" }}
                    >
                      <ShowClassifiedRow className="mb-3">
                        <tr>
                          <TableColumn text="Regexs" bold={true} />
                          {version.templates[selectorVal].regex.map(
                            (reg, index) => {
                              return (
                                <tr key={randomBytes(16).toString("hex")}>
                                  <TableColumn
                                    key={randomBytes(16).toString("hex")}
                                    text={`${index + 1}. ${reg}`}
                                  />
                                </tr>
                              );
                            }
                          )}
                        </tr>
                        <tr>
                          <TableColumn text="Params" bold={true} />
                          {version.templates[selectorVal].params.map(
                            (listparam, index) => {
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
                                    text={`${index + 1}. ${
                                      listparam.length === 0 ? "[]" : paramArray
                                    }`}
                                  />
                                </tr>
                              );
                            }
                          )}
                        </tr>
                      </ShowClassifiedRow>
                      {sessions}
                    </TreeView>
                  </tr>
                </tbody>
              </ShowClassifiedRow>
            </TabPanel>
          </div>
        </>
      )}
    </Box>
  );
};

export default ClassifiedTabs;
