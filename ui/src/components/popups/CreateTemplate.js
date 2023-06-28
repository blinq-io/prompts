import { useState, useEffect } from "react";
import axios from "axios";
import { ModelDiv } from "../../styles/components/popup.style";
import "../../styles/css/leftNav.css";
import TemplateCarousel from "../Carousel/TemplateCarousel";
import {
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";

const CreateTemplate = ({ prompt }) => {
  const [name, setName] = useState("");
  const [regex, setRegex] = useState(new Array(prompt.length).fill(""));
  const [params, setParams] = useState(new Array(prompt.length).fill(""));
  const [error, setError] = useState("");
  const [isNew, setIsNew] = useState("new");
  const [selectors, setSelectors] = useState([]);
  const [templateVersionName, setTemplateVersionName] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const res = await axios(
        `${process.env.REACT_APP_SERVER_URI}/api/getNonDuplicateTemplates`
      );
      setSelectors(res.data);
    };

    fetch();
  }, []);

  const handleOnCreateClick = async () => {
    if (name.trim() === "" && templateVersionName.trim() === "") {
      setError("Must type or choose a template name!");
      return;
    }

    if (regex.length !== prompt.length) {
      setError("Must type a regex!");
      return;
    }

    if (params.length !== prompt.length) {
      setError("Must type the params!");
      return;
    }

    for (const reg of regex) {
      if (reg.trim() === "") {
        setError("Must type a regex!");
        return;
      }
    }

    for (const param of params) {
      if (param.trim() === "") {
        setError("Must type the params!");
        return;
      }
    }

    const parameters = params.map((param) => {
      return param.replace(/\s/g, "").split(",");
    });

    await axios.post(`${process.env.REACT_APP_SERVER_URI}/api/createTemplate`, {
      name: name === "" ? templateVersionName : name,
      regex,
      params: parameters,
    });

    window.location.replace("/");
  };

  const handleSetRegex = (regexes) => {
    setRegex(regexes);
  };

  const handleSetParams = (param) => {
    setParams(param);
  };

  const handleToggleChange = (e, value) => {
    if (value !== null) {
      setIsNew(value);
      setName("");
    }
  };

  const handleSelectorChange = (e) => {
    setTemplateVersionName(e.target.value);
  };

  return (
    <ModelDiv height={isNew === "new" ? "33.8rem" : "34.9rem"}>
      <div className="rounded-lg bg-white flex flex-col justify-center">
        <h2 className="text-4xl dark:text-white font-bold text-center brand mt-4">
          Add classification
        </h2>
        <div className="flex flex-col p-5 text-black py-2">
          <label className={isNew === "version" ? "mb-3" : ""}>
            {isNew === "new" ? "Name" : "Select template name"}
          </label>
          {isNew === "new" ? (
            <input
              className="rounded-lg border-black border bg-white mt-2 p-2  focus:bg-slate-100 focus:outline-none"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <FormControl className="w-80">
              <InputLabel id="select-label">Name</InputLabel>

              <Select
                onChange={handleSelectorChange}
                labelId="select-label"
                id="select"
                label="Session"
                value={templateVersionName}
              >
                {selectors.map(({ name }) => {
                  return (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
          <ToggleButtonGroup
            color="primary"
            value={isNew}
            exclusive
            onChange={handleToggleChange}
            aria-label="Platform"
            className="mb-2 mt-4"
          >
            <ToggleButton value="new">New Template</ToggleButton>
            <ToggleButton value="version">
              Add a version to an existing template
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="flex flex-col p-5 text-black py-2">
          <label>Regex</label>
          <TemplateCarousel
            handleSetRegex={handleSetRegex}
            data={prompt}
            handleSetParams={handleSetParams}
            paramSelector={params}
          />
        </div>

        {error !== "" && <Alert severity="error">{error}</Alert>}

        <button
          onClick={handleOnCreateClick}
          className="w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/10 text-white font-semibold rounded-lg"
        >
          Create
        </button>
      </div>
    </ModelDiv>
  );
};

export default CreateTemplate;
