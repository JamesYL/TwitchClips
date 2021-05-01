import { Container, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import { getVodInfo, VodInfo } from "../../services/twitch";
import { useDimensions } from "../../util/util";
import Navbar from "../util/Navbar";
import ErrorVodPage from "./ErrorVodPage";
const useStyles = makeStyles((theme: Theme) => {
  return {
    test: {},
  };
});
const AnalyzeVod = () => {
  const { vodID } = useParams() as { vodID: string };
  const [vodInfo, setVodInfo] = React.useState<VodInfo | null | undefined>();
  const [width] = useDimensions();
  const classes = useStyles();

  React.useEffect(() => {
    getVodInfo(vodID)
      .then(({ data }) => {
        setVodInfo(data);
      })
      .catch(() => {
        setVodInfo(null);
      });
  }, [vodID]);
  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <br />
        {vodInfo === null ? (
          <ErrorVodPage />
        ) : (
          <div>
            <iframe
              src={`https://player.twitch.tv/?video=v${vodID}&parent=localhost`}
              title="Twitch embed"
              width={width * 0.8}
              height={width * 0.45}
            ></iframe>
          </div>
        )}
      </Container>
    </>
  );
};

export default AnalyzeVod;
