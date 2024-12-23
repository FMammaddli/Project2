import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    tags: "",
    difficulty: "Easy",
  });

  useEffect(() => {
    fetch("http://localhost:3001/recipes")
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  const handleAddRecipe = (e) => {
    e.preventDefault();
    const recipeToAdd = {
      ...newRecipe,
      ingredients: newRecipe.ingredients.split(","),
      steps: newRecipe.steps.split(","),
      tags: newRecipe.tags.split(","),
      lastUpdated: new Date().toISOString(),
    };

    fetch("http://localhost:3001/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipeToAdd),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipes([...recipes, data]);
        setNewRecipe({
          title: "",
          description: "",
          ingredients: "",
          steps: "",
          tags: "",
          difficulty: "Easy",
        });
      })
      .catch((error) => console.error("Error adding recipe:", error));
  };

  const handleDeleteRecipe = (id) => {
    fetch(`http://localhost:3001/recipes/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
      })
      .catch((error) => console.error("Error deleting recipe:", error));
  };

  return (
    <div className="recipe-page">
      <header>
        <h1>Recipe Manager</h1>
        <p>Manage your collection of recipes.</p>
      </header>

      <section className="add-recipe">
        <h2>Add a New Recipe</h2>
        <form onSubmit={handleAddRecipe}>
          <input
            type="text"
            placeholder="Title"
            value={newRecipe.title}
            onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newRecipe.description}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, description: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Ingredients (comma separated)"
            value={newRecipe.ingredients}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, ingredients: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Steps (comma separated)"
            value={newRecipe.steps}
            onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={newRecipe.tags}
            onChange={(e) => setNewRecipe({ ...newRecipe, tags: e.target.value })}
          />
          <select
            value={newRecipe.difficulty}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, difficulty: e.target.value })
            }
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button type="submit">Add Recipe</button>
        </form>
      </section>

      <section className="recipe-list">
        <h2>All Recipes</h2>
        {loading ? (
          <p>Loading recipes...</p>
        ) : recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDeleteRecipe}
            />
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </section>
    </div>
  );
};

export default RecipePage;
