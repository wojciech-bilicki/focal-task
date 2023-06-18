import { useEffect, useRef } from "react";
import drawZoomedPixels from "./drawing/drawZoomedPixels";

interface UseZoomArgs {
    sourceImage: HTMLImageElement | null;
    sourceCanvas: HTMLCanvasElement | null;
    cursorLocation: [number, number] | null;
    previewSize?: number;
    zoomLevel?: number;
}

const useZoom = ({
    cursorLocation,
    sourceCanvas,
    sourceImage,
    zoomLevel = 200,
    previewSize = 300,
}: UseZoomArgs) => {
    const zoomCanvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        updatePreview();
    }, [cursorLocation]);

    const updatePreview = () => {
        if (!cursorLocation) {
            return;
        }

        const x = cursorLocation[0];
        const y = cursorLocation[1];

        drawZoomedImageData(x, y);
    };

    const drawZoomedImageData = (x: number, y: number) => {
        if (!sourceCanvas || !sourceImage || !zoomCanvasRef.current) {
            return;
        }

        const sourceCanvasContext = sourceCanvas.getContext("2d", {
            willReadFrequently: true,
        });

        const zoomCanvasContext = zoomCanvasRef.current.getContext("2d", {
            willReadFrequently: true,
        });

        if (sourceCanvasContext === null || zoomCanvasContext === null) {
            return;
        }

        zoomCanvasContext.clearRect(
            0,
            0,
            zoomCanvasRef.current.width,
            zoomCanvasRef.current.height
        );

        const halfSize = previewSize / 2 / zoomLevel;

        const centerX = x - halfSize / 1.5;
        const centerY = y - halfSize / 1.5;

        zoomCanvasContext.drawImage(
            sourceImage,
            centerX,
            centerY,
            previewSize / zoomLevel,
            previewSize / zoomLevel,
            0,
            0,
            previewSize,
            previewSize
        );

        const sourceCanvasImageData = sourceCanvasContext.getImageData(
            centerX,
            centerY,
            previewSize,
            previewSize
        );

        drawZoomedPixels({
            zoomCanvasContext,
            sourceCanvasImageData,
            previewSize,
            zoomLevel,
        });
    };

    return {
        zoomCanvasRef,
    };
};

export default useZoom;
