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
app.post("/voddownload", (req, res) => {
  // data: {quality: ???, id: ??? times: [{startTime, endTime, filename}]}
  const data = req.body;
  electron.dialog
    .showOpenDialog({
      properties: ["openDirectory"],
      defaultPath: electron.app.getPath("downloads"),
    })
    .then((value) => {
      if (!value.canceled) {
        for (let i = 0; i < data.times.length; i++) {
          getVideo(
            data.id,
            data.times[i].startTime,
            data.times[i].endTime,
            data.quality,
            value.filePaths[0],
            data.times[i].filename
          );
        }
      }
    });
  res.status(200).end();
});
export default (): void => {
  app.listen(PORT, () => console.log("Server is ready on " + PORT));
};
