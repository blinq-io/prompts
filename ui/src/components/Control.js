import { useState } from "react";
import axios from "axios";

import LeftNav from "./LeftNav";
import NavBar from "./NavBar";

const Control = () => {
  const [disabled, setDisabled] = useState(true);
  const [getData, setData] = useState([]);

  const handleOnUnclassified = async (e) => {
    const uri = process.env.SERVER_URI
      ? process.env.SERVER_URI
      : "http://localhost:4000";
    let { data } = await axios.get(`${uri}/api/getAllPrompts`);

    data = data.map((item) => {
      let { prompt, response } = item;
      if (typeof prompt === "object") {
        prompt = prompt.map((item) => {
          const content = `${item.role.toUpperCase()}: ${item.content} `;
          return content;
        });
        return { ...item, response: response.message.content, prompt };
      }
      return { ...item, response: response.text };
    });
    setData(data);
    setDisabled(true);
  };

  const handleOnClassified = async (e) => {
    setDisabled(false);
    setData([]);
  };

  return (
    <div>
      <NavBar disabled={disabled} />
      <LeftNav
        handleOnUnclassified={handleOnUnclassified}
        handleOnClassified={handleOnClassified}
        data={getData}
      />
    </div>
  );
};

export default Control;
