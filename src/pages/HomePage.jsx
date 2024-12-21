import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [featuredRecipe, setFeaturedRecipe] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/recipes")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setFeaturedRecipe(data[0]); 
        }
      })
      .catch((error) => {
        console.error("Error fetching featured recipe:", error);
      });
  }, []);

  const projects = [
    {
      title: "Project 1: AutoForm Filler",
      description: "A tool to automatically fill out job application forms.",
      link: "https://github.com/Ibrahim2307/web_and_mobile_project1",
    },
  ];

  return (
    <div className="home-page">
      <header>
        <h1>Welcome to the Recipe Manager App</h1>
        <p>Here you can create and search for amazing Recipes!.</p>
      </header>

      <section className="projects">
        <h2>My Projects</h2>
        <ul>
          {projects.map((project, index) => (
            <li key={index}>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.title}
              </a>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="navigation">
        <Link to="/recipes">
          <button>View Recipes</button>
        </Link>
      </section>

      <section className="featured-recipe">
        <h2>Featured Recipe</h2>
        {featuredRecipe ? (
          <div className="recipe-card">
            <h3>{featuredRecipe.title}</h3>
            <p>{featuredRecipe.description}</p>
            <p>
              <strong>Difficulty:</strong> {featuredRecipe.difficulty}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(featuredRecipe.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p>Loading featured recipe...</p>
        )}
      </section>
    </div>
  );
};
export default HomePage;
