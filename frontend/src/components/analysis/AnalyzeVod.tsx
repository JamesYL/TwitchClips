import React from "react";
import { useParams } from "react-router-dom";

const AnalyzeVod = () => {
  const { vodID } = useParams() as { vodID: string };
  return <div></div>;
};

export default AnalyzeVod;
