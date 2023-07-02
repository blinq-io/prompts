import { ExpandLess, ExpandMore } from "@mui/icons-material";

const TableColumn = ({ text, bold, pointer, handleOnExpand, expanded }) => {
  return (
    <td
      className={`border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-800 dark:text-slate-400 ${
        bold ? "font-bold" : "font-medium"
      }`}
    >
      <p
        onClick={handleOnExpand}
        className={`whitespace-pre-wrap ${pointer ? "cursor-pointer" : ""}`}
      >
        {pointer ? !expanded ? <ExpandMore /> : <ExpandLess /> : null}
        {text}
      </p>
    </td>
  );
};

export default TableColumn;
