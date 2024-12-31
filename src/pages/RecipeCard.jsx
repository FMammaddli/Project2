import React, { useState, useEffect } from "react";

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
      lastUpdated: new Date().toISOString(), // or keep existing
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
    <div className="bg-white shadow-md rounded p-6 my-4 max-w-lg">
      {!editMode && (
        <>
          <p className="text-sm text-gray-500 mb-2">
            <strong>ID:</strong> {recipe.id}
          </p>
          <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
          <p className="mb-2">
            <strong>Description:</strong> {recipe.description}
          </p>
          {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
            <p className="mb-2">
              <strong>Tags:</strong> {recipe.tags.join(", ")}
            </p>
          )}
          {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
            <p className="mb-2">
              <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
            </p>
          )}
          {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
            <p className="mb-2">
              <strong>Steps:</strong> {recipe.steps.join(", ")}
            </p>
          )}
          <p className="mb-2">
            <strong>Difficulty:</strong> {recipe.difficulty}
          </p>
          <p className="mb-4">
            <strong>Last Updated:</strong>{" "}
            {new Date(recipe.lastUpdated).toLocaleDateString()}
          </p>
          <button
            className="inline-block mr-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
          <button
            className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </>
      )}

      {editMode && (
        <>
          <p className="text-sm text-gray-500 mb-2">
            <strong>ID:</strong> {recipe.id}
          </p>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Title:</label>
            <input
              className="border border-gray-300 rounded w-full p-2"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Description:</label>
            <textarea
              className="border border-gray-300 rounded w-full p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Tags (comma-separated):</label>
            <input
              className="border border-gray-300 rounded w-full p-2"
              type="text"
              value={tagsString}
              onChange={(e) => setTags(e.target.value.split(",").map((tag) => tag.trim()))}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Ingredients (comma-separated):</label>
            <input
              className="border border-gray-300 rounded w-full p-2"
              type="text"
              value={ingredientsString}
              onChange={(e) =>
                setIngredients(e.target.value.split(",").map((ing) => ing.trim()))
              }
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Steps (comma-separated):</label>
            <input
              className="border border-gray-300 rounded w-full p-2"
              type="text"
              value={stepsString}
              onChange={(e) => setSteps(e.target.value.split(",").map((stp) => stp.trim()))}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Difficulty:</label>
            <select
              className="border border-gray-300 rounded w-full p-2"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <p className="text-gray-700 mb-4">
            Last Updated Time: {lastUpdated.toLocaleString()}
          </p>

          <button
            className="inline-block mr-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="inline-block mr-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}