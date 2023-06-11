import { useState, useEffect } from "react";
import axios from "axios";

import LeftNav from "./LeftNav";
import NavBar from "./NavBar";

const Control = () => {
  const [disabled, setDisabled] = useState(true);
  const [getData, setData] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}/api/getPromptsCount`
      );
      setCount(data);
    };
    fetch();
  }, []);

  const handleOnUnclassified = async (e) => {
    let { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_URI}/api/getAllPrompts`
    );

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
