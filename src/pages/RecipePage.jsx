import React, { useState, useEffect, useMemo } from "react";
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
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  // Renamed to a more general term, but you can keep it as `titleSearch` if desired
  const [searchQuery, setSearchQuery] = useState("");

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
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
  };

  const handleDeleteRecipe = async (id) => {
    try {
      const { error } = await supabase.from("Recipes").delete().eq("id", id);
      if (error) {
        console.error(error);
        return;
      }
      setRecipes((prev) => prev.filter((r) => r.id !== id));
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
      if (data && data.length > 0) setRecipes((prev) => [data[0], ...prev]);
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

  const filteredAndSortedRecipes = useMemo(() => {
    let output = [...recipes];

    // Updated search to check title, description, and ingredients
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      output = output.filter((recipe) => {
        const titleMatch =
          recipe.title && recipe.title.toLowerCase().includes(query);

        const descriptionMatch =
          recipe.description &&
          recipe.description.toLowerCase().includes(query);

        const ingredientsMatch =
          Array.isArray(recipe.ingredients) &&
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(query)
          );

        // Return true if any of the three fields match
        return titleMatch || descriptionMatch || ingredientsMatch;
      });
    }

    if (difficultyFilter) {
      output = output.filter(
        (r) => r.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    if (tagFilter) {
      output = output.filter((r) => {
        if (!r.tags || !Array.isArray(r.tags)) return false;
        return r.tags.some((tag) =>
          tag.toLowerCase().includes(tagFilter.toLowerCase())
        );
      });
    }

    switch (sortOption) {
      case "title-asc":
        output.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        output.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "diff-asc":
        output.sort((a, b) => a.difficulty.localeCompare(b.difficulty));
        break;
      case "diff-desc":
        output.sort((a, b) => b.difficulty.localeCompare(a.difficulty));
        break;
      case "updated-asc":
        output.sort(
          (a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated)
        );
        break;
      case "updated-desc":
        output.sort(
          (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
        );
        break;
      default:
        break;
    }

    return output;
  }, [recipes, searchQuery, difficultyFilter, tagFilter, sortOption]);

  return (
    <div className="recipe-page">
      <h2>Recipe List</h2>
      <div className="filter-sort-controls">
        <button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? "Cancel" : "Create Recipe"}
        </button>
        {/* Updated placeholder to indicate searching in title, description, and ingredients */}
        <input
          type="text"
          placeholder="Search recipes (title, description, or ingredients)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input
          type="text"
          placeholder="Filter by tag"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort by...</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="diff-asc">Difficulty (A-Z)</option>
          <option value="diff-desc">Difficulty (Z-A)</option>
          <option value="updated-asc">Last Updated (Oldest)</option>
          <option value="updated-desc">Last Updated (Newest)</option>
        </select>
      </div>
      {isCreating && (
        <div className="create-recipe-form">
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
        {filteredAndSortedRecipes.map((recipe) => (
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