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
} from "@material-ui/core";
import Navbar from "../util/Navbar";
import { getCollections, setClips } from "../../storage/storage";
import DeleteIcon from "@material-ui/icons/Delete";
import { getExternal } from "../../services/twitch";
import React from "react";

const Bookmark = () => {
  const [collections, setCollections] = React.useState(getCollections());
  return (
    <>
      <Navbar />
      <Container>
        {(() => {
          const cards: JSX.Element[] = [];
          for (const id in collections) {
            const curr = collections[id];
            cards.push(
              <Card key={id}>
                <CardContent>
                  <Typography variant="h6">
                    <Link href={`/search/${id}`}>{curr.name}</Link>
                  </Typography>
                  <List>
                    {curr.clips.map(
                      ({ name, createdAt, startTime, endTime, quality }, i) => {
                        const date = new Date(createdAt);
                        return (
                          <ListItem
                            button
                            onClick={() => {
                              getExternal(
                                `https://www.twitch.tv/videos/${id}?t=${startTime}s`
                              );
                            }}
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
                                <IconButton edge="end" aria-label="delete clip">
                                  <DeleteIcon
                                    onClick={() => {
                                      const cpy = curr.clips.filter(
                                        (_, index) => index !== i
                                      );
                                      setClips(id, cpy);
                                      const cpy2 = { ...collections };
                                      cpy2[id] = { ...curr, clips: cpy };
                                      setCollections(cpy2);
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      }
                    )}
                  </List>
                </CardContent>
              </Card>
            );
          }
          return cards;
        })()}
      </Container>
    </>
  );
};
export default Bookmark;
