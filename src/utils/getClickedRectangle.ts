const getClickedRectangle = (
    rectangleCoordinates: [[number, number], [number, number]],
    clickX: number,
    clickY: number
) => {
    // need to check whether the rectangle was drawn from left to right or right to left

    const [x1, y1] = rectangleCoordinates[0];
    const [x2, y2] = rectangleCoordinates[1];

    const xMin = Math.min(x1, x2);
    const xMax = Math.max(x1, x2);
    const yMin = Math.min(y1, y2);
    const yMax = Math.max(y1, y2);

    if (clickX >= xMin && clickX <= xMax && clickY >= yMin && clickY <= yMax) {
        return true;
    } else {
        return false;
    }
};

export default getClickedRectangle;
