import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecipePage from "./pages/RecipeCard";
import RecipeDetails from "./pages/RecipeDetails";
import HomePage from "./pages/HomePage";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
