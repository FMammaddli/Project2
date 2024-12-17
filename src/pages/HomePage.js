import React from 'react';

const HomePage = () => {
  const projects = [
    {
      title: 'Project 1: To-Do List App',
      description: 'A simple to-do list application using React.',
      link: 'https://github.com/yourusername/todo-app',
    },
  ];

  return (
    <div>
      <h1>Welcome to the Recipe Manager App</h1>
      <p >
        Organize, create, and discover amazing recipes. Start managing your favorite recipes today!
      </p>

      <section>
        <h2>Previous Projects</h2>
        <ul>
          {projects.map((project, index) => (
            <li key={index}>
              <strong>{project.title}</strong>: {project.description} -{' '}
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                View Project
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
