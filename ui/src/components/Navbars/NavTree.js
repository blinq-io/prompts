import { useState, useEffect } from "react";
import axios from "axios";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const NavTree = ({ handleOnUnclassified, handleOnClassified }) => {
  const [groups, setGroups] = useState([]);
  //const [versions, setVersions] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}/api/getAllTemplate`
      );
      setGroups(
        data.map((group, index) => {
          return (
            <TreeItem
              key={index}
              nodeId={`${index + 3}`}
              label={`${group.name}`}
            ></TreeItem>
          );
        })
      );
    };
    fetch();
  }, []);

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
