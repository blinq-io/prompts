import { useState } from "react";
import axios from "axios";

import LeftNav from "./LeftNav";
import NavBar from "./NavBar";

const Control = () => {
  const [disabled, setDisabled] = useState(true);
  const [data, setData] = useState([]);

  const handleOnUnclassified = async (e) => {
    const uri = process.env.SERVER_URI
      ? process.env.SERVER_URI
      : "http://localhost:4000";
    const res = await axios.get(`${uri}/api/getAllPrompts`);
    console.log(res.data);
    setData(res.data);
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
        data={["data"]}
      />
    </div>
  );
};

export default Control;
