export interface ColorSet {
    transparent: string;
    opaque: string;
}

const getRandomColorSet = (alpha = 1): ColorSet => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return {
        transparent: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
        opaque: `rgb(${red}, ${green}, ${blue})`,
    };
};

export default getRandomColorSet;
