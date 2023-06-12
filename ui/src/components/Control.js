import { useState } from "react";
import LeftNav from "./LeftNav";
import NavBar from "./NavBar";

const Control = () => {
  const [classified, setClassified] = useState(false);

  const handleOnUnclassified = async (e) => {
    setClassified(false);
  };

  const handleOnClassified = async (e) => {
    setClassified(true);
  };

  return (
    <div>
      {classified && <NavBar />}

      <LeftNav
        handleOnUnclassified={handleOnUnclassified}
        handleOnClassified={handleOnClassified}
        classefied={classified}
      />
    </div>
  );
};

export default Control;
