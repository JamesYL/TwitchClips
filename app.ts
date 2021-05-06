import express from "express";
import cors from "cors";
import path from "path";
import net from "net";
import { BrowserWindow } from "electron";
import twitchRoute from "./controllers/twitch_route";
import miscRoute from "./controllers/misc_route";
import storageRoute from "./controllers/storage_route";
const app = express();

app.use(express.json());
app.use("/twitch", twitchRoute());
app.use("/misc", miscRoute());
app.use("/storage", storageRoute());

if (process.env.NODE_ENV === "development") {
  console.log("Development build...");
  app.use(cors());
} else {
  console.log("Production build...");
  app.use(express.static(path.join(process.resourcesPath, "build")));
  app.get("*", function (_, res) {
    res.sendFile(path.join(process.resourcesPath, "build", "index.html"));
  });
}
export default (window: BrowserWindow): void => {
  let port = process.env.NODE_ENV === "development" ? 8000 : 0;
  const server = app.listen(port, () => {
    port = (server.address() as net.AddressInfo).port;
    console.log("Server is ready on " + port);
    window.loadURL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : `http://localhost:${port}`
    );
  });
};
