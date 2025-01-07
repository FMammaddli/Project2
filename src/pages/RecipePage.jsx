import React, { useState, useEffect, useMemo, useRef } from "react";

import ReactDOM from "react-dom";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../index.css";

function DragPortal({ children }) {
  const portalNodeRef = useRef(null);

  if (!portalNodeRef.current) {
    const node = document.createElement("div");

    document.body.appendChild(node);

    portalNodeRef.current = node;
  }

  return ReactDOM.createPortal(children, portalNodeRef.current);
}

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
              ...provided.draggableProps.style,

              visibility: isDragging ? "hidden" : "visible",
            }}
          >
            {children}
          </div>
        );

        if (!isDragging) return child;

        return (
          <>
            {child}

            <DragPortal>
              <div
                style={{
                  ...provided.draggableProps.style,

                  pointerEvents: "none",

                  width: provided.draggableProps.style?.width || "auto",

                  height: provided.draggableProps.style?.height || "auto",

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

function RecipeCard({
  recipe,
  isSelected,
  onSelectChange,
  onUpdate,
  onDelete,
}) {
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

    onUpdate(upd);

    setEditMode(false);
  };

  const handleDelete = () => onDelete(recipe.id);

  const handleCancel = () => {
    setTitle(recipe?.title || "");

    setDescription(recipe?.description || "");

    setTags(recipe?.tags || []);

    setIngredients(recipe?.ingredients || []);

    setSteps(recipe?.steps || []);

    setDifficulty(recipe?.difficulty || "Easy");

    setEditMode(false);
  };

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

          {Array.isArray(recipe.ingredients) &&
            recipe.ingredients.length > 0 && (
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
        const respAll = await fetch("http://localhost:3000/Recipes");

        if (!respAll.ok) throw new Error("Failed to fetch all recipes");

        const all = await respAll.json();

        const count = all.length;

        const from = (currentPage - 1) * pageSize;

        const to = from + pageSize - 1;

        const respPage = await fetch(
          `http://localhost:3000/Recipes?_sort=order&_order=asc&_start=${from}&_end=${
            to + 1
          }`
        );

        if (!respPage.ok) throw new Error("Failed to fetch page");

        const data = await respPage.json();

        setRecipes(data || []);

        setTotalPages(Math.ceil(count / pageSize));
      } catch (e) {
        console.error(e);
      }
    };

    fetchRecipes();
  }, [currentPage, pageSize]);

  const filteredAndSortedRecipes = useMemo(() => {
    let output = [...recipes];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      output = output.filter((r) => {
        const t = r.title?.toLowerCase().includes(q);

        const d = r.description?.toLowerCase().includes(q);

        const i =
          Array.isArray(r.ingredients) &&
          r.ingredients.some((ing) => ing.toLowerCase().includes(q));

        return t || d || i;
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

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.index === destination.index) return;

    const swapped = [...recipes];

    const temp = swapped[source.index];

    swapped[source.index] = swapped[destination.index];

    swapped[destination.index] = temp;

    const updated = swapped.map((r, i) => ({
      ...r,

      order: (currentPage - 1) * pageSize + (i + 1),
    }));

    setRecipes(updated);

    try {
      for (const item of updated) {
        const resp = await fetch(`http://localhost:3000/Recipes/${item.id}`, {
          method: "PATCH",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ order: item.order }),
        });

        if (!resp.ok) throw new Error("Failed to update recipe order");
      }
    } catch (e) {
      console.error(e);
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

      const respAll = await fetch("http://localhost:3000/Recipes");

      const all = await respAll.json();

      const nextOrder = all.length + 1;

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

      if (!resp.ok) throw new Error("Failed to create recipe");

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
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRecipe = async (upd) => {
    try {
      const resp = await fetch(`http://localhost:3000/Recipes/${upd.id}`, {
        method: "PATCH",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          title: upd.title,

          description: upd.description,

          ingredients: upd.ingredients,

          steps: upd.steps,

          tags: upd.tags,

          difficulty: upd.difficulty,

          lastUpdated: new Date().toISOString(),

          order: upd.order,
        }),
      });

      if (!resp.ok) throw new Error("Failed to update recipe");

      const updatedData = await resp.json();

      setRecipes((prev) =>
        prev.map((r) => (r.id === updatedData.id ? updatedData : r))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRecipe = async (id) => {
    try {
      const resp = await fetch(`http://localhost:3000/Recipes/${id}`, {
        method: "DELETE",
      });

      if (!resp.ok) throw new Error("Failed to delete");

      setRecipes((prev) => prev.filter((r) => r.id !== id));

      setSelectedRecipeIds((prev) => prev.filter((x) => x !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectChange = (id) => {
    setSelectedRecipeIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);

      return [...prev, id];
    });
  };

  const handleShareSelected = () => {
    const sel = recipes.filter((r) => selectedRecipeIds.includes(r.id));

    if (sel.length === 0) return;

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

    const link = document.createElement("a");

    link.href = mailtoURL;

    link.style.display = "none";

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

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

              <div style={{ display: "none" }}>
                {providedDroppable.placeholder}
              </div>
            </div>
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
