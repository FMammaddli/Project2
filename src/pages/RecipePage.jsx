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
  const [searchQuery, setSearchQuery] = useState("");

  
  const [sortOption, setSortOption] = useState("");

  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;

        
        const { data, error, count } = await supabase
          .from("Recipes")
          .select("*", { count: "exact" })
          .order("order", { ascending: true })
          .range(from, to);

        if (error) {
          console.error(error);
          return;
        }

        
        setRecipes(data || []);
        
        setTotalPages(Math.ceil(count / pageSize));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipes();
  }, [currentPage, pageSize]);

  
  
  
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedRecipes = Array.from(recipes);
    const [movedItem] = reorderedRecipes.splice(result.source.index, 1);
    reorderedRecipes.splice(result.destination.index, 0, movedItem);

    
    
    
    const updatedRecipes = reorderedRecipes.map((recipe, index) => ({
      ...recipe,
      order: (currentPage - 1) * pageSize + (index + 1),
    }));

    setRecipes(updatedRecipes);

    try {
      for (const update of updatedRecipes) {
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
        .filter(Boolean);

      const stepsArray = newRecipe.steps
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const tagsArray = newRecipe.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      
      const { count } = await supabase
        .from("Recipes")
        .select("id", { count: "exact", head: true });
      const nextOrder = (count || 0) + 1;

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
            order: nextOrder,
          },
        ])
        .select();

      if (error) {
        console.error(error);
        return;
      }

      
      setCurrentPage(1);

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
        return `Title: ${r.title}
Description: ${r.description}
Ingredients: ${ingredientsList}
Steps: ${stepsList}
Tags: ${tagsList}
Difficulty: ${r.difficulty}
Last Updated: ${new Date(r.lastUpdated).toLocaleString()}`;
      })
      .join("\n\n");

    const mailtoURL = `mailto:?subject=Check out these recipes&body=${encodeURIComponent(
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

  
  
  
  const handleNextPage = () => {
    
    if (currentPage >= totalPages || totalPages === 0) return;

    
    setSearchQuery("");
    setDifficultyFilter("");
    setTagFilter("");

    
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    
    if (currentPage <= 1) return;

    
    setSearchQuery("");
    setDifficultyFilter("");
    setTagFilter("");

    
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="recipe-page">
      <h2>Recipe List</h2>

      {/* Filter, Search, and Sort Controls */}
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
      <div className="pagination-controls" style={{ marginTop: "1rem" }}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>

        <span style={{ margin: "0 1rem" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{ marginLeft: "1rem" }}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </select>
      </div>
    </div>
  );
}
