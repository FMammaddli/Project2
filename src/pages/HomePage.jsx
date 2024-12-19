import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Recipe Manager App</h1>
      <p>Organize, create, and discover amazing recipes. Start managing your favorite recipes today!</p>
      <Link to="/recipe">
        View Recipe Page
      </Link>
      <Link to="/contact" >
        Contact Me
      </Link>
    </div>
  );
};

export default HomePage;
