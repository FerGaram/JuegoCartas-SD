import { type JSX } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import HostPlayersTable from "./components/HostPlayersTable";
import CreateHostRoom from "./components/CreateHostRoom";

import "./App.css";

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/select-player" element={<HostPlayersTable />} />
        <Route path="/player-host" element={<CreateHostRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
