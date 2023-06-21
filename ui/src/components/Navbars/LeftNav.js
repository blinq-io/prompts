import { useSelector, useDispatch } from "react-redux";
import { classifiedActions } from "../../redux/classifiedSlice";
import ClassifiedGrid from "../Grids/ClassifiedGrid";
import UnclassifiedGrid from "../Grids/UnclassifiedGrid";
import NavTree from "./NavTree";

import "../../styles/css/leftNav.css";

const LeftNav = () => {
  const classified = useSelector((state) => state.classifiedSlice.isClassified);
  const dispatch = useDispatch();

  const handleOnUnclassified = async (e) => {
    dispatch(classifiedActions.setClassification({ isClassified: false }));
    dispatch(classifiedActions.setOpen({ isOpen: false }));
  };

  const handleOnClassified = async (e) => {
    dispatch(classifiedActions.setClassification({ isClassified: true }));
    dispatch(classifiedActions.setOpen({ isOpen: false }));
  };

  return (
    <div className="flex">
      <div className="p-5 w-48 h-screen shadow-lg">
        <h1 className="text-3xl pb-7 brand text-center">AI-Apis</h1>
        <NavTree
          handleOnClassified={handleOnClassified}
          handleOnUnclassified={handleOnUnclassified}
        />
      </div>
      {!classified ? <UnclassifiedGrid /> : <ClassifiedGrid />}
    </div>
  );
};

export default LeftNav;
