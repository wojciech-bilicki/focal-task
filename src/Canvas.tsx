import { useEffect, useRef, useState } from "react";
import useCanvas from "./useCanvas";

import $ from "./Canvas.module.css";

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
    const {
        canvasRef,
        startPaint,
        exitPaint,
        paint,
        selectedHandleId,
        resizeRectangle,
    } = useCanvas();
    const imageRef = useRef<HTMLImageElement | null>(null);

    const [imageLoadingState, setImageLoadingState] =
        useState<ImageLoadingState>(ImageLoadingState.NOT_STARTED);
    const [imageSize, setImageSize] = useState<{
        width: number;
        height: number;
    }>();

    useEffect(() => {
        if (
            imageLoadingState === ImageLoadingState.LOADED &&
            imageRef.current
        ) {
            setImageSize({
                width: imageRef.current.width,
                height: imageRef.current.height,
            });
        }
    }, [imageLoadingState]);

    return (
        <div className={$.wrapper}>
            <img
                src={imageUrl}
                alt="canvas"
                ref={imageRef}
                onLoadStart={() =>
                    setImageLoadingState(ImageLoadingState.LOADING)
                }
                onLoad={() => setImageLoadingState(ImageLoadingState.LOADED)}
            />
            <canvas
                className={$.canvas}
                ref={canvasRef}
                style={{ border: "1px solid black" }}
                onMouseDown={startPaint}
                onMouseUp={exitPaint}
                onMouseMove={selectedHandleId ? resizeRectangle : paint}
                width={imageSize?.width}
                height={imageSize?.height}
            />
        </div>
    );
};

export default Canvas;
