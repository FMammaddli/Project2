import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    ingredients: [],
    steps: "",
    tags: "",
    difficulty: "Easy",
  });
  const [ingredientInput, setIngredientInput] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/recipes")
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  const handleAddIngredient = (e) => {
    if (e.key === "Enter" && ingredientInput.trim()) {
      setNewRecipe({
        ...newRecipe,
        ingredients: [...newRecipe.ingredients, ingredientInput.trim()],
      });
      setIngredientInput(""); // Clear input after adding
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  const handleAddRecipe = (e) => {
    e.preventDefault();
    const recipeToAdd = {
      ...newRecipe,
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
          ingredients: [],
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

  const handleEditRecipe = (updatedRecipe) => {
    fetch(`http://localhost:3001/recipes/${updatedRecipe.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRecipe),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipes(
          recipes.map((recipe) => (recipe.id === data.id ? data : recipe))
        );
      })
      .catch((error) => console.error("Error updating recipe:", error));
  };

  return (
    <div className="recipe-page">
      <section className="add-recipe">
        <form onSubmit={handleAddRecipe} className="recipe-form">
          <label>
            Title
            <input
              type="text"
              value={newRecipe.title}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, title: e.target.value })
              }
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={newRecipe.description}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, description: e.target.value })
              }
              required
            />
          </label>

          <label>
            Ingredients
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={handleAddIngredient}
              placeholder="Press Enter to add an ingredient"
            />
            <ul>
              {newRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </label>

          <label>
            Steps (comma-separated)
            <input
              type="text"
              value={newRecipe.steps}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, steps: e.target.value })
              }
            />
          </label>

          <label>
            Tags (comma-separated)
            <input
              type="text"
              value={newRecipe.tags}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, tags: e.target.value })
              }
            />
          </label>

          <label>
            Difficulty
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
          </label>

          <button type="submit">Add Recipe</button>
        </form>
      </section>

      <section className="recipe-list">
        <h2>Recipe List</h2>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDelete={handleDeleteRecipe}
            onEdit={handleEditRecipe}
          />
        ))}
      </section>
    </div>
  );
};

export default RecipePage;