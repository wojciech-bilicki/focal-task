import { ColorSet } from "./getRandomColorSet";

export interface Rectangle {
    coords: [[number, number], [number, number]];
    colorSet: ColorSet;
    id: string;
}
