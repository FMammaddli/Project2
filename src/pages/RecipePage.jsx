import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../index.css";

/* ------------------------------------------------------------------------
  1) PORTAL: We'll render the dragged item in a portal so it won't disrupt
     the layout in the droppable container.
------------------------------------------------------------------------ */
function DragPortal({ children }) {
  const portalNodeRef = useRef(null);
  if (!portalNodeRef.current) {
    const node = document.createElement("div");
    document.body.appendChild(node);
    portalNodeRef.current = node;
  }
  return ReactDOM.createPortal(children, portalNodeRef.current);
}

/* ------------------------------------------------------------------------
  2) PortalAwareDraggable:
     - Renders the item in normal flow, but when "isDragging" => we place
       that element in a <DragPortal>, so it floats outside the list.
     - We do "visibility: hidden" (not "display: none") on the original
       so it still occupies space in the layout => no shift of siblings.
------------------------------------------------------------------------ */
function PortalAwareDraggable({ draggableId, index, children }) {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => {
        const isDragging = snapshot.isDragging;

        const child = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              // Keep the original item in flow so it doesn't shift others
              ...provided.draggableProps.style,
              visibility: isDragging ? "hidden" : "visible",
            }}
          >
            {children}
          </div>
        );

        // If not dragging, render normally in place
        if (!isDragging) return child;

        // If dragging, render the same node in a Portal
        return (
          <>
            {child /* keeps layout space occupied (invisible) */}
            <DragPortal>
              {/* The floating clone, same children, same style (except we remove 'visibility') */}
              <div
                style={{
                  // Because we’re outside the list, we must replicate the transform
                  ...provided.draggableProps.style,
                  pointerEvents: "none", // or 'auto' if you prefer
                  width: provided.draggableProps.style?.width || "auto",
                  height: provided.draggableProps.style?.height || "auto",
                  // Could add a shadow or background if you like:
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                  background: "white",
                  zIndex: 9999,
                }}
              >
                {children}
              </div>
            </DragPortal>
          </>
        );
      }}
    </Draggable>
  );
}

/* ------------------------------------------------------------------------
  3) RecipeCard: your existing card component, same as always
------------------------------------------------------------------------ */
function RecipeCard({ recipe, isSelected, onSelectChange, onUpdate, onDelete }) {
  const [editMode, setEditMode] = useState(false);

  const [title, setTitle] = useState(recipe?.title || "");
  const [description, setDescription] = useState(recipe?.description || "");
  const [tags, setTags] = useState(recipe?.tags || []);
  const [ingredients, setIngredients] = useState(recipe?.ingredients || []);
  const [steps, setSteps] = useState(recipe?.steps || []);
  const [difficulty, setDifficulty] = useState(recipe?.difficulty || "Easy");
  const [lastUpdated] = useState(
    recipe?.lastUpdated ? new Date(recipe.lastUpdated) : new Date()
  );

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
    const upd = {
      ...recipe,
      title,
      description,
      tags,
      ingredients,
      steps,
      difficulty,
      lastUpdated: new Date().toISOString(),
    };
    onUpdate?.(upd);
    setEditMode(false);
  };

  const handleDelete = () => onDelete?.(recipe.id);
  const handleCancel = () => {
    setTitle(recipe?.title || "");
    setDescription(recipe?.description || "");
    setTags(recipe?.tags || []);
    setIngredients(recipe?.ingredients || []);
    setSteps(recipe?.steps || []);
    setDifficulty(recipe?.difficulty || "Easy");
    setEditMode(false);
  };

  // array fields to comma string
  const tagsString = Array.isArray(tags) ? tags.join(", ") : tags;
  const ingString = Array.isArray(ingredients)
    ? ingredients.join(", ")
    : ingredients;
  const stpString = Array.isArray(steps) ? steps.join(", ") : steps;

  return (
    <div className="recipe-card my-4">
      <input
        type="checkbox"
        className="recipe-checkbox"
        checked={isSelected}
        onChange={() => onSelectChange(recipe.id)}
      />

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
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
            <div className="recipe-steps">
              <strong>Steps:</strong>
              <ol className="step-list">
                {recipe.steps.map((s, i) => (
                  <li key={i}>{s}</li>
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
              value={ingString}
              onChange={(e) =>
                setIngredients(e.target.value.split(",").map((x) => x.trim()))
              }
            />
          </div>
          <div className="edit-field">
            <label>Steps (comma-separated):</label>
            <input
              className="edit-input"
              type="text"
              value={stpString}
              onChange={(e) =>
                setSteps(e.target.value.split(",").map((x) => x.trim()))
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
 * Main RecipePage component
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

  // filters
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // multi-select
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);

  // --------------------------------------------------------------------------
  // FETCH RECIPES (PAGINATED)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // fetch all => get total
        const respAll = await fetch("http://localhost:3000/Recipes");
        if (!respAll.ok) throw new Error("Failed to fetch all recipes");
        const all = await respAll.json();
        const count = all.length;

        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;

        // 3) Fetch only for current page, sorted by 'order'
        const responsePage = await fetch(
          `http://localhost:3000/Recipes?_sort=order&_order=asc&_start=${from}&_end=${to + 1}`
        );
        if (!respPage.ok) throw new Error("Failed to fetch page");
        const data = await respPage.json();

        setRecipes(data || []);
        setTotalPages(Math.ceil(count / pageSize));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipes();
  }, [currentPage, pageSize]);

  // --------------------------------------------------------------------------
  // DRAG AND DROP
  // --------------------------------------------------------------------------
  /**
   * When a card is dropped, we reorder the **currently visible** recipes array
   * so that the moved item goes to the new index, and the item originally there
   * moves accordingly. Then we PATCH each updated recipe's "order" field so
   * that changes persist across page refreshes.
   */
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (!destination) return; // dropped outside
    if (source.index === destination.index) return; // same => no swap

    // 1) Make a copy of the current recipe array
    const reordered = Array.from(recipes);

    // 2) Remove the item from the old position
    const [movedItem] = reordered.splice(draggedIndex, 1);

    // 3) Insert it at the new position
    reordered.splice(droppedIndex, 0, movedItem);

    // 4) Reassign the "order" based on new positions
    //    We only do this for the recipes on this page
    const updatedReordered = reordered.map((rec, idx) => ({
      ...rec,
      order: (currentPage - 1) * pageSize + (idx + 1),
    }));

    // 5) Update state
    setRecipes(updatedReordered);

    // 6) Persist changes to JSON Server with PATCH
    try {
      for (const item of updatedReordered) {
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
      console.log("[DEBUG] Swap saved to JSON server!");
    } catch (err) {
      console.error("[DEBUG] error =>", err);
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
      const ing = newRecipe.ingredients
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      const stp = newRecipe.steps
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      const tgs = newRecipe.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      // next order
      const respAll = await fetch("http://localhost:3000/Recipes");
      const all = await respAll.json();
      const nextOrder = all.length + 1;

      // POST
      const resp = await fetch("http://localhost:3000/Recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newRecipe.title,
          description: newRecipe.description,
          ingredients: ing,
          steps: stp,
          tags: tgs,
          difficulty: newRecipe.difficulty,
          lastUpdated: new Date().toISOString(),
          order: nextOrder,
        }),
      });
      if (!resp.ok) {
        const e = await resp.text();
        console.error("[DEBUG] create error =>", e);
        throw new Error("Failed to create recipe");
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

  // --------------------------------------------------------------------------
  // MULTI-SELECT
  // --------------------------------------------------------------------------
  const handleSelectChange = (id) => {
    setSelectedRecipeIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };
  const handleShareSelected = () => {
    const sel = recipes.filter((r) => selectedRecipeIds.includes(r.id));
    const details = sel
      .map((r) => {
        const ing = (r.ingredients || []).join(", ");
        const stp = (r.steps || []).join(", ");
        const tgs = (r.tags || []).join(", ");
        return `Title: ${r.title}
Description: ${r.description}
Ingredients: ${ing}
Steps: ${stp}
Tags: ${tgs}
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
    setCurrentPage((p) => p + 1);
  };
  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    setCurrentPage((p) => p - 1);
  };

  return (
    <div className="recipe-page">
      <h2>Recipe List</h2>

      {/* Filter, search, etc */}
      <div className="filter-sort-controls">
        <button onClick={() => setIsCreating((c) => !c)}>
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

      {/* Create Form */}
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

      {/* Drag & Drop: horizontal list => no placeholder => no shift */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(providedDroppable) => (
            <div
              className="recipe-row"
              ref={providedDroppable.innerRef}
              {...providedDroppable.droppableProps}
            >
              {filteredAndSortedRecipes.map((r, idx) => (
                <PortalAwareDraggable
                  key={r.id}
                  draggableId={String(r.id)}
                  index={idx}
                >
                  <div className="recipe-box">
                    <RecipeCard
                      recipe={r}
                      isSelected={selectedRecipeIds.includes(r.id)}
                      onSelectChange={handleSelectChange}
                      onUpdate={handleUpdateRecipe}
                      onDelete={handleDeleteRecipe}
                    />
                  </div>
                </PortalAwareDraggable>
              ))}
              {/* Hide placeholder so it never shifts anything */}
              <div style={{ display: "none" }}>{providedDroppable.placeholder}</div>
            </div>
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