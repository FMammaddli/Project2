import React, { useState, useEffect, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../index.css";

/**
 * Inline RecipeCard component
 */
function RecipeCard({
  recipe,
  isSelected,
  onSelectChange,
  onUpdate,
  onDelete,
}) {
  const [editMode, setEditMode] = useState(false);

  // Local state for each editable field
  const [title, setTitle] = useState(recipe?.title || "");
  const [description, setDescription] = useState(recipe?.description || "");
  const [tags, setTags] = useState(recipe?.tags || []);
  const [ingredients, setIngredients] = useState(recipe?.ingredients || []);
  const [steps, setSteps] = useState(recipe?.steps || []);
  const [difficulty, setDifficulty] = useState(recipe?.difficulty || "Easy");
  const [lastUpdated] = useState(
    recipe?.lastUpdated ? new Date(recipe.lastUpdated) : new Date()
  );

  // Reset local state whenever the `recipe` prop changes
  useEffect(() => {
    setTitle(recipe?.title || "");
    setDescription(recipe?.description || "");
    setTags(recipe?.tags || []);
    setIngredients(recipe?.ingredients || []);
    setSteps(recipe?.steps || []);
    setDifficulty(recipe?.difficulty || "Easy");
    setEditMode(false);
  }, [recipe]);

  const handleSave = () => {
    const updatedRecipe = {
      ...recipe,
      title,
      description,
      tags,
      ingredients,
      steps,
      difficulty,
      lastUpdated: new Date().toISOString(),
    };
    if (typeof onUpdate === "function") onUpdate(updatedRecipe);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (typeof onDelete === "function") onDelete(recipe.id);
  };

  const handleCancel = () => {
    // Revert local state to original
    setTitle(recipe?.title || "");
    setDescription(recipe?.description || "");
    setTags(recipe?.tags || []);
    setIngredients(recipe?.ingredients || []);
    setSteps(recipe?.steps || []);
    setDifficulty(recipe?.difficulty || "Easy");
    setEditMode(false);
  };

  // Convert arrays to comma-separated strings for editing
  const tagsString = Array.isArray(tags) ? tags.join(", ") : tags;
  const ingredientsString = Array.isArray(ingredients)
    ? ingredients.join(", ")
    : ingredients;
  const stepsString = Array.isArray(steps) ? steps.join(", ") : steps;

  return (
    <div className="recipe-card my-4">
      {/* Selection Checkbox */}
      <input
        type="checkbox"
        className="recipe-checkbox"
        checked={isSelected}
        onChange={() => onSelectChange(recipe.id)}
      />

      {/* VIEW MODE */}
      {!editMode && (
        <div className="recipe-card-view">
          <h3 className="recipe-title">{recipe.title}</h3>
          <p className="recipe-description">
            <strong>Description:</strong> {recipe.description}
          </p>

          {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
            <p className="recipe-tags">
              <strong>Tags:</strong> {recipe.tags.join(", ")}
            </p>
          )}

          {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
            <div className="recipe-ingredients">
              <strong>Ingredients:</strong>
              <ul className="ingredient-list">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
            <div className="recipe-steps">
              <strong>Steps:</strong>
              <ol className="step-list">
                {recipe.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <p className="recipe-difficulty">
            <strong>Difficulty:</strong> {recipe.difficulty}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(recipe.lastUpdated).toLocaleString()}
          </p>
          <div className="button-group">
            <button className="btn btn-edit" onClick={() => setEditMode(true)}>
              Edit
            </button>
            <button className="btn btn-delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODE */}
      {editMode && (
        <div className="edit-form">
          <div className="edit-field">
            <label>Title:</label>
            <input
              className="edit-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="edit-field">
            <label>Description:</label>
            <textarea
              className="edit-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="edit-field">
            <label>Tags (comma-separated):</label>
            <input
              className="edit-input"
              type="text"
              value={tagsString}
              onChange={(e) =>
                setTags(e.target.value.split(",").map((t) => t.trim()))
              }
            />
          </div>
          <div className="edit-field">
            <label>Ingredients (comma-separated):</label>
            <input
              className="edit-input"
              type="text"
              value={ingredientsString}
              onChange={(e) =>
                setIngredients(
                  e.target.value.split(",").map((ing) => ing.trim())
                )
              }
            />
          </div>
          <div className="edit-field">
            <label>Steps (comma-separated):</label>
            <input
              className="edit-input"
              type="text"
              value={stepsString}
              onChange={(e) =>
                setSteps(e.target.value.split(",").map((st) => st.trim()))
              }
            />
          </div>
          <div className="edit-field">
            <label>Difficulty:</label>
            <select
              className="edit-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <p className="recipe-label">
            Last Updated Time: {lastUpdated.toLocaleString()}
          </p>
          <div className="button-group">
            <button className="btn btn-edit" onClick={handleSave}>
              Save
            </button>
            <button className="btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Main component: displays recipe list with SWAP-based drag and drop
 */
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

  // Filters and search
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // Multi-select
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);

  // --------------------------------------------------------------------------
  // FETCH RECIPES (PAGINATED)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // 1) Fetch all recipes to get count
        const responseAll = await fetch("http://localhost:3000/Recipes");
        if (!responseAll.ok) {
          throw new Error("Failed to fetch all recipes");
        }
        const allRecipes = await responseAll.json();
        const count = allRecipes.length;

        // 2) Calculate range for current page
        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;

        // 3) Fetch only for current page, sorted by 'order'
        // For direct-swap to persist across refreshes, we rely on 'order' in the DB
        const responsePage = await fetch(
          `http://localhost:3000/Recipes?_sort=order&_order=asc&_start=${from}&_end=${to + 1}`
        );
        if (!responsePage.ok) {
          throw new Error("Failed to fetch paginated recipes");
        }
        const data = await responsePage.json();

        setRecipes(data || []);
        setTotalPages(Math.ceil(count / pageSize));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipes();
  }, [currentPage, pageSize]);

  // --------------------------------------------------------------------------
  // DRAG AND DROP (SWAP-BASED)
  // --------------------------------------------------------------------------
  /**
   * Instead of reordering (inserting the dragged card at a new index),
   * we do a **direct swap**. So if you drag item from `source.index`
   * to `destination.index`, those two items swap places in the array.
   */
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const draggedIndex = source.index;
    const droppedIndex = destination.index;

    // Make a copy of the current list
    const swapped = [...recipes];

    // SWAP the two items directly
    const temp = swapped[draggedIndex];
    swapped[draggedIndex] = swapped[droppedIndex];
    swapped[droppedIndex] = temp;

    // Now recalculate the "order" for each item on this page
    const updatedSwapped = swapped.map((rec, idx) => ({
      ...rec,
      order: (currentPage - 1) * pageSize + (idx + 1),
    }));

    setRecipes(updatedSwapped);

    // Persist new order to JSON Server
    try {
      for (const item of updatedSwapped) {
        const response = await fetch(`http://localhost:3000/Recipes/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: item.order }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error text:", errorText);
          throw new Error("Failed to update recipe order");
        }
      }
      console.log("SWAP order updated successfully in the JSON server");
    } catch (err) {
      console.error("Error during swap order update:", err);
    }
  };

  // --------------------------------------------------------------------------
  // CREATE, UPDATE, DELETE
  // --------------------------------------------------------------------------
  const handleUpdateRecipe = async (updatedRecipe) => {
    try {
      // PATCH the updated recipe
      const response = await fetch(
        `http://localhost:3000/Recipes/${updatedRecipe.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updatedRecipe.title,
            description: updatedRecipe.description,
            ingredients: updatedRecipe.ingredients,
            steps: updatedRecipe.steps,
            tags: updatedRecipe.tags,
            difficulty: updatedRecipe.difficulty,
            lastUpdated: new Date().toISOString(),
            order: updatedRecipe.order,
          }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error text:", errorText);
        throw new Error("Failed to update recipe on the server");
      }
      // Replace the updated recipe in local state
      const updatedData = await response.json();
      setRecipes((prev) =>
        prev.map((r) => (r.id === updatedData.id ? updatedData : r))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRecipe = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/Recipes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete the recipe");
      }
      // Remove from local state
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      setSelectedRecipeIds((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      // Convert comma-separated strings into arrays
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

      // Determine the next order
      const responseAll = await fetch("http://localhost:3000/Recipes");
      const allRecipes = await responseAll.json();
      const count = allRecipes.length;
      const nextOrder = count + 1;

      // POST new recipe
      const response = await fetch("http://localhost:3000/Recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newRecipe.title,
          description: newRecipe.description,
          ingredients: ingredientsArray,
          steps: stepsArray,
          tags: tagsArray,
          difficulty: newRecipe.difficulty,
          lastUpdated: new Date().toISOString(),
          order: nextOrder,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error text:", errorText);
        throw new Error("Failed to create new recipe");
      }

      // Reset form, go back to page 1 to see the new item
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

  // --------------------------------------------------------------------------
  // MULTI-SELECT
  // --------------------------------------------------------------------------
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
        const ingredientsList = Array.isArray(r.ingredients)
          ? r.ingredients.join(", ")
          : "";
        const stepsList = Array.isArray(r.steps) ? r.steps.join(", ") : "";
        const tagsList = Array.isArray(r.tags) ? r.tags.join(", ") : "";
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

  // --------------------------------------------------------------------------
  // FILTER & SORT
  // --------------------------------------------------------------------------
  const filteredAndSortedRecipes = useMemo(() => {
    let output = [...recipes];

    // Search
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

    // Difficulty Filter
    if (difficultyFilter) {
      output = output.filter(
        (r) => r.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    // Tag Filter
    if (tagFilter) {
      output = output.filter((r) => {
        if (!r.tags || !Array.isArray(r.tags)) return false;
        return r.tags.some((tag) =>
          tag.toLowerCase().includes(tagFilter.toLowerCase())
        );
      });
    }

    // Sort
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

  // --------------------------------------------------------------------------
  // PAGINATION
  // --------------------------------------------------------------------------
  const handleNextPage = () => {
    if (currentPage >= totalPages || totalPages === 0) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    setCurrentPage((prev) => prev - 1);
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="recipe-page">
      <h2>Recipe List (SWAP Drag & Drop)</h2>

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

      {/* Create Recipe Form */}
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

      {/* DRAG & DROP CONTEXT (SWAP) */}
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
                  draggableId={String(recipe.id)}
                  index={index}
                >
                  {(providedDrag) => (
                    <div
                      ref={providedDrag.innerRef}
                      {...providedDrag.draggableProps}
                      {...providedDrag.dragHandleProps}
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

      {/* Pagination */}
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
