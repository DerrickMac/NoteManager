const { Item, List } = require("./models");
const _ = require("lodash");

// Implements user's ability to add tasks to lists
function addTaskToList(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = validateTask(itemName);
  if (!item) {
    return;
  }
  findListAndPushTask(listName, item);
  redirectToList(listName, res);
}

// addTaskToList HELPER: Returns non-empty Item objects to add to List
function validateTask(itemName) {
  if (itemName === "") {
    console.log("Error: cannot save an empty TODO");
    return null;
  }
  const item = new Item({
    name: itemName,
    completed: false,
  });
  return item;
}

// addTaskToList HELPER: searches List collection and pushes new task to list.
function findListAndPushTask(listName, item, res) {
  List.findOne({ name: listName }, function (err, foundList) {
    if (!foundList) {
      res.status(500).send("Error finding list");
      return;
    }
    foundList.items.push(item);
    foundList.save();
  });
}

// Implements user's ability to edit task content
function updateTaskContent(req, res) {
  const listName = decodeURIComponent(req.params.ListTitle);
  const itemID = req.params.itemID;
  const newTaskContent = req.body.taskContent;

  List.findOneAndUpdate(
    { name: listName, "items._id": itemID },
    { $set: { "items.$.name": newTaskContent } },
    function (err) {
      if (!err) {
        redirectToList(listName, res);
      } else {
        console.error("Error updating list:", err);
      }
    }
  );
}

// Changing completed status allows tasks to be rendered in the Completed Task section or Tasks To Do section.
function updateCompletedStatus(req, res) {
  const listName = req.body.listName;
  const itemID = req.params.itemID;
  const changeBool = req.params.Bool;

  List.findOneAndUpdate(
    { name: listName, "items._id": itemID },
    { $set: { "items.$.completed": changeBool } },
    function (err) {
      if (!err) {
        redirectToList(listName, res);
      } else {
        console.error("Error updating list:", err);
      }
    }
  );
}

// Implements user's ability to delete tasks
function deleteTask(req, res) {
  const ItemId = req.params.itemID;
  const listName = decodeURIComponent(req.params.listTitle);

  List.findOneAndUpdate(
    { name: listName },
    { $pull: { items: { _id: ItemId } } },
    function (err, foundList) {
      if (!err) {
        redirectToList(listName, res);
      }
    }
  );
}

// Encodes parameters before concatentation to URL in order for lists and task content to contain special characters
function redirectToList(decodedString, res) {
  const encodedName = encodeURIComponent(decodedString);
  res.redirect("/lists/" + encodedName);
}

module.exports = {
  addTaskToList,
  updateTaskContent,
  updateCompletedStatus,
  deleteTask,
};
