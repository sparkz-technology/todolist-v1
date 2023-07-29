// Importing the required modules
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const favicon = require("serve-favicon");
const path = require("path");
const dotenv = require("dotenv");
// Load the environment variables from the .env file
dotenv.config();
// Creating an Express application
const app = express();

// Configuring the Express application
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, "public", "favicon", "favicon.ico")));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Mongoose schema
const itemsSchema = new mongoose.Schema({
  name: String,
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

// Create Mongoose models
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

// Default items
const defaultItems = [
  { name: "Welcome to your todolist!" },
  { name: "Hit the + button to add a new item" },
  { name: "Hit this to delete an item!" },
];

// Handling the root route
app.get("/", function (req, res) {
  const currentDay = date.getDate();

  // Finding all items from the collection
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(() => {
            console.log("Successfully saved items in todolistDB");
            res.redirect("/");
          })
          .catch((err) => {
            console.error("Error saving default items:", err);
            res.redirect("/");
          });
      } else {
        res.render("index", { listTitle: currentDay, newList: foundItems });
      }
    })
    .catch((err) => {
      console.error("Error finding items:", err);
      res.redirect("/");
    });
});

// Handling the POST request for the root route
app.post("/", function (req, res) {
  const newItem = req.body.itemList;
  const listName = req.body.list;

  const item = new Item({ name: newItem });

  if (listName === date.getDate()) {
    item
      .save()
      .then(() => {
        console.log("Item saved successfully");
        res.redirect("/");
      })
      .catch((err) => {
        console.error("Error saving item:", err);
        res.redirect("/");
      });
  } else {
    List.findOne({ name: listName })
      .then((foundList) => {
        if (foundList) {
          foundList.items.push(item);
          foundList
            .save()
            .then(() => {
              console.log("Item saved successfully in custom list", listName);
              res.redirect("/" + listName);
            })
            .catch((err) => {
              console.error("Error saving item in custom list:", err);
              res.redirect("/" + listName);
            });
        } else {
          console.log("List not found");
          res.redirect("/" + listName);
        }
      })
      .catch((err) => {
        console.error("Error finding list:", err);
        res.redirect("/" + listName);
      });
  }
});

// Handling the delete route
app.post("/delete", function (req, res) {
  const checkboxId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === date.getDate()) {
    Item.findByIdAndRemove(checkboxId)
      .then(() => {
        console.log("Successfully deleted item");
        res.redirect("/");
      })
      .catch((err) => {
        console.error("Error deleting item:", err);
        res.redirect("/");
      });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkboxId } } }
    )
      .then(() => {
        console.log("Successfully deleted item from custom list", listName);
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.error("Error deleting item from custom list:", err);
        res.redirect("/" + listName);
      });
  }
});

// Handling the update route
app.post("/update", (req, res) => {
  const buttonValue = req.body.buttonValueN;
  const listTitle = req.body.listTitleN;
  const newItemName = req.body.itemNameN;
  const currentDay = date.getDate();

  if (listTitle.slice(0, 3) === currentDay.slice(0, 3)) {
    Item.findByIdAndUpdate(buttonValue, { name: newItemName })
      .then(() => {
        console.log("Item updated successfully");
        res.redirect("/"); // Redirect to the root route
      })
      .catch((err) => {
        console.error("Error updating item:", err);
        res.redirect("/"); // Redirect to the root route
      });
  } else {
    List.findOne({ name: listTitle })
      .then((foundList) => {
        if (foundList) {
          const itemToUpdate = foundList.items.find(
            (item) => item._id.toString() === buttonValue
          );
          if (itemToUpdate) {
            itemToUpdate.name = newItemName;
            foundList
              .save()
              .then(() => {
                console.log(
                  "Item updated successfully in custom list",
                  listTitle
                );
                res.redirect("/" + listTitle); // Redirect to the custom list route
              })
              .catch((err) => {
                console.error("Error updating item:", err);
                res.redirect("/" + listTitle); // Redirect to the custom list route
              });
          } else {
            console.log("Item not found");
            res.redirect("/" + listTitle); // Redirect to the custom list route
          }
        } else {
          console.log("List not found");
          res.redirect("/" + listTitle); // Redirect to the custom list route
        }
      })
      .catch((err) => {
        console.error("Error finding list:", err);
        res.redirect("/" + listTitle); // Redirect to the custom list route
      });
  }
});
// Handling the delete list route
app.post("/deleteList", function (req, res) {
  const listTitle = req.body.listTitle;
  console.log(listTitle);

  List.deleteOne({ name: listTitle })
    .then(() => {
      console.log("Successfully deleted list", listTitle);
      res.redirect("/");
    })
    .catch((err) => {
      console.error("Error deleting list:", err);
      res.redirect("/");
    });
});

// Handling custom list routes
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then((foundList) => {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list
          .save()
          .then(() => {
            console.log("New list created and saved!");
            res.redirect("/" + customListName);
          })
          .catch((err) => {
            console.error("Error saving list:", err);
            res.redirect("/");
          });
      } else {
        res.render("index", {
          listTitle: foundList.name,
          newList: foundList.items,
        });
      }
    })
    .catch((err) => {
      console.error("Error finding list:", err);
      res.redirect("/");
    });
});
app.get("/api/names", (req, res) => {
  List.find({})
    .select("name")
    .then((lists) => {
      const names = lists.map((list) => list.name);
      res.json(names);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Starting the server
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});
