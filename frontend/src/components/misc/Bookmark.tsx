import {
  Container,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Tooltip,
  Link,
  Theme,
  makeStyles,
  Grid,
  CardActions,
  Button,
} from "@material-ui/core";
import Navbar from "../util/Navbar";
import {
  Collections,
  deleteCollection,
  getCollections,
  setClips,
} from "../../services/storage";
import DeleteIcon from "@material-ui/icons/Delete";
import { getExternal } from "../../services/misc";
import React from "react";
const useStyles = makeStyles((theme: Theme) => {
  return {
    container: {
      marginTop: theme.spacing(2),
    },
    card: {
      height: "100%",
    },
    missing: {
      textAlign: "center",
      marginTop: theme.spacing(4),
      fontFamily: "'New Tegomin', serif",
    },
  };
});
const Bookmark = () => {
  const classes = useStyles();
  const [collections, setCollections] = React.useState<Collections | null>(
    null
  );
  React.useEffect(() => {
    getCollections().then((collections) => setCollections(collections));
  }, []);
  return (
    <>
      <Navbar />
      <Container className={classes.container} maxWidth={false}>
        {collections !== null && Object.keys(collections).length !== 0 && (
          <Grid container spacing={2} alignItems="stretch">
            {(() => {
              const cards: JSX.Element[] = [];
              for (const id in collections) {
                const curr = collections[id];
                cards.push(
                  <Grid item xs={12} md={6} lg={4} xl={3} key={id}>
                    <Card className={classes.card}>
                      <CardContent>
                        <Typography variant="h6">
                          <Link href={`/search/${id}`}>{curr.name}</Link>
                        </Typography>

                        <List>
                          {curr.clips.map(
                            (
                              { name, createdAt, startTime, endTime, quality },
                              i
                            ) => {
                              const date = new Date(createdAt);
                              return (
                                <ListItem
                                  button
                                  onClick={() => {
                                    getExternal(
                                      `https://www.twitch.tv/videos/${id}?t=${startTime}s`
                                    );
                                  }}
                                  key={createdAt}
                                >
                                  <ListItemText
                                    primary={`${name} (${
                                      endTime - startTime
                                    }s long at ${quality})`}
                                    secondary={`Created at ${date.toLocaleTimeString()} on ${date.toLocaleDateString()}`}
                                  />
                                  <ListItemSecondaryAction>
                                    <Tooltip
                                      title="Delete this clip"
                                      aria-label="delete clip"
                                    >
                                      <IconButton
                                        edge="end"
                                        aria-label="delete clip"
                                        onClick={() => {
                                          const cpy = curr.clips.filter(
                                            (_, index) => index !== i
                                          );
                                          setClips(id, cpy);
                                          const cpy2 = { ...collections };
                                          cpy2[id] = { ...curr, clips: cpy };
                                          setCollections(cpy2);
                                        }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </ListItemSecondaryAction>
                                </ListItem>
                              );
                            }
                          )}
                        </List>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            deleteCollection(id);
                            const cpy = { ...collections };
                            delete cpy[id];
                            setCollections(cpy);
                          }}
                        >
                          Delete Collection
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              }
              return cards;
            })()}
          </Grid>
        )}
        {collections !== null && Object.keys(collections).length === 0 && (
          <Typography variant="h4" className={classes.missing}>
            No Saved VODs or Clips found
          </Typography>
        )}
      </Container>
    </>
  );
};
export default Bookmark;
