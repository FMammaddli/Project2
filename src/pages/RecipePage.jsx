import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import { supabase } from "./createClient";

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    tags: "",
    difficulty: "Easy",
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data, error } = await supabase
          .from("Recipes")
          .select("*")
          .order("lastUpdated", { ascending: false });
        if (error) {
          console.error(error);
          return;
        }
        setRecipes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipes();
  }, []);

  const handleUpdateRecipe = (updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((recipe) => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe))
    );
  };

  const handleDeleteRecipe = async (id) => {
    try {
      const { error } = await supabase
        .from("Recipes")
        .delete()
        .eq("id", id);
      if (error) {
        console.error(error);
        return;
      }
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      const ingredientsArray = newRecipe.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      const stepsArray = newRecipe.steps
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      const tagsArray = newRecipe.tags
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      const { data, error } = await supabase
        .from("Recipes")
        .insert([
          {
            title: newRecipe.title,
            description: newRecipe.description,
            ingredients: ingredientsArray,
            steps: stepsArray,
            tags: tagsArray,
            difficulty: newRecipe.difficulty,
            lastUpdated: new Date().toISOString(),
          },
        ])
        .select();
      if (error) {
        console.error(error);
        return;
      }
      if (data && data.length > 0) {
        setRecipes((prev) => [data[0], ...prev]);
      }
      setIsCreating(false);
      setNewRecipe({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        tags: "",
        difficulty: "Easy",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="recipe-page">
      <h2>Recipe List</h2>
      <button onClick={() => setIsCreating(!isCreating)}>
        {isCreating ? "Cancel" : "Create Recipe"}
      </button>
      {isCreating && (
        <div>
          <label>
            Title
            <input
              type="text"
              value={newRecipe.title}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, title: e.target.value })
              }
            />
          </label>
          <label>
            Description
            <textarea
              value={newRecipe.description}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, description: e.target.value })
              }
            />
          </label>
          <label>
            Ingredients (comma-separated)
            <input
              type="text"
              value={newRecipe.ingredients}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, ingredients: e.target.value })
              }
            />
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
          <button onClick={handleCreate}>Create</button>
        </div>
      )}
      <section className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onUpdate={handleUpdateRecipe}
            onDelete={handleDeleteRecipe}
          />
        ))}
      </section>
    </div>
  );
};

export default RecipePage;