import { useState } from "react";
import Canvas from "./Canvas";
import "./App.css";
import $ from "./App.module.css";
import Loader from "./Loader";
import { Rectangle } from "./utils/types";

function App() {
    const [imageToGetUrl, setImageToGetUrl] = useState(
        "https://blog.drupa.com/wp-content/uploads/2014/09/shutterstock_168437519-1000x605.jpg"
    );
    const [imageUrl, setImageUrl] = useState<string | null>();

    const [isLoading, setIsLoading] = useState(false);

    const [rectangles, setRectangles] = useState<Rectangle[]>([]);

    const loadImage = () => {
        setIsLoading(true);

        // need that to avoid CORS error also why I had to write the proxy image server
        //  so that I can copy the image data from the canvas
        // and build the zoom feature
        fetch(`http://localhost:3000/images?url=${imageToGetUrl}`).then((res) =>
            res.json().then((data) => {
                setImageUrl(`http://localhost:3000/${data.url}`);
                setIsLoading(false);
            })
        );
    };

    return (
        <>
            <div className={$.wrapper}>
                <label className={$.label}>
                    <p>Provide the url to the image</p>
                    <input
                        className={$.input}
                        value={imageToGetUrl}
                        onChange={(e) => setImageToGetUrl(e.target.value)}
                        placeholder="Provide img url"
                    />
                </label>
                <button onClick={loadImage}>Load Image</button>,
            </div>
            {isLoading && <Loader />}
            {imageUrl && (
                <Canvas
                    imageUrl={imageUrl}
                    rectangles={rectangles}
                    setRectangles={setRectangles}
                />
            )}
        </>
    );
}

export default App;
