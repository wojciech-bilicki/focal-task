interface GetResizedRectangleCoordinatesArgs {
    newMousePosition: [number, number];
    rectangleCoordinates: [[number, number], [number, number]];
    selectedHandleId: "top-left" | "bottom-left" | "top-right" | "bottom-right";
}

const getResizedRectangleCoordinates = ({
    newMousePosition,
    rectangleCoordinates,
    selectedHandleId,
}: GetResizedRectangleCoordinatesArgs): [
    [number, number],
    [number, number]
] => {
    console.log(selectedHandleId);
    switch (selectedHandleId) {
        case "top-left":
            return [
                [newMousePosition[0], newMousePosition[1]],
                rectangleCoordinates[1],
            ];
        case "bottom-left":
            return [
                [newMousePosition[0], rectangleCoordinates[0][1]],
                [rectangleCoordinates[1][0], newMousePosition[1]],
            ];
        case "top-right":
            return [
                [rectangleCoordinates[0][0], newMousePosition[1]],
                [newMousePosition[0], rectangleCoordinates[1][1]],
            ];
        case "bottom-right":
            return [
                [rectangleCoordinates[0][0], rectangleCoordinates[0][1]],
                [newMousePosition[0], newMousePosition[1]],
            ];
    }
};

export default getResizedRectangleCoordinates;
