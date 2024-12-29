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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 via-white to-green-200">
      {/* Hero Header Section */}
      <header
        className="
          h-64 
          bg-[url('https://images.unsplash.com/photo-1505243366366-3d03154a2ccb?auto=format&fit=crop&w=1480&q=80')]
          bg-cover bg-center
          flex items-center justify-center
          shadow-lg
        "
      >
        <div className="bg-black bg-opacity-40 p-5 rounded-md">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">
            Welcome to Recipe Manager
          </h1>
          <p className="text-lg md:text-xl text-gray-200 text-center mt-2">
            Discover, create, and share amazing recipes with ease!
          </p>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Projects Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold mb-6">My Projects</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <li
                key={index}
                className="
                  bg-white rounded-lg shadow-md p-5 transition-transform 
                  transform hover:scale-105 hover:shadow-xl
                "
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-semibold hover:underline"
                >
                  {project.title}
                </a>
                <p className="mt-2 text-gray-700">{project.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Navigation / Button Section */}
        <section className="mb-10">
          <Link to="/recipes">
            <button
              className="
                px-6 py-3 bg-green-500 text-white font-bold rounded-lg 
                shadow-md hover:bg-green-600 transition-colors duration-300
              "
            >
              View Recipes
            </button>
          </Link>
        </section>

        {/* Featured Recipe Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Featured Recipe</h2>
          {featuredRecipe ? (
            <div
              className="
                bg-white p-6 rounded-lg shadow-md 
                transition-transform transform hover:scale-[1.02] hover:shadow-xl
              "
            >
              <h3 className="text-2xl font-bold mb-3">{featuredRecipe.title}</h3>
              <p className="mb-4 text-gray-700">{featuredRecipe.description}</p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>ID:</strong> {featuredRecipe.id}
                </p>
                <p>
                  <strong>Difficulty:</strong> {featuredRecipe.difficulty}
                </p>
                <p>
                  <strong>Ingredients:</strong>{" "}
                  {featuredRecipe.ingredients.join(", ")}
                </p>
                <p>
                  <strong>Steps:</strong>{" "}
                  {featuredRecipe.steps.join(", ")}
                </p>
                <p>
                  <strong>Tags:</strong> {featuredRecipe.tags.join(", ")}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(featuredRecipe.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">Loading featured recipe...</p>
          )}
        </section>
      </div>

      {/* Footer (Optional) */}
      <footer className="bg-green-600 text-white py-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Recipe Manager. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
