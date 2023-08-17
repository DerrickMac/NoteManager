const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const env = require("dotenv").config();
const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
require("./models");

const {
  addList,
  findLists,
  updateListName,
  deleteList,
} = require("./lists_helpers");

const {
  addTaskToList,
  updateTaskContent,
  updateCompletedStatus,
  deleteTask,
} = require("./tasks_helpers");

// API Endpoints for NoteManager Application:
// - Root endpoint renders the tutorial homepage.
// - Dynamic endpoints to manage custom lists, including finding, adding, updating, and deleting lists and tasks.
// - Endpoints for modifying specific attributes of lists and tasks, such as names, content, completion status, and more.
app.get("/", function (req, res) {
  findLists("Welcome to NoteManager", res);
});

app.get("/lists/:customListName", function (req, res) {
  findLists(req, res);
});

app.post("/lists", function (req, res) {
  addList(req, res);
});

app.post("/addtask", function (req, res) {
  addTaskToList(req, res);
});

app.patch("/edit-list-name/:oldListTitle", function (req, res) {
  updateListName(req, res);
});

app.patch("/edit-task-content/:ListTitle/:itemID", function (req, res) {
  updateTaskContent(req, res);
});

app.patch("/change-completed/:itemID/:Bool", function (req, res) {
  updateCompletedStatus(req, res);
});

app.delete("/delete/:listTitle", function (req, res) {
  deleteList(req, res);
});

app.delete("/delete/:listTitle/:itemID", function (req, res) {
  deleteTask(req, res);
});

app.listen(port, function () {
  console.log("Server started successfully");
});
