const ShowClassifiedRow = ({ children, className }) => {
  return (
    <table className={`border-collapse table-auto w-full text-sm ${className}`}>
      {children}
    </table>
  );
};

export default ShowClassifiedRow;
