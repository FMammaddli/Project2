import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./createClient";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("Recipes") 
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setRecipe(data);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>

      <h3>Ingredients:</h3>
      <ul>
        {Array.isArray(recipe.ingredients) &&
          recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
      </ul>

      <h3>Steps:</h3>
      <ol>
        {Array.isArray(recipe.steps) &&
          recipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}
      </ol>

      <p>
        <strong>Tags:</strong>{" "}
        {Array.isArray(recipe.tags) && recipe.tags.join(", ")}
      </p>

      <p>
        <strong>Difficulty:</strong> {recipe.difficulty}
      </p>

      <p>
        <strong>Last Updated:</strong>{" "}
        {new Date(recipe.lastUpdated).toLocaleString()}
      </p>

      <button onClick={() => navigate("/recipe")}>Back to Recipes</button>
    </div>
  );
};

export default RecipeDetails;