import { ColorSet } from "./getRandomColorSet";

interface DrawHandlesArgs {
    context: CanvasRenderingContext2D;
    start: [number, number];
    end: [number, number];
    colorSet: ColorSet;
    selectedHandleId:
        | "top-left"
        | "bottom-left"
        | "top-right"
        | "bottom-right"
        | null;
}

export const HANDLE_RADIUS = 12;

const drawHandles = ({
    context,
    start,
    end,
    colorSet,
    selectedHandleId,
}: DrawHandlesArgs) => {
    context.beginPath();
    context.arc(start[0], start[1], HANDLE_RADIUS, 0, 2 * Math.PI);
    context.fillStyle = colorSet.opaque;
    context.fill();
    if (selectedHandleId === "top-left") {
        context.beginPath();
        context.setLineDash([]);
        context.arc(start[0], start[1], HANDLE_RADIUS, 0, 2 * Math.PI);
        context.lineWidth = 4;
        context.strokeStyle = "rgb(255, 255, 255)";
        context.stroke();
    }

    context.beginPath();
    context.arc(start[0], end[1], HANDLE_RADIUS, 0, 2 * Math.PI);
    context.fillStyle = colorSet.opaque;
    context.fill();

    if (selectedHandleId === "bottom-left") {
        context.beginPath();
        context.setLineDash([]);
        context.arc(start[0], end[1], HANDLE_RADIUS, 0, 2 * Math.PI);
        context.lineWidth = 4;
        context.strokeStyle = "rgb(255, 255, 255)";
        context.stroke();
    }

    context.beginPath();
    context.arc(end[0], start[1], HANDLE_RADIUS, 0, 2 * Math.PI);
    context.fillStyle = colorSet.opaque;
    context.fill();

    if (selectedHandleId === "top-right") {
        context.beginPath();
        context.setLineDash([]);
        context.arc(end[0], start[1], HANDLE_RADIUS, 0, 2 * Math.PI);
        context.lineWidth = 4;
        context.strokeStyle = "rgb(255, 255, 255)";
        context.stroke();
    }

    context.beginPath();
    context.arc(end[0], end[1], HANDLE_RADIUS, 0, 2 * Math.PI);
    context.fillStyle = colorSet.opaque;
    context.fill();

    if (selectedHandleId === "bottom-right") {
        context.beginPath();
        context.lineWidth = 4;
        context.setLineDash([]);
        context.arc(end[0], end[1], HANDLE_RADIUS, 0, 2 * Math.PI);
        context.strokeStyle = "rgb(255, 255, 255)";
        context.stroke();
    }
};

export default drawHandles;
