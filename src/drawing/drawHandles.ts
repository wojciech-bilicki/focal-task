import { ColorSet } from "../utils/getRandomColorSet";

export type SelectedHandleId = 
| "top-left"
| "bottom-left"
| "top-right"
| "bottom-right"
| null;

interface GetSelectedHandlePositionArgs {
    start: [number, number];
    end: [number, number];
    selectedHandleId: SelectedHandleId;
}


interface DrawHandlesArgs extends GetSelectedHandlePositionArgs {
    context: CanvasRenderingContext2D;
    colorSet: ColorSet;
       
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

    context.beginPath();
    context.arc(start[0], end[1], HANDLE_RADIUS, 0, 2 * Math.PI);
    context.fillStyle = colorSet.opaque;
    context.fill();

    context.beginPath();
    context.arc(end[0], start[1], HANDLE_RADIUS, 0, 2 * Math.PI);
    context.fillStyle = colorSet.opaque;
    context.fill();

    context.beginPath();
    context.arc(end[0], end[1], HANDLE_RADIUS, 0, 2 * Math.PI);
    context.fillStyle = colorSet.opaque;
    context.fill();

    const selectedHandlePosition = getSelectedHandlePosition({end, start, selectedHandleId});

    if (selectedHandlePosition) {
        context.beginPath();
        context.lineWidth = 4;
        context.setLineDash([]);
        context.arc(selectedHandlePosition[0], selectedHandlePosition[1], HANDLE_RADIUS, 0, 2 * Math.PI);
        context.strokeStyle = "rgb(255, 255, 255)";
        context.stroke();
    }
};

export const getSelectedHandlePosition= ({end, start, selectedHandleId}: GetSelectedHandlePositionArgs): [number, number] | null => {
    
    switch (selectedHandleId) {
        case "top-left":
            return [start[0], start[1]]
        case "bottom-left":
            return [start[0], end[1]]
        case "top-right":
            return [end[0], start[1]]
        case "bottom-right":
            return [end[0], end[1]]
        default:
            return null;
    }
        
}

export default drawHandles;
