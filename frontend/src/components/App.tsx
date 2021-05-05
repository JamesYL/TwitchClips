import Home from "./home/Home";
import { Switch, Route } from "react-router-dom";
import AnalyzeVod from "./analysis/AnalyzeVod";
import { StylesProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import Bookmark from "./misc/Bookmark";
import Settings from "./misc/Settings";
const App = () => {
  return (
    <>
      <CssBaseline />
      <StylesProvider injectFirst>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/search/:vodID">
            <AnalyzeVod />
          </Route>
          <Route exact path="/bookmarks">
            <Bookmark />
          </Route>
          <Route exact path="/settings">
            <Settings />
          </Route>
        </Switch>
      </StylesProvider>
    </>
  );
};

export default App;
