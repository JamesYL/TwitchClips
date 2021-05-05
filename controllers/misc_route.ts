import express, { Router } from "express";
import electron from "electron";

const router = express.Router();
const getRouter = (): Router => {
  router.get("/output", (_, res) => {
    electron.dialog
      .showOpenDialog({
        properties: ["openDirectory"],
        defaultPath: electron.app.getPath("downloads"),
      })
      .then((value) => {
        if (!value.canceled) {
          res.json(value.filePaths[0]);
        } else {
          res.status(404).json({ message: "Cancelled dialog" });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Internal error" });
      });
  });
  router.post("/openexternal", (req, res) => {
    // req.body as {url: string};
    electron.shell.openExternal(req.body.url);
    res.end();
  });

  return router;
};
export default getRouter;
