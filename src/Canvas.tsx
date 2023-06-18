import { useEffect, useRef, useState, useMemo } from "react";
import useCanvas from "./useCanvas";

import $ from "./Canvas.module.css";
import useZoom from "./useZoom";
import type { Rectangle } from "./utils/types";

interface Props {
    imageUrl: string;
    rectangles: Rectangle[];
    setRectangles: (rectangles: Rectangle[]) => void;
}

enum ImageLoadingState {
    NOT_STARTED,
    LOADING,
    LOADED,
    ERROR,
}

const ZOOM_AREA_SIZE = 300;
const MIN_ZOOM_LEVEL = 1;
const MAX_ZOOM_LEVEL = 4;
const ZOOM_INCREMENT = 0.5;

const Canvas = ({ imageUrl, rectangles, setRectangles }: Props) => {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [zoomLevel, setZoomLevel] = useState(2);

    //manage canvas and drawing hook
    const {
        canvasRef,
        startPaint,
        exitPaint,
        paint,
        selectedHandleId,
        resizeRectangle,
        currentCursorLocation,
        selectedRectangleId,
        removeSelectedRectangle,
    } = useCanvas({
        rectangles,
        setRectangles,
    });

    //manage zoom hook
    const { zoomCanvasRef } = useZoom({
        sourceImage: imageRef.current,
        sourceCanvas: canvasRef.current,
        cursorLocation: currentCursorLocation,
        zoomLevel,
    });

    const [imageLoadingState, setImageLoadingState] =
        useState<ImageLoadingState>(ImageLoadingState.NOT_STARTED);

    const [imageSize, setImageSize] = useState<{
        width: number;
        height: number;
    }>();

    // handle delete key press to remove selected rectangle
    useEffect(() => {
        const handleDeletePress = (event: KeyboardEvent) => {
            if (event.key === "Delete" && selectedRectangleId) {
                removeSelectedRectangle();
            }
        };

        window.addEventListener("keydown", handleDeletePress);
        return () => {
            window.removeEventListener("keydown", handleDeletePress);
        };
    }, [selectedRectangleId]);

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

    const onMouseDown = (
        event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        const newMousePosition: [number, number] = [
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY,
        ];

        startPaint(newMousePosition);
    };

    const onMouseMove = (
        event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        const newMousePosition: [number, number] = [
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY,
        ];

        if (selectedHandleId) {
            resizeRectangle(newMousePosition);
        } else {
            paint(newMousePosition);
        }
    };

    const onTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
        const rect = (
            event.target as HTMLCanvasElement
        ).getBoundingClientRect();

        const newMousePosition: [number, number] = [
            event.touches[0].clientX - rect.left,
            event.touches[0].clientY - rect.top,
        ];

        startPaint(newMousePosition);
    };

    const onTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
        const rect = (
            event.target as HTMLCanvasElement
        ).getBoundingClientRect();

        const newMousePosition: [number, number] = [
            event.touches[0].clientX - rect.left,
            event.touches[0].clientY - rect.top,
        ];
        if (selectedHandleId) {
            resizeRectangle(newMousePosition);
        } else {
            paint(newMousePosition);
        }
    };

    return (
        <>
            {currentCursorLocation && (
                <div className={$.zoomWrapper}>
                    <canvas
                        width={ZOOM_AREA_SIZE}
                        height={ZOOM_AREA_SIZE}
                        className={$.zoomCanvas}
                        ref={zoomCanvasRef}
                    />
                </div>
            )}
            <div className={$.controls}>
                {selectedRectangleId && (
                    <button
                        className={$.deleteButton}
                        onClick={removeSelectedRectangle}
                    >
                        Delete selected rectangle
                    </button>
                )}
                <div>
                    <span className={$.zoomLevel}>ZOOM LEVEL: {zoomLevel}</span>
                    <button
                        onClick={() =>
                            setZoomLevel((prevZoomLevel) => {
                                if (prevZoomLevel > MIN_ZOOM_LEVEL) {
                                    return prevZoomLevel - ZOOM_INCREMENT;
                                }
                                return prevZoomLevel;
                            })
                        }
                    >
                        -
                    </button>
                    <button
                        onClick={() =>
                            setZoomLevel((prevZoomLevel) => {
                                if (prevZoomLevel < MAX_ZOOM_LEVEL) {
                                    return prevZoomLevel + ZOOM_INCREMENT;
                                }
                                return prevZoomLevel;
                            })
                        }
                    >
                        +
                    </button>
                </div>
            </div>

            <div className={$.outerWrapper}>
                <div className={$.innerWrapper}>
                    <img
                        // need that to avoid CORS error also why I had to write the proxy image server
                        //  so that I can copy the image data from the canvas
                        // and build the zoom feature
                        crossOrigin="anonymous"
                        src={imageUrl}
                        alt="canvas"
                        ref={imageRef}
                        onLoadStart={() =>
                            setImageLoadingState(ImageLoadingState.LOADING)
                        }
                        onLoad={() =>
                            setImageLoadingState(ImageLoadingState.LOADED)
                        }
                    />
                    <canvas
                        className={$.canvas}
                        ref={canvasRef}
                        onMouseDown={onMouseDown}
                        onMouseUp={exitPaint}
                        onMouseMove={onMouseMove}
                        onTouchStart={onTouchStart}
                        onTouchEnd={exitPaint}
                        onTouchMove={onTouchMove}
                        width={imageSize?.width}
                        height={imageSize?.height}
                    />
                </div>
            </div>
        </>
    );
};

export default Canvas;
