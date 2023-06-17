interface DrawMouseCursorHighlightCircleArgs {
    context: CanvasRenderingContext2D;
    mousePosition: [number, number]
}



const drawMouseCursorHighlightCircle = ({ context, mousePosition}: DrawMouseCursorHighlightCircleArgs) => {

    context.setLineDash([]);


    context.beginPath();
    context.arc(mousePosition[0], mousePosition[1], 50, 0, 2 * Math.PI);
    context.strokeStyle = "rgba(255, 255, 255)"
    context.lineWidth = 1
    context.stroke();

    context.beginPath();
    context.arc(mousePosition[0], mousePosition[1], 47, 0, 2 * Math.PI);
    context.strokeStyle = "rgba(0, 0, 0)"
    context.lineWidth = 4
    context.stroke();

    context.beginPath();
    context.arc(mousePosition[0], mousePosition[1], 45, 0, 2 * Math.PI);
    context.strokeStyle = "rgba(255, 255, 255)"
    context.lineWidth = 1
    context.stroke();

}

export default drawMouseCursorHighlightCircle;