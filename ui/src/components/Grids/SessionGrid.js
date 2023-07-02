import TableColumn from "../../UI/TableColumn";

const SessionGrid = ({ params, groups, promptsPerSession }) => {
  const paramsArray = [];
  params.map((param) =>
    param
      .filter((param) => param !== "undefined")
      .map((name) => paramsArray.push(name))
  );

  const parameters = () => {
    const trArray = [];
    let index = 2;

    for (let i = 1; i < promptsPerSession; i++) {
      trArray.push(
        <tr>
          <TableColumn text={`Message ${index}:`} bold />
          {paramsArray.map((param, index) => {
            return !groups[i % promptsPerSession][param] ? (
              <TableColumn />
            ) : (
              <TableColumn text={groups[i % promptsPerSession][param]} />
            );
          })}
        </tr>
      );
      index++;
    }
    return trArray;
  };

  return (
    <table className=" w-10/12 overflow-auto">
      <tr>
        <TableColumn />
        {params
          .filter((param) => param !== "undefined")
          .map((param) => {
            return param
              .filter((param) => param !== "undefined")
              .map((name) => {
                return <TableColumn text={name} bold />;
              });
          })}
      </tr>
      <tr>
        <TableColumn text="Message 1:" bold />
        {paramsArray.map((param, index) => {
          return !groups[0][param] ? (
            <TableColumn />
          ) : (
            <TableColumn text={groups[0][param]} />
          );
        })}
      </tr>
      {parameters()}
    </table>
  );
};

export default SessionGrid;
