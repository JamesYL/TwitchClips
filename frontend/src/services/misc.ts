import axios from "axios";

export const getExternal = async (url: string) => {
  return axios.post(`/misc/openexternal`, { url });
};
export const openFolderToChoose = () => {
  return axios.get<{ path: string }>(`/misc/output`);
};
