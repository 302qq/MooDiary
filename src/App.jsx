import { BrowserRouter } from "react-router-dom";
import WindowFrame from "./components/layout/WindowFrame";
import "./styles/main.css";


function App() {
  return (
    <BrowserRouter>
      <WindowFrame />
    </BrowserRouter>
  );
}

export default App;