import {
  Button,
  Container,
  Grid,
  makeStyles,
  Slider,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import { downloadClip, getVodInfo, VodInfo } from "../../services/twitch";
import {
  addClip,
  getSingleCollection,
  setCollectionName,
} from "../../storage/storage";
import { useDimensions } from "../../util/util";
import Navbar from "../util/Navbar";
import Notification from "../util/Notification";
import ErrorVodPage from "./ErrorVodPage";
const useStyles = makeStyles((theme: Theme) => {
  return {
    container: {
      padding: 0,
      overflowX: "hidden",
    },
    slider: {
      width: "100%",
    },
    options: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    actions: {
      marginTop: theme.spacing(1),
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(3),
    },
    textfields: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  };
});
const secondsToNiceTime = (num: number) => {
  const numHours = ~~(num / 3600);
  const numMins = ~~((num - numHours * 3600) / 60);
  const numSecs = num - numHours * 3600 - numMins * 60;
  return `${numHours}h ${numMins}m ${numSecs}s`;
};
interface ValueLabelProps {
  children: React.ReactElement;
  open: boolean;
  value: number;
}
const ValueLabel = (props: ValueLabelProps) => {
  const { children, open, value } = props;
  return (
    <Tooltip
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={secondsToNiceTime(value)}
    >
      {children}
    </Tooltip>
  );
};
const AnalyzeVod = () => {
  const { vodID } = useParams() as { vodID: string };
  const [vodInfo, setVodInfo] = React.useState<VodInfo | null | undefined>();
  const [width] = useDimensions();
  const classes = useStyles();
  const [values, setValues] = React.useState<[number, number]>([0, 0]);
  const [vodButtonClicked, setVodButtonClicked] = React.useState(false);
  const [saveTimeClicked, setSaveTimeClicked] = React.useState(false);
  const [vodName, setVodName] = React.useState("");
  const [clipName, setClipName] = React.useState<null | string>(null);
  const [isErr, setIsErr] = React.useState(false);

  React.useEffect(() => {
    getVodInfo(vodID)
      .then(({ data }) => {
        setVodInfo(data);
        const collection = getSingleCollection(vodID);
        if (collection) {
          setVodName(collection.name);
          setVodButtonClicked(true);
        } else {
          setVodName(data.title);
        }
      })
      .catch(() => {
        setVodInfo(null);
      });
  }, [vodID]);
  const handleDownload = () => {
    downloadClip(
      vodID,
      values[0],
      values[1],
      clipName === null ? `${vodID}_${values[0]}s_to_${values[1]}s` : clipName,
      ""
    ).catch(() => {
      setIsErr(true);
    });
  };
  return (
    <>
      <Navbar />
      <Container maxWidth={false} className={classes.container}>
        {vodInfo === null && <ErrorVodPage />}
        {typeof vodInfo === "object" && (
          <>
            <iframe
              src={`https://player.twitch.tv/?video=v${vodID}&parent=localhost`}
              title="Twitch embed"
              width={width}
              height={width * 0.5625}
              allowFullScreen={true}
            />
            <div className={classes.options}>
              <Typography variant="subtitle1">
                Move the slider to select a time range (Use arrow keys for more
                precise movement)
              </Typography>
              <Slider
                value={values}
                ValueLabelComponent={ValueLabel}
                onChange={(_, values) => {
                  setValues(values as [number, number]);
                  setSaveTimeClicked(false);
                }}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={vodInfo?.length}
                getAriaValueText={(value) => `${value} seconds`}
                className={classes.slider}
              />
              <Typography variant="subtitle1">
                Time Selected: <b>{secondsToNiceTime(values[0])}</b> to{" "}
                <b>{secondsToNiceTime(values[1])}</b>
              </Typography>
              <Grid container spacing={2} className={classes.textfields}>
                <Grid item xs={12} sm={10} md={8} lg={7}>
                  <TextField
                    value={vodName}
                    label="VOD name"
                    onChange={(event) => {
                      setVodName(event.target.value);
                      setVodButtonClicked(false);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={10} md={8} lg={7}>
                  <TextField
                    fullWidth
                    value={
                      clipName === null
                        ? `${vodID}_${values[0]}s_to_${values[1]}s`
                        : clipName
                    }
                    label="Clip name"
                    onChange={(event) => {
                      setClipName(event.target.value);
                      setSaveTimeClicked(false);
                    }}
                  />
                </Grid>
              </Grid>
              <div className={classes.actions}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                >
                  Download Clip
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSaveTimeClicked(true);
                    addClip(vodID, {
                      name: clipName
                        ? clipName
                        : `${vodID}_${values[0]}s_to_${values[1]}s`,
                      createdAt: new Date().toString(),
                      startTime: values[0],
                      endTime: values[1],
                    });
                  }}
                  disabled={saveTimeClicked}
                >
                  {saveTimeClicked ? "Clip Saved" : "Save Time Selected"}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if (vodName) {
                      setCollectionName(vodID, vodName);
                      setVodButtonClicked(true);
                    }
                  }}
                  disabled={vodButtonClicked}
                >
                  {vodButtonClicked ? "VOD Saved" : "Save VOD"}
                </Button>
              </div>
            </div>
          </>
        )}
      </Container>
      <Notification
        open={isErr}
        setOpen={setIsErr}
        message="Could not get clip. Is the output folder valid?"
      />
    </>
  );
};

export default AnalyzeVod;
