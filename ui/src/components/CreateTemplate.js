import { useState } from "react";
import axios from "axios";
import { ModelDiv } from "../styles/components/popup.style";
import "../styles/css/leftNav.css";
import TemplateCarousel from "./Carousel/TemplateCarousel";

const CreateTemplate = ({ promptId, prompt }) => {
  const [name, setName] = useState("");
  const [regex, setRegex] = useState([]);
  const [params, setParams] = useState([]);

  const handleOnCreateClick = async () => {
    const parameters = params.map((param) => {
      return param.replace(/\s/g, "").split(",");
    });

    await axios.post(`${process.env.REACT_APP_SERVER_URI}/api/createTemplate`, {
      name,
      promptId,
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

  return (
    <ModelDiv>
      <div className="rounded-lg bg-white flex flex-col justify-center">
        <h2 className="text-4xl dark:text-white font-bold text-center brand mt-4">
          Add classification
        </h2>
        <div className="flex flex-col p-5 text-black py-2">
          <label>Name</label>
          <input
            className="rounded-lg border-black border bg-white mt-2 p-2  focus:bg-slate-100 focus:outline-none"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col p-5 text-black py-2">
          <label>Regex</label>
          <TemplateCarousel
            handleSetRegex={handleSetRegex}
            data={prompt}
            handleSetParams={handleSetParams}
          />
        </div>

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
