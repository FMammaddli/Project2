import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "../index.css";

const HomePage = () => {
  const projects = [
    {
      title: "Project 1: AutoForm Filler",
      description: "Auto form filler that automatically fills online job application forms.",
      link: "https://github.com/Ibrahim2307/web_and_mobile_project1",
    },
  ];

  return (
    <div className="home-page">
      <header>
        <h1>Welcome to My Recipe Showcase!</h1>
        <p>This app highlights popular recipes and my development projects.</p>
      </header>

      {/* Link to the Recipe Page */}
      <section className="recipe-navigation">
        <Link to="/recipes" className="recipe-link">
          <button>Go to Recipe Page</button>
        </Link>
      </section>

      <section className="featured-recipe">
        <h2>Featured Recipe</h2>
        <div className="recipe-card">
          <h3>Classic Spaghetti Bolognese</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente ea deserunt asperiores animi libero quas omnis quo deleniti, maiores blanditiis possimus cumque sunt dolores aut in quam molestiae iste nemo?
          </p>
        </div>
      </section>

      <section className="projects">
        <h2>My Projects</h2>
        <ul>
          {projects.map((project, index) => (
            <li key={index}>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
