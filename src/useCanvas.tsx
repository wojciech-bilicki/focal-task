import { useEffect, useRef, useState } from "react";
import getRandomColorSet, { ColorSet } from "./utils/getRandomColorSet";

interface Rectangle {
    coords: [[number, number], [number, number]];
    colorSet: ColorSet;
    id: string;
}

interface ResizeHandle {
    x: number;
    y: number;
    radius: number;
    isSelected: boolean;
}

interface DrawRectangleArgs {
    context: CanvasRenderingContext2D;
    start: [number, number];
    end: [number, number];
    colorSet: ColorSet;
    isSelected: boolean;
}

const useCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<[number, number] | null>(
        null
    );
    const [rectangles, setRectangles] = useState<Rectangle[]>([]);
    const [currentRectangle, setCurrentRectangle] = useState<
        [[number, number], [number, number]] | null
    >(null);

    const [selectedRectangle, setSelectedRectangle] =
        useState<Rectangle | null>(null);

    const [resizeHandle, setResizeHandles] = useState<ResizeHandle[]>([]);

    const startPaint = (
        event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        const coords = [
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY,
        ] as [number, number];

        const clickedRectangle = rectangles.find(
            (rectangle) =>
                coords[0] >= rectangle.coords[0][0] &&
                coords[0] <= rectangle.coords[1][0] &&
                coords[1] >= rectangle.coords[0][1] &&
                coords[1] <= rectangle.coords[1][1]
        );
        if (clickedRectangle) {
            setSelectedRectangle(clickedRectangle);
        } else {
            setIsPainting(true);
            setMousePosition(coords);
            setCurrentRectangle([coords, coords]);
            setSelectedRectangle(null);
        }
    };

    const updateCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        // Clear the entire canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw all rectangles
        rectangles.forEach((rectangle) => {
            drawRectangle({
                context,
                start: rectangle.coords[0],
                end: rectangle.coords[1],
                colorSet: rectangle.colorSet,
                isSelected: rectangle.id === selectedRectangle?.id,
            });
        });

        // Draw the current rectangle (if it exists)
        if (currentRectangle) {
            drawRectangle({
                context,
                start: currentRectangle[0],
                end: currentRectangle[1],
                colorSet: {
                    transparent: "rgba(0, 0, 0, 0.75)",
                    opaque: "rgb(0, 0, 0)",
                },
                isSelected: false,
            });
        }
    };

    useEffect(() => {
        updateCanvas();
    }, [rectangles, currentRectangle, selectedRectangle]);

    const paint = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!isPainting) return;
        const newMousePosition: [number, number] = [
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY,
        ];
        setCurrentRectangle([
            mousePosition as [number, number],
            newMousePosition,
        ]);
    };

    const drawRectangle = ({
        colorSet,
        context,
        start,
        end,
        isSelected,
    }: DrawRectangleArgs) => {
        context.beginPath();
        context.rect(start[0], start[1], end[0] - start[0], end[1] - start[1]);
        context.fillStyle = colorSet.transparent;
        context.strokeStyle = isSelected
            ? "rgb(255, 255, 255)"
            : colorSet.opaque;
        context.lineWidth = 10;
        context.setLineDash([5, 2, 15, 2, 5, 15]);
        context.strokeRect(
            start[0],
            start[1],
            end[0] - start[0],
            end[1] - start[1]
        );
        context.fill();

        if (isSelected) {
            context.beginPath();
            context.arc(start[0], start[1], 12, 0, 2 * Math.PI);
            context.fillStyle = colorSet.opaque;
            context.fill();

            context.beginPath();
            context.arc(start[0], end[1], 12, 0, 2 * Math.PI);
            context.fillStyle = colorSet.opaque;
            context.fill();

            context.beginPath();
            context.arc(end[0], start[1], 12, 0, 2 * Math.PI);
            context.fillStyle = colorSet.opaque;
            context.fill();

            context.beginPath();
            context.arc(end[0], end[1], 12, 0, 2 * Math.PI);
            context.fillStyle = colorSet.opaque;
            context.fill();
        }
    };

    const exitPaint = () => {
        setIsPainting(false);
        setMousePosition(null);

        if (
            currentRectangle &&
            // Prevent rectangles with no area
            currentRectangle[0].toString() !== currentRectangle[1].toString()
        ) {
            setRectangles([
                ...rectangles,
                {
                    coords: currentRectangle,
                    colorSet: getRandomColorSet(0.75),
                    // stupid hack to get a unique id
                    id: Date.now().toString(),
                },
            ]);
        }
        setCurrentRectangle(null);
    };

    return {
        canvasRef,
        exitPaint,
        startPaint,
        paint,
    };
};

export default useCanvas;
