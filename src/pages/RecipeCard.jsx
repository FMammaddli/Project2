import React from "react";

const RecipeCard = ({ recipe }) => {
  console.log("Recipe Prop:", recipe); // Debug the recipe data

  if (!recipe) {
    return <div className="error">Recipe data is unavailable.</div>;
  }

  return (
    <div className="recipe-card">
      <h2>{recipe.title}</h2>
      <p><strong>Description:</strong> {recipe.description}</p>
      <div>
        <strong>Ingredients:</strong>
        <ul>
          {recipe.ingredients?.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Preparation Steps:</strong>
        <ol>
          {recipe.steps?.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
      <div>
        <p><strong>Tags:</strong> {recipe.tags?.join(", ") || "No tags available"}</p>
        <p><strong>Difficulty:</strong> {recipe.difficulty || "N/A"}</p>
        <p>
          <strong>Last Updated:</strong> {recipe.lastUpdated
            ? new Date(recipe.lastUpdated).toLocaleString()
            : "Not available"}
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;