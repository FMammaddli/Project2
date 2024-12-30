import React, { useState } from "react";

export default function RecipeCard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [difficulty, setDifficulty] = useState("Easy");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  function handleTitleChange(e) {
    setTitle(e.target.value);
    setLastUpdated(new Date());
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
    setLastUpdated(new Date());
  }

  function handleIngredientChange(index, value) {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
    setLastUpdated(new Date());
  }

  function handleIngredientKeyDown(e, index) {
    if (e.key === "Enter") {
      e.preventDefault();
      const updated = [...ingredients];
      updated.splice(index + 1, 0, "");
      setIngredients(updated);
      setLastUpdated(new Date());
    }
  }

  function handleStepChange(index, value) {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
    setLastUpdated(new Date());
  }

  function handleStepKeyDown(e, index) {
    if (e.key === "Enter") {
      e.preventDefault();
      const updated = [...steps];
      updated.splice(index + 1, 0, "");
      setSteps(updated);
      setLastUpdated(new Date());
    }
  }

  function handleTagChange(index, value) {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
    setLastUpdated(new Date());
  }

  function handleTagKeyDown(e, index) {
    if (e.key === "Enter") {
      e.preventDefault();
      const updated = [...tags];
      updated.splice(index + 1, 0, "");
      setTags(updated);
      setLastUpdated(new Date());
    }
  }

  return (
    <div className="p-6 max-w-md bg-white shadow-md rounded">
      <div className="mb-4">
        <label className="block font-semibold mb-1">Title:</label>
        <input
          className="border border-gray-300 rounded w-full p-2"
          type="text"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Description:</label>
        <textarea
          className="border border-gray-300 rounded w-full p-2"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Ingredients:</label>
        {ingredients.map((ing, i) => (
          <input
            key={i}
            className="border border-gray-300 rounded w-full p-2 mb-2"
            type="text"
            value={ing}
            onChange={(e) => handleIngredientChange(i, e.target.value)}
            onKeyDown={(e) => handleIngredientKeyDown(e, i)}
          />
        ))}
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Steps:</label>
        {steps.map((step, i) => (
          <input
            key={i}
            className="border border-gray-300 rounded w-full p-2 mb-2"
            type="text"
            value={step}
            onChange={(e) => handleStepChange(i, e.target.value)}
            onKeyDown={(e) => handleStepKeyDown(e, i)}
          />
        ))}
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Tags:</label>
        {tags.map((tag, i) => (
          <input
            key={i}
            className="border border-gray-300 rounded w-full p-2 mb-2"
            type="text"
            value={tag}
            onChange={(e) => handleTagChange(i, e.target.value)}
            onKeyDown={(e) => handleTagKeyDown(e, i)}
          />
        ))}
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Difficulty level:</label>
        <select
          className="border border-gray-300 rounded w-full p-2"
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setLastUpdated(new Date());
          }}
        >
          <option value="Hard">Hard</option>
          <option value="Medium">Medium</option>
          <option value="Easy">Easy</option>
        </select>
      </div>
      <p className="text-gray-700">
        Last Updated Time: {lastUpdated.toLocaleString()}
      </p>
    </div>
  );
}
