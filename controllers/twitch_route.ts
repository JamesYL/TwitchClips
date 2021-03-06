import express, { Router } from "express";
import { getVodInfo, getQualities, getVideo } from "../twitch/getVod";
import electron from "electron";
import crypto from "crypto";
import Observable from "../util/Observable";
const router = express.Router();

const getRouter = (): Router => {
  router.get("/vodinfo/:id", (req, res) => {
    getVodInfo(req.params.id)
      .then((vodInfo) => {
        res.send(vodInfo);
      })
      .catch(() => {
        res.status(400).end();
      });
  });
  router.get("/vodqualities/:id", (req, res) => {
    getQualities(req.params.id)
      .then((qualities) => {
        res.send(qualities);
      })
      .catch(() => {
        res.status(400).end();
      });
  });
  interface DownloadProgress {
    [downloadID: string]: { progress: number };
  }
  const ongoingDownloads: {
    [vodID: string]: DownloadProgress;
  } = {};
  router.post("/voddownload", (req, res) => {
    const data = req.body as {
      quality: string;
      id: string;
      times: { startTime: number; endTime: number; filename: string }[];
      outputFolder?: string;
    };
    const downloadID = crypto.randomBytes(20).toString("hex");
    if (data.id in ongoingDownloads) {
      ongoingDownloads[data.id][downloadID] = { progress: 0 };
    } else {
      ongoingDownloads[data.id] = { [downloadID]: { progress: 0 } };
    }
    let totalTime = 0;
    data.times.forEach(
      ({ startTime, endTime }) => (totalTime += endTime - startTime)
    );
    try {
      const observ = new Observable((progress, completed) => {
        ongoingDownloads[data.id][downloadID].progress = Math.min(
          1,
          progress / totalTime
        );
        if (completed) {
          delete ongoingDownloads[data.id][downloadID];
          if (!Object.keys(ongoingDownloads[data.id]).length)
            delete ongoingDownloads[data.id];
        }
      });
      const vids: Promise<string>[] = [];
      for (let i = 0; i < data.times.length; i++) {
        vids.push(
          getVideo(
            data.id,
            data.times[i].startTime,
            data.times[i].endTime,
            data.quality,
            data.outputFolder
              ? data.outputFolder
              : electron.app.getPath("downloads"),
            data.times[i].filename,
            observ
          )
        );
      }
      res.json(downloadID);
      Promise.all(vids).then(() => observ.finish());
    } catch (err) {
      res.status(400).json({ message: "Could not get video" });
    }
  });
  router.get("/voddownload/:vodID", (req, res) => {
    const vodID = req.params.vodID;
    if (!(vodID in ongoingDownloads)) {
      res.send([]);
    } else {
      const output: { downloadID: string; progress: number }[] = [];
      for (const downloadID in ongoingDownloads[vodID]) {
        output.push({
          downloadID,
          progress: ongoingDownloads[vodID][downloadID].progress,
        });
      }
      res.send(output);
    }
  });

  return router;
};
export default getRouter;
