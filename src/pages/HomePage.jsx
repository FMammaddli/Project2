import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";

const HomePage = () => {
  const [featuredRecipe, setFeaturedRecipe] = useState(null);

  useEffect(() => {
    fetchFeaturedRecipe();
  }, []);

  /**
   * Fetch the newest recipe from JSON Server by sorting
   * on `lastUpdated` in descending order.
   */
  const fetchFeaturedRecipe = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/Recipes?_sort=lastUpdated&_order=desc&_limit=1"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch featured recipe from JSON Server");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setFeaturedRecipe(data[0]);
      }
    } catch (err) {
      console.error("Error fetching featured recipe:", err);
    }
  };

  /**
   * Example projects array. Adjust as needed.
   */
  const projects = [
    {
      title: "Project 1: AutoForm Filler",
      description: "A tool to automatically fill out job application forms.",
      link: "https://github.com/username/web_and_mobile_project1",
    },
  ];

  return (
    <div className="home-page">
      {/* Header Section */}
      <header className="page-header">
        <div className="header-content">
          <h1>Welcome to Recipe Manager</h1>
          <p>Discover, create, and share amazing recipes with ease!</p>
        </div>
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/recipe" className="nav-link">
                Recipes
              </Link>
            </li>
            <li>
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* My Projects Section */}
      <section className="my-projects-section">
        <h2 className="my-projects-title">My Projects</h2>
        <ul className="my-projects-list">
          {projects.map((project, index) => (
            <li key={index} className="my-projects-item">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="my-projects-link"
              >
                {project.title}
              </a>
              <p className="my-projects-description">{project.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured Recipe Section */}
      <section className="featured-recipe">
        <h2>Featured Recipe</h2>
        {featuredRecipe ? (
          <div className="featured-recipe-card">
            <p>
              <strong>ID:</strong> {featuredRecipe.id}
            </p>
            <h3>{featuredRecipe.title}</h3>
            <p>
              <strong>Description:</strong> {featuredRecipe.description}
            </p>
            {Array.isArray(featuredRecipe.tags) &&
              featuredRecipe.tags.length > 0 && (
                <p>
                  <strong>Tags:</strong>{" "}
                  {featuredRecipe.tags.join(", ")}
                </p>
              )}
            {Array.isArray(featuredRecipe.ingredients) &&
              featuredRecipe.ingredients.length > 0 && (
                <p>
                  <strong>Ingredients:</strong>{" "}
                  {featuredRecipe.ingredients.join(", ")}
                </p>
              )}
            {Array.isArray(featuredRecipe.steps) &&
              featuredRecipe.steps.length > 0 && (
                <p>
                  <strong>Steps:</strong>{" "}
                  {featuredRecipe.steps.join(", ")}
                </p>
              )}
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
