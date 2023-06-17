import { ColorSet } from "../utils/getRandomColorSet";

interface DrawRectangleArgs {
    context: CanvasRenderingContext2D;
    start: [number, number];
    end: [number, number];
    colorSet: ColorSet;
    isSelected: boolean;
}

const STROKE_WIDTH = 10

const SELECTED_STROKE_COLOR = "rgb(255, 255, 255)"

const LINE_DASH_SPACING = [5, 2, 15, 2, 5, 15]

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
    context.strokeStyle = isSelected ? SELECTED_STROKE_COLOR : colorSet.opaque;
    context.lineWidth = STROKE_WIDTH;
    context.setLineDash(LINE_DASH_SPACING);
    context.fill();
    context.strokeRect(
        start[0],
        start[1],
        end[0] - start[0],
        end[1] - start[1]
    );
};

export default drawRectangle;
