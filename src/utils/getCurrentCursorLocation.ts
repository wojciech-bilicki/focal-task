import { SelectedHandleId, getSelectedHandlePosition } from "../drawing/drawHandles";

interface GetCurrentCursorLocationArgs {
    selectedHandleId: SelectedHandleId;
    rectangleCoordinates: [[number, number], [number, number]] | null;
}

const getCurrentCursorLocation= ({ selectedHandleId, rectangleCoordinates}: GetCurrentCursorLocationArgs) => {
    if (!rectangleCoordinates) {
        return null;
    }
    if (!selectedHandleId) {
        return rectangleCoordinates[1];
    } else {
        return getSelectedHandlePosition({end: rectangleCoordinates[1], start: rectangleCoordinates[0], selectedHandleId});
    }

    
}


export default getCurrentCursorLocation;