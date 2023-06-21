import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { classifiedActions } from "../../redux/classifiedSlice";
import axios from "axios";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const NavTree = ({ handleOnUnclassified, handleOnClassified }) => {
  const [groups, setGroups] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}/api/getClassifiedPage?page=0`
      );
      setGroups(
        data.map((group, index) => {
          return (
            <TreeItem
              key={index}
              nodeId={`${index + 3}`}
              label={`${group.name}`}
              onClick={handleOnTreeClick}
            ></TreeItem>
          );
        })
      );
    };
    fetch();
  }, []);

  const handleOnTreeClick = async (e) => {
    const name = e.target.innerHTML;
    const { data } = await axios.post(
      `${process.env.REACT_APP_SERVER_URI}/api/getTemplateByName`,
      {
        name,
      }
    );

    data.prompt = {
      data: data.prompt,
    };

    data.regex = {
      data: data.regex,
    };

    data.groups = {
      data: data.groups,
    };
    data.params = {
      data: data.params,
    };

    data.response = {
      data: data.response,
    };

    dispatch(classifiedActions.setRowData({ rowData: data }));
    dispatch(classifiedActions.setOpen({ isOpen: true }));
    dispatch(classifiedActions.setClassification({ isClassified: true }));
  };
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400 }}
    >
      <TreeItem
        nodeId="1"
        label="Unclassified"
        onClick={handleOnUnclassified}
      />
      <TreeItem nodeId="2" label="Classified" onClick={handleOnClassified}>
        {groups}
      </TreeItem>
    </TreeView>
  );
};

export default NavTree;
