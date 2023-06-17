import { useRef } from "react";

const useZoom = (zoomImage: string | null) => {
  const zoomCanvasRef = useRef<HTMLCanvasElement | null>(null);
  return {
    zoomCanvasRef,
  };
};

export default useZoom;
