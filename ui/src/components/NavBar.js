const NavBar = ({ disabled }) => {
  return (
    <div className="flex">
      <div className="w-screen bg-slate-200 border border-slate-400">
        <button
          disabled={disabled}
          className={`p-5 duration-100 ${
            disabled ? "text-slate-400" : "hover:text-slate-600"
          }`}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default NavBar;
