import express from "express";
import cors from "cors";
const PORT = process.env.PORT || 8080;
const app = express();
import { getVodInfo, getQualities, getVideo } from "./twitch/getVod";
import electron from "electron";
import path from "path";

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
app.post("/voddownload", async (req, res) => {
  const data = req.body as {
    quality: string;
    id: string;
    times: { startTime: number; endTime: number; filename: string }[];
    outputFolder?: string;
  };
  try {
    const vids = [];
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
          data.times[i].filename
        )
      );
    }
    await Promise.all(vids);
    res.status(200).end();
  } catch (err) {
    res.status(400).json({ message: "Could not get video" });
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
export default (): void => {
  app.listen(PORT, () => console.log("Server is ready on " + PORT));
};
