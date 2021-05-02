import axios from "axios";
import { getVodInfo } from "../services/twitch";
export const setOutputPath = async () => {
  try {
    const path = await axios.get<{ path: string }>("/output");
    console.log(path.data);
    window.localStorage.setItem("output-path", path.data.path);
    return path.data.path;
  } catch (err) {
    return getOutputPath();
  }
};
export const getOutputPath = () => {
  return window.localStorage.getItem("output-path");
};
export interface Clip {
  name: string;
  createdAt: string;
  startTime: number;
  endTime: number;
}
export interface Collections {
  [id: string]: {
    name: string;
    clips: Clip[];
  };
}
export const getCollections = (): Collections => {
  const collections = window.localStorage.getItem("saved-collections");
  if (collections) {
    return JSON.parse(collections);
  } else return {};
};
export const getSingleCollection = (id: string) => {
  const collections = getCollections();
  if (id in collections) return collections[id];
  return null;
};
export const setCollectionName = (id: string, name: string) => {
  const collections = getCollections();
  if (id in collections) {
    collections[id].name = name;
  } else {
    collections[id] = {
      name,
      clips: [],
    };
  }
  window.localStorage.setItem("saved-collections", JSON.stringify(collections));
};
export const addClip = async (id: string, clip: Clip) => {
  const collections = getCollections();
  if (id in collections) {
    collections[id].clips.push(clip);
  } else {
    const vodInfo = (await getVodInfo(id)).data;
    collections[id] = {
      name: vodInfo.title,
      clips: [clip],
    };
  }
  window.localStorage.setItem("saved-collections", JSON.stringify(collections));
};
export const setClips = async (id: string, clips: Clip[]) => {
  const collections = getCollections();
  if (id in collections) {
    collections[id].clips = clips;
  } else {
    const vodInfo = (await getVodInfo(id)).data;
    collections[id] = {
      name: vodInfo.title,
      clips: clips,
    };
  }
  window.localStorage.setItem("saved-collections", JSON.stringify(collections));
};
