import express from "express";
import cors from "cors";
const PORT = process.env.PORT || 8080;
const app = express();
import { getVodInfo, getQualities, getVideo } from "./twitch/getVod";
import electron from "electron";
import path from "path";
import crypto from "crypto";
import Observable from "./util/Observable";

if (process.env.NODE_ENV === "development") {
  console.log("Development build...");
  app.use(cors());
} else {
  console.log("Production build...");
  app.use(express.static("build"));
}
app.use(express.json());

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

app.get("/vodinfo/:id", (req, res) => {
  getVodInfo(req.params.id)
    .then((vodInfo) => {
      res.send(vodInfo);
    })
    .catch(() => {
      res.status(400).end();
    });
});
app.get("/vodqualities/:id", (req, res) => {
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
app.post("/voddownload", (req, res) => {
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
    res.send({
      downloadID,
    });
    Promise.all(vids).then(() => observ.finish());
  } catch (err) {
    res.status(400).json({ message: "Could not get video" });
  }
});
app.get("/voddownload/:vodID", (req, res) => {
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
app.get("/output", (_, res) => {
  electron.dialog
    .showOpenDialog({
      properties: ["openDirectory"],
      defaultPath: electron.app.getPath("downloads"),
    })
    .then((value) => {
      if (!value.canceled) {
        res.json({ path: value.filePaths });
      } else {
        res.status(404).json({ message: "Cancelled dialog" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Internal error" });
    });
});
app.post("/openexternal", (req, res) => {
  // req.body as {url: string};
  electron.shell.openExternal(req.body.url);
  res.end();
});
export default (): void => {
  app.listen(PORT, () => console.log("Server is ready on " + PORT));
};
