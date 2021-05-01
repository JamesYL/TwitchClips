import { Button, Typography } from "@material-ui/core";
import { getOutputPath, setOutputPath } from "../../storage/storage";
import Navbar from "../util/Navbar";
import React from "react";
const Settings = () => {
  const [path, setPath] = React.useState<null | string>(getOutputPath());
  return (
    <div>
      <Navbar />
      <Typography variant="body1"> Set Output Folder</Typography>
      <Button
        variant="contained"
        onClick={() => {
          setOutputPath().then((item) => setPath(item));
        }}
      >
        {path ? path : "Downloads"}
      </Button>
    </div>
  );
};
export default Settings;
