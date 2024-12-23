import React, { useState } from "react";

const RecipeCard = ({ recipe, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(recipe);

  const handleEditRecipe = () => {
    fetch(`http://localhost:3001/recipes/${recipe.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedRecipe),
    })
      .then((response) => response.json())
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => console.error("Error editing recipe:", error));
  };

  return (
    <div className="recipe-card">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedRecipe.title}
            onChange={(e) =>
              setEditedRecipe({ ...editedRecipe, title: e.target.value })
            }
          />
          <textarea
            value={editedRecipe.description}
            onChange={(e) =>
              setEditedRecipe({ ...editedRecipe, description: e.target.value })
            }
          />
          <button onClick={handleEditRecipe}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(recipe.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
