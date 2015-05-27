// A simple script to start the REPL
// and intialize the database
var REPL = require("repl");
var db = require("./models");

var repl = REPL.start("Login > ");
repl.context.db = db;

repl.on("exit", function () {
  console.log("GOODBYE!!");
  process.exit();
});
