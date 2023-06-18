interface DrawZoomedPixelsArgs {
    sourceCanvasImageData: ImageData;
    zoomLevel: number;
    zoomCanvasContext: CanvasRenderingContext2D;
    previewSize: number;
}

const drawZoomedPixels = ({
    sourceCanvasImageData,
    zoomLevel,
    zoomCanvasContext,
    previewSize,
}: DrawZoomedPixelsArgs) => {
    for (let i = 0; i < sourceCanvasImageData.data.length; i += 4) {
        const pixelIndex = i / 4;
        const pixelX = pixelIndex % previewSize;
        const pixelY = Math.floor(pixelIndex / previewSize);

        // determine the RGBA color for the current pixel
        const r = sourceCanvasImageData.data[i + 0];
        const g = sourceCanvasImageData.data[i + 1];
        const b = sourceCanvasImageData.data[i + 2];
        const a = sourceCanvasImageData.data[i + 3] / 255; // alpha is in the range 0-255, so we normalize it to 0-1

        // set the fill color
        zoomCanvasContext.fillStyle = `rgba(${r},${g},${b},${a})`;

        // draw a zoomed-in pixel on the preview canvas
        zoomCanvasContext.fillRect(
            pixelX * zoomLevel,
            pixelY * zoomLevel,
            zoomLevel,
            zoomLevel
        );
    }
};

export default drawZoomedPixels;
