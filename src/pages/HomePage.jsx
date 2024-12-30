import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./createClient";

const HomePage = () => {
  const [featuredRecipe, setFeaturedRecipe] = useState(null);

  useEffect(() => {
    fetchFeaturedRecipe();
  }, []);

  const fetchFeaturedRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from("Recipes")
        .select("*")
        .order("lastUpdated", { ascending: false })
        .limit(1);
      if (error) {
        console.error(error);
        return;
      }
      if (data && data.length > 0) {
        setFeaturedRecipe(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        <Link to="/recipe">
          <button>View Recipes</button>
        </Link>
      </section>
      <section className="featured-recipe my-8 mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Featured Recipe</h2>
        {featuredRecipe ? (
          <div className="bg-white shadow-md rounded p-6">
            <p className="text-sm text-gray-500 mb-2">
              <strong>ID:</strong> {featuredRecipe.id}
            </p>
            <h3 className="text-xl font-semibold mb-2">{featuredRecipe.title}</h3>
            <p className="mb-2">
              <strong>Description:</strong> {featuredRecipe.description}
            </p>
            {Array.isArray(featuredRecipe.tags) && featuredRecipe.tags.length > 0 && (
              <p className="mb-2">
                <strong>Tags:</strong> {featuredRecipe.tags.join(", ")}
              </p>
            )}
            {Array.isArray(featuredRecipe.ingredients) &&
              featuredRecipe.ingredients.length > 0 && (
                <p className="mb-2">
                  <strong>Ingredients:</strong> {featuredRecipe.ingredients.join(", ")}
                </p>
              )}
            {Array.isArray(featuredRecipe.steps) && featuredRecipe.steps.length > 0 && (
              <p className="mb-2">
                <strong>Steps:</strong> {featuredRecipe.steps.join(", ")}
              </p>
            )}
            <p className="mb-2">
              <strong>Difficulty:</strong> {featuredRecipe.difficulty}
            </p>
            <p>
              <strong>Last Updated:</strong> {new Date(featuredRecipe.lastUpdated).toLocaleDateString()}
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
