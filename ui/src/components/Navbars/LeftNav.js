import ClassifiedGrid from "../Grids/ClassifiedGrid";
import UnclassifiedGrid from "../Grids/UnclassifiedGrid";

const LeftNav = ({ handleOnUnclassified, handleOnClassified, classefied }) => {
  return (
    <div className="flex">
      <div className="p-5 w-48 h-screen bg-cyan-200">
        <h1 className="text-3xl pb-7 font-mono">AI-Apis</h1>
        <button
          onClick={handleOnUnclassified}
          className="duration-100 text-xl font-serif block hover:text-slate-600"
        >
          Unclassified
        </button>
        <button
          onClick={handleOnClassified}
          className="duration-100 pt-3 text-xl font-serif block hover:text-slate-600"
        >
          Classified
        </button>
      </div>
      {!classefied ? <UnclassifiedGrid /> : <ClassifiedGrid />}
    </div>
  );
};

export default LeftNav;
