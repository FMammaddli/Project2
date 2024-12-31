import React, { useState, useEffect } from "react";
import "../index.css";

export default function RecipeCard({ recipe, onUpdate, onDelete }) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(recipe?.title || "");
  const [description, setDescription] = useState(recipe?.description || "");
  const [tags, setTags] = useState(recipe?.tags || []);
  const [ingredients, setIngredients] = useState(recipe?.ingredients || []);
  const [steps, setSteps] = useState(recipe?.steps || []);
  const [difficulty, setDifficulty] = useState(recipe?.difficulty || "Easy");
  const [lastUpdated, setLastUpdated] = useState(
    recipe?.lastUpdated ? new Date(recipe.lastUpdated) : new Date()
  );

  useEffect(() => {
    setTitle(recipe?.title || "");
    setDescription(recipe?.description || "");
    setTags(recipe?.tags || []);
    setIngredients(recipe?.ingredients || []);
    setSteps(recipe?.steps || []);
    setDifficulty(recipe?.difficulty || "Easy");
    setLastUpdated(recipe?.lastUpdated ? new Date(recipe.lastUpdated) : new Date());
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
    if (typeof onUpdate === "function") {
      onUpdate(updatedRecipe);
    }
    setEditMode(false);
  };

  const handleDelete = () => {
    if (typeof onDelete === "function") {
      onDelete(recipe.id);
    }
  };

  const handleCancel = () => {
    setTitle(recipe?.title || "");
    setDescription(recipe?.description || "");
    setTags(recipe?.tags || []);
    setIngredients(recipe?.ingredients || []);
    setSteps(recipe?.steps || []);
    setDifficulty(recipe?.difficulty || "Easy");
    setLastUpdated(recipe?.lastUpdated ? new Date(recipe.lastUpdated) : new Date());
    setEditMode(false);
  };

  const tagsString = Array.isArray(tags) ? tags.join(", ") : tags;
  const ingredientsString = Array.isArray(ingredients) ? ingredients.join(", ") : ingredients;
  const stepsString = Array.isArray(steps) ? steps.join(", ") : steps;

  return (
    <div className="recipe-card my-4">
      {!editMode && (
        <div className="recipe-card-view">
          <p className="recipe-label">
            <strong>ID:</strong> {recipe.id}
          </p>
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
            <p className="recipe-ingredients">
              <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
            </p>
          )}
          {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
            <p className="recipe-steps">
              <strong>Steps:</strong> {recipe.steps.join(", ")}
            </p>
          )}
          <p className="recipe-difficulty">
            <strong>Difficulty:</strong> {recipe.difficulty}
          </p>
          <p>
            <strong>Last Updated:</strong> {new Date(recipe.lastUpdated).toLocaleDateString()}
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
          <p className="recipe-label">
            <strong>ID:</strong> {recipe.id}
          </p>
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
              onChange={(e) => setTags(e.target.value.split(",").map((t) => t.trim()))}
            />
          </div>
          <div className="edit-field">
            <label>Ingredients (comma-separated):</label>
            <input
              className="edit-input"
              type="text"
              value={ingredientsString}
              onChange={(e) =>
                setIngredients(e.target.value.split(",").map((ing) => ing.trim()))
              }
            />
          </div>
          <div className="edit-field">
            <label>Steps (comma-separated):</label>
            <input
              className="edit-input"
              type="text"
              value={stepsString}
              onChange={(e) => setSteps(e.target.value.split(",").map((st) => st.trim()))}
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