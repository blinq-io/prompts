import Grid from "./Grid";

const LeftNav = ({ handleOnUnclassified, handleOnClassified, data }) => {
  return (
    <div className="flex">
      <div className="p-5 w-72 h-screen bg-cyan-200">
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
      {data.length > 0 ? <Grid data={data} /> : <h1>Nothing to see here!</h1>}
    </div>
  );
};

export default LeftNav;
