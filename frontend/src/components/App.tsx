import Home from "./home/Home";
import { Switch, Route } from "react-router-dom";
import AnalyzeVod from "./analysis/AnalyzeVod";
import { StylesProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import Bookmark from "./bookmarks/Bookmark";
const App = () => {
  return (
    <>
      <CssBaseline />
      <StylesProvider injectFirst>
        <Switch>
          <Route path="/search/:vodID">
            <AnalyzeVod />
          </Route>
          <Route path="/bookmarks">
            <Bookmark />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </StylesProvider>
    </>
  );
};

export default App;
