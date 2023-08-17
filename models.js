const mongoose = require("mongoose");

// MongoDB set up and initiating model schemas
mongoose.connect(process.env.MONGODB_CONNECT_STRING, { useNewUrlParser: true });

const itemsSchema = {
  name: { type: String },
  completed: Boolean,
};

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

module.exports = {
  Item,
  List,
};
