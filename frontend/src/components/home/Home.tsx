import { Container, makeStyles, Theme } from "@material-ui/core";
import BigSearchBar from "./BigSearchBar";
import Navbar from "../util/Navbar";

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    animation: `$comeDown 2000ms`,
    position: "fixed",
    top: 0,
    left: 0,
    flexGrow: 1,
    width: "100%",
    background: "transparent",
  },
  title: {
    fontFamily: "Alfa Slab One, cursive",
    color: "white",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
    marginRight: theme.spacing(2),
  },
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: 200,
    height: "100vh",
    justifyContent: "center",
    overflow: "hidden",
    margin: 0,
    padding: 0,
    width: "100vw",
  },
  search: {
    width: "100%",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    animation: `$comeUp 2000ms`,
  },
  "@keyframes comeUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(200%)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  "@keyframes comeDown": {
    "0%": {
      opacity: 0,
      transform: "translateY(-200%)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  "@keyframes gradient": {
    "0%": {
      backgroundPosition: "0% 50%",
    },
    "50%": {
      backgroundPosition: "25% 50%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
    },
  },
  background: {
    position: "fixed",
    width: "400%",
    height: "200%",
    background:
      "radial-gradient(circle, rgba(57,226,182,1) 8%, rgba(20,176,103,1) 24%, rgba(67,145,207,1) 40%, rgba(81,40,184,1) 54%, rgba(139,79,205,1) 68%, rgba(186,60,162,1) 80%, rgba(204,139,68,1) 93%)",
    top: "-150%",
    left: "-200%",
    zIndex: -8,
    transform: "rotateZ(-10deg)",
    backgroundPosition: "80%",
    backgroundSize: "400% 400%",
    animation: "$gradient 15s ease infinite",
    overflow: "hidden",
  },
  grow: {
    flexGrow: 1,
  },
}));
const Home = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.bar}>
        <Navbar transparent />
      </div>
      <Container maxWidth={false} className={classes.root}>
        <div className={classes.background} />
        <div className={classes.search}>
          <BigSearchBar />
        </div>
      </Container>
    </>
  );
};

export default Home;
