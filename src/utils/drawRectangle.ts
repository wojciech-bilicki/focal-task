import { ColorSet } from "./getRandomColorSet";

interface DrawRectangleArgs {
    context: CanvasRenderingContext2D;
    start: [number, number];
    end: [number, number];
    colorSet: ColorSet;
    isSelected: boolean;
}

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
    context.strokeStyle = isSelected ? "rgb(255, 255, 255)" : colorSet.opaque;
    context.lineWidth = 10;
    context.setLineDash([5, 2, 15, 2, 5, 15]);
    context.strokeRect(
        start[0],
        start[1],
        end[0] - start[0],
        end[1] - start[1]
    );
    context.fill();
};

export default drawRectangle;
