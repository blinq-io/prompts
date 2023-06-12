const TableRow = ({ text, bold }) => {
  return (
    <td
      className={`border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-800 dark:text-slate-400 ${
        bold ? "font-bold" : "font-medium"
      }`}
    >
      {text}
    </td>
  );
};

export default TableRow;
