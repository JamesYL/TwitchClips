import { getOutputPath } from "./storage";
import axios from "axios";

export type ImageURL = string;
export type DateString = string;
export interface VodInfo {
  title: string;
  views: number;
  url: string;
  language: string;
  created_at: DateString;
  published_at: DateString;
  recorded_at: DateString;
  game: string;
  length: number;
  preview: {
    small: ImageURL;
    medium: ImageURL;
    large: ImageURL;
  };
  channel: {
    display_name: string;
    logo: ImageURL;
    url: string;
    _id: string;
  };
}
export interface DownloadProgress {
  downloadID: string;
  progress: number;
}
export const getVodInfo = async (id: string | number) => {
  return (await axios.get<VodInfo>(`/twitch/vodinfo/${id}`)).data;
};

export const getQualities = async (id: string | number) => {
  return (await axios.get<string[]>(`/twitch/vodqualities/${id}`)).data;
};

export const getDownloadProgress = async (vodID: string | number) => {
  return (await axios.get<DownloadProgress[]>(`/twitch/voddownload/${vodID}`))
    .data;
};
export const downloadClip = async (
  id: string | number,
  startTime: number,
  endTime: number,
  filename: string,
  quality = ""
) => {
  return (
    await axios.post<string>(`/twitch/voddownload`, {
      quality,
      id,
      times: [{ startTime, endTime, filename }],
      outputFolder: await getOutputPath(),
    })
  ).data;
};
