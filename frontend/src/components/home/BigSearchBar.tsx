import React from "react";
import { Theme, makeStyles, IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Notification from "../util/Notification";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    border: "1px solid #696969",
    borderRadius: 25,
    display: "flex",
    width: "100%",
    maxWidth: 800,
    background: theme.palette.background.paper,
  },
  button: {
    marginLeft: "auto",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  input: {
    border: 0,
    flex: 1,
    marginLeft: 20,
    outlineStyle: "none",
    boxShadow: "none",
    borderColor: "transparent",
    "input::-ms-clear": {
      display: "none",
    },
    fontSize: "calc(0.75em + 1vmin)",
    background: theme.palette.background.paper,
  },
}));
const BigSearchBar = () => {
  const history = useHistory();
  const classes = useStyles();
  const [isErr, setIsErr] = React.useState(false);
  const [vodVal, setVodVal] = React.useState("");
  const [dotAnimation, setDot] = React.useState("");
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (dotAnimation === "...") setDot("");
      else {
        setDot(dotAnimation + ".");
      }
    }, 500);
    return () => clearInterval(interval);
  }, [dotAnimation]);
  const handleSubmit = () => {
    let filtered: number = parseInt(vodVal);
    if (!filtered) {
      const index = vodVal.indexOf("videos/");
      if (index >= 0) {
        const tmp = vodVal.slice(index + 7);
        const secondSlash = tmp.indexOf("/");
        if (secondSlash >= 0) {
          filtered = parseInt(tmp.slice(0, secondSlash));
        } else filtered = parseInt(tmp);
      }
    }
    if (filtered) {
      history.push(`/search/${filtered}`);
      history.go(0);
    } else setIsErr(true);
  };

  return (
    <div className={classes.root}>
      <input
        autoFocus
        className={classes.input}
        type="text"
        onChange={(e) => setVodVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        placeholder={`Enter twitch vod URL${dotAnimation}`}
      />
      <IconButton onClick={handleSubmit} className={classes.button}>
        <SearchIcon />
      </IconButton>
      <Notification
        message={`Could not find VOD`}
        open={isErr}
        setOpen={setIsErr}
      />
    </div>
  );
};
export default BigSearchBar;
