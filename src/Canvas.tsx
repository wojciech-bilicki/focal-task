import { useEffect, useRef, useState, useMemo } from "react";
import useCanvas from "./useCanvas";

import $ from "./Canvas.module.css";
import useZoom from "./useZoom";

interface Props {
  imageUrl: string;
}

enum ImageLoadingState {
  NOT_STARTED,
  LOADING,
  LOADED,
  ERROR,
}

const Canvas = ({ imageUrl }: Props) => {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const {
    canvasRef,
    startPaint,
    exitPaint,
    paint,
    selectedHandleId,
    resizeRectangle,
    zoomImage,
    currentCursorLocation,
  } = useCanvas();

  console.log(currentCursorLocation);
  const { zoomCanvasRef } = useZoom(zoomImage);

  const [imageLoadingState, setImageLoadingState] = useState<ImageLoadingState>(
    ImageLoadingState.NOT_STARTED
  );
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  }>();

  useEffect(() => {
    if (imageLoadingState === ImageLoadingState.LOADED && imageRef.current) {
      setImageSize({
        width: imageRef.current.width,
        height: imageRef.current.height,
      });
    }
  }, [imageLoadingState]);

  console.log(
    `${currentCursorLocation?.[0] || 0}px ${currentCursorLocation?.[1] || 0}px`
  );
  return (
    <>
      <div className={$.zoomWrapper}>
        <img
          className={$.zoomCanvas}
          src={imageUrl}
          style={{
            objectPosition: `-${currentCursorLocation?.[0] || 0}px -${
              currentCursorLocation?.[1] || 0
            }px`,
          }}
        />
        <img className={$.zoomImage} src={zoomImage || ""} />
      </div>
      <div className={$.wrapper}>
        <img
          src={imageUrl}
          alt="canvas"
          ref={imageRef}
          onLoadStart={() => setImageLoadingState(ImageLoadingState.LOADING)}
          onLoad={() => setImageLoadingState(ImageLoadingState.LOADED)}
        />
        <canvas
          className={$.canvas}
          ref={canvasRef}
          onMouseDown={startPaint}
          onMouseUp={exitPaint}
          onMouseMove={selectedHandleId ? resizeRectangle : paint}
          width={imageSize?.width}
          height={imageSize?.height}
        />
      </div>
    </>
  );
};

export default Canvas;
