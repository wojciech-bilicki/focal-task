import { useEffect, useRef, useState } from "react";
import getRandomColorSet, { ColorSet } from "./utils/getRandomColorSet";
import drawRectangle from "./drawing/drawRectangle";
import drawHandles, { HANDLE_RADIUS } from "./drawing/drawHandles";
import getResizedRectangleCoordinates from "./utils/getResizedRectangleCoordinates";
import drawMouseCursorHighlightCircle from "./drawing/drawMouseCursorHighlightCircle";
import getCurrentCursorLocation from "./utils/getCurrentCursorLocation";

interface Rectangle {
  coords: [[number, number], [number, number]];
  colorSet: ColorSet;
  id: string;
}

type HandleId = "top-left" | "bottom-left" | "top-right" | "bottom-right";

interface ResizeHandle {
  x: number;
  y: number;
  isSelected: boolean;
  id: HandleId;
}

const ZOOM_AREA_SIZE = 200;

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

  const [selectedRectangleId, setSelectedRectangleId] = useState<string | null>(
    null
  );

  const [resizeHandles, setResizeHandles] = useState<ResizeHandle[]>([]);
  const [selectedHandleId, setSelectedHandleId] = useState<HandleId | null>(
    null
  );

  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [currentCursorLocation, setCurrentCursorLocation] = useState<
    [number, number] | null
  >(null);

  const startPaint = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const coords = [event.nativeEvent.offsetX, event.nativeEvent.offsetY] as [
      number,
      number
    ];

    const clickedRectangle = rectangles.find(
      (rectangle) =>
        coords[0] >= rectangle.coords[0][0] &&
        coords[0] <= rectangle.coords[1][0] &&
        coords[1] >= rectangle.coords[0][1] &&
        coords[1] <= rectangle.coords[1][1]
    );

    const clickedResizeHandle = resizeHandles.find((handle) => {
      return (
        coords[0] >= handle.x - HANDLE_RADIUS &&
        coords[0] <= handle.x + HANDLE_RADIUS &&
        coords[1] >= handle.y - HANDLE_RADIUS &&
        coords[1] <= handle.y + HANDLE_RADIUS
      );
    });

    if (clickedResizeHandle) {
      setSelectedHandleId(clickedResizeHandle?.id ?? null);
    }

    if (clickedRectangle) {
      setSelectedRectangleId(clickedRectangle.id);
      setResizeHandles([
        {
          x: clickedRectangle.coords[0][0],
          y: clickedRectangle.coords[0][1],
          isSelected: clickedResizeHandle?.id === "top-left",
          id: "top-left",
        },
        {
          x: clickedRectangle.coords[0][0],
          y: clickedRectangle.coords[1][1],
          isSelected: clickedResizeHandle?.id === "bottom-left",
          id: "bottom-left",
        },
        {
          x: clickedRectangle.coords[1][0],
          y: clickedRectangle.coords[0][1],
          isSelected: clickedResizeHandle?.id === "top-right",
          id: "top-right",
        },
        {
          x: clickedRectangle.coords[1][0],
          y: clickedRectangle.coords[1][1],
          isSelected: clickedResizeHandle?.id === "bottom-right",
          id: "bottom-right",
        },
      ]);
      if (!clickedResizeHandle) {
        setSelectedHandleId(null);
      }
    } else if (!clickedResizeHandle) {
      setIsPainting(true);
      setMousePosition(coords);
      setCurrentRectangle([coords, coords]);
      setResizeHandles([]);
      setSelectedRectangleId(null);
      setSelectedHandleId(null);
    }
  };

  const resizeRectangle = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!selectedRectangleId) return;

    const newMousePosition: [number, number] = [
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
    ];

    const newRectangles = rectangles.map((rectangle): Rectangle => {
      if (rectangle.id === selectedRectangleId && selectedHandleId) {
        return {
          ...rectangle,
          coords: getResizedRectangleCoordinates({
            rectangleCoordinates: rectangle.coords,
            newMousePosition,
            selectedHandleId,
          }),
        };
      } else {
        return rectangle;
      }
    });

    setRectangles(newRectangles);
  };

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
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
        isSelected: rectangle.id === selectedRectangleId,
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

    const selectedRectangle = rectangles.find(
      (rectangle) => rectangle.id === selectedRectangleId
    );

    if (selectedRectangle) {
      drawHandles({
        context,
        start: selectedRectangle.coords[0],
        end: selectedRectangle.coords[1],
        colorSet: selectedRectangle.colorSet,
        selectedHandleId: selectedHandleId,
      });
    }

    if ((selectedHandleId && selectedRectangle) || currentRectangle) {
      const currentCursorLocation = getCurrentCursorLocation({
        selectedHandleId,
        rectangleCoordinates: selectedRectangle?.coords ?? currentRectangle,
      });

      if (currentCursorLocation) {
        const imageData = context.getImageData(
          currentCursorLocation[0] - 10,
          currentCursorLocation[1] - 10,
          ZOOM_AREA_SIZE,
          ZOOM_AREA_SIZE
        );
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
        const tempCtx = tempCanvas.getContext("2d", {
          willReadFrequently: true,
        })!;

        tempCtx.putImageData(imageData, 0, 0);
        const zoomImg = tempCanvas.toDataURL();

        setCurrentCursorLocation(currentCursorLocation);
        setZoomImage(zoomImg);

        drawMouseCursorHighlightCircle({
          context,
          mousePosition: currentCursorLocation,
        });
      }
    }
  };

  useEffect(() => {
    updateCanvas();
  }, [
    rectangles,
    currentRectangle,
    selectedRectangleId,
    selectedHandleId,
    // image,
  ]);

  const paint = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isPainting) return;
    const newMousePosition: [number, number] = [
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
    ];

    setCurrentRectangle([mousePosition as [number, number], newMousePosition]);
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
    selectedHandleId,
    canvasRef,
    exitPaint,
    startPaint,
    paint,
    resizeRectangle,
    zoomImage,
    currentCursorLocation,
  };
};

export default useCanvas;
