# Todo List-v1 App

This is a simple web app that lets you create and manage your personal todo list. I made this project to practice my JavaScript and MongoDB skills.

## Features

- You can create custom lists with different names and items.
- You can add, delete, and update items in your lists.
- You can delete a whole list if you want.
- You can view all the names of your lists in the /api/names route.

## Installation

- Clone this repository or download the zip file.
- Install Node.js and MongoDB on your machine.
- Create a .env file in the root directory of the project and add the following variables:
  - MONGODB_URI: The connection string to your MongoDB database. You can use a local or a remote database.
  - PORT: The port number for your server. You can use any port you want, but the default is 3000.
- Run `npm install` to install all the dependencies.
- Run `node app.js` to start the server.
- Go to http://localhost:3000/ or http://localhost:<PORT>/ to see the app in action.

## Dependencies

- Express: A web framework for Node.js
- Body-parser: A middleware to parse request bodies
- Date: A module to get the current date
- Mongoose: An object data modeling (ODM) library for MongoDB
- Lodash: A utility library for JavaScript
- Serve-favicon: A middleware to serve favicon icons
- Path: A module to work with file and directory paths
- Dotenv: A module to load environment variables from a .env file

