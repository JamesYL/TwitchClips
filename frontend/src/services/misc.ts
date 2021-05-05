import axios from "axios";

export const getExternal = async (url: string) => {
  return (await axios.post<void>(`/misc/openexternal`, { url })).data;
};
export const openFolderToChoose = async () => {
  return (await axios.get<string>(`/misc/output`)).data;
};
