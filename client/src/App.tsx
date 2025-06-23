import { type JSX } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import HostPlayersTable from "./components/HostPlayersTable";
import UnoGame from "./components/UnoGame";
import UnoInstructions from "./components/UnoInstructions";
import AboutUs from "./components/AboutUs";

import "./App.css";

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/instrucciones" element={<UnoInstructions />} />
        <Route path="/acercade" element={<AboutUs />} />
        <Route path="/select-player" element={<HostPlayersTable />} />
        <Route path="/game" element={<UnoGame gameId={""} playerId={""} playerName={""} onGameEnd={function (): void {
          throw new Error("Function not implemented.");
        } } />} />
      </Routes>
    </Router>
  );
}

export default App;