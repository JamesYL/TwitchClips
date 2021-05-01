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

export const getVodInfo = async (id: string | number) => {
  return axios.get<VodInfo>(`/vodinfo/${id}`);
};