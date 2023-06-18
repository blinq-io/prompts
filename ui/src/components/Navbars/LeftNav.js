import ClassifiedGrid from "../Grids/ClassifiedGrid";
import UnclassifiedGrid from "../Grids/UnclassifiedGrid";
import NavTree from "./NavTree";

import "../../styles/css/leftNav.css";

const LeftNav = ({ handleOnUnclassified, handleOnClassified, classefied }) => {
  return (
    <div className="flex">
      <div className="p-5 w-48 h-screen shadow-lg">
        <h1 className="text-3xl pb-7 brand text-center">AI-Apis</h1>
        <NavTree
          handleOnClassified={handleOnClassified}
          handleOnUnclassified={handleOnUnclassified}
        />
      </div>
      {!classefied ? <UnclassifiedGrid /> : <ClassifiedGrid />}
    </div>
  );
};

export default LeftNav;
