import "./App.css";
import Canvas from "./Canvas";

const imageUrl =
    "https://blog.drupa.com/wp-content/uploads/2014/09/shutterstock_168437519-1000x605.jpg";
function App() {
    return <Canvas imageUrl={imageUrl} />;
}

export default App;
