import axios from "axios";
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
