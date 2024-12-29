import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import RecipePage from './RecipePage';
import ContactPage from './ContactPage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipe" element={<RecipePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
    </Router>
  );
}


export default App;