import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Simulate data fetching
    const exampleRecipes = [
      {
        title: "Easy Chicken Curry",
        description: "This easy staple chicken curry is perfect for family dinners.",
        ingredients: ["Chicken", "Yogurt", "Spices", "Garlic", "Ginger"],
        steps: ["Marinate chicken", "Cook with spices", "Add yogurt", "Simmer until cooked"],
        tags: ["Easy", "Gluten-free", "Dinner"],
        difficulty: "Easy",
        lastUpdated: "2024-01-20T10:00:00Z",
      },
    ];

    console.log("Recipes Data:", exampleRecipes); // Debug
    setRecipes(exampleRecipes);
  }, []);

  return (
    <div>
      <h1>Recipe List</h1>
      {recipes.length > 0 ? (
        recipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} />
        ))
      ) : (
        <p>No recipes available.</p>
      )}
    </div>
  );
};

export default RecipePage;
