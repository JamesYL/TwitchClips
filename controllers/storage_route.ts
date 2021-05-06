import express, { Router } from "express";
import storage from "electron-json-storage";
import { getVodInfo } from "../twitch/getVod";

const router = express.Router();
const getRouter = (): Router => {
  router.get("/output_dir", (_, res) => {
    const data = storage.getSync("outputDir");
    res.json("outputDir" in data ? data["outputDir"] : null);
  });
  router.post("/output_dir", (req, res) => {
    storage.set("outputDir", { outputDir: req.body.outputDir }, null);
    res.end();
  });
  router.get("/collections", (_, res) => {
    res.json(storage.getSync("collections"));
  });
  router.get("/collections/:id", (req, res) => {
    const collections = storage.getSync("collections");
    if (req.params.id in collections) {
      res.json(collections[req.params.id]);
    } else res.json(null);
  });
  router.post("/collections/:id", async (req, res) => {
    const collections = storage.getSync("collections");
    const name = req.body.name;
    const clips = req.body.clips;
    const id = req.params.id;
    if (id in collections) {
      if (name) collections[id].name = name;
      if (clips) collections[id].clips = clips;
    } else {
      collections[id] = {
        name: name ? name : (await getVodInfo(id)).title,
        clips: clips ? clips : [],
      };
    }
    storage.set("collections", collections, null);
    res.end();
  });
  router.post("/collections/:id/add_clip", async (req, res) => {
    const collections = storage.getSync("collections");
    const clip = req.body.clip;
    const id = req.params.id;
    if (id in collections) {
      collections[id].clips.push(clip);
    } else {
      collections[id] = {
        name: (await getVodInfo(id)).title,
        clips: [clip],
      };
    }
    storage.set("collections", collections, null);
    res.end();
  });
  router.delete("/collections/:id", async (req, res) => {
    const collections = storage.getSync("collections");
    const id = req.params.id;
    if (id in collections) {
      delete collections[id];
      storage.set("collections", collections, null);
    }
    res.end();
  });

  return router;
};
export default getRouter;
