import {
  Column,
  DataGrid,
  Paging,
  Selection,
} from "devextreme-react/data-grid";

const handleOnSelectedChanged = (e) => {
  console.log(e.selectedRowsData[0]);
};

const Grid = ({ data }) => {
  return (
    <div>
      <DataGrid
        dataSource={data}
        keyExpr="_id"
        onSelectionChanged={handleOnSelectedChanged}
      >
        <Selection mode="single" />
        <Paging defaultPageSize={15}></Paging>
        <Column dataField="prompt"></Column>
        <Column dataField="parameteres"></Column>
        <Column dataField="response"></Column>
        <Column dataField="createdAt"></Column>
      </DataGrid>
    </div>
  );
};

export default Grid;
