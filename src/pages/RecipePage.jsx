import React, { useState, useEffect } from "react";

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/recipes")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="recipe-page">
      <header>
        <h1>Recipe List</h1>
        <p>Explore a collection of amazing recipes.</p>
      </header>

      <section className="recipe-list">
        <h2>All Recipes</h2>
        {loading ? (
          <p>Loading recipes...</p>
        ) : recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <p>
                <strong>Difficulty:</strong> {recipe.difficulty}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(recipe.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </section>
    </div>
  );
};

export default RecipePage;
