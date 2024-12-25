import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import RecipePage from './RecipePage';
import ContactPage from './ContactPage';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import RecipePage from './RecipePage';
import ContactPage from './ContactPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-950">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipe" element={<RecipePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;