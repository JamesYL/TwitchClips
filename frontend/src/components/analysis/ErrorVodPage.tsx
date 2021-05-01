import { makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
const useStyles = makeStyles((theme: Theme) => {
  return {
    title: {
      marginBottom: theme.spacing(2),
      fontFamily: "'New Tegomin', serif",
    },
    subtitle: { fontFamily: "'New Tegomin', serif" },
    info: {
      margin: theme.spacing(5),
    },
  };
});
const ErrorVodPage = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.info}>
        <Typography
          variant="h2"
          component="h1"
          className={classes.title}
          align="center"
        >
          <b> Uh Oh! </b>
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          className={classes.subtitle}
          align="center"
        >
          The VOD you are looking for doesn't seem to exist!
        </Typography>
      </div>
    </>
  );
};
export default ErrorVodPage;
