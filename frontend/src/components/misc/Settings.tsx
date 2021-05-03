import {
  Button,
  Typography,
  Container,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { getOutputPath, setOutputPath } from "../../storage/storage";
import Navbar from "../util/Navbar";
import React from "react";
const useStyles = makeStyles((theme: Theme) => {
  return {
    outputText: {
      marginBottom: theme.spacing(1),
    },
    container: {
      marginTop: theme.spacing(2),
    },
  };
});
const Settings = () => {
  const classes = useStyles();

  const [path, setPath] = React.useState<null | string>(getOutputPath());
  return (
    <>
      <Navbar />
      <Container className={classes.container}>
        <Typography variant="body1" className={classes.outputText}>
          Current Output Folder: <b>{path ? path : "Downloads"}</b>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOutputPath().then((item) => setPath(item));
          }}
        >
          Select Output Folder
        </Button>
      </Container>
    </>
  );
};
export default Settings;
