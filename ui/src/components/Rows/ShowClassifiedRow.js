const ShowClassifiedRow = ({ children, scrollx, scrolly }) => {
  return (
    <table className={`border-collapse table-auto w-full text-sm`}>
      {children}
    </table>
  );
};

export default ShowClassifiedRow;
