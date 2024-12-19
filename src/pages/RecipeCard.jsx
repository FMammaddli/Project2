import React from "react";

const RecipeCard = ({ recipe }) => {
  console.log("Recipe received by RecipeCard:", recipe); // Debug here

  if (!recipe) {
    return <div className="error">Recipe data is unavailable.</div>;
  }

  return (
    <div className="recipe-card">
      <h2>{recipe.title}</h2>
      <p><strong>Description:</strong> {recipe.description}</p>
    </div>
  );
};

export default RecipeCard;
