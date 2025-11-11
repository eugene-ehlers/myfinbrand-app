// src/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Insights from "./pages/Insights"; // <-- add this
import DecisionEngines101 from "./pages/articles/DecisionEngines101"; // already exists from earlier

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/insights" element={<Insights />} /> {/* <-- add this */}
      <Route path="/insights/decision-engines-101" element={<DecisionEngines101 />} />
    </Routes>
  );
}

