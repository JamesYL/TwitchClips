import React from "react";
export const useDimensions = () => {
  const [dimensions, setDimensions] = React.useState([0, 0]);
  React.useEffect(() => {
    const update = () => {
      setDimensions([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  }, []);
  return dimensions;
};
