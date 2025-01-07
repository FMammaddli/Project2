## Recipe Manager

A web application built with React, Supabase, and json-server to create, manage, and share recipes.
Table of Contents

    Project Overview
    Features
    Live Demo (GitHub Pages)
    Installation & Setup
        1. Clone the Repo
        2. Install Dependencies
        3. Run json-server
        4. Start the React App
    Usage
        Navigating Pages
        Creating a Recipe
        Editing/Deleting Recipes
        Contact Form
    Technologies Used
    License

## Project Overview

Recipe Manager is a simple CRUD application allowing users to:

    Create, read, update, and delete recipes.
    Manage recipe order via drag-and-drop.
    Filter, search, and paginate through recipes.
    Send contact messages using a form connected to a json-server endpoint.

## Features

    Supabase Integration: Stores and retrieves recipe data.
    React Router: For navigating between Home, Recipes, and Contact pages.
    Drag and Drop: Reorder recipes in the Recipe Page via react-beautiful-dnd.
    Search & Filter: Filter by difficulty or tag, and search by keywords.
    Pagination: Control how many recipes are shown per page.
    Contact Form: Posts form data to http://localhost:3000/messages (json-server endpoint).


## Installation & Setup
1. Clone the Repo
git clone https://github.com/FMammaddli/Project2.git
cd <Project2>

2. Install Dependencies

Make sure you have Node.js and npm (or yarn) installed. Then run:
    npm install

Make sure to install the required dependencies of the project:

npm install react-beautiful-dnd
npm install @dnd-kit/core @dnd-kit/sortable

3. Run json-server

This project uses json-server to handle the contact form submissions.
Open a new terminal window/tab and run:

    npx json-server --watch db.json --port 3000
    Note:

    Make sure you have a db.json file in your project root or adjust the path as needed.

4. Start the React App

Back in your main terminal, run:
    npm run start

## Usage
* Navigating Pages

    To navigate the pages, use the navigation bar links that will take you to either Recipe Pages, or Contact Form if you are in the Main Page. 
    Consider also that to go back to homepage just click on left arrow in the top left handside of the browser. 

* Creating a Recipe

    Self-explanatory part, the button is located in the RecipePage, 
    Click on "Create" and you will have a way to fill out it the details.
    Then click on another create button and it will be stored now automatically.

* Editing/Deleting Recipes

    Click "Edit" on a recipe card.
    Update fields and click "Save".
    To delete a recipe, click "Delete".

* Contact Form

    Navigate to Contact.
    Fill in the subject, email, and message.
    Press "Send Message" to POST the data to json-server.



## License

This project is licensed under MIT License
