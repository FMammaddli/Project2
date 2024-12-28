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
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
      <header className="bg-green-500 text-white py-8 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Recipe Manager</h1>
          <p className="text-lg">Discover, create, and share amazing recipes with ease!</p>
        </div>
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
              <strong>ID:</strong> {featuredRecipe.id}
            </p>
            <p>
              <strong>Difficulty:</strong> {featuredRecipe.difficulty}
            </p>
            <p>
              <strong>Ingredients:</strong> {featuredRecipe.ingredients.join(", ")}
            </p>
            <p>
              <strong>Steps:</strong> {featuredRecipe.steps.join(", ")}
            </p>
            <p>
              <strong>Tags:</strong> {featuredRecipe.tags.join(", ")}
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
