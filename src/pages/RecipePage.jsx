import React, { useState, useEffect, useMemo } from "react";
import RecipeCard from "./RecipeCard";
import { supabase } from "./createClient";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function RecipePage() {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data, error } = await supabase
          .from("Recipes")
          .select("*")
          .order("order", { ascending: true }); // Fetch sorted by 'order'
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return; 
  
    const reorderedRecipes = Array.from(recipes);
    const [movedItem] = reorderedRecipes.splice(result.source.index, 1);
    reorderedRecipes.splice(result.destination.index, 0, movedItem);
  
    const updatedRecipes = reorderedRecipes.map((recipe, index) => ({
      ...recipe,
      order: index + 1,
    }));
  
    setRecipes(updatedRecipes);
  
    const updates = updatedRecipes.map((recipe) => ({
      id: recipe.id,
      order: recipe.order,
    }));
  
    console.log("Updating order in database:", updates);
  
    try {
      for (const update of updates) {
        const { error } = await supabase
          .from("Recipes")
          .update({ order: update.order })
          .eq("id", update.id);
  
        if (error) {
          console.error("Failed to update recipe order in the database:", error);
        }
      }
  
      console.log("Order updated successfully in the database");
    } catch (err) {
      console.error("Error during order update:", err);
    }
  };

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
      setSelectedRecipeIds((prev) => prev.filter((item) => item !== id));
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
            order: recipes.length + 1,
          },
        ])
        .select();

      if (error) {
        console.error(error);
        return;
      }
      if (data && data.length > 0) setRecipes((prev) => [...prev, data[0]]);
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

  const handleSelectChange = (id) => {
    setSelectedRecipeIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      return [...prev, id];
    });
  };

  const handleShareSelected = () => {
    const selected = recipes.filter((r) => selectedRecipeIds.includes(r.id));
    const details = selected
      .map((r) => {
        const ingredientsList = r.ingredients.join(", ");
        const stepsList = r.steps.join(", ");
        const tagsList = r.tags.join(", ");
        return `Title: ${r.title}\nDescription: ${r.description}\nIngredients: ${ingredientsList}\nSteps: ${stepsList}\nTags: ${tagsList}\nDifficulty: ${r.difficulty}\nLast Updated: ${new Date(r.lastUpdated).toLocaleString()}`;
      })
      .join("\n\n");

    const mailtoURL = `mailto:?subject=Check out these recipes&body=Here are the recipes:\n\n${encodeURIComponent(
      details
    )}`;
    window.open(mailtoURL, "_blank");
  };

  const filteredAndSortedRecipes = useMemo(() => {
    let output = [...recipes];

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
        <input
          type="text"
          placeholder="Search"
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
        </select>
        {selectedRecipeIds.length > 0 && (
          <button onClick={handleShareSelected}>Share</button>
        )}
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="recipe-list">
          {(provided) => (
            <section
              className="recipe-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredAndSortedRecipes.map((recipe, index) => (
                <Draggable
                  key={recipe.id}
                  draggableId={recipe.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <RecipeCard
                        recipe={recipe}
                        isSelected={selectedRecipeIds.includes(recipe.id)}
                        onSelectChange={handleSelectChange}
                        onUpdate={handleUpdateRecipe}
                        onDelete={handleDeleteRecipe}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </section>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
