import React from 'react';
const HomePage = () => {
  const projects = [
    {
      title: 'Project 1: AutoForm Filler ',
      description: 'Auto form filler that automatically fills online job application forms.',
      link: 'https://github.com/Ibrahim2307/web_and_mobile_project1',
    },
  ];

  return (
    <div style={styles.container}>
      <h1>Welcome to the Recipe Manager App</h1>
      <p style={styles.intro}>
        Organize, create, and discover amazing recipes. Start managing your favorite recipes today!
      </p>
      <section style={styles.projectsSection}>
        <h2>Previous Projects</h2>
        <ul>
          {projects.map((project, index) => (
            <li key={index} style={styles.projectItem}>
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

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  intro: {
    fontSize: '1.2rem',
    marginBottom: '20px',
  },
  projectsSection: {
    marginTop: '30px',
    textAlign: 'left',
  },
  projectItem: {
    marginBottom: '10px',
  },
};

export default HomePage;