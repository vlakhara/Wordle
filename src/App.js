import HowToPlay from "./component/HowToPlay";
import "./App.css";
import { useState } from "react";
import { Button } from "@mui/material";
function App() {
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  
  return (
    <div className="prevent-select">
      <Button
        onClick={() => {
          setIsHowToPlayOpen(true);
        }}
      >
        Open
      </Button>
      {isHowToPlayOpen && (
        <HowToPlay onClick={() => setIsHowToPlayOpen(false)} />
      )}
    </div>
  );
}

export default App;
