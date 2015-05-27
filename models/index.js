var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/library_app");

module.exports.User = require("./user");
module.exports.Book = require("./book");
