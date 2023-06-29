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
    /* eslint-disable react-hooks/exhaustive-deps */

    const fetch = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}/api/getClassifiedPage?page=0`
      );

      const templates = await Promise.all(
        data.map(async (group, index) => {
          const { data: versionData } = await axios.post(
            `${process.env.REACT_APP_SERVER_URI}/api/getVersionByName`,
            {
              name: group.name,
            }
          );
          return (
            <TreeItem
              key={index}
              nodeId={`${index + 3}`}
              label={group.name}
              onClick={handleOnTreeClick}
              expandIcon={<ChevronRightIcon id={group.name} />}
              collapseIcon={<ExpandMoreIcon id={group.name} />}
            >
              {versionData.templates.map((tmp, verIndex) => {
                return (
                  <TreeItem
                    onClick={(e) => {
                      handleOnTreeClick(e, group.name);
                    }}
                    key={`tmp ${verIndex}`}
                    nodeId={`${index * 10 + 10 + verIndex}`}
                    label={`V${verIndex + 1}`}
                  />
                );
              })}
            </TreeItem>
          );
        })
      );
      setGroups(templates);
    };
    fetch();
  }, []);

  const handleOnTreeClick = async (e, id) => {
    const name =
      e.target.tagName === "svg" ? e.target.id : !id ? e.target.innerHTML : id;

    const { data } = await axios.post(
      `${process.env.REACT_APP_SERVER_URI}/api/getTemplateByName`,
      {
        name,
      }
    );

    if (data.error) {
      return;
    }

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

    const ver = !id ? 0 : Number(e.target.innerHTML.split("V")[1]) - 1;

    dispatch(
      classifiedActions.setRowData({
        rowData: { ...data, ver },
      })
    );
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
