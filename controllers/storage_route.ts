import express from "express";
import electron from "electron";

const router = express.Router();
const getRouter = () => {
  return router;
};
export default getRouter;
