import axios from "axios";
import { openFolderToChoose } from "./misc";
export interface Clip {
  name: string;
  createdAt: string;
  startTime: number;
  endTime: number;
  quality: string;
}
export interface Collections {
  [id: string]: SingleCollection;
}
export interface SingleCollection {
  name: string;
  clips: Clip[];
}
export const setOutputPath = async () => {
  try {
    const path = await openFolderToChoose();
    axios.post("/storage/output_dir", { outputDir: path });
    return path;
  } catch (err) {
    return getOutputPath();
  }
};
export const getOutputPath = async () => {
  return (await axios.get<string | null>("/storage/output_dir")).data;
};
export const getCollections = async (): Promise<Collections> => {
  return (await axios.get<Collections>("/storage/collections")).data;
};
export const getSingleCollection = async (
  id: string
): Promise<SingleCollection | null> => {
  return (
    await axios.get<SingleCollection | null>(`/storage/collections/${id}`)
  ).data;
};
export const setCollectionName = (id: string, name: string) => {
  axios.post(`/storage/collections/${id}`, { name });
};
export const addClip = async (id: string, clip: Clip) => {
  axios.post(`/storage/collections/${id}/add_clip`, { clip });
};
export const setClips = async (id: string, clips: Clip[]) => {
  axios.post(`/storage/collections/${id}`, { clips });
};
