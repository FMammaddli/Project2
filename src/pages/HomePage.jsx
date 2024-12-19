import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to the Recipe Manager App</h1>
      <p>Organize, create, and discover amazing recipes. Start managing your favorite recipes today!</p>

      <Link to="/recipe" style={{ margin: '10px', display: 'inline-block', fontSize: '1.2rem' }}>
        View Recipe Page
      </Link>
      <Link to="/contact" style={{ margin: '10px', display: 'inline-block', fontSize: '1.2rem' }}>
        Contact Me
      </Link>
    </div>
  );
};

export default HomePage;
