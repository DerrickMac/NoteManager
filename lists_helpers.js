const _ = require("lodash");
const { List } = require("./models");

function addList(req, res) {
  const listName = _.capitalize(req.body.createList);
  const encodedName = encodeURIComponent(listName);

  const newList = new List({
    name: listName,
    items: [],
  });

  newList.save(function (err) {
    if (!err) {
      const baseUrl = req.protocol + "://" + req.get("host");
      res.redirect(`${baseUrl}/lists/${encodedName}`);
    } else {
      res.send(err);
    }
  });
}

// Checks whether to route to homepage or specific list
function findLists(req, res) {
  // Get all Lists in collection so we can render the 'Saved List' side nav
  List.find({}, function (err, allLists) {
    if (!err) {
      if (req === "Welcome to NoteManager") {
        renderTutorial(res, allLists);
      } else {
        renderSpecificList(req, res, allLists);
      }
    } else {
      console.error(err);
      res.status(500).send("Error getting all lists");
    }
  });
}

// findLists HELPER: Finds the homepage's list and renders page
function renderTutorial(res, allLists) {
  List.findOne({ name: "Welcome to NoteManager" }, function (err, foundList) {
    if (!err) {
      res.render("list", {
        allLists: allLists,
        listTitle: foundList.name,
        newListItems: foundList.items,
      });
    } else {
      console.error(err);
      res.status(500).send("Error finding tutorial list");
    }
  });
}

// findLists HELPER: Finds target list and renders page
function renderSpecificList(req, res, allLists) {
  const decodedName = decodeURIComponent(req.params.customListName);
  List.findOne({ name: decodedName }, function (err, foundList) {
    if (!err) {
      res.render("list", {
        allLists: allLists,
        listTitle: foundList.name,
        newListItems: foundList.items,
      });
    } else {
      console.error(err);
      res.status(500).send("Error finding list");
    }
  });
}

// Implements user's ability to edit list names
function updateListName(req, res) {
  const oldListName = decodeURIComponent(req.params.oldListTitle);
  const newListName = _.capitalize(req.body.listName);

  List.findOneAndUpdate(
    { name: oldListName },
    { $set: { name: newListName } },
    function (err) {
      if (!err) {
        redirectToList(newListName, res);
      } else {
        console.error("Error updating list:", err);
      }
    }
  );
}

// Implements user's ability to delete lists
function deleteList(req, res) {
  const listName = req.params.listTitle;

  List.deleteOne({ name: listName }, function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
}

// Encodes parameters before concatentation to URL in order for lists and task content to contain special characters
function redirectToList(decodedString, res) {
  const encodedName = encodeURIComponent(decodedString);
  res.redirect("/lists/" + encodedName);
}

module.exports = {
  addList,
  findLists,
  updateListName,
  deleteList,
};
