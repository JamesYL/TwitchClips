import React from "react";
import { Theme, makeStyles, IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Notification from "./Notification";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    border: "1px solid lightgrey",
    borderRadius: 25,
    maxWidth: 600,
    display: "flex",
    width: "100%",
    background: theme.palette.background.paper,
  },
  button: {
    marginLeft: "auto",
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
    fontSize: 16,
    background: theme.palette.background.paper,
  },
}));
const SearchBar = () => {
  const history = useHistory();
  const classes = useStyles();
  const [isErr, setIsErr] = React.useState(false);
  const [vodVal, setVodVal] = React.useState("");
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
        type="text"
        onChange={(e) => setVodVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        placeholder="Enter twitch vod URL"
        className={classes.input}
      />
      <IconButton onClick={handleSubmit} className={classes.button}>
        <SearchIcon />
      </IconButton>
      <Notification
        message={`Vod id cannot be determined from the input`}
        open={isErr}
        setOpen={setIsErr}
      />
    </div>
  );
};
export default SearchBar;
