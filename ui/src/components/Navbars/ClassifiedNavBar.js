import { AppBar, Toolbar, Stack, Button } from "@mui/material";

const ClassifiedNavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Stack direction="row" spacing={2}>
          <Button>Prompt</Button>
          <Button>Regex</Button>
          <Button>Parameters</Button>
          <Button>Groups</Button>
          <Button>Response</Button>
          <Button>Statistics</Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default ClassifiedNavBar;
