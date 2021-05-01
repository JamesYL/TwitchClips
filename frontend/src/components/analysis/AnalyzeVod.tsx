import { Container } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import { getVodInfo, VodInfo } from "../../services/twitch";
import Navbar from "../util/Navbar";
import ErrorVodPage from "./ErrorVodPage";

const AnalyzeVod = () => {
  const { vodID } = useParams() as { vodID: string };
  const [vodInfo, setVodInfo] = React.useState<VodInfo | null | undefined>();
  React.useEffect(() => {
    getVodInfo(vodID)
      .then(({ data }) => setVodInfo(data))
      .catch((err) => setVodInfo(null));
  });
  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <br />
        {vodInfo === null ? <ErrorVodPage /> : <>test</>}
      </Container>
    </>
  );
};

export default AnalyzeVod;
